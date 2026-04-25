'use client';

import { useEffect, useRef, useState } from 'react';

export default function CrosshairCursor() {
  const crosshairRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const el = e.target as HTMLElement;
      const interactive =
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button') ||
        el.getAttribute('role') === 'button' ||
        el.classList.contains('magnetic');
      setIsHovering(!!interactive);
    };

    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const tick = () => {
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate(${mousePos.current.x - 6}px, ${mousePos.current.y - 6}px)`;
      }

      const lerp = 0.12;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Crosshair */}
      <div
        ref={crosshairRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ width: 12, height: 12 }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <line x1="6" y1="0" x2="6" y2="4" stroke="var(--amber-glow)" strokeWidth="1.5" style={{ transition: 'opacity 0.1s' }} />
          <line x1="6" y1="8" x2="6" y2="12" stroke="var(--amber-glow)" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="4" y2="6" stroke="var(--amber-glow)" strokeWidth="1.5" />
          <line x1="8" y1="6" x2="12" y2="6" stroke="var(--amber-glow)" strokeWidth="1.5" />
          <circle
            cx="6" cy="6"
            r={isClicking ? 1 : 1.5}
            fill="var(--amber-glow)"
            style={{ transition: 'r 0.1s' }}
          />
        </svg>
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ width: 40, height: 40, transition: 'opacity 0.3s' }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          style={{ overflow: 'visible' }}
        >
          <circle
            cx="20" cy="20"
            r={isHovering ? 17 : 14}
            stroke="var(--amber-glow)"
            strokeWidth={isHovering ? 1.5 : 1}
            strokeDasharray={isHovering ? '4 2' : '3 3'}
            fill={isHovering ? 'rgba(212,130,10,0.06)' : 'none'}
            style={{ transition: 'r 0.25s, stroke-width 0.2s, fill 0.2s' }}
          />
          {isHovering && (
            <>
              <line x1="12" y1="3"  x2="12" y2="8"  stroke="var(--amber-glow)" strokeWidth="1.5" />
              <line x1="3"  y1="12" x2="8"  y2="12" stroke="var(--amber-glow)" strokeWidth="1.5" />
              <line x1="28" y1="3"  x2="28" y2="8"  stroke="var(--amber-glow)" strokeWidth="1.5" />
              <line x1="32" y1="12" x2="37" y2="12" stroke="var(--amber-glow)" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </div>
    </>
  );
}
