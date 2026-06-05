import crypto from 'node:crypto';
import { query } from '../db/pool.js';

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRIES = 3;

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function pickFields(source, fields) {
  if (!Array.isArray(fields) || fields.length === 0) return { ...source };
  const out = {};
  for (const f of fields) {
    if (f in source) out[f] = source[f];
  }
  return out;
}

function renderTemplate(template, data) {
  // {{path.to.value}} -> value
  return template.replace(/\{\{\s*([\w.[\]]+)\s*\}\}/g, (_, expr) => {
    const parts = expr.split('.');
    let cur = data;
    for (const p of parts) {
      if (cur == null) return '';
      cur = cur[p];
    }
    if (cur == null) return '';
    if (typeof cur === 'object') return JSON.stringify(cur);
    return String(cur);
  });
}

function buildBody(webhook, eventType, payload) {
  const selectedFields = parseJson(webhook.selected_fields_json, []);
  const filtered = pickFields(payload, selectedFields);

  const fullData = {
    event: eventType,
    timestamp: new Date().toISOString(),
    site: payload.siteName || payload.site || null,
    data: filtered,
    ...(webhook.include_metadata ? { metadata: {
      source_form: payload.source_form || null,
      lead_id: payload.lead_id || null,
    } } : {}),
  };

  if (webhook.payload_template && String(webhook.payload_template).trim().length) {
    const rendered = renderTemplate(String(webhook.payload_template), {
      ...fullData,
      ...filtered,
      raw: payload,
    });
    return rendered;
  }
  return JSON.stringify(fullData);
}

async function deliverOnce(webhook, body) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'SodiqSchool-Webhook/1.0',
    ...parseJson(webhook.custom_headers_json, {}),
  };
  if (webhook.secret) {
    const sig = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex');
    headers['X-Webhook-Signature'] = `sha256=${sig}`;
  }

  const timeoutMs = webhook.timeout_ms || DEFAULT_TIMEOUT_MS;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(webhook.url, {
      method: webhook.method || 'POST',
      headers,
      body,
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => '');
    return {
      ok: res.ok,
      status: res.status,
      responseBody: text.slice(0, 4000),
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      ok: false,
      status: null,
      responseBody: null,
      error: err.name === 'AbortError' ? `Timeout after ${timeoutMs}ms` : (err.message || String(err)),
      durationMs: Date.now() - start,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function logDelivery(webhook, eventType, body, result, attempts) {
  try {
    await query(
      `INSERT INTO webhook_deliveries
        (webhook_id, event_type, target_url, request_body, response_status, response_body, error, attempts, duration_ms, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        webhook.id,
        eventType,
        webhook.url,
        body.slice(0, 60000),
        result.status,
        result.responseBody ? String(result.responseBody).slice(0, 60000) : null,
        result.error || null,
        attempts,
        result.durationMs || 0,
        result.ok ? 1 : 0,
      ],
    );
  } catch (err) {
    console.error('[webhook] failed to log delivery', err.message);
  }

  try {
    if (result.ok) {
      await query(`UPDATE webhooks SET last_success_at = NOW(), last_error = NULL WHERE id = ?`, [webhook.id]);
    } else {
      const msg = result.error || `HTTP ${result.status}`;
      await query(`UPDATE webhooks SET last_error_at = NOW(), last_error = ? WHERE id = ?`, [String(msg).slice(0, 1000), webhook.id]);
    }
  } catch (err) {
    console.error('[webhook] failed to update webhook status', err.message);
  }
}

export async function dispatchOne(webhook, eventType, payload) {
  const body = buildBody(webhook, eventType, payload);
  const maxAttempts = Math.max(1, webhook.retry_count || DEFAULT_RETRIES);
  let result;
  let attempt = 0;
  for (attempt = 1; attempt <= maxAttempts; attempt++) {
    result = await deliverOnce(webhook, body);
    if (result.ok) break;
    if (attempt < maxAttempts) {
      const backoff = Math.min(2000 * attempt, 8000);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  await logDelivery(webhook, eventType, body, result, attempt);
  return result;
}

export async function dispatchEvent(eventType, payload) {
  let rows;
  try {
    rows = await query(
      `SELECT * FROM webhooks
       WHERE is_active = 1 AND is_archived = 0
         AND (event_types_json IS NULL
              OR JSON_LENGTH(event_types_json) = 0
              OR JSON_CONTAINS(event_types_json, JSON_QUOTE(?)))`,
      [eventType],
    );
  } catch (err) {
    // Table may not exist yet (migration not run); skip silently
    if (err && err.code === 'ER_NO_SUCH_TABLE') return;
    console.error('[webhook] failed to load webhooks', err.message);
    return;
  }
  if (!rows || rows.length === 0) return;

  // Fire-and-forget per webhook in parallel
  await Promise.all(rows.map(async (w) => {
    try { await dispatchOne(w, eventType, payload); }
    catch (err) { console.error('[webhook] dispatch error', w.id, err.message); }
  }));
}
