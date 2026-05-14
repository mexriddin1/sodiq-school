import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

const submitSchema = z.object({
  name: z.string().min(1).max(150),
  phone: z.string().min(4).max(40),
  message: z.string().max(5000).nullable().optional(),
  grade: z.string().max(20).nullable().optional(),
  source_form: z.string().max(60).optional(),
});

// Public: form submission
router.post('/', async (req, res) => {
  const b = submitSchema.parse(req.body);
  await query(
    `INSERT INTO application_submissions (source_form, name, phone, message, grade, status)
     VALUES (?, ?, ?, ?, ?, 'new')`,
    [b.source_form ?? 'contact', b.name, b.phone, b.message ?? null, b.grade ?? null],
  );
  res.status(201).json({ ok: true });
});

// Admin: list/inbox
router.get('/', requireAuth, async (req, res) => {
  const status = req.query.status;
  const where = [];
  const params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  const sql = `SELECT * FROM application_submissions
               ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
               ORDER BY created_at DESC LIMIT 200`;
  const rows = await query(sql, params);
  res.json({ items: rows });
});

router.get('/:id', requireAuth, async (req, res) => {
  const rows = await query(`SELECT * FROM application_submissions WHERE id = ?`, [parseInt(req.params.id, 10)]);
  if (!rows[0]) throw new HttpError(404, 'Not found');
  res.json(rows[0]);
});

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']).optional(),
  notes: z.string().max(5000).nullable().optional(),
});

router.put('/:id', requireAuth, async (req, res) => {
  const b = updateSchema.parse(req.body);
  const fields = []; const params = [];
  if (b.status !== undefined) { fields.push('status = ?'); params.push(b.status); }
  if (b.notes !== undefined) { fields.push('notes = ?'); params.push(b.notes); }
  if (!fields.length) return res.json({ ok: true });
  params.push(parseInt(req.params.id, 10));
  await query(`UPDATE application_submissions SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query(`DELETE FROM application_submissions WHERE id = ?`, [parseInt(req.params.id, 10)]);
  res.json({ ok: true });
});

export default router;
