'use client';

import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap } from '@/lib/types';

interface ClientsSectionProps {
  content: ContentMap;
}

const GOVT_CLIENTS = [
  'Bangladesh Army',
  'Bangladesh Navy',
  'Bangladesh Air Force',
  'Border Guard Bangladesh',
  'Bangladesh Police',
  'Rapid Action Battalion',
  'Roads & Highways Dept.',
  'BADC',
  'LGED',
];

const PRIVATE_CLIENTS = [
  'Leatherex Footwear Industries',
  'Disney Sweater Ltd',
  'BHML Industries Ltd',
  'Blessing Group',
  'Vantage Hi-Tech Ltd',
  'Millennium Washing Ltd',
  'SG-WICUS (BD) Ltd',
  'Purbasha Knit Composite',
  'Rupali Group Ltd',
  'Home One Builders Ltd',
  'Nazveena Properties',
  'Probal Properties Ltd',
  'Friends Structure Ltd',
  'Kadir Associates Ltd',
];

export default function ClientsSection({ content }: ClientsSectionProps) {
  const [chipRef, chipsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  // Duplicate for seamless marquee
  const marqueeItems = [...GOVT_CLIENTS, ...GOVT_CLIENTS];

  return (
    <section
      id="clients"
      style={{ background: 'var(--steel-blue)', position: 'relative', overflow: 'hidden' }}
      aria-label="Clients"
    >
      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel text={content['clients.section_label'] ?? '06 / TRUSTED BY'} className="mb-4" />
        <SectionRule className="mb-6" />
        <AnimatedHeadline
          text={content['clients.headline'] ?? 'BUILT ON TRUST.\nPROVEN BY SERVICE.'}
          style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            textTransform: 'uppercase',
            color: 'var(--concrete-white)',
            marginBottom: '1rem',
          } as React.CSSProperties}
        />
        <p style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem', color: 'rgba(242,240,235,0.6)', maxWidth: 600, lineHeight: 1.7, marginBottom: '3rem' }}>
          {content['clients.intro'] ?? ''}
        </p>

        {/* Government marquee */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--amber-glow)', marginBottom: '1rem' }}>
          GOVERNMENT & DEFENCE
        </p>
        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '3rem' }}>
          {/* Fade edges */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(to right, var(--steel-blue), transparent)', zIndex: 1, pointerEvents: 'none' }} aria-hidden="true" />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(to left, var(--steel-blue), transparent)', zIndex: 1, pointerEvents: 'none' }} aria-hidden="true" />

          <div className="marquee-track" aria-label="Government clients">
            {marqueeItems.map((client, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: i % 2 === 0 ? 'var(--concrete-white)' : 'rgba(242,240,235,0.35)',
                  whiteSpace: 'nowrap',
                  padding: '0.75rem 2.5rem',
                }}
              >
                {client}
              </span>
            ))}
          </div>
        </div>

        {/* Private sector */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--amber-glow)', marginBottom: '1rem' }}>
          PRIVATE SECTOR
        </p>
        <div
          ref={chipRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}
        >
          {PRIVATE_CLIENTS.map((client, i) => (
            <div
              key={client}
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 500,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                color: 'var(--dust-gray)',
                border: '1px solid rgba(138,141,145,0.2)',
                padding: '0.75rem 1rem',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
                transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                cursor: 'default',
                opacity: chipsInView ? 1 : 0,
                transform: chipsInView ? 'none' : 'translateY(10px)',
                transitionDelay: `${i * 50}ms`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--concrete-white)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber-glow)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(212,130,10,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--dust-gray)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(138,141,145,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
