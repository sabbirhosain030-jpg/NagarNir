import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Building2, FileText, FolderOpen, Users, Palette, Layers, ArrowRight } from 'lucide-react';

async function getCounts() {
  const supabase = createClient();
  const [content, projects, team, theme] = await Promise.all([
    supabase.from('site_content').select('key', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('team').select('id', { count: 'exact', head: true }),
    supabase.from('theme').select('variable', { count: 'exact', head: true }),
  ]);
  return {
    content: content.count ?? 0,
    projects: projects.count ?? 0,
    team: team.count ?? 0,
    theme: theme.count ?? 0,
  };
}

const STAT_CARDS = [
  { label: 'Content Blocks',   href: '/admin/content',  icon: FileText,    key: 'content'  },
  { label: 'Projects',         href: '/admin/projects', icon: FolderOpen,  key: 'projects' },
  { label: 'Team Members',     href: '/admin/team',     icon: Users,       key: 'team'     },
  { label: 'Theme Variables',  href: '/admin/theme',    icon: Palette,     key: 'theme'    },
];

const QUICK_ACTIONS = [
  { label: 'Edit Hero Text',   href: '/admin/content',  desc: 'Update homepage content' },
  { label: 'Add Project',      href: '/admin/projects', desc: 'Add a new portfolio item' },
  { label: 'Manage Team',      href: '/admin/team',     desc: 'Add or edit team members' },
  { label: 'Change Colors',    href: '/admin/theme',    desc: 'Live theme studio' },
  { label: 'Toggle Sections',  href: '/admin/sections', desc: 'Show/hide site sections' },
  { label: 'Preview Live Site',href: '/',               desc: 'View the public website' },
];

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          NAGAR NIRMATA LTD
        </p>
        <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)', letterSpacing: '0.06em' }}>
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {STAT_CARDS.map(({ label, href, icon: Icon, key }) => (
          <Link
            key={key}
            href={href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(242,240,235,0.07)',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                padding: '1.5rem',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,130,10,0.4)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(212,130,10,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,240,235,0.07)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <Icon size={20} style={{ color: 'var(--amber-glow)', marginBottom: '1rem' }} />
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--amber-glow)', lineHeight: 1 }}>
                {counts[key as keyof typeof counts]}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
                {label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Quick Actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {QUICK_ACTIONS.map(action => (
            <Link
              key={action.label}
              href={action.href}
              target={action.href === '/' ? '_blank' : undefined}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(242,240,235,0.06)',
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,130,10,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,240,235,0.06)';
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--concrete-white)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                    {action.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.78rem', color: 'var(--dust-gray)' }}>
                    {action.desc}
                  </p>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--amber-glow)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
