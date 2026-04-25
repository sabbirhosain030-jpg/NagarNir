'use client';

import { useInView } from '@/lib/hooks/useInView';

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  staggerMs?: number;
  color?: string;
  style?: React.CSSProperties;
}

export default function AnimatedHeadline({
  text,
  className = '',
  as: Tag = 'h2',
  staggerMs = 80,
  color,
  style,
}: AnimatedHeadlineProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const lines = text.split('\n');

  return (
    <Tag ref={ref as unknown as React.Ref<HTMLHeadingElement>} className={className} style={style}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{ display: 'block', overflow: 'hidden', lineHeight: 1.1 }}
        >
          <span
            style={{
              display: 'block',
              transform: inView ? 'none' : 'translateY(60px) rotateX(6deg)',
              opacity: inView ? 1 : 0,
              transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms, opacity 0.7s ease ${i * staggerMs}ms`,
              color: color,
              perspective: '800px',
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
