'use client';

import { useState, useEffect, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import { useInView } from '@/lib/hooks/useInView';
import type { Project } from '@/lib/types';

interface BlueprintCardProps {
  project: Project;
}

const TYPE_COLORS: Record<string, string> = {
  rcc:         'var(--blueprint-line)',
  steel:       'var(--amber-glow)',
  consultancy: 'var(--dust-gray)',
  infra:       'var(--rebar-red)',
  upcoming:    'var(--amber-glow)',
};

const TYPE_LABELS: Record<string, string> = {
  rcc:         'RCC',
  steel:       'Steel',
  consultancy: 'Consultancy',
  infra:       'Infrastructure',
  upcoming:    'Upcoming',
};

export default function BlueprintCard({ project }: BlueprintCardProps) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();

  const hasImage = !!project.image_url;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '4/3',
        position: 'relative',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
        border: hovered
          ? '1px solid rgba(212,130,10,0.4)'
          : '1px solid rgba(242,240,235,0.06)',
        transform: inView
          ? (hovered ? 'translateY(-4px)' : 'translateY(0)')
          : 'translateY(40px)',
        opacity: inView ? 1 : 0,
        transition:
          'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, border-color 0.3s',
        background: 'var(--steel-blue)',
        cursor: 'pointer',
      }}
    >
      {/* Blueprint overlay */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: hovered && hasImage ? 0 : 1,
          transition: 'opacity 0.45s ease',
          background: 'var(--steel-blue)',
        }}
      >
        {/* Blueprint grid lines */}
        <svg
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.25 }}
          aria-hidden="true"
        >
          {[20, 40, 60, 80].map(p => (
            <React.Fragment key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="var(--blueprint-line)" strokeWidth="1" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="var(--blueprint-line)" strokeWidth="1" />
            </React.Fragment>
          ))}
        </svg>

        {/* Building wireframe */}
        <svg
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <rect x="140" y="60"  width="120" height="180" fill="none" stroke="var(--blueprint-line)" strokeWidth="1.5" />
          <rect x="155" y="80"  width="30"  height="40"  fill="none" stroke="var(--blueprint-line)" strokeWidth="1" />
          <rect x="215" y="80"  width="30"  height="40"  fill="none" stroke="var(--blueprint-line)" strokeWidth="1" />
          <rect x="155" y="140" width="30"  height="40"  fill="none" stroke="var(--blueprint-line)" strokeWidth="1" />
          <rect x="215" y="140" width="30"  height="40"  fill="none" stroke="var(--blueprint-line)" strokeWidth="1" />
          <rect x="170" y="200" width="60"  height="40"  fill="none" stroke="var(--blueprint-line)" strokeWidth="1" />
          <line x1="140" y1="60" x2="200" y2="20" stroke="var(--blueprint-line)" strokeWidth="1" />
          <line x1="260" y1="60" x2="200" y2="20" stroke="var(--blueprint-line)" strokeWidth="1" />
        </svg>

        {/* Card info */}
        <div style={{ position: 'absolute', inset: 0, padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Type badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.6rem',
              background: 'rgba(13,15,18,0.8)',
              color: TYPE_COLORS[project.type] ?? 'var(--dust-gray)',
              border: `1px solid ${TYPE_COLORS[project.type] ?? 'var(--dust-gray)'}`,
            }}>
              {TYPE_LABELS[project.type] ?? project.type}
            </span>
          </div>

          {/* Bottom info */}
          <div>
            {project.client && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', marginBottom: '0.3rem', letterSpacing: '0.08em' }}>
                {project.client}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1rem', color: 'var(--concrete-white)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              {project.title}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.location && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--dust-gray)' }}>
                  📍 {project.location}
                </span>
              )}
              {project.value_crore && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--amber-glow)' }}>
                  ৳ {project.value_crore} Cr
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo overlay on hover */}
      {hasImage && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        >
          <CldImage
            src={project.image_url!}
            alt={project.title}
            fill
            crop="fill"
            quality="auto"
            format="auto"
            style={{ objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(13,15,18,0.95) 0%, rgba(13,15,18,0.4) 50%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', right: '1.2rem' }}>
            <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--concrete-white)', marginBottom: '0.4rem' }}>
              {project.title}
            </p>
            {project.value_crore && (
              <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--amber-glow)', marginBottom: '0.5rem' }}>
                ৳ {project.value_crore} Crore
              </p>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--amber-glow)', letterSpacing: '0.12em' }}>
              VIEW PROJECT →
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Need React for JSX fragments
import React from 'react';
