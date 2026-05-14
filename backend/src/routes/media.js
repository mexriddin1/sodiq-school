import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();

// public list (used by admin and possibly client)
router.get('/', async (_req, res) => {
  const rows = await query(
    `SELECT id, filename, url, mime_type, size_bytes, alt_text, created_at
     FROM media ORDER BY created_at DESC LIMIT 200`,
  );
  res.json({ items: rows });
});

router.get('/:id', async (req, res) => {
  const rows = await query(`SELECT * FROM media WHERE id = ?`, [parseInt(req.params.id, 10)]);
  if (!rows[0]) throw new HttpError(404, 'Media not found');
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query(`DELETE FROM media WHERE id = ?`, [parseInt(req.params.id, 10)]);
  res.json({ ok: true });
});

export default router;
