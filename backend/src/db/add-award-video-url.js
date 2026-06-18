import { pool, query } from './pool.js';

async function run() {
  console.log('[migrate] award video_url...');
  const rows = await query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'awards'
       AND COLUMN_NAME = 'video_url'`,
  );

  if (Number(rows[0]?.count || 0) === 0) {
    await query(`ALTER TABLE awards ADD COLUMN video_url VARCHAR(500) NULL AFTER image_id`);
    console.log('[migrate] added awards.video_url');
  } else {
    console.log('[migrate] awards.video_url already exists');
  }

  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
