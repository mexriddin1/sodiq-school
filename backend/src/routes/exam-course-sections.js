import { Router } from 'express';
import { buildCrudRouter } from '../lib/crud.js';
import { query } from '../db/pool.js';
import { pickLocale } from '../lib/i18n.js';

const baseRouter = buildCrudRouter({
  table: 'exam_course_sections',
  tTable: 'exam_course_section_translations',
  fkColumn: 'exam_course_section_id',
  parentColumns: ['exam_course_id', 'image_id', 'is_reverse', 'sort_order', 'is_published'],
  translationColumns: ['title', 'body'],
  publicColumns: ['id', 'exam_course_id', 'image_id', 'is_reverse', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = exam_course_sections.image_id',
});

const router = Router();

// GET /by-course/:badge?lang=uz  (badge: IELTS or SAT)
router.get('/by-course/:badge', async (req, res) => {
  const locale = pickLocale(req);
  const rows = await query(
    `SELECT s.id, s.exam_course_id, s.image_id, s.is_reverse, s.sort_order,
            m.url AS image_url,
            t.title, t.body
     FROM exam_course_sections s
     INNER JOIN exam_courses ec ON ec.id = s.exam_course_id
     LEFT JOIN media m ON m.id = s.image_id
     LEFT JOIN exam_course_section_translations t
       ON t.exam_course_section_id = s.id AND t.locale = ?
     WHERE s.is_published = 1 AND ec.badge = ?
     ORDER BY s.sort_order ASC`,
    [locale, req.params.badge],
  );
  res.json({ items: rows });
});

router.use('/', baseRouter);

export default router;
