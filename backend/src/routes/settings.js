import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { pickLocale } from '../lib/i18n.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

// Public: GET /api/settings?lang=uz  → { 'hero.title': '...', ... }
router.get('/', async (req, res) => {
  const locale = pickLocale(req);
  const rows = await query(
    `SELECT \`key\`, value_uz, value_ru, value_en, value_raw, \`group\` FROM settings`,
  );
  const map = {};
  for (const r of rows) {
    const localized = locale === 'ru' ? r.value_ru : locale === 'en' ? r.value_en : r.value_uz;
    map[r.key] = localized ?? r.value_raw ?? '';
  }
  res.json(map);
});

// Admin: list all with all locales (?group= optional)
router.get('/all', requireAuth, async (req, res) => {
  const sql = req.query.group
    ? `SELECT * FROM settings WHERE \`group\` = ? ORDER BY \`key\` ASC`
    : `SELECT * FROM settings ORDER BY \`group\` ASC, \`key\` ASC`;
  const params = req.query.group ? [req.query.group] : [];
  const rows = await query(sql, params);
  res.json({ items: rows });
});

router.get('/groups', requireAuth, async (_req, res) => {
  const rows = await query(`SELECT DISTINCT \`group\` FROM settings ORDER BY \`group\` ASC`);
  res.json({ items: rows.map(r => r.group) });
});

const upsertSchema = z.object({
  key: z.string().min(1),
  value_uz: z.string().nullable().optional(),
  value_ru: z.string().nullable().optional(),
  value_en: z.string().nullable().optional(),
  value_raw: z.string().nullable().optional(),
  group: z.string().optional(),
  description: z.string().nullable().optional(),
});

router.put('/:key', requireAuth, async (req, res) => {
  const body = upsertSchema.partial({ key: true }).parse(req.body);
  const key = req.params.key;
  await query(
    `INSERT INTO settings (\`key\`, value_uz, value_ru, value_en, value_raw, \`group\`, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       value_uz = VALUES(value_uz),
       value_ru = VALUES(value_ru),
       value_en = VALUES(value_en),
       value_raw = VALUES(value_raw),
       \`group\` = COALESCE(VALUES(\`group\`), \`group\`),
       description = COALESCE(VALUES(description), description)`,
    [
      key,
      body.value_uz ?? null,
      body.value_ru ?? null,
      body.value_en ?? null,
      body.value_raw ?? null,
      body.group ?? 'general',
      body.description ?? null,
    ],
  );
  res.json({ ok: true });
});

router.post('/', requireAuth, async (req, res) => {
  const body = upsertSchema.parse(req.body);
  try {
    await query(
      `INSERT INTO settings (\`key\`, value_uz, value_ru, value_en, value_raw, \`group\`, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [body.key, body.value_uz ?? null, body.value_ru ?? null, body.value_en ?? null,
       body.value_raw ?? null, body.group ?? 'general', body.description ?? null],
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Key already exists');
    throw err;
  }
});

router.delete('/:key', requireAuth, async (req, res) => {
  await query(`DELETE FROM settings WHERE \`key\` = ?`, [req.params.key]);
  res.json({ ok: true });
});

export default router;
