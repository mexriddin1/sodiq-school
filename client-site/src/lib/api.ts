import type { Locale } from '@/i18n/config';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// On the server (SSR/build), we can hit the backend directly via loopback to
// avoid going through public DNS/firewall. Browser code still uses API_BASE.
const SERVER_API_BASE =
  typeof window === 'undefined' && process.env.INTERNAL_API_BASE_URL
    ? process.env.INTERNAL_API_BASE_URL
    : API_BASE;

// Resolves an /uploads/... URL returned by backend to a fully qualified URL.
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

async function apiFetch<T>(path: string, init?: RequestInit & { revalidate?: number }): Promise<T> {
  const base = SERVER_API_BASE;
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    next: init?.revalidate !== undefined ? { revalidate: init.revalidate } : { revalidate: 60 },
  });
  if (!res.ok) {
    let detail: any = '';
    try { detail = await res.json(); } catch {}
    throw new Error(`API ${res.status} ${path}: ${JSON.stringify(detail)}`);
  }
  return res.json();
}

export type SiteBundle = {
  locale: Locale;
  settings: Record<string, string>;
  teachers: Array<{
    id: number; slug: string; image_id: number | null; sort_order: number;
    image_url: string | null; name: string; role: string; bio: string;
    meta: Array<{ label: string; value: string }>;
  }>;
  testimonial_videos: Array<{ id: number; url: string; thumbnail_id: number | null; name: string; role: string; sort_order: number; thumbnail_url: string | null }>;
  top_students: Array<{ id: number; image_id: number | null; grant_label: string; sort_order: number; image_url: string | null; university: string; name: string; description: string }>;
  alumni: Array<{ id: number; image_id: number | null; ielts_label: string; sort_order: number; image_url: string | null; name: string; university: string; major: string }>;
  exam_results: {
    ielts: Array<{ id: number; exam_type: string; score: string; image_id: number | null; year: number; sort_order: number; image_url: string | null; name: string; grade: string }>;
    sat:   Array<{ id: number; exam_type: string; score: string; image_id: number | null; year: number; sort_order: number; image_url: string | null; name: string; grade: string }>;
  };
  awards: Array<{ id: number; icon_key: string; image_id: number | null; image_url: string | null; video_url: string | null; gold_count: number; silver_count: number; bronze_count: number; total_label_value: string; sort_order: number; title: string; description: string; gold_label: string; silver_label: string; bronze_label: string; total_label: string }>;
  universities: Array<{ id: number; raw_name: string; image_id: number | null; image_url: string | null; group: 'main'|'partner'|'practice'; track: 'left'|'right'; page: 'index'|'natijalar'|'both'; sort_order: number; name: string }>;
  carousel: Array<{ id: number; image_id: number | null; image_url: string | null; sort_order: number }>;
  blog_posts: Array<{ id: number; slug: string; image_id: number | null; published_at: string | null; sort_order: number; image_url: string | null; badge: string; date_label: string; title: string; excerpt: string }>;
  exam_courses: Array<{ id: number; badge: string; theme: string; score_value: string; sort_order: number; score_label: string; body: string; facts: Array<{label:string;value:string}>; note: string; cta_label: string }>;
  lesson_subjects: Array<{ id: number; group_key: string; icon_key: string; sort_order: number; title: string; tags: string[] }>;
  lesson_extras: Array<{ id: number; image_id: number | null; image_url: string | null; link_url: string; icon_key: string; sort_order: number; title: string; description: string; link_label: string }>;
  gallery: Array<{ id: number; image_id: number | null; size_class: string; sort_order: number; image_url: string | null; caption: string }>;
  faqs: Array<{ id: number; page: 'index'|'aloqa'|'both'; sort_order: number; question: string; answer: string }>;
  pricing_plans: Array<{ id: number; amount: string; currency: string; is_featured: number; sort_order: number; label: string; note: string; includes: string; cta_label: string }>;
  advantages: Array<{ id: number; icon_key: string; accent_num: number; sort_order: number; title: string; description: string }>;
  about_stats: Array<{ id: number; prefix: string; value: string; suffix: string; page: string; sort_order: number; label: string; sub: string | null }>;
};

export async function fetchSiteBundle(locale: Locale): Promise<SiteBundle> {
  return apiFetch<SiteBundle>(`/api/public-site?lang=${locale}`, { revalidate: 30 });
}

export type ExamCourseSection = {
  id: number;
  exam_course_id: number;
  image_id: number | null;
  image_url: string | null;
  is_reverse: number;
  sort_order: number;
  title: string;
  body: string;
};

export async function fetchExamCourseSections(badge: string, locale: Locale): Promise<{ items: ExamCourseSection[] }> {
  return apiFetch(`/api/exam-course-sections/by-course/${encodeURIComponent(badge)}?lang=${locale}`, { revalidate: 30 });
}

export type BlogPostFull = {
  id: number; slug: string; image_id: number | null; published_at: string | null;
  image_url: string | null;
  badge: string; date_label: string; title: string; excerpt: string; content: string;
};

export async function fetchBlogPostBySlug(slug: string, locale: Locale): Promise<BlogPostFull> {
  return apiFetch<BlogPostFull>(`/api/blog/by-slug/${encodeURIComponent(slug)}?lang=${locale}`, { revalidate: 30 });
}

export type TeacherFull = {
  id: number; slug: string; image_id: number | null; sort_order: number;
  image_url: string | null; name: string; role: string; bio: string;
  meta: Array<{ label: string; value: string }>;
};

export async function fetchTeacherBySlug(slug: string, locale: Locale): Promise<TeacherFull | null> {
  // We have GET /api/teachers/:id but seeded teachers have unique slugs.
  // Fetch all and filter — only ~6 records.
  const res = await apiFetch<{ items: TeacherFull[] }>(`/api/teachers?lang=${locale}`, { revalidate: 30 });
  return res.items.find(t => t.slug === slug) || null;
}

export async function submitApplication(payload: {
  name: string; phone: string; message?: string; age?: string; grade?: string; region?: string; source_form?: string;
  event_id?: string; fbp?: string; fbc?: string;
}): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/api/applications`, {
    method: 'POST', body: JSON.stringify(payload),
    next: undefined as any, // disable cache on POST
  });
}
