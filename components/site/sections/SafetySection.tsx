'use client';

import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import GlassPanel from '@/components/site/ui/GlassPanel';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap } from '@/lib/types';

interface SafetySectionProps {
  content: ContentMap;
}

const PILLARS = [
  {
    num: '01',
    titleKey: 'safety.block1_title',
    bodyKey: 'safety.block1_body',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 4 L34 10 L34 24 C34 32 20 38 20 38 C20 38 6 32 6 24 L6 10 Z" fill="none" stroke="var(--amber-glow)" strokeWidth="1.8" />
        <ellipse cx="20" cy="16" rx="5" ry="3" fill="none" stroke="var(--amber-glow)" strokeWidth="1.4" />
        <line x1="20" y1="19" x2="20" y2="28" stroke="var(--amber-glow)" strokeWidth="1.4" />
        <line x1="15" y1="23" x2="25" y2="23" stroke="var(--amber-glow)" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    num: '02',
    titleKey: 'safety.block2_title',
    bodyKey: 'safety.block2_body',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="8" y="6" width="24" height="28" rx="1" fill="none" stroke="var(--amber-glow)" strokeWidth="1.6" />
        <line x1="13" y1="13" x2="27" y2="13" stroke="var(--amber-glow)" strokeWidth="1.2" />
        <line x1="13" y1="18" x2="27" y2="18" stroke="var(--amber-glow)" strokeWidth="1.2" />
        <line x1="13" y1="23" x2="22" y2="23" stroke="var(--amber-glow)" strokeWidth="1.2" />
        <path d="M13 28 L17 25 L21 29 L26 22" stroke="var(--amber-glow)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '03',
    titleKey: 'safety.block3_title',
    bodyKey: 'safety.block3_body',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="6"  y="28" width="6"  height="8"  fill="none" stroke="var(--amber-glow)" strokeWidth="1.4" />
        <rect x="17" y="20" width="6"  height="16" fill="none" stroke="var(--amber-glow)" strokeWidth="1.4" />
        <rect x="28" y="12" width="6"  height="24" fill="none" stroke="var(--amber-glow)" strokeWidth="1.4" />
        <path d="M9 28 L20 20 L31 12" stroke="var(--amber-glow)" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="9"  cy="28" r="2" fill="var(--amber-glow)" />
        <circle cx="20" cy="20" r="2" fill="var(--amber-glow)" />
        <circle cx="31" cy="12" r="2" fill="var(--amber-glow)" />
      </svg>
    ),
  },
];

export default function SafetySection({ content }: SafetySectionProps) {
  const [bannerRef, bannerInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id="safety"
      style={{ background: 'var(--steel-blue)', position: 'relative', overflow: 'hidden' }}
      aria-label="Safety and quality"
    >
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel text={content['safety.section_label'] ?? '08 / SAFETY & QUALITY'} className="mb-4" />
          <SectionRule className="mb-6" />
          <AnimatedHeadline
            text={content['safety.headline'] ?? 'BUILDING SAFE.\nBUILDING SMART.'}
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--concrete-white)',
            } as React.CSSProperties}
          />
        </div>

        {/* Pillar cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {PILLARS.map((pillar, i) => {
            const [cardRef, cardInView] = useInView<HTMLDivElement>({ threshold: 0.2 });
            return (
              <div
                key={pillar.num}
                ref={cardRef}
                style={{
                  background: 'var(--glass-tint)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(242,240,235,0.08)',
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: cardInView ? 1 : 0,
                  transform: cardInView ? 'none' : 'translateY(30px)',
                  transition: `opacity 0.7s ease ${i * 150}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
                }}
              >
                {/* Watermark number */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-0.1em', right: '0.1em',
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '5rem',
                    color: 'rgba(242,240,235,0.05)',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {pillar.num}
                </div>

                <div style={{ marginBottom: '1.2rem' }}>{pillar.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-barlow)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  color: 'var(--amber-glow)',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                }}>
                  {content[pillar.titleKey] ?? ''}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: '0.88rem',
                  lineHeight: 1.75,
                  color: 'rgba(242,240,235,0.65)',
                }}>
                  {content[pillar.bodyKey] ?? ''}
                </p>
              </div>
            );
          })}
        </div>

        {/* Garment assessment banner */}
        <div
          ref={bannerRef}
          style={{
            background: 'var(--glass-tint)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(242,240,235,0.08)',
            clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
            padding: '2.5rem 3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            opacity: bannerInView ? 1 : 0,
            transform: bannerInView ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '5rem', color: 'var(--amber-glow)', lineHeight: 1 }}>20+</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.18em', marginTop: '0.3rem' }}>
              SAFETY ASSESSMENTS COMPLETED
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem', color: 'rgba(242,240,235,0.7)', lineHeight: 1.7 }}>
              Garment factories, industrial buildings, and commercial structures assessed across Bangladesh under our comprehensive EHS framework.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
