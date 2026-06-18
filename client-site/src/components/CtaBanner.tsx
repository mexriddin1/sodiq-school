'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { submitApplication } from '@/lib/api';
import { fireTelegramLead } from '@/lib/telegram';
import { fireMetaLead, generateEventId, getMetaCookies } from '@/lib/meta-pixel';
import { firstContactAddress, splitContactAddresses } from '@/lib/contact';
import { GRADE_OPTIONS, UZBEKISTAN_REGIONS } from '@/lib/form-options';
import { PinIcon, PhoneIcon, ClockIcon, TelegramIcon } from './Icons';

type Props = {
  locale: Locale;
  settings: Record<string, string>;
  variant?: 'default' | 'compact';
  customTitle?: string;
  customSubtitle?: string;
  showMap?: boolean;
};

type MapLocation = {
  name: string;
  address: string;
  lat: string;
  lng: string;
  zoom: string;
  url: string;
};

function makeMapUrl(location: Pick<MapLocation, 'lat' | 'lng' | 'zoom' | 'address'>) {
  const lat = location.lat?.trim();
  const lng = location.lng?.trim();
  const zoom = location.zoom?.trim() || '16';
  if (lat && lng) {
    const coords = `${lat},${lng}`;
    return `https://www.google.com/maps?q=${encodeURIComponent(coords)}&z=${encodeURIComponent(zoom)}&output=embed`;
  }
  return location.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`
    : '';
}

function parseMapLocations(settings: Record<string, string>, fallbackAddress: string): MapLocation[] {
  const raw = settings['contact.map_locations']?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item, index) => {
            const location = {
              name: String(item?.name || `Manzil ${index + 1}`),
              address: String(item?.address || ''),
              lat: String(item?.lat || ''),
              lng: String(item?.lng || ''),
              zoom: String(item?.zoom || '16'),
            };
            return { ...location, url: makeMapUrl(location) };
          })
          .filter((item) => item.url);
      }
    } catch {
      // Fall back to legacy map settings below.
    }
  }

  const embedUrl = settings['contact.map_embed_url']?.trim();
  if (embedUrl) return [{ name: 'Manzil', address: fallbackAddress, lat: '', lng: '', zoom: '16', url: embedUrl }];

  const legacy = {
    name: 'Manzil',
    address: fallbackAddress,
    lat: settings['contact.map_lat'] || '',
    lng: settings['contact.map_lng'] || '',
    zoom: settings['contact.map_zoom'] || '16',
  };
  const url = makeMapUrl(legacy);
  return url ? [{ ...legacy, url }] : [];
}

export function CtaBanner({
  locale,
  settings,
  variant = 'default',
  customTitle,
  customSubtitle,
  showMap = true,
}: Props) {
  const dict = getDict(locale);
  const phone = settings['contact.phone'] || '+998 78 888 80 80';
  const phoneLink = settings['contact.phone_link'] || phone.replace(/\D/g, '');
  const address = settings['contact.address'] || '';
  const addresses = splitContactAddresses(address);
  const tg = settings['contact.telegram'] || 'https://t.me/sodiq_school';
  const ig = settings['contact.instagram'] || 'https://instagram.com/sodiqschool.uz';
  const yt = settings['contact.youtube'] || 'https://youtube.com/@sodiq_school';
  const mapLocations = parseMapLocations(settings, firstContactAddress(address));
  const mapCountClass =
    mapLocations.length === 1 ? 'map-count-1'
    : mapLocations.length === 2 ? 'map-count-2'
    : mapLocations.length === 3 ? 'map-count-3'
    : mapLocations.length === 4 ? 'map-count-4'
    : mapLocations.length === 5 ? 'map-count-5'
    : 'map-count-many';

  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const leadFired = useRef(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get('name') as string || '').trim();
    const phoneVal = (fd.get('phone') as string || '').trim();
    const message = (fd.get('message') as string || '').trim();
    const grade = (fd.get('grade') as string || '').trim();
    const region = (fd.get('region') as string || '').trim();
    if (!name || !phoneVal) return;
    setBusy(true);
    const eventId = generateEventId();
    const { fbp, fbc } = getMetaCookies();
    if (!leadFired.current) {
      fireMetaLead(eventId);
      fireTelegramLead();
      leadFired.current = true;
    }
    try {
      await submitApplication({
        name,
        phone: phoneVal,
        message: message || undefined,
        grade: grade || undefined,
        region: region || undefined,
        source_form: 'cta-banner',
        event_id: eventId, fbp, fbc,
      });
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
      router.push(`/${locale}/thanks`);
    }
  }

  return (
    <section className="cta-banner" id="contact">
      <div className="cta-deco cta-deco-1"></div>
      <div className="cta-deco cta-deco-2"></div>
      <div className="cta-deco cta-deco-3"></div>
      <div className="cta-deco cta-deco-4"></div>
      <div className="container">
        <div className="cta-inner reveal">
          <div className="cta-left">
            <div className="cta-info-head">
              <h3 className="cta-info-title">{dict.sections.contact_title}</h3>
              <p className="cta-info-sub">{dict.sections.contact_subtitle}</p>
            </div>
            <div className="cta-info-card">
              {variant === 'default' && addresses.map((item, index) => (
                <div className="cta-info-row" key={item}>
                  <PinIcon className="cta-ic" />
                  <div>
                    <span className="cta-info-label">
                      {dict.sections.address_label}{addresses.length > 1 ? ` ${index + 1}` : ''}
                    </span>
                    <span className="cta-info-value">{item}</span>
                  </div>
                </div>
              ))}
              <div className="cta-info-row">
                <PhoneIcon className="cta-ic" />
                <div>
                  <span className="cta-info-label">{dict.sections.phone_label}</span>
                  <a href={`tel:${phoneLink}`} className="cta-info-value">{phone}</a>
                </div>
              </div>
              {variant === 'default' && (
                <div className="cta-info-row">
                  <ClockIcon className="cta-ic" />
                  <div>
                    <span className="cta-info-label">{dict.sections.hours_label}</span>
                    <span className="cta-info-value">{settings['contact.hours']}</span>
                  </div>
                </div>
              )}
            </div>

            {variant === 'default' && (
              <div className="cta-socials">
                <a href={tg} className="cta-social" aria-label="Telegram">
                  <TelegramIcon />
                </a>
                <a href={ig} className="cta-social" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href={yt} className="cta-social" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 9.71s-.23-1.6-.93-2.3c-.89-.93-1.89-.94-2.35-.99C16.4 6.1 12 6.1 12 6.1s-4.4 0-7.72.32c-.46.05-1.46.06-2.35.99-.7.7-.93 2.3-.93 2.3S.77 11.54.77 13.37v1.71c0 1.83.23 3.66.23 3.66s.23 1.6.93 2.3c.89.93 2.06.9 2.58 1 1.87.18 7.49.23 7.49.23s4.4-.01 7.72-.33c.46-.05 1.46-.06 2.35-.99.7-.7.93-2.3.93-2.3s.23-1.83.23-3.66v-1.71c0-1.83-.23-3.66-.23-3.66zM9.55 15.72V9.5l6.36 3.12-6.36 3.1z"/></svg>
                </a>
              </div>
            )}
          </div>

          <div className="cta-right">
            <form className="cta-form" onSubmit={onSubmit} noValidate>
              <div className="cta-form-head">
                <h3 className="cta-form-title">{customTitle || dict.sections.contact_eyebrow}</h3>
                <p className="cta-form-sub">{customSubtitle || dict.sections.contact_subtitle}</p>
              </div>
              <input type="text" name="name" required placeholder={dict.form.name_placeholder} />
              <input type="tel" name="phone" required placeholder={dict.form.phone_placeholder} />
              <select name="grade" defaultValue="">
                <option value="" disabled>{dict.form.grade_choose}</option>
                {GRADE_OPTIONS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
              </select>
              <select name="region" defaultValue="">
                <option value="" disabled>{dict.form.region_choose}</option>
                {UZBEKISTAN_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
              <textarea name="message" rows={3} placeholder={dict.form.message_placeholder} />
              <button type="submit" className="cta-submit" disabled={busy}>
                {busy ? dict.form.submitted : dict.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showMap && mapLocations.length > 0 && (
        <div className={`cta-map-grid ${mapCountClass}`}>
          {mapLocations.map((location, index) => (
            <div className="cta-map-card" key={`${location.name}-${index}`}>
              <div className="cta-map-card-head">
                <strong>{location.name || `Manzil ${index + 1}`}</strong>
                {location.address && <span>{location.address}</span>}
              </div>
              <iframe
                src={location.url}
                title={`Sodiq School manzili: ${location.name || index + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
