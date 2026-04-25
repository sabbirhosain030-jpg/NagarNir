'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface StatCounterProps {
  value: string; // e.g. "15+", "150+", "5"
  label: string;
  delay?: number;
}

function parseValue(raw: string): { number: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: '' };
  return { number: parseInt(match[1], 10), suffix: match[2] };
}

export default function StatCounter({ value, label, delay = 0 }: StatCounterProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const [filled, setFilled] = useState(false);
  const started = useRef(false);
  const { number, suffix } = parseValue(value);

  useEffect(() => {
    if (!inView || started.current || number === 0) return;
    started.current = true;

    const timeout = setTimeout(() => {
      setFilled(true);
      const duration = 1400;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * number));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inView, number, delay]);

  return (
    <div
      ref={ref}
      className="corner-cut"
      style={{
        background: 'var(--glass-tint)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(242,240,235,0.08)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 180,
      }}
    >
      {/* Liquid fill */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: filled ? '100%' : '0%',
          background: 'linear-gradient(to top, rgba(212,130,10,0.12), rgba(212,130,10,0.04))',
          transition: 'height 1.5s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 5vw, 5rem)',
            color: 'var(--amber-glow)',
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          {count}{suffix}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--dust-gray)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
