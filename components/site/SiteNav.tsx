'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MagneticButton from '@/components/site/cursor/MagneticButton';

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team',     href: '#team' },
  { label: 'Safety',   href: '#safety' },
  { label: 'Contact',  href: '#contact' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(13,15,18,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(242,240,235,0.06)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link href="/" aria-label="Nagar Nirmata Ltd home">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" fill="none" />
            <text x="4" y="26" fontFamily="var(--font-bebas)" fontSize="26" fill="var(--amber-glow)">NN</text>
            <line x1="0" y1="30" x2="32" y2="30" stroke="var(--amber-glow)" strokeWidth="1.5" />
          </svg>
          <span style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>
            Nagar Nirmata
          </span>
        </div>
      </Link>

      {/* Nav links — desktop */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
           className="hidden md:flex">
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--dust-gray)',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--concrete-white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}
          >
            {link.label}
          </a>
        ))}

        <MagneticButton
          href="#contact"
          className="corner-cut-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'var(--amber-glow)',
            color: 'var(--iron-dark)',
            fontWeight: 700,
            padding: '0.5rem 1.2rem',
            border: 'none',
            textDecoration: 'none',
            display: 'inline-block',
          } as React.CSSProperties}
        >
          Get a Quote →
        </MagneticButton>
      </div>
    </nav>
  );
}
