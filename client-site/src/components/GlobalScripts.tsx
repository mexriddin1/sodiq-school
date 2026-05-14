'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Re-implements the behaviors from sodiq-school/main.js:
//  - reveal on scroll
//  - count-up
//  - tabs
//  - faq accordion
//  - card tilt
//  - mission parallax
//  - testimonials carousel arrows
// Re-runs after every navigation so newly mounted DOM is wired up.
export function GlobalScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // small delay so the DOM is fully painted before observers attach
    const t = setTimeout(init, 30);
    // Re-init at later moments to catch late-mounted content (HMR replacements,
    // lazy chunks, async data) that adds new `.cu` / `.reveal` elements.
    const t2 = setTimeout(init, 600);
    const t3 = setTimeout(init, 1800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return null;
}

function init() {
  // ---- reveal ----
  const revealEls = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- count-up ----
  const counters = document.querySelectorAll<HTMLElement>('.cu:not([data-cu-init])');
  if (counters.length) {
    const countUp = (el: HTMLElement) => {
      const raw = el.dataset.target || '0';
      const target = parseFloat(raw);
      if (!isFinite(target)) return;
      // Detect decimals from the data-target string itself (e.g. "7.5" → 1 decimal)
      const decimals = raw.includes('.') ? (raw.split('.')[1]?.length || 0) : 0;
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        el.textContent = decimals ? current.toFixed(decimals) : Math.round(current).toString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cuObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            countUp(el);
            cuObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    counters.forEach((c) => {
      c.dataset.cuInit = '1';
      cuObserver.observe(c);
    });
  }

  // ---- tabs ----
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tab-btn:not([data-tab-init])');
  if (tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.dataset.tabInit = '1';
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach((p) => {
          p.classList.toggle('active', p.id === 'tab-' + id);
        });
      });
    });
  }

  // ---- faq accordion ----
  const faqItems = document.querySelectorAll<HTMLElement>('.faq-item:not([data-faq-init])');
  if (faqItems.length) {
    faqItems.forEach((item) => {
      item.dataset.faqInit = '1';
      const q = item.querySelector('.faq-q');
      const a = item.querySelector<HTMLElement>('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach((other) => {
          other.classList.remove('open');
          const oa = other.querySelector<HTMLElement>('.faq-a');
          if (oa) oa.style.maxHeight = '0px';
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  // ---- testimonials carousel arrows ----
  document.querySelectorAll<HTMLElement>('.video-wrap:not([data-vw-init])').forEach((wrap) => {
    wrap.dataset.vwInit = '1';
    const track = wrap.querySelector<HTMLElement>('.video-testimonials');
    const left = wrap.querySelector<HTMLElement>('.scroll-left');
    const right = wrap.querySelector<HTMLElement>('.scroll-right');
    if (!track || !left || !right) return;
    const amount = 260;
    left.addEventListener('click', () => track.scrollBy({ left: -amount, behavior: 'smooth' }));
    right.addEventListener('click', () => track.scrollBy({ left: amount, behavior: 'smooth' }));
  });

  // ---- card tilt ----
  document.querySelectorAll<HTMLElement>('[data-tilt]:not([data-tilt-init])').forEach((card) => {
    card.dataset.tiltInit = '1';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ---- mission parallax ----
  const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (parallaxEls.length) {
    const onScroll = () => {
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const vCenter = window.innerHeight / 2;
        const offset = (center - vCenter) * 0.08;
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
