export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const TOKEN_KEY = 'sodiq_admin_token';
const USER_KEY = 'sodiq_admin_user';

export type AdminUser = {
  id: number; email: string; name: string; role: 'superadmin' | 'admin' | 'editor';
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function getUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try { const v = localStorage.getItem(USER_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function setUser(u: AdminUser) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }

type FetchOpts = {
  method?: string;
  body?: any;
  formData?: FormData;
  noAuth?: boolean;
};

export async function api<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token && !opts.noAuth) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { method: opts.method || 'GET', headers, body, cache: 'no-store' });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const message = (data && data.error) || res.statusText || 'Request failed';
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export class ApiError extends Error {
  status: number; details: any;
  constructor(message: string, status: number, details?: any) {
    super(message); this.status = status; this.details = details;
  }
}

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}
