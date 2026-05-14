import { query } from '../pool.js';

const subjects = [
  {
    group_key: 'academic', icon_key: 'academic', sort: 1,
    tr: {
      uz: { title: 'Akademik fanlar', tags: ['Matematika', 'Ingliz tili', 'Tarix', 'Ijtimoiy fanlar', 'Kimyo', 'Ona tili'] },
      ru: { title: 'Академические предметы', tags: ['Математика', 'Английский', 'История', 'Обществознание', 'Химия', 'Родной язык'] },
      en: { title: 'Academic subjects', tags: ['Mathematics', 'English', 'History', 'Social Studies', 'Chemistry', 'Native language'] },
    },
  },
  {
    group_key: 'tarbiya', icon_key: 'tarbiya', sort: 2,
    tr: {
      uz: { title: 'Tarbiya fanlari', tags: ['Odobnoma', "Notiqlik san'ati", 'Ruhiy tarbiya', 'Arab tili', 'Mnemonika'] },
      ru: { title: 'Воспитательные предметы', tags: ['Этикет', 'Ораторское искусство', 'Духовное воспитание', 'Арабский', 'Мнемоника'] },
      en: { title: 'Character subjects', tags: ['Ethics', 'Public speaking', 'Spiritual upbringing', 'Arabic', 'Mnemonics'] },
    },
  },
];

export async function seedLessonSubjects() {
  console.log('[seed] lesson subjects...');
  for (const s of subjects) {
    const r = await query(
      `INSERT INTO lesson_subjects (group_key, icon_key, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [s.group_key, s.icon_key, s.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(s.tr)) {
      await query(
        `INSERT INTO lesson_subject_translations (lesson_subject_id, locale, title, tags_json) VALUES (?,?,?,?)`,
        [id, locale, tr.title, JSON.stringify(tr.tags)],
      );
    }
  }
}
