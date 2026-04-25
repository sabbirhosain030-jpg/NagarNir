'use client';

import { useState } from 'react';
import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap } from '@/lib/types';

interface ServicesSectionProps {
  content: ContentMap;
}

const SERVICES = [
  {
    id: 'rcc',
    title: 'RCC Construction',
    body: 'From foundation to finish — reinforced concrete structures for residential, commercial, and industrial projects. We\'ve completed over 40 named RCC projects.',
    tags: ['Residential', 'Commercial', 'Industrial'],
    stat: '40+', statLabel: 'RCC Projects',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="10" y="8"  width="20" height="4"  fill="var(--amber-glow)" opacity="0.9" />
        <rect x="10" y="16" width="20" height="4"  fill="var(--amber-glow)" opacity="0.7" />
        <rect x="10" y="24" width="20" height="4"  fill="var(--amber-glow)" opacity="0.5" />
        <rect x="10" y="32" width="20" height="4"  fill="var(--amber-glow)" opacity="0.3" />
        <line x1="20" y1="8" x2="20" y2="36" stroke="var(--amber-glow)" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'steel',
    title: 'Steel Construction',
    body: 'Pre-engineered and custom steel structures — industrial sheds, mezzanines, large-span warehouses. Trusted by Bangladesh Army, EPZ clients, and major manufacturers.',
    tags: ['Industrial Sheds', 'Warehouses', 'EPZ Projects'],
    stat: '9+', statLabel: 'Steel Projects',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <line x1="5" y1="35" x2="35" y2="5" stroke="var(--amber-glow)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="5"  x2="35" y2="35" stroke="var(--amber-glow)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="4" fill="none" stroke="var(--amber-glow)" strokeWidth="2" />
        <circle cx="5"  cy="5"  r="2.5" fill="var(--amber-glow)" />
        <circle cx="35" cy="5"  r="2.5" fill="var(--amber-glow)" />
        <circle cx="5"  cy="35" r="2.5" fill="var(--amber-glow)" />
        <circle cx="35" cy="35" r="2.5" fill="var(--amber-glow)" />
      </svg>
    ),
  },
  {
    id: 'consultancy',
    title: 'Design & Consultancy',
    body: 'Architectural and structural design services, from concept to working drawings. Over 9 completed consultancy-led projects in Dhaka\'s most prestigious locations.',
    tags: ['Architecture', 'Structure', 'Drawings'],
    stat: '9+', statLabel: 'Design Projects',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="8" y="6" width="24" height="28" rx="1" fill="none" stroke="var(--amber-glow)" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="28" y2="14" stroke="var(--amber-glow)" strokeWidth="1" />
        <line x1="12" y1="14" x2="22" y2="22" stroke="var(--amber-glow)" strokeWidth="1.5" />
        <line x1="22" y1="22" x2="26" y2="18" stroke="var(--amber-glow)" strokeWidth="1.5" />
        <line x1="26" y1="18" x2="28" y2="20" stroke="var(--amber-glow)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'safety',
    title: 'Safety & EHS',
    body: 'Comprehensive safety assessment of garment factories, industrial buildings, and commercial structures. Safety parks, EHS planning, and quality monitoring on every site.',
    tags: ['Assessment', 'EHS Planning', 'Quality'],
    stat: '20+', statLabel: 'Assessments Done',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 6 L34 12 L34 24 C34 31 20 38 20 38 C20 38 6 31 6 24 L6 12 Z" fill="none" stroke="var(--amber-glow)" strokeWidth="1.8" />
        <path d="M14 20 L18 24 L27 15" stroke="var(--amber-glow)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'realestate',
    title: 'Real Estate & Supply',
    body: 'Nagar Nirmata operates across real estate development, supply, and trading — delivering end-to-end solutions for both government and private sector clients.',
    tags: ['Real Estate', 'Supply Chain', 'Trading'],
    stat: '5', statLabel: 'Service Pillars',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 8 L32 18 L32 34 L8 34 L8 18 Z" fill="none" stroke="var(--amber-glow)" strokeWidth="1.8" />
        <rect x="16" y="24" width="8" height="10" fill="none" stroke="var(--amber-glow)" strokeWidth="1.2" />
        <circle cx="10" cy="12" r="2" fill="var(--amber-glow)" />
        <circle cx="20" cy="8"  r="2" fill="var(--amber-glow)" />
        <circle cx="30" cy="12" r="2" fill="var(--amber-glow)" />
        <line x1="10" y1="12" x2="20" y2="8"  stroke="var(--amber-glow)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="20" y1="8"  x2="30" y2="12" stroke="var(--amber-glow)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

export default function ServicesSection({ content }: ServicesSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="services"
      style={{ background: 'var(--iron-dark)', position: 'relative', overflow: 'hidden' }}
      aria-label="Services"
    >
      <div className="blueprint-grid-sm" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel text={content['services.section_label'] ?? '03 / WHAT WE DO'} className="mb-4" />
          <SectionRule className="mb-6" />
          <AnimatedHeadline
            text={content['services.headline'] ?? 'FIVE PILLARS OF\nCAPABILITY'}
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--concrete-white)',
            } as React.CSSProperties}
          />
        </div>

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              onMouseEnter={() => setHovered(service.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'var(--glass-tint)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: hovered === service.id
                  ? '1px solid rgba(212,130,10,0.4)'
                  : '1px solid rgba(242,240,235,0.07)',
                clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                padding: '2rem',
                position: 'relative',
                transform: inView ? (hovered === service.id ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(40px)',
                opacity: inView ? 1 : 0,
                transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms, opacity 0.6s ease ${i * 100}ms, border-color 0.3s`,
                overflow: 'hidden',
              }}
            >
              {/* Amber top border reveal */}
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'var(--amber-glow)',
                  transform: hovered === service.id ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.35s ease',
                }}
                aria-hidden="true"
              />

              <div style={{ marginBottom: '1.2rem' }}>{service.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.15rem', textTransform: 'uppercase', color: 'var(--concrete-white)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                {service.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.87rem', lineHeight: 1.75, color: 'rgba(242,240,235,0.6)', marginBottom: '1.2rem' }}>
                {service.body}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {service.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--dust-gray)', border: '1px solid rgba(138,141,145,0.3)', padding: '0.25rem 0.5rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(242,240,235,0.06)', paddingTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'var(--amber-glow)' }}>{service.stat}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.12em' }}>{service.statLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
