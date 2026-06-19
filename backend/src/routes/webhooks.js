import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { dispatchOne } from '../services/webhook-dispatcher.js';

const router = Router();

// Available fields admin can pick from for the "applications" lead payload
export const AVAILABLE_FIELDS = [
  { key: 'name',        label: 'Ism' },
  { key: 'phone',       label: 'Telefon' },
  { key: 'message',     label: 'Xabar' },
  { key: 'age',         label: 'Yosh' },
  { key: 'grade',       label: 'Sinf' },
  { key: 'region',      label: 'Viloyat' },
  { key: 'utm_source',   label: 'UTM source' },
  { key: 'utm_medium',   label: 'UTM medium' },
  { key: 'utm_campaign', label: 'UTM campaign' },
  { key: 'utm_term',     label: 'UTM term' },
  { key: 'utm_content',  label: 'UTM content' },
  { key: 'landing_page', label: 'Landing page' },
  { key: 'referrer',     label: 'Referrer' },
  { key: 'source_form', label: 'Forma manbasi' },
  { key: 'siteName',    label: 'Sayt nomi' },
  { key: 'lead_id',     label: 'Lead ID' },
  { key: 'created_at',  label: 'Yaratilgan vaqt' },
];

export const AVAILABLE_EVENTS = [
  { key: 'application.created', label: 'Yangi ariza (form yuborildi)' },
];

const baseSchema = z.object({
  name: z.string().min(1).max(150),
  url: z.string().url().max(1000),
  method: z.enum(['POST', 'PUT', 'PATCH']).default('POST'),
  secret: z.string().max(255).nullable().optional(),
  event_types: z.array(z.string().max(80)).optional(),
  selected_fields: z.array(z.string().max(80)).optional(),
  custom_headers: z.record(z.string(), z.string()).optional(),
  payload_template: z.string().max(20000).nullable().optional(),
  include_metadata: z.boolean().optional(),
  retry_count: z.number().int().min(1).max(10).optional(),
  timeout_ms: z.number().int().min(1000).max(60000).optional(),
  is_active: z.boolean().optional(),
});

function rowToDto(row) {
  if (!row) return null;
  const parse = (v, f) => { if (v == null) return f; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch { return f; } };
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    method: row.method,
    secret: row.secret,
    event_types: parse(row.event_types_json, []),
    selected_fields: parse(row.selected_fields_json, []),
    custom_headers: parse(row.custom_headers_json, {}),
    payload_template: row.payload_template || '',
    include_metadata: !!row.include_metadata,
    retry_count: row.retry_count,
    timeout_ms: row.timeout_ms,
    is_active: !!row.is_active,
    is_archived: !!row.is_archived,
    archived_at: row.archived_at,
    last_success_at: row.last_success_at,
    last_error_at: row.last_error_at,
    last_error: row.last_error,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Metadata for the admin UI (available fields/events)
router.get('/meta', requireAuth, (_req, res) => {
  res.json({ fields: AVAILABLE_FIELDS, events: AVAILABLE_EVENTS });
});

// List webhooks (filter: ?archived=1 to show only archived, default = active)
router.get('/', requireAuth, async (req, res) => {
  const showArchived = req.query.archived === '1';
  const rows = await query(
    `SELECT * FROM webhooks WHERE is_archived = ? ORDER BY created_at DESC`,
    [showArchived ? 1 : 0],
  );
  res.json({ items: rows.map(rowToDto) });
});

router.get('/:id', requireAuth, async (req, res) => {
  const rows = await query(`SELECT * FROM webhooks WHERE id = ?`, [parseInt(req.params.id, 10)]);
  if (!rows[0]) throw new HttpError(404, 'Webhook topilmadi');
  res.json(rowToDto(rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
  const b = baseSchema.parse(req.body);
  const result = await query(
    `INSERT INTO webhooks
      (name, url, method, secret, event_types_json, selected_fields_json, custom_headers_json,
       payload_template, include_metadata, retry_count, timeout_ms, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.name,
      b.url,
      b.method,
      b.secret || null,
      JSON.stringify(b.event_types && b.event_types.length ? b.event_types : ['application.created']),
      JSON.stringify(b.selected_fields || []),
      JSON.stringify(b.custom_headers || {}),
      b.payload_template || null,
      b.include_metadata === false ? 0 : 1,
      b.retry_count || 3,
      b.timeout_ms || 10000,
      b.is_active === false ? 0 : 1,
    ],
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/:id', requireAuth, async (req, res) => {
  const b = baseSchema.partial().parse(req.body);
  const id = parseInt(req.params.id, 10);
  const fields = [];
  const params = [];
  const set = (col, val) => { fields.push(`${col} = ?`); params.push(val); };

  if (b.name !== undefined) set('name', b.name);
  if (b.url !== undefined) set('url', b.url);
  if (b.method !== undefined) set('method', b.method);
  if (b.secret !== undefined) set('secret', b.secret || null);
  if (b.event_types !== undefined) set('event_types_json', JSON.stringify(b.event_types));
  if (b.selected_fields !== undefined) set('selected_fields_json', JSON.stringify(b.selected_fields));
  if (b.custom_headers !== undefined) set('custom_headers_json', JSON.stringify(b.custom_headers));
  if (b.payload_template !== undefined) set('payload_template', b.payload_template || null);
  if (b.include_metadata !== undefined) set('include_metadata', b.include_metadata ? 1 : 0);
  if (b.retry_count !== undefined) set('retry_count', b.retry_count);
  if (b.timeout_ms !== undefined) set('timeout_ms', b.timeout_ms);
  if (b.is_active !== undefined) set('is_active', b.is_active ? 1 : 0);

  if (!fields.length) return res.json({ ok: true });
  params.push(id);
  await query(`UPDATE webhooks SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

// Archive (soft delete) — keeps history
router.post('/:id/archive', requireAuth, async (req, res) => {
  await query(
    `UPDATE webhooks SET is_archived = 1, is_active = 0, archived_at = NOW() WHERE id = ?`,
    [parseInt(req.params.id, 10)],
  );
  res.json({ ok: true });
});

router.post('/:id/restore', requireAuth, async (req, res) => {
  await query(
    `UPDATE webhooks SET is_archived = 0, archived_at = NULL WHERE id = ?`,
    [parseInt(req.params.id, 10)],
  );
  res.json({ ok: true });
});

// Hard delete (and cascade deliveries)
router.delete('/:id', requireAuth, async (req, res) => {
  await query(`DELETE FROM webhooks WHERE id = ?`, [parseInt(req.params.id, 10)]);
  res.json({ ok: true });
});

// Send a test payload to the webhook URL (uses current saved config)
router.post('/:id/test', requireAuth, async (req, res) => {
  const rows = await query(`SELECT * FROM webhooks WHERE id = ?`, [parseInt(req.params.id, 10)]);
  const w = rows[0];
  if (!w) throw new HttpError(404, 'Webhook topilmadi');

  const samplePayload = {
    name: 'Test Foydalanuvchi',
    phone: '+998901234567',
    message: 'Bu test soʻrov',
    age: '14-15 yosh',
    grade: '9',
    region: 'Toshkent',
    utm_source: 'telegram',
    utm_medium: 'social',
    utm_campaign: 'test',
    utm_term: '',
    utm_content: '',
    landing_page: '/uz?utm_source=telegram&utm_medium=social&utm_campaign=test',
    referrer: '',
    source_form: 'test',
    siteName: 'Sodiq School',
    lead_id: 0,
    created_at: new Date().toISOString(),
  };

  const result = await dispatchOne(w, 'application.created', samplePayload);
  res.json({
    ok: result.ok,
    status: result.status,
    error: result.error || null,
    durationMs: result.durationMs,
    responsePreview: result.responseBody ? String(result.responseBody).slice(0, 1000) : null,
  });
});

// Recent deliveries for one webhook
router.get('/:id/deliveries', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
  const rows = await query(
    `SELECT id, event_type, target_url, response_status, error, attempts, duration_ms, success, created_at
     FROM webhook_deliveries
     WHERE webhook_id = ?
     ORDER BY created_at DESC
     LIMIT ${limit}`,
    [parseInt(req.params.id, 10)],
  );
  res.json({ items: rows });
});

router.get('/:id/deliveries/:deliveryId', requireAuth, async (req, res) => {
  const rows = await query(
    `SELECT * FROM webhook_deliveries WHERE id = ? AND webhook_id = ?`,
    [parseInt(req.params.deliveryId, 10), parseInt(req.params.id, 10)],
  );
  if (!rows[0]) throw new HttpError(404, 'Topilmadi');
  res.json(rows[0]);
});

export default router;
