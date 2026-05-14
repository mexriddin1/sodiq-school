import { query } from '../pool.js';

const items = [
  {
    image_key: 'ustoz-mansur',
    grant_label: '$394,000',
    sort_order: 1,
    translations: {
      uz: {
        university: 'Harvard University',
        name: 'Jasurbek Umarov',
        description: "9-sinfdan Sodiq Schoolda o'qidi va 3 yil o'tib, Harvardga kirdi. O'zbekiston xususiy maktablari orasida birinchi marta.",
      },
      ru: {
        university: 'Harvard University',
        name: 'Жасурбек Умаров',
        description: 'Учился в Sodiq School с 9 класса и через 3 года поступил в Гарвард. Впервые среди частных школ Узбекистана.',
      },
      en: {
        university: 'Harvard University',
        name: 'Jasurbek Umarov',
        description: 'Studied at Sodiq School from 9th grade and got into Harvard 3 years later. The first time among Uzbekistan\'s private schools.',
      },
    },
  },
  {
    image_key: 'ustoz-azimjon',
    grant_label: '$360,000',
    sort_order: 2,
    translations: {
      uz: { university: 'NYU Abu Dhabi', name: 'Murod Aslamov', description: "Dunyo reytingida 43-o'rinda turuvchi universitetga kirdi. IELTS 8.5, SAT 1540." },
      ru: { university: 'NYU Abu Dhabi', name: 'Мурод Асламов', description: 'Поступил в университет, занимающий 43-е место в мировом рейтинге. IELTS 8.5, SAT 1540.' },
      en: { university: 'NYU Abu Dhabi', name: 'Murod Aslamov', description: 'Got into a university ranked 43rd in the world. IELTS 8.5, SAT 1540.' },
    },
  },
  {
    image_key: 'ustoz-shomirza',
    grant_label: '100% grant',
    sort_order: 3,
    translations: {
      uz: { university: 'University of Hong Kong', name: 'Irgashev Mustafo', description: "Dunyo reytingida 17-o'rinda. IELTS 7.5, SAT 1520." },
      ru: { university: 'University of Hong Kong', name: 'Иргашев Мустафо', description: '17-е место в мировом рейтинге. IELTS 7.5, SAT 1520.' },
      en: { university: 'University of Hong Kong', name: 'Irgashev Mustafo', description: 'Ranked 17th in the world. IELTS 7.5, SAT 1520.' },
    },
  },
  {
    image_key: 'ustoz-hafizulloh',
    grant_label: '$400,000',
    sort_order: 4,
    translations: {
      uz: { university: 'University of Chicago', name: 'Nuraziz Ungboyev', description: 'Dunyo TOP-15 universitetidan biri. IT va startaplar sohasida eng kuchli.' },
      ru: { university: 'University of Chicago', name: 'Нуразиз Унгбоев', description: 'Один из ТОП-15 университетов мира. Сильнейший в сфере IT и стартапов.' },
      en: { university: 'University of Chicago', name: 'Nuraziz Ungboyev', description: 'One of the world\'s top 15 universities. Strongest in IT and startups.' },
    },
  },
];

export async function seedTopStudents(mediaMap) {
  console.log('[seed] top students...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO top_students (image_id, grant_label, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [mediaMap[it.image_key] ?? null, it.grant_label, it.sort_order],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.translations)) {
      await query(
        `INSERT INTO top_student_translations (top_student_id, locale, university, name, description) VALUES (?, ?, ?, ?, ?)`,
        [id, locale, tr.university, tr.name, tr.description],
      );
    }
  }
}
