import crypto from 'node:crypto';
import { env } from '../config/env.js';

const GRAPH_VERSION = 'v21.0';

function isConfigured() {
  return Boolean(env.metaCapi.pixelId && env.metaCapi.accessToken);
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

// Meta requires E.164 digits-only (no '+', no spaces).
// Uzbekistan numbers come in as +998 90 123 45 67, 998901234567, 90 123-45-67, etc.
function normalizePhone(raw) {
  if (!raw) return '';
  let d = String(raw).replace(/\D+/g, '');
  if (!d) return '';
  if (d.length === 9) d = '998' + d;        // 901234567 -> 998901234567
  else if (d.length === 12 && d.startsWith('998')) { /* ok */ }
  else if (d.length === 13 && d.startsWith('9998')) d = d.slice(1); // strip stray leading 9
  return d;
}

function normalizeName(raw) {
  return String(raw || '').trim().toLowerCase();
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || '';
}

export function buildEventId() {
  return crypto.randomUUID();
}

/**
 * Send a Lead event to Meta Conversion API.
 * Safe to call without await; failures are logged, never thrown.
 *
 * @param {Object} lead   - application payload (name, phone, source_form, lead_id, ...)
 * @param {Object} req    - express request (for IP + UA)
 * @param {string} eventId - dedup ID; pass the same one to browser fbq for dedup
 */
export async function sendLeadEvent(lead, req, eventId) {
  if (!isConfigured()) {
    return;
  }

  const phone = normalizePhone(lead.phone);
  const fullName = normalizeName(lead.name);
  const [firstName, ...restName] = fullName.split(/\s+/).filter(Boolean);
  const lastName = restName.join(' ');

  const user_data = {
    client_ip_address: clientIp(req),
    client_user_agent: req.headers['user-agent'] || '',
  };
  if (phone) user_data.ph = [sha256(phone)];
  if (firstName) user_data.fn = [sha256(firstName)];
  if (lastName) user_data.ln = [sha256(lastName)];
  // Browser cookies — Meta uses these to attribute the lead back to the ad impression.
  if (lead.fbp) user_data.fbp = lead.fbp;
  if (lead.fbc) user_data.fbc = lead.fbc;

  const event = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: req.headers['referer'] || req.headers['origin'] || '',
    user_data,
    custom_data: {
      lead_event_source: lead.source_form || 'contact',
      content_name: lead.source_form || 'contact',
      lead_id: lead.lead_id ? String(lead.lead_id) : undefined,
    },
  };

  const body = { data: [event] };
  if (env.metaCapi.testEventCode) {
    body.test_event_code = env.metaCapi.testEventCode;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${env.metaCapi.pixelId}/events?access_token=${encodeURIComponent(env.metaCapi.accessToken)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[meta-capi] non-2xx', res.status, text);
      return;
    }
    if (env.metaCapi.debug) {
      const json = await res.json().catch(() => null);
      console.log('[meta-capi] sent Lead', { eventId, response: json });
    }
  } catch (err) {
    console.error('[meta-capi] request failed', err.message);
  }
}
