import { query } from '../pool.js';

const items = [
  { img: 'ustoz-mansur', ielts: 'IELTS 8.5', sort: 1, tr: {
    uz: { name: "Aziza Sa'dullayeva", university: 'Harvard University', major: 'Computer Science' },
    ru: { name: 'Азиза Садуллаева', university: 'Harvard University', major: 'Computer Science' },
    en: { name: "Aziza Sa'dullayeva", university: 'Harvard University', major: 'Computer Science' },
  }},
  { img: 'ustoz-azimjon', ielts: 'IELTS 8.0', sort: 2, tr: {
    uz: { name: 'Jahongir Mahmudov', university: 'MIT', major: 'Electrical Engineering' },
    ru: { name: 'Жахонгир Махмудов', university: 'MIT', major: 'Electrical Engineering' },
    en: { name: 'Jahongir Mahmudov', university: 'MIT', major: 'Electrical Engineering' },
  }},
  { img: 'ustoz-rayxona', ielts: 'IELTS 8.5', sort: 3, tr: {
    uz: { name: 'Diyora Karimova', university: 'NYU Abu Dhabi', major: 'Economics & Finance' },
    ru: { name: 'Диёра Каримова', university: 'NYU Abu Dhabi', major: 'Economics & Finance' },
    en: { name: 'Diyora Karimova', university: 'NYU Abu Dhabi', major: 'Economics & Finance' },
  }},
  { img: 'ustoz-shomirza', ielts: 'IELTS 8.0', sort: 4, tr: {
    uz: { name: 'Asadbek Toshmatov', university: 'University of Cambridge', major: 'Mathematics' },
    ru: { name: 'Асадбек Тошматов', university: 'University of Cambridge', major: 'Mathematics' },
    en: { name: 'Asadbek Toshmatov', university: 'University of Cambridge', major: 'Mathematics' },
  }},
  { img: 'ustoz-hafizulloh', ielts: 'IELTS 7.5', sort: 5, tr: {
    uz: { name: 'Zarina Aliyeva', university: 'Nazarbayev University', major: 'International Relations' },
    ru: { name: 'Зарина Алиева', university: 'Nazarbayev University', major: 'International Relations' },
    en: { name: 'Zarina Aliyeva', university: 'Nazarbayev University', major: 'International Relations' },
  }},
  { img: 'ustoz-shokir', ielts: 'IELTS 7.5', sort: 6, tr: {
    uz: { name: 'Shoxruh Xolmatov', university: 'University College London', major: 'Mechanical Engineering' },
    ru: { name: 'Шохрух Холматов', university: 'University College London', major: 'Mechanical Engineering' },
    en: { name: 'Shoxruh Xolmatov', university: 'University College London', major: 'Mechanical Engineering' },
  }},
];

export async function seedAlumni(mediaMap) {
  console.log('[seed] alumni...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO alumni (image_id, ielts_label, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [mediaMap[it.img] ?? null, it.ielts, it.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.tr)) {
      await query(
        `INSERT INTO alumni_translations (alumni_id, locale, name, university, major) VALUES (?, ?, ?, ?, ?)`,
        [id, locale, tr.name, tr.university, tr.major],
      );
    }
  }
}
