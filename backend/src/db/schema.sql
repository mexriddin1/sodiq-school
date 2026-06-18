-- ============================================================
-- Sodiq School database schema
-- MySQL 8.0+ recommended (utf8mb4)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS webhook_deliveries;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS application_submissions;
DROP TABLE IF EXISTS exam_course_section_translations;
DROP TABLE IF EXISTS exam_course_sections;
DROP TABLE IF EXISTS carousel_images;
DROP TABLE IF EXISTS faq_translations;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS gallery_translations;
DROP TABLE IF EXISTS gallery_items;
DROP TABLE IF EXISTS about_stat_translations;
DROP TABLE IF EXISTS about_stats;
DROP TABLE IF EXISTS advantage_translations;
DROP TABLE IF EXISTS advantages;
DROP TABLE IF EXISTS pricing_plan_translations;
DROP TABLE IF EXISTS pricing_plans;
DROP TABLE IF EXISTS lesson_extra_translations;
DROP TABLE IF EXISTS lesson_extras;
DROP TABLE IF EXISTS lesson_subject_translations;
DROP TABLE IF EXISTS lesson_subjects;
DROP TABLE IF EXISTS exam_course_translations;
DROP TABLE IF EXISTS exam_courses;
DROP TABLE IF EXISTS blog_post_translations;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS university_translations;
DROP TABLE IF EXISTS universities;
DROP TABLE IF EXISTS award_translations;
DROP TABLE IF EXISTS awards;
DROP TABLE IF EXISTS exam_result_translations;
DROP TABLE IF EXISTS exam_results;
DROP TABLE IF EXISTS alumni_translations;
DROP TABLE IF EXISTS alumni;
DROP TABLE IF EXISTS top_student_translations;
DROP TABLE IF EXISTS top_students;
DROP TABLE IF EXISTS testimonial_videos;
DROP TABLE IF EXISTS teacher_meta_translations;
DROP TABLE IF EXISTS teacher_meta;
DROP TABLE IF EXISTS teacher_bio_translations;
DROP TABLE IF EXISTS teacher_bios;
DROP TABLE IF EXISTS teacher_translations;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- USERS (admin panel users)
-- ============================================================
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('superadmin','admin','editor') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MEDIA (uploaded files)
-- ============================================================
CREATE TABLE media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100),
  size_bytes INT UNSIGNED,
  alt_text VARCHAR(255),
  uploaded_by INT UNSIGNED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SETTINGS (site-wide key/value, multilingual)
-- value_uz / value_ru / value_en are translatable strings.
-- value_raw is a non-translatable raw value (e.g. phone, url, color)
-- ============================================================
CREATE TABLE settings (
  `key` VARCHAR(120) NOT NULL PRIMARY KEY,
  value_uz TEXT,
  value_ru TEXT,
  value_en TEXT,
  value_raw TEXT,
  `group` VARCHAR(60) DEFAULT 'general',
  description VARCHAR(255),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TEACHERS
-- ============================================================
CREATE TABLE teachers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image_id INT UNSIGNED,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE teacher_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio MEDIUMTEXT,
  meta_json JSON,
  UNIQUE KEY uniq_teacher_locale (teacher_id, locale),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TESTIMONIAL VIDEOS (parent reviews on home/about)
-- ============================================================
CREATE TABLE testimonial_videos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  thumbnail_id INT UNSIGNED,
  name VARCHAR(120) NOT NULL DEFAULT '',
  role VARCHAR(180) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thumbnail_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TOP STUDENTS (cards on index page: Harvard, NYU, etc.)
-- ============================================================
CREATE TABLE top_students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id INT UNSIGNED,
  grant_label VARCHAR(50),
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE top_student_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  top_student_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  university VARCHAR(150) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  UNIQUE KEY uniq_ts_locale (top_student_id, locale),
  FOREIGN KEY (top_student_id) REFERENCES top_students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ALUMNI (graduate cards on natijalar page)
-- ============================================================
CREATE TABLE alumni (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id INT UNSIGNED,
  ielts_label VARCHAR(20),
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE alumni_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alumni_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  university VARCHAR(150) NOT NULL,
  major VARCHAR(150),
  UNIQUE KEY uniq_alumni_locale (alumni_id, locale),
  FOREIGN KEY (alumni_id) REFERENCES alumni(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EXAM RESULTS (IELTS/SAT score cards)
-- ============================================================
CREATE TABLE exam_results (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_type ENUM('ielts','sat') NOT NULL,
  score VARCHAR(10) NOT NULL,
  image_id INT UNSIGNED,
  year INT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_result_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_result_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  grade VARCHAR(80),
  UNIQUE KEY uniq_er_locale (exam_result_id, locale),
  FOREIGN KEY (exam_result_id) REFERENCES exam_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- AWARDS (medal sections)
-- ============================================================
CREATE TABLE awards (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon_key VARCHAR(50) DEFAULT 'trophy',
  image_id INT UNSIGNED,
  video_url VARCHAR(500),
  gold_count INT DEFAULT 0,
  silver_count INT DEFAULT 0,
  bronze_count INT DEFAULT 0,
  total_label_value VARCHAR(50),
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE award_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  award_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  gold_label VARCHAR(50),
  silver_label VARCHAR(50),
  bronze_label VARCHAR(50),
  total_label VARCHAR(120),
  UNIQUE KEY uniq_award_locale (award_id, locale),
  FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- UNIVERSITIES (pills)
-- group: 'main' (universities they got into) | 'partner' | 'practice'
-- ============================================================
CREATE TABLE universities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  image_id INT UNSIGNED,
  `group` ENUM('main','partner','practice') NOT NULL DEFAULT 'main',
  track ENUM('left','right') NOT NULL DEFAULT 'left',
  page ENUM('index','natijalar','both') NOT NULL DEFAULT 'both',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE university_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  university_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  name VARCHAR(150) NOT NULL,
  UNIQUE KEY uniq_uni_locale (university_id, locale),
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  image_id INT UNSIGNED,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  published_at DATETIME,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE blog_post_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  blog_post_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  badge VARCHAR(50),
  date_label VARCHAR(80),
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content MEDIUMTEXT,
  UNIQUE KEY uniq_post_locale (blog_post_id, locale),
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EXAM COURSES (IELTS/SAT cards on mashgulotlar)
-- ============================================================
CREATE TABLE exam_courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  badge VARCHAR(20) NOT NULL,
  theme VARCHAR(20) DEFAULT 'ielts',
  score_value VARCHAR(20),
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_course_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_course_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  score_label VARCHAR(80),
  body TEXT,
  facts_json JSON,
  note TEXT,
  cta_label VARCHAR(80),
  UNIQUE KEY uniq_course_locale (exam_course_id, locale),
  FOREIGN KEY (exam_course_id) REFERENCES exam_courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- LESSON SUBJECTS (Akademik / Tarbiya groups, with tags)
-- ============================================================
CREATE TABLE lesson_subjects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_key VARCHAR(40) NOT NULL DEFAULT 'academic',
  icon_key VARCHAR(40) DEFAULT 'academic',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lesson_subject_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lesson_subject_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(150) NOT NULL,
  tags_json JSON,
  UNIQUE KEY uniq_ls_locale (lesson_subject_id, locale),
  FOREIGN KEY (lesson_subject_id) REFERENCES lesson_subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- LESSON EXTRAS (Zakovat, Mutolaa, etc.)
-- ============================================================
-- ============================================================
-- ABOUT STATS — stat cards on home/about pages
-- ============================================================
CREATE TABLE about_stats (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prefix VARCHAR(10) DEFAULT '',
  value VARCHAR(20) NOT NULL,
  suffix VARCHAR(10) DEFAULT '',
  page VARCHAR(20) DEFAULT 'both',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE about_stat_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  about_stat_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  label VARCHAR(150) NOT NULL,
  sub TEXT,
  UNIQUE KEY uniq_as_locale (about_stat_id, locale),
  FOREIGN KEY (about_stat_id) REFERENCES about_stats(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ADVANTAGES — 5 (or more) feature cards on the home page
-- ============================================================
CREATE TABLE advantages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon_key VARCHAR(40) DEFAULT 'graduation',
  accent_num TINYINT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE advantage_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  advantage_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  UNIQUE KEY uniq_adv_locale (advantage_id, locale),
  FOREIGN KEY (advantage_id) REFERENCES advantages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRICING PLANS — multiple tariff cards admin can add
-- ============================================================
CREATE TABLE pricing_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  amount VARCHAR(40) NOT NULL,
  currency VARCHAR(20) NOT NULL DEFAULT 'so''m',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pricing_plan_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pricing_plan_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  label VARCHAR(150),
  note VARCHAR(255),
  includes TEXT,
  cta_label VARCHAR(80),
  UNIQUE KEY uniq_pp_locale (pricing_plan_id, locale),
  FOREIGN KEY (pricing_plan_id) REFERENCES pricing_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lesson_extras (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id INT UNSIGNED,
  link_url VARCHAR(500),
  icon_key VARCHAR(40) DEFAULT 'sparkles',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lesson_extra_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lesson_extra_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  link_label VARCHAR(80),
  UNIQUE KEY uniq_le_locale (lesson_extra_id, locale),
  FOREIGN KEY (lesson_extra_id) REFERENCES lesson_extras(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- GALLERY (about-page tiles)
-- ============================================================
CREATE TABLE gallery_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id INT UNSIGNED,
  size_class VARCHAR(20) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gallery_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  gallery_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  caption VARCHAR(200) NOT NULL,
  UNIQUE KEY uniq_gallery_locale (gallery_id, locale),
  FOREIGN KEY (gallery_id) REFERENCES gallery_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FAQ
-- page can be 'index' | 'aloqa' | 'both'
-- ============================================================
CREATE TABLE faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page ENUM('index','aloqa','both') NOT NULL DEFAULT 'both',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faq_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  faq_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  UNIQUE KEY uniq_faq_locale (faq_id, locale),
  FOREIGN KEY (faq_id) REFERENCES faqs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- APPLICATIONS (form submissions from public site)
-- ============================================================
CREATE TABLE application_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source_form VARCHAR(60) DEFAULT 'contact',
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  message TEXT,
  age VARCHAR(40),
  grade VARCHAR(20),
  region VARCHAR(120),
  status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WEBHOOKS (forward lead/form submissions to external URLs)
-- selected_fields_json: JSON array of field names from the lead payload
-- payload_template: optional JSON template with {{field}} placeholders.
--   If null/empty, selected fields are sent as a flat JSON object.
-- custom_headers_json: extra HTTP headers (object)
-- secret: when set, HMAC-SHA256 of body is sent as X-Webhook-Signature
-- ============================================================
CREATE TABLE webhooks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  method ENUM('POST','PUT','PATCH') NOT NULL DEFAULT 'POST',
  secret VARCHAR(255),
  event_types_json JSON,
  selected_fields_json JSON,
  custom_headers_json JSON,
  payload_template MEDIUMTEXT,
  include_metadata TINYINT(1) NOT NULL DEFAULT 1,
  retry_count TINYINT UNSIGNED NOT NULL DEFAULT 3,
  timeout_ms INT UNSIGNED NOT NULL DEFAULT 10000,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  archived_at DATETIME NULL,
  last_success_at DATETIME NULL,
  last_error_at DATETIME NULL,
  last_error TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_webhooks_active (is_active, is_archived)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE webhook_deliveries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  webhook_id INT UNSIGNED NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  target_url VARCHAR(1000) NOT NULL,
  request_body MEDIUMTEXT,
  response_status INT,
  response_body MEDIUMTEXT,
  error TEXT,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 1,
  duration_ms INT UNSIGNED,
  success TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_wd_webhook (webhook_id, created_at),
  FOREIGN KEY (webhook_id) REFERENCES webhooks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CAROUSEL IMAGES (image marquee shown on home page after Awards)
-- ============================================================
CREATE TABLE carousel_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id INT UNSIGNED,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EXAM COURSE SECTIONS (long-form sections on /mashgulot-ielts and /mashgulot-sat)
-- Each exam course (IELTS/SAT) has multiple md-section blocks (image + text + bullets)
-- ============================================================
CREATE TABLE exam_course_sections (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_course_id INT UNSIGNED NOT NULL,
  image_id INT UNSIGNED,
  is_reverse TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (exam_course_id) REFERENCES exam_courses(id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE exam_course_section_translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_course_section_id INT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255),
  body MEDIUMTEXT,
  UNIQUE KEY uniq_ecs_locale (exam_course_section_id, locale),
  FOREIGN KEY (exam_course_section_id) REFERENCES exam_course_sections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
