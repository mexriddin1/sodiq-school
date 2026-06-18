declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fires the Meta Pixel Lead event with a dedup eventID.
// Same eventId is sent to backend so the server-side CAPI event dedupes against this one.
export function fireMetaLead(eventId: string) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {}, { eventID: eventId });
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : undefined;
}

export function getMetaCookies(): { fbp?: string; fbc?: string } {
  return { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') };
}

export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
}
