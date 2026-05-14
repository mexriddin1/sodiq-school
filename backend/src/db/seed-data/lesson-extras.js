import { query } from '../pool.js';

const extras = [
  {
    link_url: 'https://www.instagram.com/reel/DXeb0rtggME/', icon_key: 'sparkles', sort: 1,
    tr: {
      uz: { title: 'Zakovat', description: "O'quvchilar jamoa bo'lib mantiqiy va intellektual o'yinlarda ishtirok etadi. Tez fikrlash va jamoada ishlashni rivojlantiradi.", link_label: "Videoni ko'rish →" },
      ru: { title: 'Заковат', description: 'Ученики участвуют в командных интеллектуальных играх, развивая быстрое мышление и работу в команде.', link_label: 'Смотреть видео →' },
      en: { title: 'Zakovat', description: 'Students compete in team intellectual games, developing quick thinking and teamwork.', link_label: 'Watch video →' },
    },
  },
  {
    link_url: 'https://www.instagram.com/reel/DVi1v92glF3/', icon_key: 'book', sort: 2,
    tr: {
      uz: { title: 'Mutolaa loyihasi', description: "Kitob o'qish odatga aylangan. <strong>1200+ kitob</strong> o'qildi, <strong>1500+ soat</strong> tinglandi.", link_label: "Videoni ko'rish →" },
      ru: { title: 'Проект чтения', description: 'Чтение стало привычкой. Прочитано <strong>1200+ книг</strong>, прослушано <strong>1500+ часов</strong>.', link_label: 'Смотреть видео →' },
      en: { title: 'Reading project', description: 'Reading is a habit here. <strong>1,200+ books</strong> read, <strong>1,500+ hours</strong> of audio listened to.', link_label: 'Watch video →' },
    },
  },
];

export async function seedLessonExtras() {
  console.log('[seed] lesson extras...');
  for (const e of extras) {
    const r = await query(
      `INSERT INTO lesson_extras (link_url, icon_key, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [e.link_url, e.icon_key, e.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(e.tr)) {
      await query(
        `INSERT INTO lesson_extra_translations (lesson_extra_id, locale, title, description, link_label) VALUES (?,?,?,?,?)`,
        [id, locale, tr.title, tr.description, tr.link_label],
      );
    }
  }
}
