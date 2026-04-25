'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, FolderOpen, Users, Palette, Layers, LogOut, ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/admin',           icon: LayoutDashboard },
  { label: 'Content Editor',  href: '/admin/content',   icon: FileText },
  { label: 'Projects',        href: '/admin/projects',  icon: FolderOpen },
  { label: 'Team Members',    href: '/admin/team',      icon: Users },
  { label: 'Theme Studio',    href: '/admin/theme',     icon: Palette },
  { label: 'Section Manager', href: '/admin/sections',  icon: Layers },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: '#111317',
        borderRight: '1px solid rgba(242,240,235,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
      aria-label="Admin sidebar"
    >
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(242,240,235,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <text x="2" y="26" fontFamily="var(--font-bebas)" fontSize="26" fill="var(--amber-glow)">NN</text>
            <line x1="0" y1="30" x2="32" y2="30" stroke="var(--amber-glow)" strokeWidth="1.5" />
          </svg>
          <div>
            <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--concrete-white)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Nagar Nirmata
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--amber-glow)', letterSpacing: '0.16em' }}>
              ADMIN PANEL
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }} aria-label="Admin navigation">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive ? 'var(--amber-glow)' : 'var(--dust-gray)',
                background: isActive ? 'rgba(212,130,10,0.1)' : 'transparent',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s, background 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--amber-glow)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(212,130,10,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--dust-gray)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              {isActive && (
                <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: 'var(--amber-glow)', borderRadius: '0 2px 2px 0' }} aria-hidden="true" />
              )}
              <Icon size={15} />
              {label}
            </Link>
          );
        })}

        {/* View live site */}
        <div style={{ margin: '1rem 1.5rem', height: 1, background: 'rgba(242,240,235,0.06)' }} aria-hidden="true" />
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            color: 'var(--dust-gray)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--concrete-white)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}
        >
          <ExternalLink size={15} />
          View Live Site ↗
        </Link>
      </nav>

      {/* Footer: user + sign out */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(242,240,235,0.06)' }}>
        {userEmail && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--dust-gray)', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </p>
        )}
        <button
          onClick={handleSignOut}
          id="admin-signout"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.75rem',
            background: 'transparent',
            border: '1px solid rgba(192,57,43,0.3)',
            color: 'var(--rebar-red)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--rebar-red)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(192,57,43,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,57,43,0.3)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
