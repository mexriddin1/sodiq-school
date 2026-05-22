// One-shot patch for missing settings keys + about_stats rows for the
// results-dark section. Idempotent: uses INSERT ... ON DUPLICATE KEY UPDATE
// for settings and skips about_stats if any page='results' row exists.
//
// Run with:  npm run db:seed-missing-fields
import { pool, query } from './pool.js';

const settings = [
  // Mission title — page.tsx uses s['mission.title_brand'] + s['mission.title_accent']
  {
    key: 'mission.title_brand', group: 'mission',
    uz: 'Sodiq School',
    ru: 'Sodiq School',
    en: 'Sodiq School',
  },
  {
    key: 'mission.title_accent', group: 'mission',
    uz: "missiyasi",
    ru: 'миссия',
    en: 'mission',
  },
  // Admissions section subtitles
  {
    key: 'admissions.process_title', group: 'admissions',
    uz: 'Qabul jarayoni',
    ru: 'Процесс поступления',
    en: 'Admissions process',
  },
  {
    key: 'admissions.exams_title', group: 'admissions',
    uz: 'Kirish imtihonlari',
    ru: 'Вступительные экзамены',
    en: 'Entrance exams',
  },
  {
    key: 'admissions.info_title', group: 'admissions',
    uz: 'Muhim ma\'lumotlar',
    ru: 'Важная информация',
    en: 'Key information',
  },
];

const resultsStats = [
  {
    prefix: '', value: '300', suffix: '+', page: 'results', sort_order: 1,
    tr: {
      uz: { label: 'IELTS topshirgan o\'quvchilar', sub: "Oxirgi 4 yil davomida" },
      ru: { label: 'Учеников сдали IELTS',          sub: 'За последние 4 года' },
      en: { label: 'Students took IELTS',            sub: 'Over the last 4 years' },
    },
  },
  {
    prefix: '', value: '7.5', suffix: '', page: 'results', sort_order: 2,
    tr: {
      uz: { label: "IELTS o'rtacha ball",  sub: "Bizning o'quvchilarimiz natijasi" },
      ru: { label: 'Средний балл IELTS',    sub: 'Результат наших учеников' },
      en: { label: 'Average IELTS score',   sub: "Our students' result" },
    },
  },
  {
    prefix: '', value: '1400', suffix: '+', page: 'results', sort_order: 3,
    tr: {
      uz: { label: "SAT o'rtacha ball",  sub: "TOP universitetlar uchun yetarli" },
      ru: { label: 'Средний балл SAT',    sub: 'Достаточно для ТОП-вузов' },
      en: { label: 'Average SAT score',   sub: 'Enough for top universities' },
    },
  },
  {
    prefix: '', value: '98', suffix: '%', page: 'results', sort_order: 4,
    tr: {
      uz: { label: "Universitetga kirgan bitiruvchilar", sub: "Tanlagan oliygohga muvaffaqiyatli o'tdi" },
      ru: { label: 'Выпускников поступили в вуз',         sub: 'Зачислены в выбранный университет' },
      en: { label: 'Graduates admitted',                  sub: 'Accepted into their chosen university' },
    },
  },
];

async function upsertSettings() {
  console.log('[seed-missing-fields] upserting settings...');
  for (const s of settings) {
    await query(
      `INSERT INTO settings (\`key\`, value_uz, value_ru, value_en, \`group\`)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         value_uz = COALESCE(NULLIF(value_uz, ''), VALUES(value_uz)),
         value_ru = COALESCE(NULLIF(value_ru, ''), VALUES(value_ru)),
         value_en = COALESCE(NULLIF(value_en, ''), VALUES(value_en))`,
      [s.key, s.uz, s.ru, s.en, s.group],
    );
  }
}

async function insertResultsStats() {
  const existing = await query(`SELECT COUNT(*) AS n FROM about_stats WHERE page = 'results'`);
  if (existing[0].n > 0) {
    console.log(`[seed-missing-fields] about_stats(page='results') already has ${existing[0].n} rows, skipping`);
    return;
  }
  console.log('[seed-missing-fields] inserting results stats...');
  for (const it of resultsStats) {
    const r = await query(
      `INSERT INTO about_stats (prefix, value, suffix, page, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)`,
      [it.prefix, it.value, it.suffix, it.page, it.sort_order],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.tr)) {
      await query(
        `INSERT INTO about_stat_translations (about_stat_id, locale, label, sub) VALUES (?, ?, ?, ?)`,
        [id, locale, tr.label, tr.sub],
      );
    }
  }
}

async function run() {
  await upsertSettings();
  await insertResultsStats();
  console.log('[seed-missing-fields] done');
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
