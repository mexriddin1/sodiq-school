import { query } from '../pool.js';

const videos = [
  { url: 'https://www.instagram.com/reel/C2chGhkKEod/', thumb: 'ustoz-mansur',     name: 'Hasan Mamasaidov',   role: 'Mfaktor, Dekos',     sort: 1 },
  { url: 'https://www.instagram.com/reel/C0g6UcyKSXV/', thumb: 'ustoz-azimjon',    name: 'Alisher Isaev',      role: 'Sales Doctor, Milliard', sort: 2 },
  { url: 'https://www.instagram.com/reel/C2FVGKyqDfq/', thumb: 'ustoz-shomirza',   name: 'Husan Mamasaidov',   role: 'Mfaktor, Deli',      sort: 3 },
  { url: 'https://www.instagram.com/reel/DW6QbDFglVz/', thumb: 'ustoz-hafizulloh', name: 'Ibrohim Gulyamov',   role: 'PCG',                sort: 4 },
  { url: 'https://www.instagram.com/reel/DWywjhAgsTo/', thumb: 'ustoz-shokir',     name: 'Shokir Rahmonov',    role: 'Sodiq School',       sort: 5 },
];

export async function seedTestimonialVideos(mediaMap) {
  console.log('[seed] testimonial videos...');
  for (const v of videos) {
    await query(
      `INSERT INTO testimonial_videos (url, thumbnail_id, name, role, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)`,
      [v.url, mediaMap[v.thumb] ?? null, v.name, v.role, v.sort],
    );
  }
}
