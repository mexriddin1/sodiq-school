import { query } from '../pool.js';

const items = [
  {
    prefix: '', value: '1500', suffix: '+', page: 'both', sort_order: 1,
    tr: {
      uz: { label: "O'quvchilar", sub: "Akademik dasturlardagi o'quvchilar soni" },
      ru: { label: 'Учеников',     sub: 'Учеников в академических программах' },
      en: { label: 'Students',     sub: 'Students enrolled in academic programs' },
    },
  },
  {
    prefix: '', value: '300', suffix: '+', page: 'both', sort_order: 2,
    tr: {
      uz: { label: "TOP universitetga kirgan bitiruvchilar", sub: "Harvard, Chicago, NYU Abu Dhabi va boshqalar" },
      ru: { label: 'Выпускников в ТОП-университетах',         sub: 'Harvard, Chicago, NYU Abu Dhabi и другие' },
      en: { label: 'Graduates at top universities',           sub: 'Harvard, Chicago, NYU Abu Dhabi and others' },
    },
  },
  {
    prefix: '$', value: '15', suffix: 'M+', page: 'both', sort_order: 3,
    tr: {
      uz: { label: "Bitiruvchilar olgan grantlar",   sub: "Jami stipendiya va grantlar miqdori" },
      ru: { label: 'Грантов выпускникам',             sub: 'Общая сумма стипендий и грантов' },
      en: { label: 'In scholarships and grants',      sub: 'Total awarded to graduates' },
    },
  },
  {
    prefix: '', value: '20', suffix: '+', page: 'both', sort_order: 4,
    tr: {
      uz: { label: "Yillik tajriba", sub: "Sifatli ta'lim sohasidagi yo'lboshchi" },
      ru: { label: 'Лет опыта',      sub: 'Лидер в сфере качественного образования' },
      en: { label: 'Years of experience', sub: 'A leader in quality education' },
    },
  },
  {
    prefix: '', value: '40', suffix: '+', page: 'both', sort_order: 5,
    tr: {
      uz: { label: "Tajribali ustozlar", sub: "Xalqaro sertifikatga ega o'qituvchilar" },
      ru: { label: 'Опытных преподавателей', sub: 'С международными сертификатами' },
      en: { label: 'Experienced teachers',   sub: 'With international certifications' },
    },
  },
  {
    prefix: '', value: '98', suffix: '%', page: 'both', sort_order: 6,
    tr: {
      uz: { label: "Ota-onalar mamnunligi", sub: "Ichki so'rovnoma natijasi (2026)" },
      ru: { label: 'Довольных родителей',    sub: 'По внутреннему опросу (2026)' },
      en: { label: 'Parent satisfaction',    sub: 'Based on internal survey (2026)' },
    },
  },
];

export async function seedAboutStats() {
  console.log('[seed] about stats...');
  for (const it of items) {
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
