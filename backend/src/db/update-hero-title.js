// One-shot UPDATE for hero title parts so it wraps as:
//   Line 1: title_main
//   Line 2: title_accent (orange, display:block in CSS)
//   Line 3: title_suffix
import { pool, query } from './pool.js';

const updates = [
  { key: 'hero.title_main',   uz: 'Bizning',           ru: 'Наши',  en: 'Our' },
  { key: 'hero.title_accent', uz: "o'quvchilar",       ru: 'ученики', en: 'students' },
  { key: 'hero.title_suffix', uz: "Harvardda o'qiydi", ru: 'учатся в Гарварде', en: 'study at Harvard' },
];

async function run() {
  for (const u of updates) {
    await query(
      `UPDATE settings SET value_uz = ?, value_ru = ?, value_en = ? WHERE \`key\` = ?`,
      [u.uz, u.ru, u.en, u.key],
    );
    console.log(`updated ${u.key}`);
  }
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
