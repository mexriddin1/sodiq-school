import { Router } from 'express';
import { query } from '../db/pool.js';
import { pickLocale } from '../lib/i18n.js';

const router = Router();

// One mega-endpoint that returns the entire public site bundle for one locale.
// Frontend can call once per page-load, cache it on the server side,
// and pick what it needs. Reduces round-trips significantly.
router.get('/', async (req, res) => {
  const locale = pickLocale(req);

  const [
    settings,
    teachers,
    testimonialVideos,
    topStudents,
    alumni,
    examIelts,
    examSat,
    awards,
    universities,
    blogPosts,
    examCourses,
    lessonSubjects,
    lessonExtras,
    gallery,
    faqs,
    carousel,
    pricingPlans,
    advantages,
    aboutStats,
  ] = await Promise.all([
    query(`SELECT \`key\`, value_uz, value_ru, value_en, value_raw FROM settings`),

    query(
      `SELECT t.id, t.slug, t.image_id, t.sort_order, m.url AS image_url,
              tt.name, tt.role, tt.bio, tt.meta_json
       FROM teachers t
       LEFT JOIN media m ON m.id = t.image_id
       LEFT JOIN teacher_translations tt ON tt.teacher_id = t.id AND tt.locale = ?
       WHERE t.is_published = 1
       ORDER BY t.sort_order ASC`, [locale]),

    query(
      `SELECT tv.id, tv.url, tv.thumbnail_id, tv.name, tv.role, tv.sort_order, m.url AS thumbnail_url
       FROM testimonial_videos tv
       LEFT JOIN media m ON m.id = tv.thumbnail_id
       WHERE tv.is_published = 1
       ORDER BY tv.sort_order ASC`),

    query(
      `SELECT ts.id, ts.image_id, ts.grant_label, ts.sort_order, m.url AS image_url,
              tst.university, tst.name, tst.description
       FROM top_students ts
       LEFT JOIN media m ON m.id = ts.image_id
       LEFT JOIN top_student_translations tst ON tst.top_student_id = ts.id AND tst.locale = ?
       WHERE ts.is_published = 1
       ORDER BY ts.sort_order ASC`, [locale]),

    query(
      `SELECT a.id, a.image_id, a.ielts_label, a.sort_order, m.url AS image_url,
              at.name, at.university, at.major
       FROM alumni a
       LEFT JOIN media m ON m.id = a.image_id
       LEFT JOIN alumni_translations at ON at.alumni_id = a.id AND at.locale = ?
       WHERE a.is_published = 1
       ORDER BY a.sort_order ASC`, [locale]),

    query(
      `SELECT er.id, er.exam_type, er.score, er.image_id, er.year, er.sort_order,
              m.url AS image_url, ert.name, ert.grade
       FROM exam_results er
       LEFT JOIN media m ON m.id = er.image_id
       LEFT JOIN exam_result_translations ert ON ert.exam_result_id = er.id AND ert.locale = ?
       WHERE er.is_published = 1 AND er.exam_type = 'ielts'
       ORDER BY er.sort_order ASC`, [locale]),
    query(
      `SELECT er.id, er.exam_type, er.score, er.image_id, er.year, er.sort_order,
              m.url AS image_url, ert.name, ert.grade
       FROM exam_results er
       LEFT JOIN media m ON m.id = er.image_id
       LEFT JOIN exam_result_translations ert ON ert.exam_result_id = er.id AND ert.locale = ?
       WHERE er.is_published = 1 AND er.exam_type = 'sat'
       ORDER BY er.sort_order ASC`, [locale]),

    query(
      `SELECT a.id, a.icon_key, a.image_id, a.video_url, a.gold_count, a.silver_count, a.bronze_count,
              a.total_label_value, a.sort_order, m.url AS image_url,
              at.title, at.description, at.gold_label, at.silver_label, at.bronze_label, at.total_label
       FROM awards a
       LEFT JOIN media m ON m.id = a.image_id
       LEFT JOIN award_translations at ON at.award_id = a.id AND at.locale = ?
       WHERE a.is_published = 1
       ORDER BY a.sort_order ASC`, [locale]),

    query(
      `SELECT u.id, u.name AS raw_name, u.image_id, u.\`group\`, u.track, u.page, u.sort_order,
              m.url AS image_url, ut.name
       FROM universities u
       LEFT JOIN media m ON m.id = u.image_id
       LEFT JOIN university_translations ut ON ut.university_id = u.id AND ut.locale = ?
       WHERE u.is_published = 1
       ORDER BY u.page ASC, u.\`group\` ASC, u.sort_order ASC`, [locale]),

    query(
      `SELECT bp.id, bp.slug, bp.image_id, bp.published_at, bp.sort_order,
              m.url AS image_url,
              bpt.badge, bpt.date_label, bpt.title, bpt.excerpt
       FROM blog_posts bp
       LEFT JOIN media m ON m.id = bp.image_id
       LEFT JOIN blog_post_translations bpt ON bpt.blog_post_id = bp.id AND bpt.locale = ?
       WHERE bp.is_published = 1
       ORDER BY bp.sort_order ASC, bp.published_at DESC`, [locale]),

    query(
      `SELECT ec.id, ec.badge, ec.theme, ec.score_value, ec.sort_order,
              ect.score_label, ect.body, ect.facts_json, ect.note, ect.cta_label
       FROM exam_courses ec
       LEFT JOIN exam_course_translations ect ON ect.exam_course_id = ec.id AND ect.locale = ?
       WHERE ec.is_published = 1
       ORDER BY ec.sort_order ASC`, [locale]),

    query(
      `SELECT ls.id, ls.group_key, ls.icon_key, ls.sort_order,
              lst.title, lst.tags_json
       FROM lesson_subjects ls
       LEFT JOIN lesson_subject_translations lst ON lst.lesson_subject_id = ls.id AND lst.locale = ?
       WHERE ls.is_published = 1
       ORDER BY ls.sort_order ASC`, [locale]),

    query(
      `SELECT le.id, le.image_id, le.link_url, le.icon_key, le.sort_order,
              m.url AS image_url,
              let.title, let.description, let.link_label
       FROM lesson_extras le
       LEFT JOIN media m ON m.id = le.image_id
       LEFT JOIN lesson_extra_translations let ON let.lesson_extra_id = le.id AND let.locale = ?
       WHERE le.is_published = 1
       ORDER BY le.sort_order ASC`, [locale]),

    query(
      `SELECT g.id, g.image_id, g.size_class, g.sort_order, m.url AS image_url,
              gt.caption
       FROM gallery_items g
       LEFT JOIN media m ON m.id = g.image_id
       LEFT JOIN gallery_translations gt ON gt.gallery_id = g.id AND gt.locale = ?
       WHERE g.is_published = 1
       ORDER BY g.sort_order ASC`, [locale]),

    query(
      `SELECT f.id, f.page, f.sort_order, ft.question, ft.answer
       FROM faqs f
       LEFT JOIN faq_translations ft ON ft.faq_id = f.id AND ft.locale = ?
       WHERE f.is_published = 1
       ORDER BY f.sort_order ASC`, [locale]),

    query(
      `SELECT c.id, c.image_id, c.sort_order, m.url AS image_url
       FROM carousel_images c
       LEFT JOIN media m ON m.id = c.image_id
       WHERE c.is_published = 1
       ORDER BY c.sort_order ASC`),

    query(
      `SELECT p.id, p.amount, p.currency, p.is_featured, p.sort_order,
              pt.label, pt.note, pt.includes, pt.cta_label
       FROM pricing_plans p
       LEFT JOIN pricing_plan_translations pt ON pt.pricing_plan_id = p.id AND pt.locale = ?
       WHERE p.is_published = 1
       ORDER BY p.sort_order ASC`, [locale]),

    query(
      `SELECT a.id, a.icon_key, a.accent_num, a.sort_order,
              at.title, at.description
       FROM advantages a
       LEFT JOIN advantage_translations at ON at.advantage_id = a.id AND at.locale = ?
       WHERE a.is_published = 1
       ORDER BY a.sort_order ASC`, [locale]),

    query(
      `SELECT s.id, s.prefix, s.value, s.suffix, s.page, s.sort_order,
              st.label, st.sub
       FROM about_stats s
       LEFT JOIN about_stat_translations st ON st.about_stat_id = s.id AND st.locale = ?
       WHERE s.is_published = 1
       ORDER BY s.sort_order ASC`, [locale]),
  ]);

  // map settings → key/value
  const settingsMap = {};
  for (const r of settings) {
    const v = locale === 'ru' ? r.value_ru : locale === 'en' ? r.value_en : r.value_uz;
    settingsMap[r.key] = v ?? r.value_raw ?? '';
  }

  // parse JSON columns
  const parseJson = (v) => {
    if (!v) return [];
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return []; }
    }
    return v;
  };
  for (const t of teachers) { t.meta = parseJson(t.meta_json); delete t.meta_json; }
  for (const c of examCourses) { c.facts = parseJson(c.facts_json); delete c.facts_json; }
  for (const s of lessonSubjects) { s.tags = parseJson(s.tags_json); delete s.tags_json; }

  res.json({
    locale,
    settings: settingsMap,
    teachers,
    testimonial_videos: testimonialVideos,
    top_students: topStudents,
    alumni,
    exam_results: { ielts: examIelts, sat: examSat },
    awards,
    universities,
    blog_posts: blogPosts,
    exam_courses: examCourses,
    lesson_subjects: lessonSubjects,
    lesson_extras: lessonExtras,
    gallery,
    faqs,
    carousel,
    pricing_plans: pricingPlans,
    advantages,
    about_stats: aboutStats,
  });
});

export default router;
