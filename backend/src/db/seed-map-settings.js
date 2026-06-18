import { pool, query } from './pool.js';

const settings = [
  { key: 'contact.map_lat', value_raw: '41.2389', description: 'Google Map latitude. Example: 41.2389' },
  { key: 'contact.map_lng', value_raw: '69.2181', description: 'Google Map longitude. Example: 69.2181' },
  { key: 'contact.map_zoom', value_raw: '16', description: 'Google Map zoom level. Usually 14-18.' },
  { key: 'contact.map_embed_url', value_raw: '', description: 'Optional full Google Maps embed URL. If filled, it overrides lat/lng.' },
];

async function run() {
  console.log('[seed] map settings...');
  await query(
    `INSERT INTO settings (\`key\`, value_uz, value_ru, value_en, \`group\`, description)
     VALUES ('contact.address', ?, ?, ?, 'contact', ?)
     ON DUPLICATE KEY UPDATE
       \`group\` = VALUES(\`group\`),
       description = VALUES(description)`,
    [
      "Toshkent, Yunusobod tumani, Amir Temur ko'chasi 142",
      'Ташкент, Юнусабадский район, ул. Амира Темура 142',
      'Tashkent, Yunusobod district, Amir Temur street 142',
      'Bir nechta manzilni yangi qatordan yoki | belgisi bilan ajrating. Misol: "Manzil 1 | Manzil 2"',
    ],
  );
  for (const s of settings) {
    await query(
      `INSERT INTO settings (\`key\`, value_raw, \`group\`, description)
       VALUES (?, ?, 'contact', ?)
       ON DUPLICATE KEY UPDATE
         \`group\` = VALUES(\`group\`),
         description = VALUES(description)`,
      [s.key, s.value_raw, s.description],
    );
  }
  console.log('[seed] map settings done');
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
