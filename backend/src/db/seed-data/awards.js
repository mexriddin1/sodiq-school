import { query } from '../pool.js';

const awards = [
  {
    icon_key: 'wsc', sort: 1,
    gold: 46, silver: 47, bronze: 1,
    total_label_value: '93',
    tr: {
      uz: { title: "World Scholar's Cup", description: "Xalqaro musobaqa. 4 yildan beri ishtirok etamiz.", gold_label: 'oltin', silver_label: 'kumush', bronze_label: 'kubok', total_label: "Jami <strong>93 medal</strong> · 27 o'quvchi" },
      ru: { title: "World Scholar's Cup", description: 'Международный конкурс. Участвуем уже 4 года.', gold_label: 'золото', silver_label: 'серебро', bronze_label: 'кубок', total_label: 'Всего <strong>93 медали</strong> · 27 учеников' },
      en: { title: "World Scholar's Cup", description: 'International competition. We have been participating for 4 years.', gold_label: 'gold', silver_label: 'silver', bronze_label: 'cup', total_label: 'Total <strong>93 medals</strong> · 27 students' },
    },
  },
  {
    icon_key: 'star', sort: 2,
    gold: 4, silver: 4, bronze: 2,
    total_label_value: '10',
    tr: {
      uz: { title: 'Asiarope olimpiadasi', description: 'Matematika, tabiiy fanlar, ingliz tili.', gold_label: 'oltin', silver_label: 'kumush', bronze_label: 'bronza', total_label: 'Jami <strong>10 medal</strong>' },
      ru: { title: 'Олимпиада Asiarope', description: 'Математика, естественные науки, английский.', gold_label: 'золото', silver_label: 'серебро', bronze_label: 'бронза', total_label: 'Всего <strong>10 медалей</strong>' },
      en: { title: 'Asiarope olympiad', description: 'Mathematics, natural sciences, English.', gold_label: 'gold', silver_label: 'silver', bronze_label: 'bronze', total_label: 'Total <strong>10 medals</strong>' },
    },
  },
  {
    icon_key: 'karate', sort: 3,
    gold: 4, silver: 4, bronze: 0,
    total_label_value: '8',
    tr: {
      uz: { title: '"Qibray Open" karate', description: 'Sport maydonida ham yaxshi natijalar.', gold_label: "1-o'rin", silver_label: "2-o'rin", bronze_label: '', total_label: 'Jami <strong>8 sovrindor</strong>' },
      ru: { title: '"Qibray Open" каратэ', description: 'Хорошие результаты и в спорте.', gold_label: '1 место', silver_label: '2 место', bronze_label: '', total_label: 'Всего <strong>8 призёров</strong>' },
      en: { title: '"Qibray Open" karate', description: 'Strong results in sports too.', gold_label: '1st place', silver_label: '2nd place', bronze_label: '', total_label: 'Total <strong>8 winners</strong>' },
    },
  },
];

// Map icon_key → media key from seedMedia()
const iconToMedia = {
  wsc: 'award-wsc',
  star: 'award-asiarope',
  karate: 'award-karate',
};

export async function seedAwards(mediaMap = {}) {
  console.log('[seed] awards...');
  for (const a of awards) {
    const mediaKey = iconToMedia[a.icon_key];
    const imageId = mediaKey ? mediaMap[mediaKey] : null;
    const r = await query(
      `INSERT INTO awards (icon_key, image_id, video_url, gold_count, silver_count, bronze_count, total_label_value, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [a.icon_key, imageId, a.video_url ?? null, a.gold, a.silver, a.bronze, a.total_label_value, a.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(a.tr)) {
      await query(
        `INSERT INTO award_translations (award_id, locale, title, description, gold_label, silver_label, bronze_label, total_label)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, locale, tr.title, tr.description, tr.gold_label, tr.silver_label, tr.bronze_label, tr.total_label],
      );
    }
  }
}
