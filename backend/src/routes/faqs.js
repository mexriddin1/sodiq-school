import { Router } from 'express';
import { buildCrudRouter } from '../lib/crud.js';
import { query } from '../db/pool.js';
import { pickLocale } from '../lib/i18n.js';

const baseRouter = buildCrudRouter({
  table: 'faqs',
  tTable: 'faq_translations',
  fkColumn: 'faq_id',
  parentColumns: ['page', 'sort_order', 'is_published'],
  translationColumns: ['question', 'answer'],
  publicColumns: ['id', 'page', 'sort_order'],
});

const router = Router();

// GET /by-page/:page  → faqs for a specific page (or 'both')
router.get('/by-page/:page', async (req, res) => {
  const locale = pickLocale(req);
  const page = req.params.page;
  const rows = await query(
    `SELECT faqs.id, faqs.page, faqs.sort_order,
            faq_translations.question, faq_translations.answer
     FROM faqs
     LEFT JOIN faq_translations
       ON faq_translations.faq_id = faqs.id
       AND faq_translations.locale = ?
     WHERE faqs.is_published = 1 AND (faqs.page = ? OR faqs.page = 'both')
     ORDER BY faqs.sort_order ASC`,
    [locale, page],
  );
  res.json({ items: rows });
});

router.use('/', baseRouter);
export default router;
