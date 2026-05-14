import { query } from '../pool.js';

const items = [
  'carousel-telegram-cloud-photo-size-2-5472380547129613300-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613301-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613302-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613303-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613304-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613305-y',
  'carousel-telegram-cloud-photo-size-2-5472380547129613306-y',
];

export async function seedCarousel(mediaMap = {}) {
  console.log('[seed] carousel images...');
  let i = 1;
  for (const key of items) {
    const imageId = mediaMap[key] ?? null;
    if (!imageId) continue;
    await query(
      `INSERT INTO carousel_images (image_id, sort_order, is_published) VALUES (?, ?, 1)`,
      [imageId, i++],
    );
  }
}
