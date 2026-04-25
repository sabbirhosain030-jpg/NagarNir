import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'steel';
  cornerCut?: boolean;
  amberBorder?: 'left' | 'top' | 'none';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  cornerCut = true,
  amberBorder = 'none',
  style,
  onClick,
}: GlassPanelProps) {
  const variantClass = {
    default: 'glass',
    dark: 'glass-dark',
    steel: '',
  }[variant];

  const steelStyle: React.CSSProperties =
    variant === 'steel'
      ? {
          background: 'rgba(26,43,60,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(242,240,235,0.08)',
        }
      : {};

  const borderStyle: React.CSSProperties =
    amberBorder === 'left'
      ? { borderLeft: '3px solid var(--amber-glow)' }
      : amberBorder === 'top'
      ? { borderTop: '2px solid var(--amber-glow)' }
      : {};

  return (
    <div
      className={`${variantClass} ${cornerCut ? 'corner-cut' : ''} ${className}`}
      style={{ ...steelStyle, ...borderStyle, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
