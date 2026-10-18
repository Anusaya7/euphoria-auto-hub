'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FINDER } from '@/lib/serviceCatalog';

export default function Finder() {
  const [id, setId] = useState('unsure');
  const pick = FINDER.find((item) => item.id === id) || FINDER[0];
  return (
    <div>
      <div className="eh-finder">
        {FINDER.map((item) => <button key={item.id} type="button" className={id === item.id ? 'on' : ''} onClick={() => setId(item.id)}>{item.label}</button>)}
      </div>
      <div className="eh-book" style={{ marginTop: 16 }}>
        <p className="eh-kicker">Recommendation</p>
        <h3 style={{ fontSize: 32 }}>{pick.service}</h3>
        <p>{pick.slug ? 'This matches a service the studio already offers. Pricing and timing are confirmed by the team.' : 'Tell the studio what is bothering you and they will suggest the right work.'}</p>
        <div className="eh-actions">
          <Link className="eh-btn" href={pick.slug ? `/booking?service=${encodeURIComponent(pick.service)}` : '/contact'}>Get my recommendation</Link>
          {pick.slug && <Link className="eh-btn-ghost" href={`/services/${pick.slug}`}>Learn more</Link>}
        </div>
      </div>
    </div>
  );
}
