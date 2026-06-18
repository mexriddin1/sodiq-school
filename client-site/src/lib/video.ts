export const DIRECT_VIDEO_EXTS = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i;

export function getYouTubeId(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return match?.[1] || '';
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&controls=1` : '';
}

export function isDirectVideoUrl(url: string | null | undefined): boolean {
  return !!url && DIRECT_VIDEO_EXTS.test(url);
}
