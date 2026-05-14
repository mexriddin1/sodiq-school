import { resolveMediaUrl } from '@/lib/api';

type Item = { id: number; image_url: string | null };

export function ImgCarousel({ items }: { items: Item[] }) {
  if (!items?.length) return null;
  return (
    <div className="img-carousel">
      <div className="img-carousel-track">
        <div className="img-carousel-inner">
          {items.map((it) => (
            <div key={it.id} className="img-carousel-item">
              {it.image_url && <img src={resolveMediaUrl(it.image_url)} alt="Sodiq School" />}
            </div>
          ))}
        </div>
        <div className="img-carousel-inner" aria-hidden="true">
          {items.map((it) => (
            <div key={`d-${it.id}`} className="img-carousel-item">
              {it.image_url && <img src={resolveMediaUrl(it.image_url)} alt="Sodiq School" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
