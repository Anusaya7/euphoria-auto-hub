'use client';

export default function WrapFinishes({ finishes }: { finishes?: { label?: string; description?: string; desc?: string }[] }) {
  const items = finishes?.length ? finishes : [
    { label: 'Gloss', description: 'Mirror-like shine' },
    { label: 'Matte', description: 'Understated elegance' },
    { label: 'Satin', description: 'Between gloss and matte' },
    { label: 'Custom', description: 'Your unique vision' },
  ];

  return (
    <div className="wrap-finishes">
      {items.map((finish) => (
        <div key={finish.label || finish.description} className="wrap-finish">
          <div className="wrap-finish-label">{finish.label}</div>
          <div className="wrap-finish-desc">{finish.description || finish.desc}</div>
        </div>
      ))}
    </div>
  );
}

