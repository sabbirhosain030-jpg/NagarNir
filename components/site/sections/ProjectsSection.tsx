'use client';

import { useState } from 'react';
import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import BlueprintCard from '@/components/site/ui/BlueprintCard';
import { useProjects } from '@/lib/hooks/useSupabase';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap, ProjectType } from '@/lib/types';

interface ProjectsSectionProps {
  content: ContentMap;
}

type FilterType = 'all' | ProjectType;

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',            value: 'all' },
  { label: 'RCC',            value: 'rcc' },
  { label: 'Steel',          value: 'steel' },
  { label: 'Consultancy',    value: 'consultancy' },
  { label: 'Infrastructure', value: 'infra' },
];

export default function ProjectsSection({ content }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { projects: allProjects, loading } = useProjects();
  const { projects: upcomingProjects } = useProjects('upcoming');
  const [rowRef, rowsInView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  const completed = allProjects.filter(p => p.type !== 'upcoming');
  const filtered = activeFilter === 'all'
    ? completed
    : completed.filter(p => p.type === activeFilter);

  const pipelineTotal = upcomingProjects.reduce((sum, p) => sum + (p.value_crore ?? 0), 0);

  return (
    <section
      id="projects"
      style={{ background: 'var(--iron-dark)', position: 'relative' }}
      aria-label="Projects portfolio"
    >
      <div className="blueprint-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel text={content['projects.section_label'] ?? '04 / OUR PROJECTS'} className="mb-4" />
          <SectionRule className="mb-6" />
          <AnimatedHeadline
            text={content['projects.headline'] ?? 'BUILT ACROSS\nBANGLADESH'}
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--concrete-white)',
              marginBottom: '1rem',
            } as React.CSSProperties}
          />
          <p style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem', color: 'rgba(242,240,235,0.6)', maxWidth: 600, lineHeight: 1.7 }}>
            {content['projects.intro'] ?? ''}
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
          role="tablist"
          aria-label="Project type filter"
        >
          {FILTERS.map(filter => (
            <button
              key={filter.value}
              role="tab"
              aria-selected={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.5rem 1.2rem',
                border: activeFilter === filter.value
                  ? 'none'
                  : '1px solid rgba(138,141,145,0.3)',
                background: activeFilter === filter.value
                  ? 'var(--amber-glow)'
                  : 'transparent',
                color: activeFilter === filter.value
                  ? 'var(--iron-dark)'
                  : 'var(--dust-gray)',
                clipPath: activeFilter === filter.value
                  ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)'
                  : 'none',
                transition: 'all 0.2s ease',
                fontWeight: activeFilter === filter.value ? 700 : 400,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Project grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton corner-cut" style={{ aspectRatio: '4/3' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {filtered.map(project => (
              <BlueprintCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Upcoming projects */}
        <div id="upcoming" style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <SectionLabel text={content['upcoming.section_label'] ?? '05 / UPCOMING PROJECTS'} className="mb-4" />
            <SectionRule className="mb-6" />
            <AnimatedHeadline
              text={content['upcoming.headline'] ?? 'THE NEXT CHAPTER'}
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                textTransform: 'uppercase',
                color: 'var(--concrete-white)',
                marginBottom: '0.75rem',
              } as React.CSSProperties}
            />
            <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem', color: 'rgba(242,240,235,0.6)', maxWidth: 600, lineHeight: 1.7 }}>
              {content['upcoming.intro'] ?? ''}
            </p>
          </div>

          <div ref={rowRef}>
            {upcomingProjects.map((project, i) => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.2rem 1.5rem',
                  borderLeft: '3px solid var(--amber-glow)',
                  background: 'rgba(26,43,60,0.4)',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  opacity: rowsInView ? 1 : 0,
                  transform: rowsInView ? 'none' : 'translateX(-20px)',
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber-glow)', minWidth: 24 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--concrete-white)' }}>
                    {project.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', marginTop: '0.2rem' }}>
                    {[project.client, project.location].filter(Boolean).join(' · ')}
                  </p>
                </div>
                {project.value_crore && (
                  <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: 'var(--amber-glow)' }}>
                    ৳ {project.value_crore} Cr
                  </span>
                )}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--amber-glow)', border: '1px solid var(--amber-glow)',
                  padding: '0.2rem 0.6rem',
                }}>
                  Upcoming
                </span>
              </div>
            ))}
          </div>

          {/* Pipeline total */}
          {pipelineTotal > 0 && (
            <div
              style={{
                marginTop: '2rem',
                background: 'rgba(212,130,10,0.08)',
                border: '1px solid rgba(212,130,10,0.3)',
                clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                padding: '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: 'var(--amber-glow)', lineHeight: 1 }}>
                  ৳ {pipelineTotal.toFixed(2)} Cr
                </span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.15em', marginTop: '0.3rem' }}>
                  TOTAL PIPELINE VALUE
                </p>
              </div>
              <div style={{ width: 1, height: 50, background: 'rgba(212,130,10,0.3)' }} aria-hidden="true" />
              <div>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: 'var(--amber-glow)', lineHeight: 1 }}>
                  {upcomingProjects.length}
                </span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.15em', marginTop: '0.3rem' }}>
                  PROJECTS IN PIPELINE
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
