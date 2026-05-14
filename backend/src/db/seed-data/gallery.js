import { query } from '../pool.js';

const items = [
  { size: 'tall', sort: 1, tr: { uz: 'Dars paytida',     ru: 'На уроке',           en: 'In class' } },
  { size: '',     sort: 2, tr: { uz: 'IELTS va SAT',     ru: 'IELTS и SAT',         en: 'IELTS and SAT' } },
  { size: '',     sort: 3, tr: { uz: 'Ustozlar',         ru: 'Учителя',             en: 'Teachers' } },
  { size: 'wide', sort: 4, tr: { uz: 'Xayriya tadbirlari', ru: 'Благотворительные мероприятия', en: 'Charity events' } },
  { size: '',     sort: 5, tr: { uz: 'Debate',           ru: 'Дебаты',              en: 'Debate' } },
  { size: '',     sort: 6, tr: { uz: 'Musobaqalar',      ru: 'Соревнования',        en: 'Competitions' } },
  { size: 'tall', sort: 7, tr: { uz: 'Maktab',           ru: 'Школа',               en: 'School' } },
  { size: '',     sort: 8, tr: { uz: 'Sport',            ru: 'Спорт',               en: 'Sports' } },
  { size: '',     sort: 9, tr: { uz: 'Tadbirlar',        ru: 'Мероприятия',         en: 'Events' } },
];

export async function seedGallery() {
  console.log('[seed] gallery...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO gallery_items (image_id, size_class, sort_order, is_published) VALUES (NULL, ?, ?, 1)`,
      [it.size, it.sort],
    );
    const id = r.insertId;
    await query(
      `INSERT INTO gallery_translations (gallery_id, locale, caption) VALUES (?,?,?),(?,?,?),(?,?,?)`,
      [id, 'uz', it.tr.uz, id, 'ru', it.tr.ru, id, 'en', it.tr.en],
    );
  }
}
