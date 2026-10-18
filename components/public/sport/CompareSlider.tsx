'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CompareSlider({ before, after, beforeLabel, afterLabel }: { before: string; after: string; beforeLabel: string; afterLabel: string }) {
  const [pos, setPos] = useState(52);

  return (
    <div className="eh-slider">
      <Image src={after} alt={afterLabel} fill sizes="100vw" />
      <div className="eh-slider-before" style={{ width: `${pos}%` }}>
        <div className="eh-slider-frame">
          <Image src={before} alt={beforeLabel} fill sizes="100vw" />
        </div>
      </div>
      <span className="eh-slider-tag left">{beforeLabel}</span>
      <span className="eh-slider-tag right">{afterLabel}</span>
      <input
        type="range"
        min={8}
        max={92}
        value={pos}
        aria-label="Drag to compare the studio wash photograph and the finished studio car"
        onChange={(event) => setPos(Number(event.target.value))}
      />
    </div>
  );
}
