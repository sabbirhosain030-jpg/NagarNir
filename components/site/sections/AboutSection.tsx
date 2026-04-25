'use client';

import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import GlassPanel from '@/components/site/ui/GlassPanel';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap } from '@/lib/types';

interface AboutSectionProps {
  content: ContentMap;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const [bodyRef, bodyInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [quoteRef, quoteInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  const col1 = content['about.body_col1'] ?? '';
  const col2 = content['about.body_col2'] ?? '';

  const col1Paras = col1.split('\n\n').filter(Boolean);
  const col2Paras = col2.split('\n\n').filter(Boolean);

  return (
    <section
      id="about"
      style={{
        background: 'var(--iron-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="About Nagar Nirmata"
    >
      {/* Blueprint grid */}
      <div className="blueprint-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      {/* Watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '-0.02em',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-bebas)',
          fontSize: '15vw',
          color: 'var(--blueprint-line)',
          opacity: 0.05,
          userSelect: 'none',
          lineHeight: 1,
          pointerEvents: 'none',
        }}
      >
        01
      </div>

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(480px, 100%), 1fr))',
          gap: '4rem',
        }}>
          {/* Left column */}
          <div>
            <SectionLabel
              text={content['about.section_label'] ?? '01 / WHO WE ARE'}
              className="mb-4"
            />
            <SectionRule className="mb-6" />
            <AnimatedHeadline
              text={content['about.headline'] ?? 'A MULTIDIMENSIONAL\nENGINEERING LEGACY'}
              className="font-heading font-bold mb-6"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.01em',
                lineHeight: 1.05,
                color: 'var(--concrete-white)',
                textTransform: 'uppercase',
              } as React.CSSProperties}
            />

            <div ref={bodyRef}>
              {col1Paras.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-lora)',
                    fontSize: '1.02rem',
                    lineHeight: 1.8,
                    color: 'rgba(242,240,235,0.7)',
                    marginBottom: '1.2rem',
                    opacity: bodyInView ? 1 : 0,
                    transform: bodyInView ? 'none' : 'translateY(10px)',
                    transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={{ marginTop: '5rem' }}>
              {col2Paras.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-lora)',
                    fontSize: '1.02rem',
                    lineHeight: 1.8,
                    color: 'rgba(242,240,235,0.7)',
                    marginBottom: '1.2rem',
                    opacity: bodyInView ? 1 : 0,
                    transform: bodyInView ? 'none' : 'translateY(10px)',
                    transition: `opacity 0.6s ease ${(i + 2) * 150}ms, transform 0.6s ease ${(i + 2) * 150}ms`,
                  }}
                >
                  {para}
                </p>
              ))}

              {/* Pull quote */}
              <div ref={quoteRef}>
                <GlassPanel
                  amberBorder="left"
                  cornerCut={false}
                  style={{
                    padding: '1.5rem 1.5rem 1.5rem 1.8rem',
                    marginBottom: '1.5rem',
                    opacity: quoteInView ? 1 : 0,
                    transform: quoteInView ? 'none' : 'translateX(20px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-barlow)',
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--concrete-white)',
                    lineHeight: 1.6,
                  }}>
                    "{content['about.pull_quote'] ?? 'More than 150 buildings completed across Bangladesh.'}"
                  </p>
                </GlassPanel>
              </div>

              {/* Core values */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Skill', 'Sincerity', 'Commitment'].map(v => (
                  <span
                    key={v}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--amber-glow)',
                      border: '1px solid var(--amber-glow)',
                      background: 'rgba(212,130,10,0.06)',
                      padding: '0.4rem 0.9rem',
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motto banner */}
        <div
          style={{
            marginTop: '5rem',
            background: 'var(--steel-blue)',
            padding: '2.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.18em', marginBottom: '0.4rem' }}>
              OUR MOTTO
            </p>
            <p style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
              color: 'var(--amber-glow)',
              letterSpacing: '0.08em',
            }}>
              {content['global.motto'] ?? 'ALWAYS FOR YOUR SATISFACTION'}
            </p>
          </div>
          <div style={{ width: 1, height: 60, background: 'rgba(242,240,235,0.1)' }} aria-hidden="true" />
          <p style={{
            fontFamily: 'var(--font-lora)',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'rgba(242,240,235,0.6)',
          }}>
            {content['global.core_values'] ?? 'Skill · Sincerity · Commitment'}
          </p>
        </div>
      </div>
    </section>
  );
}
