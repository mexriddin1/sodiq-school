import { query } from '../pool.js';

const courses = [
  {
    badge: 'IELTS', theme: 'ielts', score_value: '7.5', sort: 1,
    tr: {
      uz: {
        score_label: "O'rtacha",
        body: "Xalqaro ingliz tili imtihoni. <strong>Harvard, Oxford, NYU</strong> kabi universitetlarga kirish uchun asosiy talab.",
        facts: [
          { label: 'Minimal ball', value: '6.5' },
          { label: 'TOP universitetlar', value: '7.0+' },
          { label: 'Eng yuqori natija', value: '8.5' },
        ],
        note: "O'quvchi bir vaqtda ham maktab dasturini o'taydi, ham imtihonga tayyorlanadi.",
        cta_label: "Ro'yxatdan o'tish",
      },
      ru: {
        score_label: 'Средний',
        body: 'Международный экзамен по английскому. Основное требование для поступления в <strong>Harvard, Oxford, NYU</strong>.',
        facts: [
          { label: 'Минимальный балл', value: '6.5' },
          { label: 'Топ-университеты', value: '7.0+' },
          { label: 'Лучший результат', value: '8.5' },
        ],
        note: 'Ученик одновременно проходит школьную программу и готовится к экзамену.',
        cta_label: 'Записаться',
      },
      en: {
        score_label: 'Average',
        body: 'International English exam. The main requirement for admission to <strong>Harvard, Oxford, NYU</strong>.',
        facts: [
          { label: 'Minimum score', value: '6.5' },
          { label: 'Top universities', value: '7.0+' },
          { label: 'Highest result', value: '8.5' },
        ],
        note: 'Students follow the school program and prepare for the exam at the same time.',
        cta_label: 'Sign up',
      },
    },
  },
  {
    badge: 'SAT', theme: 'sat', score_value: '1400', sort: 2,
    tr: {
      uz: {
        score_label: "O'rtacha",
        body: 'Amerika universitetlariga kirish uchun standart imtihon. <strong>Bowdoin, Carnegie Mellon, University of Toronto</strong> kabi universitetlar SAT natijasiga qarab qabul qiladi.',
        facts: [
          { label: 'TOP kirish uchun', value: '1400+' },
          { label: 'Eng yuqori natija', value: '1540' },
        ],
        note: "SAT kursi ham akademik fanlar bilan parallel o'rgatiladi.",
        cta_label: "Ro'yxatdan o'tish",
      },
      ru: {
        score_label: 'Средний',
        body: 'Стандартный экзамен для поступления в американские университеты.',
        facts: [
          { label: 'Для ТОП', value: '1400+' },
          { label: 'Лучший результат', value: '1540' },
        ],
        note: 'Курс SAT идёт параллельно с академическими предметами.',
        cta_label: 'Записаться',
      },
      en: {
        score_label: 'Average',
        body: 'Standard exam for admission to US universities.',
        facts: [
          { label: 'For top schools', value: '1400+' },
          { label: 'Highest result', value: '1540' },
        ],
        note: 'The SAT course runs in parallel with academic subjects.',
        cta_label: 'Sign up',
      },
    },
  },
];

export async function seedExamCourses() {
  console.log('[seed] exam courses...');
  for (const c of courses) {
    const r = await query(
      `INSERT INTO exam_courses (badge, theme, score_value, sort_order, is_published) VALUES (?, ?, ?, ?, 1)`,
      [c.badge, c.theme, c.score_value, c.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(c.tr)) {
      await query(
        `INSERT INTO exam_course_translations (exam_course_id, locale, score_label, body, facts_json, note, cta_label)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, locale, tr.score_label, tr.body, JSON.stringify(tr.facts), tr.note, tr.cta_label],
      );
    }
  }
}
