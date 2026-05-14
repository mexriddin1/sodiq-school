import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const rows = await query(
    `SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = ? LIMIT 1`,
    [email],
  );
  const user = rows[0];
  if (!user || !user.is_active) throw new HttpError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const rows = await query(
    `SELECT id, email, name, role, created_at FROM users WHERE id = ? AND is_active = 1`,
    [req.user.id],
  );
  if (!rows[0]) throw new HttpError(401, 'User not found');
  res.json({ user: rows[0] });
});

const passwordChangeSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(6),
});

router.post('/change-password', requireAuth, async (req, res) => {
  const body = passwordChangeSchema.parse(req.body);
  const rows = await query(`SELECT password_hash FROM users WHERE id = ?`, [req.user.id]);
  const ok = await bcrypt.compare(body.current_password, rows[0].password_hash);
  if (!ok) throw new HttpError(400, 'Current password is incorrect');
  const newHash = await bcrypt.hash(body.new_password, 10);
  await query(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, req.user.id]);
  res.json({ ok: true });
});

export default router;
