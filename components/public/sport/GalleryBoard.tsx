'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';
import { localImage } from '@/lib/links';

const FILTERS = ['All', 'Car Wash', 'Detailing', 'Ceramic', 'Graphene', 'PPF', 'Wraps', 'Polishing', 'Interior'];

export default function GalleryBoard({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = images.filter((image) => {
    if (filter === 'All') return true;
    const cat = (image.category || '').toLowerCase();
    const target = filter.toLowerCase();
    if (target === 'car wash') return cat.includes('wash');
    return cat.includes(target);
  });

  const active = activeIndex !== null && visible[activeIndex] ? visible[activeIndex] : null;

  const nextImage = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < visible.length - 1 ? prev + 1 : 0));
  }, [activeIndex, visible.length]);

  const prevImage = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : visible.length - 1));
  }, [activeIndex, visible.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, nextImage, prevImage]);

  return (
    <div>
      <div className="eh-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? 'on' : ''}
            onClick={() => {
              setFilter(item);
              setActiveIndex(null);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="eh-empty eh-gallery-empty" role="status">
          Published studio photographs for category &ldquo;{filter}&rdquo; will appear here once uploaded from the admin panel.
        </div>
      ) : (
        <div className="eh-gallery-grid">
          {visible.map((image, index) => (
            <button
              key={image.id}
              className="eh-shot"
              type="button"
              aria-label={`View ${image.title || 'Studio photograph'} in lightbox`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={localImage(image.image_url, '/images/hero-car.jpg')}
                alt={image.alt_text || image.title}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
              <div className="eh-shot-caption">
                <span>{image.category}</span>
                <strong>{image.title}</strong>
              </div>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="eh-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="eh-lightbox-content">
            <button
              type="button"
              className="eh-lightbox-close"
              aria-label="Close image preview"
              onClick={() => setActiveIndex(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <X size={20} /> Close [Esc]
            </button>

            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {visible.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(23, 25, 29, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <Image
                src={localImage(active.image_url, '/images/hero-car.jpg')}
                alt={active.alt_text || active.title}
                width={1400}
                height={900}
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  borderRadius: 8,
                  objectFit: 'contain',
                }}
              />

              {visible.length > 1 && (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(23, 25, 29, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            <div style={{ marginTop: 14, textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 12, color: '#D71920', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {active.category} · {activeIndex! + 1} of {visible.length}
              </div>
              <h3 style={{ fontSize: 20, color: '#FFFFFF', margin: '4px 0 0' }}>{active.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
