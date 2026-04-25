'use client';

import { useRef, useEffect } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface SectionRuleProps {
  className?: string;
}

export default function SectionRule({ className = '' }: SectionRuleProps) {
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.3 });
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const length = line.getTotalLength?.() ?? 1000;
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = inView ? '0' : `${length}`;
    line.style.transition = inView ? 'stroke-dashoffset 1s ease' : 'none';
  }, [inView]);

  return (
    <svg
      ref={ref}
      className={`w-full ${className}`}
      height="2"
      viewBox="0 0 1000 2"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rule-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="var(--amber-glow)" stopOpacity="1" />
          <stop offset="40%"  stopColor="var(--amber-glow)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--amber-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line ref={lineRef} x1="0" y1="1" x2="1000" y2="1" stroke="url(#rule-grad)" strokeWidth="1.5" />
    </svg>
  );
}
