import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from '../pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const uploadsDir = path.join(projectRoot, 'uploads');
const seedTargetDir = path.join(uploadsDir, 'seed');

// Source folders to look in (best-effort copy if assets aren't already in seed/)
const sourceCandidates = [
  path.resolve(projectRoot, '..', 'sodiq-school', 'img'),
  path.resolve(projectRoot, '..', 'sodiq-school', 'images', 'blog'),
];

const teacherImages = [
  'ustoz-mansur.png', 'ustoz-azimjon.png', 'ustoz-shomirza.png',
  'ustoz-hafizulloh.png', 'ustoz-shokir.png', 'ustoz-rayxona.png',
];
const blogImages = [
  'ielts-exam.png', 'islom-grant.png', 'olympiad.png',
  'school-kids.png', 'stem-lab.png', 'students-group.png', 'trophy.png',
];

// Logos
const logos = [
  { name: 'Dark.png', subdir: 'Logo' },
  { name: 'Light.png', subdir: 'Logo' },
];

// Award images
const awardImgs = [
  { name: 'wsc.png', subdir: 'awards' },
  { name: 'asiarope.png', subdir: 'awards' },
  { name: 'karate.png', subdir: 'awards' },
];

// Exam logos
const examLogos = ['ielts-logo.png', 'sat-logo.png'];

// University logos
const universityImgs = [
  'Harvard.png', 'New Abu Dabhi.png', 'University of Chicago.png',
  'University of Hong Kong.png', 'Hong Kong Polytechnic University.png',
  'Kyoto University.png', 'Carnegie Mellon University.png',
  'Illinois Institute of Technology.png',
  'University of Toronto.png', 'University of Minnesota.png',
  'Drexel University.png', 'Central Asian University.png',
  'WIUT.png', 'Webster.png', 'Amity University.png',
];

// Carousel images
const carouselImgs = [
  'telegram-cloud-photo-size-2-5472380547129613300-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613301-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613302-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613303-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613304-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613305-y.jpg',
  'telegram-cloud-photo-size-2-5472380547129613306-y.jpg',
];

async function ensureDirs() {
  await fs.mkdir(seedTargetDir, { recursive: true });
  await fs.mkdir(path.join(seedTargetDir, 'Logo'), { recursive: true });
  await fs.mkdir(path.join(seedTargetDir, 'Carousel'), { recursive: true });
  await fs.mkdir(path.join(seedTargetDir, 'Universities'), { recursive: true });
  await fs.mkdir(path.join(seedTargetDir, 'awards'), { recursive: true });
}

async function copyIfExists(src, dst) {
  try { await fs.copyFile(src, dst); return true; } catch { return false; }
}

async function copyTeacherAndBlog() {
  for (const name of [...teacherImages, ...blogImages]) {
    const dst = path.join(seedTargetDir, name);
    let exists = false;
    try { await fs.stat(dst); exists = true; } catch {}
    if (exists) continue;
    for (const dir of sourceCandidates) {
      if (await copyIfExists(path.join(dir, name), dst)) break;
    }
  }
}

async function insertMedia(filename, urlPath, mime = 'image/png') {
  const r = await query(
    `INSERT INTO media (filename, url, mime_type) VALUES (?, ?, ?)`,
    [filename, urlPath, mime],
  );
  return r.insertId;
}

export async function seedMedia() {
  console.log('[seed] media...');
  await ensureDirs();
  await copyTeacherAndBlog();

  const map = {};

  // Teachers + blog (root of seed/)
  for (const name of [...teacherImages, ...blogImages]) {
    const key = name.replace(/\.[^.]+$/, '');
    map[key] = await insertMedia(name, `/uploads/seed/${name}`);
  }

  // Logos
  for (const { name, subdir } of logos) {
    const key = `logo-${name.replace(/\.[^.]+$/, '').toLowerCase()}`;
    map[key] = await insertMedia(name, `/uploads/seed/${subdir}/${name}`);
  }

  // Award images
  for (const { name, subdir } of awardImgs) {
    const key = `award-${name.replace(/\.[^.]+$/, '')}`;
    map[key] = await insertMedia(name, `/uploads/seed/${subdir}/${name}`);
  }

  // Exam logos (root of seed/)
  for (const name of examLogos) {
    const key = name.replace(/\.[^.]+$/, '');
    map[key] = await insertMedia(name, `/uploads/seed/${name}`);
  }

  // University logos
  for (const name of universityImgs) {
    const key = `uni-${name.replace(/\.[^.]+$/, '')}`;
    map[key] = await insertMedia(name, `/uploads/seed/Universities/${encodeURI(name)}`);
  }

  // Carousel images
  for (const name of carouselImgs) {
    const key = `carousel-${name.replace(/\.[^.]+$/, '')}`;
    map[key] = await insertMedia(name, `/uploads/seed/Carousel/${name}`, 'image/jpeg');
  }

  return map;
}
