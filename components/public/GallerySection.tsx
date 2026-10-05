'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { localImage } from '@/lib/links';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  image_url: string;
  alt_text?: string;
}

const CATEGORIES = ['Car Wash', 'Detailing', 'PPF', 'Ceramic', 'Graphene', 'Wraps', 'Polishing', 'Interior'];

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const available = ['All', ...CATEGORIES.filter((cat) => images.some((img) => img.category === cat))];
  const filtered = active === 'All' ? images : images.filter((img) => img.category === active);
  const current = lightbox === null ? null : filtered[lightbox];

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, filtered.length]);

  if (!images.length) {
    return <p className="empty-note">No gallery images yet.</p>;
  }

  return (
    <>
      <div className="gallery-filters">
        {available.map((cat) => (
          <button key={cat} className={`gallery-filter${active === cat ? ' active' : ''}`} onClick={() => setActive(cat)} type="button">
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-note">No images in this category.</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`gallery-item gallery-span-${i % 6} reveal reveal-delay-${(i % 4) + 1}`}
              onClick={() => setLightbox(i)}
            >
              <Image
                src={localImage(img.image_url, '/images/hero-car.jpg')}
                alt={img.alt_text || img.title || img.category}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="gallery-item-overlay">
                <div className="gallery-item-cat">{img.category}</div>
                <div className="gallery-item-title">{img.title}</div>
                <div className="gallery-item-action">View Project →</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {current && (
        <div
          className="lightbox open"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={current.title || 'Gallery image'}
          onTouchStart={(e) => { touchX.current = e.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(e) => {
            if (touchX.current === null || filtered.length < 2) return;
            const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 48) return;
            setLightbox((i) => (i === null ? i : (i + (dx < 0 ? 1 : -1) + filtered.length) % filtered.length));
          }}
        >
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close" type="button">✕</button>
          {filtered.length > 1 && (
            <button className="lightbox-nav prev" type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)); }}>‹</button>
          )}
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <Image
              src={localImage(current.image_url, '/images/hero-car.jpg')}
              alt={current.alt_text || current.title || ''}
              width={1400}
              height={900}
              style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain' }}
            />
            <div className="lightbox-caption">{current.title} · {current.category}</div>
          </div>
          {filtered.length > 1 && (
            <button className="lightbox-nav next" type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i + 1) % filtered.length)); }}>›</button>
          )}
        </div>
      )}
    </>
  );
}
