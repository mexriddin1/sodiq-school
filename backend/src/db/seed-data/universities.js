import { query } from '../pool.js';

// New version: each university entry can have a logo image (image_id) and is split
// across two carousel tracks: 'left' (top track, scrolls left) / 'right' (bottom).
// `group` distinguishes 'main' (universities students got into) from 'partner' / 'practice'.
//
// Format: [name, mediaKey, group, page, track, sort_order]
const data = [
  // ========== Logo carousel (index + natijalar) - LEFT track ==========
  ['Harvard',                          'uni-Harvard',                          'main', 'both', 'left', 1],
  ['NYU Abu Dhabi',                    'uni-New Abu Dabhi',                    'main', 'both', 'left', 2],
  ['University of Chicago',            'uni-University of Chicago',            'main', 'both', 'left', 3],
  ['University of Hong Kong',          'uni-University of Hong Kong',          'main', 'both', 'left', 4],
  ['Hong Kong Polytechnic University', 'uni-Hong Kong Polytechnic University', 'main', 'both', 'left', 5],
  ['Kyoto University',                 'uni-Kyoto University',                 'main', 'both', 'left', 6],
  ['Carnegie Mellon University',       'uni-Carnegie Mellon University',       'main', 'both', 'left', 7],
  ['Illinois Institute of Technology', 'uni-Illinois Institute of Technology', 'main', 'both', 'left', 8],

  // ========== Logo carousel - RIGHT track ==========
  ['University of Toronto',            'uni-University of Toronto',            'main',    'both', 'right', 1],
  ['University of Minnesota',          'uni-University of Minnesota',          'main',    'both', 'right', 2],
  ['Drexel University',                'uni-Drexel University',                'main',    'both', 'right', 3],
  ['Central Asian University',         'uni-Central Asian University',         'partner', 'both', 'right', 4],
  ['WIUT',                             'uni-WIUT',                             'partner', 'both', 'right', 5],
  ['Webster University',               'uni-Webster',                          'partner', 'both', 'right', 6],
  ['Amity University',                 'uni-Amity University',                 'partner', 'both', 'right', 7],
];

export async function seedUniversities(mediaMap = {}) {
  console.log('[seed] universities...');
  for (const [name, mediaKey, group, page, track, sort] of data) {
    const imageId = mediaMap[mediaKey] ?? null;
    const r = await query(
      `INSERT INTO universities (name, image_id, \`group\`, track, page, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [name, imageId, group, track, page, sort],
    );
    const id = r.insertId;
    // proper nouns — same in all locales
    await query(
      `INSERT INTO university_translations (university_id, locale, name) VALUES (?,?,?),(?,?,?),(?,?,?)`,
      [id, 'uz', name, id, 'ru', name, id, 'en', name],
    );
  }
}
