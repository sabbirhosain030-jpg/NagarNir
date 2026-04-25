'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/site/cursor/MagneticButton';
import type { ContentMap } from '@/lib/types';

const VerticalCityScene = dynamic(
  () => import('@/components/site/canvas/VerticalCityScene'),
  { ssr: false }
);

interface HeroSectionProps {
  content: ContentMap;
  revealed: boolean;
}

export default function HeroSection({ content, revealed }: HeroSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      setScrollProgress(Math.min(scrollY / height, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headline1 = content['hero.headline_line1'] ?? 'WE BUILD';
  const headline2 = content['hero.headline_line2'] ?? 'WHAT ENDURES.';

  const line1Chars = headline1.split('');
  const line2Chars = headline2.split('');

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{ height: '200vh', position: 'relative' }}
      aria-label="Hero"
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Three.js city */}
        <VerticalCityScene scrollProgress={scrollProgress} />

        {/* Radial vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(13,15,18,0.7) 100%)',
          }}
        />

        {/* Grain texture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 2rem',
            maxWidth: 900,
            transform: `translateY(${scrollProgress * -60}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Pre-title */}
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--amber-glow)',
              marginBottom: '1.5rem',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'none' : 'translateX(-20px)',
              transition: 'opacity 0.6s ease 100ms, transform 0.6s ease 100ms',
            }}
          >
            {content['hero.pretitle'] ?? 'EST. 2009 · DHAKA, BANGLADESH'}
          </p>

          {/* Headline line 1 */}
          <div
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              lineHeight: 0.95,
              color: 'var(--concrete-white)',
              overflow: 'hidden',
              marginBottom: '0.1rem',
            }}
          >
            <div>
              {line1Chars.map((char, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: revealed ? 'none' : 'translateY(100%) rotateX(-30deg)',
                    opacity: revealed ? 1 : 0,
                    transition: `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${100 + i * 35}ms, opacity 0.5s ease ${100 + i * 35}ms`,
                    perspective: '800px',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

          {/* Headline line 2 — amber */}
          <div
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              lineHeight: 0.95,
              color: 'var(--amber-glow)',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              {line2Chars.map((char, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: revealed ? 'none' : 'translateY(100%) rotateX(-30deg)',
                    opacity: revealed ? 1 : 0,
                    transition: `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${300 + i * 35}ms, opacity 0.5s ease ${300 + i * 35}ms`,
                    perspective: '800px',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

          {/* Bengali tagline */}
          <div
            style={{
              fontFamily: 'var(--font-hind)',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              color: 'rgba(242,240,235,0.6)',
              marginBottom: '0.75rem',
              clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 0.8s cubic-bezier(0.22,1,0.36,1) 900ms',
            }}
          >
            {content['hero.bengali_tagline'] ?? 'নগর নির্মাতা লিমিটেড'}
          </div>

          {/* Sub-headline */}
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 500,
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--dust-gray)',
              marginBottom: '1.5rem',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 900ms, transform 0.5s ease 900ms',
            }}
          >
            {content['hero.sub_headline'] ?? 'Engineering Construction · Design · Consultancy · Real Estate'}
          </p>

          {/* Body */}
          <p
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
              lineHeight: 1.8,
              color: 'rgba(242,240,235,0.65)',
              maxWidth: 560,
              marginBottom: '2rem',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'none' : 'translateY(10px)',
              transition: 'opacity 0.5s ease 1300ms, transform 0.5s ease 1300ms',
            }}
          >
            {content['hero.body'] ?? 'From the ground up — shaping Bangladesh\'s built environment since 2009.'}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <MagneticButton
              href="#projects"
              id="hero-cta-primary"
              className="corner-cut"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--amber-glow)',
                color: 'var(--iron-dark)',
                fontWeight: 700,
                padding: '0.85rem 1.8rem',
                border: 'none',
                textDecoration: 'none',
                display: 'inline-block',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateY(16px)',
                transition: 'opacity 0.5s ease 1300ms, transform 0.5s ease 1300ms',
              } as React.CSSProperties}
            >
              {content['hero.cta_primary'] ?? 'Explore Our Projects →'}
            </MagneticButton>

            <MagneticButton
              href="#about"
              id="hero-cta-secondary"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--concrete-white)',
                fontWeight: 500,
                padding: '0.85rem 1.8rem',
                border: '1px solid rgba(242,240,235,0.25)',
                textDecoration: 'none',
                display: 'inline-block',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateY(16px)',
                transition: 'opacity 0.5s ease 1400ms, transform 0.5s ease 1400ms',
              } as React.CSSProperties}
            >
              {content['hero.cta_secondary'] ?? 'Download Brochure'}
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: scrollProgress > 0.1 ? 0 : revealed ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
          aria-hidden="true"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--dust-gray)' }}>
            SCROLL
          </span>
          <div style={{ width: 1, height: 32, background: 'rgba(138,141,145,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div
              className="scroll-pulse"
              style={{ position: 'absolute', top: '-40%', left: 0, right: 0, height: '40%', background: 'var(--amber-glow)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
