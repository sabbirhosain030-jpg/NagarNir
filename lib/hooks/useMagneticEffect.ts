'use client';

import { useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

interface MagneticEffectReturn {
  buttonRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  textSpringX: MotionValue<number>;
  textSpringY: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
}

export function useMagneticEffect(): MagneticEffectReturn {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 18, mass: 0.4 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const textMouseX = useMotionValue(0);
  const textMouseY = useMotionValue(0);
  const textSpringX = useSpring(textMouseX, springConfig);
  const textSpringY = useSpring(textMouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    mouseX.set(dx);
    mouseY.set(dy);
    textMouseX.set(dx * 0.4);
    textMouseY.set(dy * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    textMouseX.set(0);
    textMouseY.set(0);
  };

  return { buttonRef, springX, springY, textSpringX, textSpringY, handleMouseMove, handleMouseLeave };
}
