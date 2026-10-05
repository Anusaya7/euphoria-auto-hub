'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [value, setValue] = useState(54);

  return (
    <div className="compare-wrap">
      <div className="compare">
        <Image src={after} alt="Finished luxury exterior after studio care" fill sizes="(max-width: 900px) 100vw, 1120px" style={{ objectFit: 'cover' }} />
        <div className="compare-before" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={before} alt="Vehicle during a premium foam wash" fill sizes="(max-width: 900px) 100vw, 1120px" style={{ objectFit: 'cover' }} />
        </div>
        <span className="compare-tag compare-tag-before">Before</span>
        <span className="compare-tag compare-tag-after">After</span>
        <div className="compare-handle" style={{ left: `${value}%` }} aria-hidden="true" />
        <input
          className="compare-range"
          type="range"
          min={6}
          max={94}
          value={Math.round(value)}
          aria-label="Drag to compare before and after"
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
      <p className="compare-note">Drag to compare a studio wash with a protected finish.</p>
    </div>
  );
}
