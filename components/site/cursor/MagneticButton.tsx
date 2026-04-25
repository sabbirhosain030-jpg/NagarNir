'use client';

import { motion } from 'framer-motion';
import { useMagneticEffect } from '@/lib/hooks/useMagneticEffect';
import React from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled,
  id,
  style,
}: MagneticButtonProps) {
  const { buttonRef, springX, springY, textSpringX, textSpringY, handleMouseMove, handleMouseLeave } =
    useMagneticEffect();

  if (href) {
    return (
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        id={id}
        className={`magnetic ${className}`}
        style={{ ...style, x: springX, y: springY, display: 'inline-block' }}
        onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        onMouseLeave={handleMouseLeave}
      >
        <motion.span style={{ x: textSpringX, y: textSpringY, display: 'block' }}>
          {children}
        </motion.span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      id={id}
      disabled={disabled}
      className={`magnetic ${className}`}
      style={{ ...style, x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLButtonElement>}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span style={{ x: textSpringX, y: textSpringY, display: 'block' }}>
        {children}
      </motion.span>
    </motion.button>
  );
}
