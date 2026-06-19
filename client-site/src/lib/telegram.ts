declare global {
  interface Window {
    tgp?: (...args: unknown[]) => void;
  }
}

function getTelegramLeadEventId() {
  if (typeof window === 'undefined') return 'bjPNOpBd-zqujVWo8';

  const pathname = window.location.pathname.replace(/\/$/, '');

  return pathname.endsWith('/imtixon-1july') || pathname.endsWith('/imtixon-1iyul')
    ? 'bjPNOpBd-wozq1aBm'
    : 'bjPNOpBd-zqujVWo8';
}

// Fires the Telegram Pixel Lead event. No-op on pages where tgp is not loaded.
export function fireTelegramLead() {
  if (typeof window !== 'undefined' && typeof window.tgp === 'function') {
    window.tgp('event', getTelegramLeadEventId());
  }
}
