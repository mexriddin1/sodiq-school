import { Router } from 'express';
import { buildCrudRouter } from '../lib/crud.js';
import { query } from '../db/pool.js';
import { pickLocale } from '../lib/i18n.js';
import { HttpError } from '../middleware/errors.js';

const baseRouter = buildCrudRouter({
  table: 'blog_posts',
  tTable: 'blog_post_translations',
  fkColumn: 'blog_post_id',
  parentColumns: ['slug', 'image_id', 'is_published', 'published_at', 'sort_order'],
  translationColumns: ['badge', 'date_label', 'title', 'excerpt', 'content'],
  publicColumns: ['id', 'slug', 'image_id', 'published_at', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = blog_posts.image_id',
});

const router = Router();

// public: GET /by-slug/:slug
router.get('/by-slug/:slug', async (req, res) => {
  const locale = pickLocale(req);
  const rows = await query(
    `SELECT blog_posts.id, blog_posts.slug, blog_posts.image_id,
            blog_posts.published_at, blog_posts.sort_order,
            media.url AS image_url,
            blog_post_translations.badge, blog_post_translations.date_label,
            blog_post_translations.title, blog_post_translations.excerpt,
            blog_post_translations.content
     FROM blog_posts
     LEFT JOIN media ON media.id = blog_posts.image_id
     LEFT JOIN blog_post_translations
       ON blog_post_translations.blog_post_id = blog_posts.id
       AND blog_post_translations.locale = ?
     WHERE blog_posts.is_published = 1 AND blog_posts.slug = ?
     LIMIT 1`,
    [locale, req.params.slug],
  );
  if (!rows[0]) throw new HttpError(404, 'Blog post not found');
  res.json(rows[0]);
});

router.use('/', baseRouter);

export default router;
