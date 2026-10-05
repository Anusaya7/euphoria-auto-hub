import Image from 'next/image';
import Link from 'next/link';
import { localImage } from '@/lib/links';
import type { Service } from '@/lib/types';

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-card-image">
        <Image
          src={localImage(service.image, '/images/service-car-wash.jpg')}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="service-card-content">
        <div className="service-card-top">
          <span className="service-card-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="service-card-arrow" aria-hidden="true">→</span>
        </div>
        <div className="service-card-accent" />
        <h3 className="service-card-name">{service.name}</h3>
        <p className="service-card-desc">{service.short_description}</p>
      </div>
    </Link>
  );
}
