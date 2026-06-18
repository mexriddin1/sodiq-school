import type { SiteBundle } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/api';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '@/lib/video';

export function TestimonialVideos({ items, dict }: {
  items: SiteBundle['testimonial_videos'];
  dict: { left: string; right: string };
}) {
  return (
    <div className="video-grid reveal delay-1">
      {items.map((v) => {
        const poster = resolveMediaUrl(v.thumbnail_url) || undefined;
        const youtubeEmbedUrl = getYouTubeEmbedUrl(v.url);
        const isDirectVideo = isDirectVideoUrl(v.url);
        return (
          <div key={v.id} className="video-card">
            <div className="video-frame">
              {youtubeEmbedUrl ? (
                <iframe
                  className="video-player"
                  src={youtubeEmbedUrl}
                  title={v.name || 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isDirectVideo ? (
                <video
                  className="video-player"
                  controls
                  preload="metadata"
                  poster={poster}
                >
                  <source src={resolveMediaUrl(v.url)} />
                </video>
              ) : (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-poster"
                  style={poster ? { backgroundImage: `url('${poster}')` } : undefined}
                  aria-label={v.name || 'Video'}
                >
                  <span className="video-play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
