import bcrypt from 'bcryptjs';
import { pool, query, tx } from './pool.js';
import { env } from '../config/env.js';
import { seedSettings } from './seed-data/settings.js';
import { seedTeachers } from './seed-data/teachers.js';
import { seedTopStudents } from './seed-data/top-students.js';
import { seedAlumni } from './seed-data/alumni.js';
import { seedExamResults } from './seed-data/exam-results.js';
import { seedAwards } from './seed-data/awards.js';
import { seedUniversities } from './seed-data/universities.js';
import { seedBlogPosts } from './seed-data/blog-posts.js';
import { seedExamCourses } from './seed-data/exam-courses.js';
import { seedLessonSubjects } from './seed-data/lesson-subjects.js';
import { seedLessonExtras } from './seed-data/lesson-extras.js';
import { seedGallery } from './seed-data/gallery.js';
import { seedFaqs } from './seed-data/faqs.js';
import { seedTestimonialVideos } from './seed-data/testimonial-videos.js';
import { seedMedia } from './seed-data/media.js';
import { seedCarousel } from './seed-data/carousel.js';
import { seedExamCourseSections } from './seed-data/exam-course-sections.js';
import { seedPricingPlans } from './seed-data/pricing-plans.js';
import { seedAdvantages } from './seed-data/advantages.js';
import { seedAboutStats } from './seed-data/about-stats.js';

async function clearTables() {
  console.log('[seed] clearing data...');
  const tables = [
    'application_submissions',
    'exam_course_section_translations', 'exam_course_sections',
    'pricing_plan_translations', 'pricing_plans',
    'advantage_translations', 'advantages',
    'about_stat_translations', 'about_stats',
    'carousel_images',
    'faq_translations', 'faqs',
    'gallery_translations', 'gallery_items',
    'lesson_extra_translations', 'lesson_extras',
    'lesson_subject_translations', 'lesson_subjects',
    'exam_course_translations', 'exam_courses',
    'blog_post_translations', 'blog_posts',
    'university_translations', 'universities',
    'award_translations', 'awards',
    'exam_result_translations', 'exam_results',
    'alumni_translations', 'alumni',
    'top_student_translations', 'top_students',
    'testimonial_videos',
    'teacher_translations', 'teachers',
    'settings',
    'media',
    'users',
  ];
  await query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    await query(`TRUNCATE TABLE \`${t}\``);
  }
  await query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seedAdmin() {
  console.log('[seed] creating default admin...');
  const hash = await bcrypt.hash(env.seed.adminPassword, 10);
  await query(
    `INSERT INTO users (email, password_hash, name, role, is_active)
     VALUES (?, ?, ?, 'superadmin', 1)`,
    [env.seed.adminEmail, hash, env.seed.adminName],
  );
  console.log(`[seed]   admin: ${env.seed.adminEmail} / ${env.seed.adminPassword}`);
}

async function run() {
  console.log('[seed] starting...');
  await clearTables();
  await seedAdmin();
  const mediaMap = await seedMedia();
  await seedSettings();
  await seedTeachers(mediaMap);
  await seedTestimonialVideos(mediaMap);
  await seedTopStudents(mediaMap);
  await seedAlumni(mediaMap);
  await seedExamResults(mediaMap);
  await seedAwards(mediaMap);
  await seedUniversities(mediaMap);
  await seedBlogPosts(mediaMap);
  await seedExamCourses();
  await seedExamCourseSections(mediaMap);
  await seedLessonSubjects();
  await seedLessonExtras();
  await seedGallery();
  await seedFaqs();
  await seedCarousel(mediaMap);
  await seedPricingPlans();
  await seedAdvantages();
  await seedAboutStats();
  console.log('[seed] done');
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
