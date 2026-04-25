'use client';

import SectionLabel from '@/components/site/ui/SectionLabel';
import StatCounter from '@/components/site/ui/StatCounter';
import type { ContentMap } from '@/lib/types';

interface StatsSectionProps {
  content: ContentMap;
}

const STAT_KEYS = [
  { num: 'stats.stat1_number', label: 'stats.stat1_label' },
  { num: 'stats.stat2_number', label: 'stats.stat2_label' },
  { num: 'stats.stat3_number', label: 'stats.stat3_label' },
  { num: 'stats.stat4_number', label: 'stats.stat4_label' },
  { num: 'stats.stat5_number', label: 'stats.stat5_label' },
];

export default function StatsSection({ content }: StatsSectionProps) {
  return (
    <section
      id="stats"
      className="amber-top-edge"
      style={{ background: 'var(--steel-blue)', position: 'relative', overflow: 'hidden' }}
      aria-label="Company statistics"
    >
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel
          text={content['stats.section_label'] ?? '02 / BY THE NUMBERS'}
          className="mb-10"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
        }}>
          {STAT_KEYS.map(({ num, label }, i) => (
            <StatCounter
              key={num}
              value={content[num] ?? '0'}
              label={content[label] ?? ''}
              delay={i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
