import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsAbs = path.resolve(__dirname, '..', '..', env.uploadDir);

await fs.mkdir(uploadsAbs, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsAbs),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]+/g, '-');
    cb(null, `${ts}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpe?g|webp|gif|svg\+xml)/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

const router = Router();
router.use(requireAuth);

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  const r = await query(
    `INSERT INTO media (filename, url, mime_type, size_bytes, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.file.filename, url, req.file.mimetype, req.file.size, req.body.alt || null, req.user.id],
  );
  res.status(201).json({
    id: r.insertId,
    filename: req.file.filename,
    url,
    mime_type: req.file.mimetype,
    size_bytes: req.file.size,
  });
});

export default router;
