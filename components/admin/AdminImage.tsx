import Image from 'next/image';

export default function AdminImage({ src, alt, tall = false }: { src: string; alt: string; tall?: boolean }) {
  if (!src.startsWith('/images/') && !src.startsWith('/uploads/') && !src.startsWith('https://')) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={360}
      unoptimized={src.startsWith('https://')}
      className={tall ? 'admin-gallery-photo' : 'admin-image-preview'}
      style={{ objectFit: 'cover' }}
    />
  );
}
