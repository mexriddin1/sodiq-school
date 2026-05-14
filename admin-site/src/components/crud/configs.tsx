import type { EntityConfig } from './types';

export const teachersConfig: EntityConfig = {
  endpoint: '/api/teachers',
  basePath: '/teachers',
  title: 'Ustozlar',
  singular: 'Ustoz',
  hasImage: true,
  parentFields: [
    { name: 'slug', label: "Slug (URL identifikator)", type: 'text', required: true, help: "Lotin harflari, masalan: 'mansur'" },
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox', help: 'Saytda ko\'rinadi' },
  ],
  translationFields: [
    { name: 'name', label: 'Ism familiya', type: 'text', required: true },
    { name: 'role', label: 'Lavozim', type: 'text', required: true },
    { name: 'bio', label: 'Tarjimai hol (HTML)', type: 'richtext', help: '<p>, <strong> teglari ishlatilishi mumkin' },
    { name: 'meta_json', label: 'Qo\'shimcha ma\'lumotlar (Label/Value qatorlar)', type: 'facts' },
  ],
  listColumns: [
    { key: 'name', label: 'Ism' },
    { key: 'role', label: 'Lavozim' },
    { key: 'slug', label: 'Slug', render: (r) => <span className="id-cell">{r.slug}</span> },
  ],
};

export const topStudentsConfig: EntityConfig = {
  endpoint: '/api/top-students',
  basePath: '/top-students',
  title: "TOP o'quvchilar (asosiy sahifa)",
  singular: "TOP o'quvchi",
  hasImage: true,
  parentFields: [
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'grant_label', label: 'Grant yorlig\'i', type: 'text', help: "masalan: $394,000 yoki '100% grant'" },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'university', label: 'Universitet', type: 'text', required: true },
    { name: 'name', label: 'Ism', type: 'text', required: true },
    { name: 'description', label: 'Izoh', type: 'textarea' },
  ],
  listColumns: [
    { key: 'name', label: 'Ism' },
    { key: 'university', label: 'Universitet' },
    { key: 'grant_label', label: 'Grant' },
  ],
};

export const alumniConfig: EntityConfig = {
  endpoint: '/api/alumni',
  basePath: '/alumni',
  title: 'Bitiruvchilar',
  singular: 'Bitiruvchi',
  hasImage: true,
  parentFields: [
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'ielts_label', label: 'IELTS belgisi', type: 'text', help: "masalan: 'IELTS 8.5'" },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'name', label: 'Ism', type: 'text', required: true },
    { name: 'university', label: 'Universitet', type: 'text', required: true },
    { name: 'major', label: 'Yo\'nalish', type: 'text' },
  ],
  listColumns: [
    { key: 'name', label: 'Ism' },
    { key: 'university', label: 'Universitet' },
    { key: 'ielts_label', label: 'IELTS' },
  ],
};

export const examResultsConfig: EntityConfig = {
  endpoint: '/api/exam-results',
  basePath: '/exam-results',
  title: 'IELTS / SAT natijalar',
  singular: 'Natija',
  hasImage: true,
  parentFields: [
    { name: 'exam_type', label: 'Imtihon turi', type: 'select', required: true, options: [
      { value: 'ielts', label: 'IELTS' },
      { value: 'sat',   label: 'SAT' },
    ] },
    { name: 'score', label: 'Ball', type: 'text', required: true },
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'year', label: 'Yil', type: 'number' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'name', label: 'Ism', type: 'text', required: true },
    { name: 'grade', label: 'Sinf yorlig\'i', type: 'text', help: "masalan: '11-sinf · 2025'" },
  ],
  listColumns: [
    { key: 'exam_type', label: 'Tur', render: (r) => <strong>{r.exam_type?.toUpperCase()}</strong> },
    { key: 'name', label: 'Ism' },
    { key: 'score', label: 'Ball' },
    { key: 'year', label: 'Yil' },
  ],
};

export const awardsConfig: EntityConfig = {
  endpoint: '/api/awards',
  basePath: '/awards',
  title: 'Sovrinlar',
  singular: 'Sovrin',
  parentFields: [
    { name: 'icon_key', label: 'Ikon kaliti', type: 'select', options: [
      { value: 'wsc', label: "World Scholar's Cup" },
      { value: 'star', label: 'Yulduz (olimpiada)' },
      { value: 'karate', label: 'Karate' },
    ]},
    { name: 'gold_count', label: 'Oltin soni', type: 'number' },
    { name: 'silver_count', label: 'Kumush soni', type: 'number' },
    { name: 'bronze_count', label: 'Bronza soni', type: 'number' },
    { name: 'total_label_value', label: 'Jami qiymat (matn)', type: 'text' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'title', label: 'Sarlavha', type: 'text', required: true },
    { name: 'description', label: 'Izoh', type: 'textarea' },
    { name: 'gold_label', label: 'Oltin yorlig\'i', type: 'text' },
    { name: 'silver_label', label: 'Kumush yorlig\'i', type: 'text' },
    { name: 'bronze_label', label: 'Bronza yorlig\'i', type: 'text' },
    { name: 'total_label', label: 'Jami yorliq (HTML)', type: 'textarea' },
  ],
  listColumns: [
    { key: 'title', label: 'Sarlavha' },
    { key: 'icon_key', label: 'Ikon' },
    { key: 'total_label_value', label: 'Jami' },
  ],
};

export const universitiesConfig: EntityConfig = {
  endpoint: '/api/universities',
  basePath: '/universities',
  title: 'Universitetlar',
  singular: 'Universitet',
  parentFields: [
    { name: 'name', label: 'Asosiy nom', type: 'text', required: true },
    { name: 'group', label: 'Guruh', type: 'select', required: true, options: [
      { value: 'main', label: 'Asosiy (kirgan)' },
      { value: 'partner', label: 'Hamkor' },
      { value: 'practice', label: 'Amaliyot hamkori' },
    ]},
    { name: 'page', label: 'Qaysi sahifada', type: 'select', options: [
      { value: 'index', label: 'Bosh sahifa' },
      { value: 'natijalar', label: 'Natijalar' },
      { value: 'both', label: 'Ikkalasida' },
    ]},
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'name', label: 'Nom (mahalliy)', type: 'text', required: true },
  ],
  listColumns: [
    { key: 'name', label: 'Nomi' },
    { key: 'group', label: 'Guruh' },
    { key: 'page', label: 'Sahifa' },
  ],
};

export const blogConfig: EntityConfig = {
  endpoint: '/api/blog',
  basePath: '/blog',
  title: 'Blog maqolalari',
  singular: 'Maqola',
  hasImage: true,
  parentFields: [
    { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
  ],
  translationFields: [
    { name: 'badge', label: 'Belgicha (Badge)', type: 'text' },
    { name: 'date_label', label: 'Sana matni', type: 'text', help: "masalan: '12 Aprel, 2026'" },
    { name: 'title', label: 'Sarlavha', type: 'text', required: true },
    { name: 'excerpt', label: 'Qisqa tavsif', type: 'textarea' },
    { name: 'content', label: 'Kontent (HTML)', type: 'richtext', rows: 14 },
  ],
  listColumns: [
    { key: 'title', label: 'Sarlavha' },
    { key: 'badge', label: 'Belgi' },
    { key: 'slug', label: 'Slug', render: (r) => <span className="id-cell">{r.slug}</span> },
  ],
};

export const examCoursesConfig: EntityConfig = {
  endpoint: '/api/exam-courses',
  basePath: '/exam-courses',
  title: 'IELTS / SAT kurslari',
  singular: 'Kurs',
  parentFields: [
    { name: 'badge', label: 'Belgicha', type: 'text', help: "masalan: IELTS yoki SAT" },
    { name: 'theme', label: 'Tema', type: 'select', options: [
      { value: 'ielts', label: 'IELTS (orange)' },
      { value: 'sat', label: 'SAT (navy)' },
    ]},
    { name: 'score_value', label: 'Ball', type: 'text' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'score_label', label: 'Ball yorlig\'i', type: 'text' },
    { name: 'body', label: 'Asosiy matn (HTML)', type: 'richtext' },
    { name: 'facts_json', label: 'Faktlar (label/value)', type: 'facts' },
    { name: 'note', label: 'Izoh', type: 'textarea' },
    { name: 'cta_label', label: 'CTA tugma matni', type: 'text' },
  ],
  listColumns: [
    { key: 'badge', label: 'Badge' },
    { key: 'score_value', label: 'Ball' },
    { key: 'theme', label: 'Tema' },
  ],
};

export const lessonSubjectsConfig: EntityConfig = {
  endpoint: '/api/lesson-subjects',
  basePath: '/lesson-subjects',
  title: "O'quv fanlari",
  singular: 'Fan guruhi',
  parentFields: [
    { name: 'group_key', label: 'Guruh kaliti', type: 'text', help: "masalan: academic yoki tarbiya" },
    { name: 'icon_key', label: 'Ikon kaliti', type: 'select', options: [
      { value: 'academic', label: 'Akademik' },
      { value: 'tarbiya', label: 'Tarbiya' },
    ]},
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'title', label: 'Sarlavha', type: 'text', required: true },
    { name: 'tags_json', label: 'Tag\'lar (vergul bilan)', type: 'tags' },
  ],
  listColumns: [
    { key: 'title', label: 'Sarlavha' },
    { key: 'group_key', label: 'Guruh' },
  ],
};

export const lessonExtrasConfig: EntityConfig = {
  endpoint: '/api/lesson-extras',
  basePath: '/lesson-extras',
  title: "Qo'shimcha faoliyatlar",
  singular: 'Faoliyat',
  hasImage: true,
  parentFields: [
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'link_url', label: 'Havola (URL)', type: 'text' },
    { name: 'icon_key', label: 'Ikon kaliti (rasm yo\'q bo\'lsa)', type: 'select', options: [
      { value: 'sparkles', label: 'Sparkles' },
      { value: 'book', label: 'Book' },
    ]},
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'title', label: 'Sarlavha', type: 'text', required: true },
    { name: 'description', label: 'Izoh (HTML)', type: 'textarea' },
    { name: 'link_label', label: 'Havola matni', type: 'text' },
  ],
  listColumns: [
    { key: 'title', label: 'Sarlavha' },
    { key: 'icon_key', label: 'Ikon' },
  ],
};

const baseStatsParentFields = [
  { name: 'prefix', label: 'Old qo\'shimcha (masalan: $)', type: 'text' as const },
  { name: 'value', label: 'Qiymat (raqam yoki "8–25")', type: 'text' as const, required: true,
    help: 'Faqat raqam bo\'lsa (450, 20, 239) animatsiya qiladi. "8–25" kabi qiymat oddiy ko\'rinadi.' },
  { name: 'suffix', label: 'Ortidagi qo\'shimcha (masalan: +, M+, K)', type: 'text' as const },
  { name: 'sort_order', label: 'Tartib', type: 'number' as const },
  { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' as const },
];
const baseStatsTranslationFields = [
  { name: 'label', label: 'Yorliq', type: 'text' as const, required: true },
  { name: 'sub', label: 'Kichik tushuntirish (ixtiyoriy)', type: 'textarea' as const },
];
const baseStatsListColumns = [
  { key: 'label', label: 'Yorliq' },
  { key: 'value', label: 'Qiymat' },
];

export const statsHomeAboutConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-home',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'home_about' },
  defaults: { page: 'home_about' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const statsAboutPageConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-about',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'about_about' },
  defaults: { page: 'about_about' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const statsResultsConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-results',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'results' },
  defaults: { page: 'results' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const statsMashGrantConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-grant',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'mash_grant' },
  defaults: { page: 'mash_grant' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const statsMashIeltsConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-ielts',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'mash_ielts' },
  defaults: { page: 'mash_ielts' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const statsMashSatConfig: EntityConfig = {
  endpoint: '/api/about-stats',
  basePath: '/stats-sat',
  title: 'Statistika kartalari',
  singular: 'Statistika',
  listFilter: { field: 'page', value: 'mash_sat' },
  defaults: { page: 'mash_sat' },
  parentFields: baseStatsParentFields,
  translationFields: baseStatsTranslationFields,
  listColumns: baseStatsListColumns,
};

export const advantagesConfig: EntityConfig = {
  endpoint: '/api/advantages',
  basePath: '/advantages',
  title: 'Sodiq School afzalliklari',
  singular: 'Afzallik',
  parentFields: [
    { name: 'icon_key', label: 'Ikon', type: 'select', options: [
      { value: 'graduation', label: 'Graduation (talaba shapkasi)' },
      { value: 'bars', label: 'Bars (statistika)' },
      { value: 'people', label: 'People (odamlar)' },
      { value: 'document', label: 'Document (hujjat)' },
      { value: 'building', label: 'Building (bino)' },
    ]},
    { name: 'accent_num', label: 'Aksent raqami (1–5)', type: 'number', help: 'Faqat ichki tartib uchun, hozir hammasi orange.' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'title', label: 'Sarlavha', type: 'text', required: true },
    { name: 'description', label: 'Matn (HTML, <strong> ishlatish mumkin)', type: 'textarea' },
  ],
  listColumns: [
    { key: 'title', label: 'Sarlavha' },
    { key: 'icon_key', label: 'Ikon' },
  ],
};

export const pricingPlansConfig: EntityConfig = {
  endpoint: '/api/pricing-plans',
  basePath: '/pricing-plans',
  title: "Oylik to'lov tariflari",
  singular: 'Tarif',
  parentFields: [
    { name: 'amount', label: "Narx (raqamlar, masalan: 6 600 000)", type: 'text', required: true },
    { name: 'currency', label: 'Valyuta', type: 'text' },
    { name: 'is_featured', label: 'Asosiy tarif (orange aksent bilan)', type: 'checkbox' },
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'label', label: 'Yorliq (masalan: 7–11-sinflar uchun:)', type: 'text', required: true },
    { name: 'note', label: 'Izoh (masalan: *Chegirmalar ham mavjud)', type: 'text' },
    { name: 'includes', label: "Tarkibi ( | bilan ajratilgan ro'yxat)", type: 'textarea',
      help: "Har bir punktni '|' belgisi bilan ajrating. Masalan: Akademik fanlar|IELTS|Tarbiya" },
    { name: 'cta_label', label: 'Tugma matni (masalan: Ariza topshirish →)', type: 'text' },
  ],
  listColumns: [
    { key: 'label', label: 'Yorliq' },
    { key: 'amount', label: 'Narx' },
  ],
};

export const galleryConfig: EntityConfig = {
  endpoint: '/api/gallery',
  basePath: '/gallery',
  title: 'Galereya',
  singular: 'Tasvir',
  hasImage: true,
  parentFields: [
    { name: 'image_id', label: 'Rasm', type: 'image' },
    { name: 'size_class', label: 'O\'lcham klassi', type: 'select', options: [
      { value: '', label: 'Standard' },
      { value: 'tall', label: 'Tall (uzun)' },
      { value: 'wide', label: 'Wide (keng)' },
    ]},
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'caption', label: 'Sarlavha', type: 'text', required: true },
  ],
  listColumns: [
    { key: 'caption', label: 'Sarlavha' },
    { key: 'size_class', label: 'O\'lcham' },
  ],
};

export const faqsConfig: EntityConfig = {
  endpoint: '/api/faqs',
  basePath: '/faqs',
  title: 'FAQ',
  singular: 'Savol',
  parentFields: [
    { name: 'page', label: 'Qaysi sahifada', type: 'select', options: [
      { value: 'index', label: 'Bosh sahifa' },
      { value: 'aloqa', label: 'Aloqa' },
      { value: 'both', label: 'Ikkalasida' },
    ]},
    { name: 'sort_order', label: 'Tartib', type: 'number' },
    { name: 'is_published', label: 'Chop etilgan', type: 'checkbox' },
  ],
  translationFields: [
    { name: 'question', label: 'Savol', type: 'text', required: true },
    { name: 'answer', label: 'Javob (HTML)', type: 'richtext' },
  ],
  listColumns: [
    { key: 'question', label: 'Savol' },
    { key: 'page', label: 'Sahifa' },
  ],
};
