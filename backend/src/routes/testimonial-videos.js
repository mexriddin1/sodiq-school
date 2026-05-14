import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

router.get('/', async (_req, res) => {
  const rows = await query(
    `SELECT tv.id, tv.url, tv.thumbnail_id, tv.name, tv.role, tv.sort_order, m.url AS thumbnail_url
     FROM testimonial_videos tv
     LEFT JOIN media m ON m.id = tv.thumbnail_id
     WHERE tv.is_published = 1
     ORDER BY tv.sort_order ASC`,
  );
  res.json({ items: rows });
});

router.get('/:id', async (req, res) => {
  const rows = await query(`SELECT * FROM testimonial_videos WHERE id = ?`, [parseInt(req.params.id, 10)]);
  if (!rows[0]) throw new HttpError(404, 'Not found');
  res.json(rows[0]);
});

const schema = z.object({
  url: z.string().min(1),
  thumbnail_id: z.number().int().nullable().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

router.post('/', requireAuth, async (req, res) => {
  const b = schema.parse(req.body);
  const r = await query(
    `INSERT INTO testimonial_videos (url, thumbnail_id, name, role, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?)`,
    [b.url, b.thumbnail_id ?? null, b.name ?? '', b.role ?? '', b.sort_order ?? 0, b.is_published === false ? 0 : 1],
  );
  res.status(201).json({ id: r.insertId });
});

router.put('/:id', requireAuth, async (req, res) => {
  const b = schema.partial().parse(req.body);
  const id = parseInt(req.params.id, 10);
  const fields = []; const params = [];
  for (const [k, v] of Object.entries(b)) {
    if (k === 'is_published') { fields.push('is_published = ?'); params.push(v ? 1 : 0); }
    else { fields.push(`${k} = ?`); params.push(v); }
  }
  if (!fields.length) return res.json({ ok: true });
  params.push(id);
  await query(`UPDATE testimonial_videos SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query(`DELETE FROM testimonial_videos WHERE id = ?`, [parseInt(req.params.id, 10)]);
  res.json({ ok: true });
});

export default router;
