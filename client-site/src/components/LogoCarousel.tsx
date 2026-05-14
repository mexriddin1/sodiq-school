import { resolveMediaUrl } from '@/lib/api';

type Uni = {
  id: number;
  name: string;
  image_url: string | null;
  group: 'main' | 'partner' | 'practice';
  track: 'left' | 'right';
};

export function LogoCarousel({ universities }: { universities: Uni[] }) {
  const left = universities.filter((u) => u.track === 'left');
  const right = universities.filter((u) => u.track === 'right');

  return (
    <div className="logo-carousel reveal">
      {left.length > 0 && <Track items={left} direction="left" />}
      {right.length > 0 && <Track items={right} direction="right" />}
    </div>
  );
}

function Track({ items, direction }: { items: Uni[]; direction: 'left' | 'right' }) {
  return (
    <div className="logo-track" data-direction={direction}>
      <div className="logo-track-inner">
        {items.map((u) => <Card key={u.id} u={u} />)}
      </div>
      <div className="logo-track-inner" aria-hidden="true">
        {items.map((u) => <Card key={`d-${u.id}`} u={u} />)}
      </div>
    </div>
  );
}

function Card({ u }: { u: Uni }) {
  return (
    <div className="logo-card">
      {u.image_url
        ? <img src={resolveMediaUrl(u.image_url)} alt={u.name} />
        : <div style={{ padding: '0 18px', fontWeight: 700, color: 'var(--navy-50)' }}>{u.name}</div>}
    </div>
  );
}
