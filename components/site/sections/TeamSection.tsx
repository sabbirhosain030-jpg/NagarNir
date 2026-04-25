'use client';

import { CldImage } from 'next-cloudinary';
import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import { useTeam } from '@/lib/hooks/useSupabase';
import { useInView } from '@/lib/hooks/useInView';
import type { ContentMap, TeamMember, TeamCategory } from '@/lib/types';

interface TeamSectionProps {
  content: ContentMap;
}

const CATEGORIES: { key: TeamCategory; label: string }[] = [
  { key: 'board',        label: 'Board of Directors' },
  { key: 'technical',    label: 'Key Technical Team' },
  { key: 'architecture', label: 'Architecture Team' },
];

function getInitials(name: string) {
  return name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).join('');
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <article
      ref={ref}
      style={{
        background: 'var(--glass-tint)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(242,240,235,0.07)',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
        padding: '1.5rem',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 70}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 70}ms`,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = inView ? 'none' : 'translateY(20px)'; }}
    >
      {/* Photo or initials */}
      <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '2px solid rgba(212,130,10,0.4)', flexShrink: 0 }}>
        {member.photo_url ? (
          <CldImage
            src={member.photo_url}
            alt={member.name}
            width={56}
            height={56}
            crop="fill"
            gravity="face"
            quality="auto"
            format="auto"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'var(--blueprint-line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: 'var(--concrete-white)',
          }}>
            {getInitials(member.name)}
          </div>
        )}
      </div>

      <h3 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--concrete-white)', marginBottom: '0.3rem', lineHeight: 1.2 }}>
        {member.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        {member.title}
      </p>
      {member.qualifications && (
        <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.78rem', color: 'var(--dust-gray)', lineHeight: 1.5 }}>
          {member.qualifications}
        </p>
      )}
    </article>
  );
}

function CategoryGroup({ category, label }: { category: TeamCategory; label: string }) {
  const { team, loading } = useTeam(category);
  const [headerRef, headerInView] = useInView<HTMLDivElement>();

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      {/* Group header */}
      <div
        ref={headerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          opacity: headerInView ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <div style={{ height: 1, width: 32, background: 'var(--amber-glow)' }} aria-hidden="true" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-glow)' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,130,10,0.2)' }} aria-hidden="true" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)' }}>
          {team.length} members
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton corner-cut" style={{ height: 180 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamSection({ content }: TeamSectionProps) {
  return (
    <section
      id="team"
      style={{ background: 'var(--iron-dark)', position: 'relative' }}
      aria-label="Leadership and team"
    >
      <div className="blueprint-grid-sm" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel text={content['team.section_label'] ?? '07 / LEADERSHIP'} className="mb-4" />
          <SectionRule className="mb-6" />
          <AnimatedHeadline
            text={content['team.headline'] ?? 'THE MINDS BEHIND\nTHE STRUCTURES'}
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--concrete-white)',
            } as React.CSSProperties}
          />
        </div>

        {CATEGORIES.map(cat => (
          <CategoryGroup key={cat.key} category={cat.key} label={cat.label} />
        ))}
      </div>
    </section>
  );
}
