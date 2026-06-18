declare global {
  interface Window {
    tgp?: (...args: unknown[]) => void;
  }
}

// Fires the Telegram Pixel Lead event. No-op outside /short-landing where tgp isn't loaded.
export function fireTelegramLead() {
  if (typeof window !== 'undefined' && typeof window.tgp === 'function') {
    window.tgp('event', 'bjPNOpBd-zqujVWo8');
  }
}
