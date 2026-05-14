import { query } from '../pool.js';

// New version: each card shows BOTH IELTS and SAT scores in one line.
// We seed these as IELTS-tab entries (the new design only really uses one grid
// and stores combined scores in the `grade` field).
const ielts = [
  { img: 'ustoz-azimjon',    score: '8.5', name: 'Manzura Karlibayeva',   grade: 'IELTS: 8.5; SAT: 1380' },
  { img: 'ustoz-rayxona',    score: '8.0', name: 'Xotamov Saidvalixon',   grade: 'IELTS: 8.0; SAT: 1210' },
  { img: 'ustoz-shomirza',   score: '8.0', name: 'Otabekova Madina',      grade: 'IELTS: 8.0' },
  { img: 'ustoz-shokir',     score: '7.5', name: 'Aslamov Murod',         grade: 'IELTS: 7.5; SAT: 1540' },
  { img: 'ustoz-hafizulloh', score: '7.5', name: 'Mavlonov Abbos',        grade: 'IELTS: 7.5; SAT: 1540' },
  { img: 'ustoz-mansur',     score: '7.5', name: 'Irgashev Mustafo',      grade: 'IELTS: 7.5; SAT: 1520' },
  { img: 'ustoz-shomirza',   score: '7.5', name: 'Rauf Lutfulloh',        grade: 'IELTS: 7.5; SAT: 1480' },
  { img: 'ustoz-shokir',     score: '7.5', name: 'Elamonov Imran',        grade: 'IELTS: 7.5; SAT: 1400' },
];

const sat = [
  { img: 'ustoz-shomirza',   score: '1540', name: 'Aslamov Murod',        grade: 'SAT: 1540; IELTS: 7.5' },
  { img: 'ustoz-hafizulloh', score: '1540', name: 'Mavlonov Abbos',       grade: 'SAT: 1540; IELTS: 7.5' },
  { img: 'ustoz-mansur',     score: '1520', name: 'Irgashev Mustafo',     grade: 'SAT: 1520; IELTS: 7.5' },
  { img: 'ustoz-shokir',     score: '1480', name: 'Rauf Lutfulloh',       grade: 'SAT: 1480; IELTS: 7.5' },
  { img: 'ustoz-shokir',     score: '1400', name: 'Elamonov Imran',       grade: 'SAT: 1400; IELTS: 7.5' },
  { img: 'ustoz-azimjon',    score: '1380', name: 'Manzura Karlibayeva',  grade: 'SAT: 1380; IELTS: 8.5' },
  { img: 'ustoz-rayxona',    score: '1210', name: 'Xotamov Saidvalixon',  grade: 'SAT: 1210; IELTS: 8.0' },
];

async function insertList(type, list, mediaMap) {
  let sort = 1;
  for (const it of list) {
    const r = await query(
      `INSERT INTO exam_results (exam_type, score, image_id, year, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)`,
      [type, it.score, mediaMap[it.img] ?? null, 2025, sort++],
    );
    const id = r.insertId;
    await query(
      `INSERT INTO exam_result_translations (exam_result_id, locale, name, grade) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?)`,
      [id, 'uz', it.name, it.grade, id, 'ru', it.name, it.grade, id, 'en', it.name, it.grade],
    );
  }
}

export async function seedExamResults(mediaMap) {
  console.log('[seed] exam results...');
  await insertList('ielts', ielts, mediaMap);
  await insertList('sat', sat, mediaMap);
}
