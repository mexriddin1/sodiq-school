import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('superadmin', 'admin'), async (_req, res) => {
  const rows = await query(
    `SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC`,
  );
  res.json({ items: rows });
});

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['superadmin', 'admin', 'editor']).default('admin'),
  is_active: z.boolean().optional(),
});

router.post('/', requireRole('superadmin'), async (req, res) => {
  const body = createSchema.parse(req.body);
  const hash = await bcrypt.hash(body.password, 10);
  try {
    const r = await query(
      `INSERT INTO users (email, password_hash, name, role, is_active) VALUES (?, ?, ?, ?, ?)`,
      [body.email, hash, body.name, body.role, body.is_active ? 1 : 1],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Email already exists');
    throw err;
  }
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['superadmin', 'admin', 'editor']).optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

router.put('/:id', requireRole('superadmin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = updateSchema.parse(req.body);
  const fields = [];
  const params = [];
  if (body.name !== undefined) { fields.push('name = ?'); params.push(body.name); }
  if (body.role !== undefined) { fields.push('role = ?'); params.push(body.role); }
  if (body.is_active !== undefined) { fields.push('is_active = ?'); params.push(body.is_active ? 1 : 0); }
  if (body.password) {
    fields.push('password_hash = ?');
    params.push(await bcrypt.hash(body.password, 10));
  }
  if (!fields.length) return res.json({ ok: true });
  params.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

router.delete('/:id', requireRole('superadmin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) throw new HttpError(400, 'Cannot delete yourself');
  await query(`DELETE FROM users WHERE id = ?`, [id]);
  res.json({ ok: true });
});

export default router;
