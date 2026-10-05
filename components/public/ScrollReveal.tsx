'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    const fallback = window.setTimeout(() => {
      elements.forEach((el) => el.classList.add('visible'));
    }, 1800);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
