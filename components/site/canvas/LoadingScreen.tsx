'use client';

import { useEffect, useRef, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Phase sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase(1), 100));   // grid draws
    timers.push(setTimeout(() => setPhase(2), 400));   // logo
    timers.push(setTimeout(() => setPhase(3), 600));   // headline
    timers.push(setTimeout(() => setPhase(4), 800));   // tagline
    timers.push(setTimeout(() => setPhase(5), 1000));  // progress bar

    // Progress animation 1000 → 2800ms
    timers.push(setTimeout(() => {
      const start = performance.now();
      const duration = 1800;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 1000));

    // Exit
    timers.push(setTimeout(() => setExiting(true), 3000));
    timers.push(setTimeout(() => onComplete(), 3700));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const GRID_H = 15;
  const GRID_V = 21;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'var(--iron-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        transition: exiting ? 'transform 0.7s cubic-bezier(0.77,0,0.18,1)' : 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Blueprint grid */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {Array.from({ length: GRID_H }).map((_, i) => {
          const y = ((i + 1) / (GRID_H + 1)) * 100;
          const delay = i * 50;
          return (
            <line
              key={`h${i}`}
              x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
              stroke="var(--blueprint-line)"
              strokeWidth="0.15"
              style={{
                opacity: phase >= 1 ? 1 : 0,
                transition: `opacity 0.4s ease ${delay}ms`,
              }}
            />
          );
        })}
        {Array.from({ length: GRID_V }).map((_, i) => {
          const x = ((i + 1) / (GRID_V + 1)) * 100;
          const delay = 200 + i * 30;
          return (
            <line
              key={`v${i}`}
              x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
              stroke="var(--blueprint-line)"
              strokeWidth="0.15"
              style={{
                opacity: phase >= 1 ? 1 : 0,
                transition: `opacity 0.4s ease ${delay}ms`,
              }}
            />
          );
        })}

        {/* Centre crosshair */}
        <line x1="48%" y1="46%" x2="52%" y2="46%" stroke="var(--amber-glow)" strokeWidth="0.3"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }} />
        <line x1="48%" y1="54%" x2="52%" y2="54%" stroke="var(--amber-glow)" strokeWidth="0.3"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }} />
        <line x1="46%" y1="48%" x2="46%" y2="52%" stroke="var(--amber-glow)" strokeWidth="0.3"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }} />
        <line x1="54%" y1="48%" x2="54%" y2="52%" stroke="var(--amber-glow)" strokeWidth="0.3"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }} />
        <circle cx="50%" cy="50%" r="3%" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.2"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }} />
      </svg>

      {/* NN Monogram */}
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          marginBottom: '1rem',
        }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-label="NN monogram">
          <text x="4" y="58" fontFamily="var(--font-bebas)" fontSize="60" fill="var(--amber-glow)">NN</text>
          <line x1="0" y1="66" x2="72" y2="66" stroke="var(--amber-glow)" strokeWidth="2" />
        </svg>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-barlow)',
          fontWeight: 700,
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--concrete-white)',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}
      >
        NAGAR NIRMATA
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--amber-glow)',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          marginBottom: '2.5rem',
        }}
      >
        A Complete Commitment
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: 240,
          height: 2,
          background: 'rgba(242,240,235,0.08)',
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: `${progress}%`,
            background: 'var(--amber-glow)',
            boxShadow: '0 0 12px var(--amber-glow)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Progress percent */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        color: 'var(--dust-gray)',
        marginTop: '0.6rem',
        opacity: phase >= 5 ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {progress}%
      </p>
    </div>
  );
}
