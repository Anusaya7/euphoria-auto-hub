'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { phoneHref } from '@/lib/links';
import type { ContactInfo } from '@/lib/types';
import ThemeToggle from '@/components/public/ThemeToggle';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ contact }: { contact?: ContactInfo }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo" onClick={close}>
              <span className="navbar-logo-name">EUPHORIA <span>AUTO</span> HUB</span>
              <span className="navbar-logo-tagline">Your Car&apos;s Best Friend</span>
            </Link>
            <div className="navbar-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={`navbar-link${isActive(link.href) ? ' active' : ''}`} aria-current={isActive(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="navbar-cta">
              <ThemeToggle />
              <Link href="/contact" className="navbar-book">Book Your Car</Link>
              <button
                className={`navbar-mobile-toggle${menuOpen ? ' open' : ''}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                type="button"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div id="mobile-navigation" className={`mobile-menu${menuOpen ? ' open' : ''}`} hidden={!menuOpen}>
        <div className="mobile-menu-scroll">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-menu-link" onClick={close}>{link.label}</Link>
          ))}
          <div className="mobile-menu-divider" />
          <div className="mobile-menu-contact">
            <ThemeToggle />
            {contact?.phone && <a href={phoneHref(contact.phone)} className="mobile-menu-phone">{contact.phone}</a>}
            <Link href="/contact" className="btn-primary" onClick={close}><span>Book Your Car</span></Link>
          </div>
        </div>
      </div>
    </>
  );
}
