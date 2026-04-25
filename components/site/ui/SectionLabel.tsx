'use client';

import { useInView } from '@/lib/hooks/useInView';

interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = '' }: SectionLabelProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`font-mono text-xs tracking-widest uppercase ${className}`}
      style={{
        color: 'var(--amber-glow)',
        transform: inView ? 'none' : 'translateX(-20px)',
        opacity: inView ? 1 : 0,
        transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
        letterSpacing: '0.18em',
      }}
    >
      {text}
    </div>
  );
}
