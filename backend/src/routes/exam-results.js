import { Router } from 'express';
import { buildCrudRouter } from '../lib/crud.js';
import { query } from '../db/pool.js';
import { pickLocale } from '../lib/i18n.js';

const baseRouter = buildCrudRouter({
  table: 'exam_results',
  tTable: 'exam_result_translations',
  fkColumn: 'exam_result_id',
  parentColumns: ['exam_type', 'score', 'image_id', 'year', 'sort_order', 'is_published'],
  translationColumns: ['name', 'grade'],
  publicColumns: ['id', 'exam_type', 'score', 'image_id', 'year', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = exam_results.image_id',
});

const router = Router();

// Convenience: GET /by-type/:type returns rows of a single exam_type
router.get('/by-type/:type', async (req, res) => {
  const locale = pickLocale(req);
  const t = req.params.type;
  const rows = await query(
    `SELECT exam_results.id, exam_results.exam_type, exam_results.score,
            exam_results.image_id, exam_results.year, exam_results.sort_order,
            media.url AS image_url,
            exam_result_translations.name, exam_result_translations.grade
     FROM exam_results
     LEFT JOIN media ON media.id = exam_results.image_id
     LEFT JOIN exam_result_translations
       ON exam_result_translations.exam_result_id = exam_results.id
       AND exam_result_translations.locale = ?
     WHERE exam_results.is_published = 1 AND exam_results.exam_type = ?
     ORDER BY exam_results.sort_order ASC`,
    [locale, t],
  );
  res.json({ items: rows });
});

router.use('/', baseRouter);

export default router;
