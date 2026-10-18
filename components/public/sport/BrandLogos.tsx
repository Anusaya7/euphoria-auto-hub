'use client';

import React, { useState } from 'react';

export interface BrandItem {
  id: string;
  name: string;
  category: 'german' | 'british' | 'suv';
  tag: string;
  spec: string;
  svg: React.ReactNode;
}

export const CAR_BRANDS: BrandItem[] = [
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    category: 'german',
    tag: 'AMG & S-Class',
    spec: 'Ceramic Clear Calibrated',
    svg: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="merc-chrome" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" stroke="url(#merc-chrome)" strokeWidth="5" />
        <circle cx="50" cy="50" r="39" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M50 8 L50 50 L42 46 Z" fill="#E2E8F0" />
        <path d="M50 8 L58 46 L50 50 Z" fill="#94A3B8" />
        <path d="M14 74 L50 50 L44 42 Z" fill="#CBD5E1" />
        <path d="M14 74 L48 57 L50 50 Z" fill="#64748B" />
        <path d="M86 74 L50 50 L52 57 Z" fill="#E2E8F0" />
        <path d="M86 74 L56 42 L50 50 Z" fill="#94A3B8" />
      </svg>
    ),
  },
  {
    id: 'bmw',
    name: 'BMW',
    category: 'german',
    tag: 'M-Performance',
    spec: 'Dual-Stage Bavarian Clear',
    svg: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="#FFFFFF" strokeWidth="3.5" />
        <circle cx="50" cy="50" r="33" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M 50 17 A 33 33 0 0 1 83 50 L 50 50 Z" fill="#0066B1" />
        <path d="M 17 50 A 33 33 0 0 1 50 83 L 50 50 Z" fill="#0066B1" />
        <path d="M 50 17 A 33 33 0 0 0 17 50 L 50 50 Z" fill="#FFFFFF" />
        <path d="M 83 50 A 33 33 0 0 1 50 83 L 50 50 Z" fill="#FFFFFF" />
        <line x1="50" y1="17" x2="50" y2="83" stroke="#1E293B" strokeWidth="2" />
        <line x1="17" y1="50" x2="83" y2="50" stroke="#1E293B" strokeWidth="2" />
        <path d="M22 28 A40 40 0 0 1 78 28" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'audi',
    name: 'Audi',
    category: 'german',
    tag: 'RS & Quattro',
    spec: 'Ultra-Hard Clear Safe',
    svg: (
      <svg width="56" height="30" viewBox="0 0 160 80" fill="none">
        <defs>
          <linearGradient id="audi-ring" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#CBD5E1" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="40" r="26" stroke="url(#audi-ring)" strokeWidth="6.5" />
        <circle cx="64" cy="40" r="26" stroke="url(#audi-ring)" strokeWidth="6.5" />
        <circle cx="96" cy="40" r="26" stroke="url(#audi-ring)" strokeWidth="6.5" />
        <circle cx="128" cy="40" r="26" stroke="url(#audi-ring)" strokeWidth="6.5" />
      </svg>
    ),
  },
  {
    id: 'porsche',
    name: 'Porsche',
    category: 'german',
    tag: 'Sports & GT',
    spec: 'Concourse Pure Acrylic',
    svg: (
      <svg width="38" height="44" viewBox="0 0 100 120" fill="none">
        <defs>
          <linearGradient id="porsche-gold" x1="0" y1="0" x2="100" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#FDE68A" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <path d="M15 15 L85 15 C88 50 82 85 50 112 C18 85 12 50 15 15 Z" fill="url(#porsche-gold)" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M26 40 L45 40 L45 75 L26 75 Z" fill="#D71920" />
        <path d="M55 40 L74 40 L74 75 L55 75 Z" fill="#D71920" />
        <line x1="28" y1="28" x2="42" y2="28" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <line x1="58" y1="28" x2="72" y2="28" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M38 52 C38 46 62 46 62 52 C62 70 50 82 50 82 C50 82 38 70 38 52 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
        <path d="M48 57 C48 55 52 55 53 58 C53 62 49 65 52 70" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'rangerover',
    name: 'Range Rover',
    category: 'british',
    tag: 'Land Rover SUV',
    spec: '195µm TPU PPF Ready',
    svg: (
      <svg width="54" height="30" viewBox="0 0 130 72" fill="none">
        <defs>
          <linearGradient id="rr-green" x1="0" y1="0" x2="130" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B4619" />
            <stop offset="0.6" stopColor="#062B0E" />
            <stop offset="1" stopColor="#021406" />
          </linearGradient>
          <linearGradient id="rr-gold" x1="0" y1="0" x2="0" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
        <ellipse cx="65" cy="36" rx="60" ry="32" fill="url(#rr-green)" stroke="url(#rr-gold)" strokeWidth="3" />
        <ellipse cx="65" cy="36" rx="54" ry="26" stroke="url(#rr-gold)" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M28 36 L102 36" stroke="url(#rr-gold)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 26 L48 36 L34 46" stroke="url(#rr-gold)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M96 26 L82 36 L96 46" stroke="url(#rr-gold)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    category: 'british',
    tag: 'British Luxury',
    spec: 'Metallic Flake Restored',
    svg: (
      <svg width="52" height="30" viewBox="0 0 140 80" fill="none">
        <defs>
          <linearGradient id="jag-silver" x1="0" y1="0" x2="140" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#CBD5E1" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
        </defs>
        <path d="M12 56 C24 38 42 24 68 28 C82 30 96 20 114 26 C122 28 130 36 126 42 C122 45 116 42 110 40 C98 36 90 44 82 50 C72 56 58 58 46 54 C36 50 26 56 12 56 Z" fill="url(#jag-silver)" />
        <path d="M38 53 C44 64 54 66 64 62" stroke="url(#jag-silver)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M102 42 C110 52 118 52 122 48" stroke="url(#jag-silver)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'volvo',
    name: 'Volvo',
    category: 'british',
    tag: 'Polestar & XC',
    spec: 'Swedish Hard Paint Spec',
    svg: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="volvo-chrome" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="52" r="38" stroke="url(#volvo-chrome)" strokeWidth="6" />
        <line x1="72" y1="28" x2="90" y2="10" stroke="url(#volvo-chrome)" strokeWidth="7" strokeLinecap="round" />
        <polyline points="74,10 90,10 90,26" stroke="url(#volvo-chrome)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="44" width="56" height="16" rx="3" fill="#0C2340" stroke="url(#volvo-chrome)" strokeWidth="1.5" />
        <text x="48" y="56" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1">VOLVO</text>
      </svg>
    ),
  },
  {
    id: 'toyota',
    name: 'Toyota',
    category: 'suv',
    tag: 'Fortuner & Vellfire',
    spec: 'Soft Japanese Clear Safe',
    svg: (
      <svg width="52" height="34" viewBox="0 0 130 90" fill="none">
        <defs>
          <linearGradient id="toyota-chrome" x1="0" y1="0" x2="0" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#CBD5E1" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
        </defs>
        <ellipse cx="65" cy="45" rx="58" ry="38" stroke="url(#toyota-chrome)" strokeWidth="6" />
        <ellipse cx="65" cy="30" rx="36" ry="18" stroke="url(#toyota-chrome)" strokeWidth="5.5" />
        <ellipse cx="65" cy="52" rx="18" ry="30" stroke="url(#toyota-chrome)" strokeWidth="5.5" />
      </svg>
    ),
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    category: 'suv',
    tag: 'Thar & Scorpio-N',
    spec: '10H Graphene Armor',
    svg: (
      <svg width="50" height="34" viewBox="0 0 130 90" fill="none">
        <defs>
          <linearGradient id="mah-silver" x1="0" y1="0" x2="130" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#CBD5E1" />
            <stop offset="1" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        <path d="M22 68 L48 20 C54 18 60 26 62 34 L52 68" stroke="url(#mah-silver)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M108 68 L82 20 C76 18 70 26 68 34 L78 68" stroke="url(#mah-silver)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44 50 C54 44 76 44 86 50" stroke="#D71920" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tata',
    name: 'Tata Motors',
    category: 'suv',
    tag: 'Safari & Harrier',
    spec: 'Dark Edition TPU PPF',
    svg: (
      <svg width="48" height="34" viewBox="0 0 130 90" fill="none">
        <defs>
          <linearGradient id="tata-chrome" x1="0" y1="0" x2="0" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#93C5FD" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        <ellipse cx="65" cy="45" rx="56" ry="36" stroke="#E2E8F0" strokeWidth="5.5" />
        <path d="M34 32 C52 52 78 52 96 32" stroke="url(#tata-chrome)" strokeWidth="6" strokeLinecap="round" />
        <line x1="65" y1="32" x2="65" y2="68" stroke="url(#tata-chrome)" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    category: 'german',
    tag: 'Tiguan & Virtus',
    spec: 'Precision Gloss Finish',
    svg: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="vw-chrome" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="50" cy="50" r="39" stroke="url(#vw-chrome)" strokeWidth="2" />
        <path d="M32 26 L50 64 L68 26" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 42 L42 80 L50 64 L58 80 L75 42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'skoda',
    name: 'Skoda',
    category: 'suv',
    tag: 'Kodiaq & Octavia',
    spec: 'Czech Hard Clear Tested',
    svg: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="skoda-green" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22C55E" />
            <stop offset="1" stopColor="#15803D" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="50" cy="50" r="38" stroke="url(#skoda-green)" strokeWidth="2.5" />
        <path d="M50 18 L68 44 L32 44 Z" fill="url(#skoda-green)" />
        <circle cx="50" cy="62" r="14" stroke="url(#skoda-green)" strokeWidth="4" />
        <circle cx="50" cy="34" r="4" fill="#FFFFFF" />
        <line x1="50" y1="44" x2="50" y2="80" stroke="url(#skoda-green)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

type FilterType = 'all' | 'german' | 'british' | 'suv';

export default function BrandLogos() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredBrands = activeFilter === 'all' 
    ? CAR_BRANDS 
    : CAR_BRANDS.filter((b) => b.category === activeFilter);

  return (
    <section className="eh-brands-wrap" aria-label="Automotive brands serviced by Euphoria Auto Hub">
      <div className="eh-wrap">
        <div className="eh-brands-head">
          <div className="eh-brands-kicker">
            <span className="pulse-dot" />
            <span>COMPREHENSIVE MULTI-BRAND EXPERTISE</span>
          </div>

          <h2 className="eh-brands-title">
            PRECISION DETAILING FOR <span className="accent-red">EVERY PERFORMANCE &amp; LUXURY</span> MARQUE
          </h2>

          <p className="eh-brands-subtitle">
            From daily sedans and rugged 4×4 SUVs to exotic supercars — our Bavdhan studio calibrates machine polishing pads, compound densities, and ceramic coatings to your vehicle’s specific factory clear coat hardness.
          </p>

          <div className="eh-brands-filters" role="tablist" aria-label="Filter marques by category">
            <button
              type="button"
              className={`eh-brand-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Marques ({CAR_BRANDS.length})
            </button>
            <button
              type="button"
              className={`eh-brand-filter-btn ${activeFilter === 'german' ? 'active' : ''}`}
              onClick={() => setActiveFilter('german')}
            >
              German Luxury (5)
            </button>
            <button
              type="button"
              className={`eh-brand-filter-btn ${activeFilter === 'british' ? 'active' : ''}`}
              onClick={() => setActiveFilter('british')}
            >
              British &amp; Nordic (3)
            </button>
            <button
              type="button"
              className={`eh-brand-filter-btn ${activeFilter === 'suv' ? 'active' : ''}`}
              onClick={() => setActiveFilter('suv')}
            >
              Performance &amp; 4×4 SUV (4)
            </button>
          </div>
        </div>

        <div className="eh-brands-grid">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="eh-brand-card">
              <div className="eh-brand-icon" aria-hidden="true">
                {brand.svg}
              </div>
              <strong className="eh-brand-card-name">{brand.name}</strong>
              <span className="eh-brand-card-tag">{brand.tag}</span>
              <span className="eh-brand-card-spec">{brand.spec}</span>
            </div>
          ))}
        </div>

        {/* Studio Technical Standards Bar */}
        <div className="eh-brands-trust-bar">
          <div className="eh-brands-trust-card">
            <div className="eh-brands-trust-icon">🔬</div>
            <div className="eh-brands-trust-text">
              <strong>Digital Paint Gauge Profiling</strong>
              <p>Every panel is micrometer-mapped before any compounding to protect OEM clear coat integrity.</p>
            </div>
          </div>

          <div className="eh-brands-trust-card">
            <div className="eh-brands-trust-icon">🛡️</div>
            <div className="eh-brands-trust-text">
              <strong>Factory Warranty Preservation</strong>
              <p>100% genuine Garware Hi-Tech TPU, 3M, &amp; Koch-Chemie chemistry that never voids OEM warranties.</p>
            </div>
          </div>

          <div className="eh-brands-trust-card">
            <div className="eh-brands-trust-icon">💎</div>
            <div className="eh-brands-trust-text">
              <strong>Zero Swirl &amp; Hologram Guarantee</strong>
              <p>Multi-stage eccentric dual-action machine refining inspected under 6500K concourse LED lighting.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
