'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save } from 'lucide-react';
import type { SiteContent } from '@/lib/types';

const SECTIONS = [
  'nav', 'hero', 'about', 'stats', 'services', 'projects', 'upcoming',
  'clients', 'team', 'safety', 'contact', 'footer', 'global'
];

function ContentRow({ item }: { item: SiteContent }) {
  const [value, setValue] = useState(item.value);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const supabase = createClient();

  const isTextarea = value.length > 80 || item.key.includes('body') || item.key.includes('message');

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    const { error } = await supabase
      .from('site_content')
      .update({ value })
      .eq('key', item.key);

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    }
    setSaving(false);
  };

  const borderColor = status === 'success' ? '#27ae60' : status === 'error' ? 'var(--rebar-red)' : 'rgba(242,240,235,0.12)';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${borderColor}`,
      padding: '1.2rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      transition: 'border-color 0.3s'
    }}>
      <div style={{ flex: 1 }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'var(--dust-gray)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase'
        }}>
          {item.label || item.key} <span style={{ opacity: 0.5 }}>({item.key})</span>
        </label>
        {isTextarea ? (
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            className="admin-input"
            rows={4}
            style={{ resize: 'vertical' }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="admin-input"
          />
        )}
      </div>
      <button
        onClick={handleSave}
        disabled={saving || value === item.value}
        style={{
          marginTop: '1.4rem',
          padding: '0.6rem 1rem',
          background: value !== item.value ? 'var(--amber-glow)' : 'rgba(255,255,255,0.05)',
          color: value !== item.value ? 'var(--iron-dark)' : 'var(--dust-gray)',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: saving || value === item.value ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s'
        }}
      >
        <Save size={14} />
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

export default function ContentEditorPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').order('section').order('key');
      if (data) setContent(data as SiteContent[]);
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) return <div style={{ color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)' }}>Loading content...</div>;

  const grouped = SECTIONS.reduce((acc, sec) => {
    acc[sec] = content.filter(c => c.section === sec);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  // Add any unmapped sections
  const unmapped = content.filter(c => !SECTIONS.includes(c.section || ''));
  if (unmapped.length > 0) grouped['other'] = unmapped;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          CONTENT MANAGEMENT
        </p>
        <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)', letterSpacing: '0.06em' }}>
          Site Content
        </h1>
        <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.85rem', color: 'var(--dust-gray)', marginTop: '0.5rem' }}>
          Update text across the site. Changes apply instantly.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {Object.entries(grouped).map(([section, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={section}>
              <h2 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                color: 'var(--amber-glow)',
                borderBottom: '1px solid rgba(212,130,10,0.3)',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}>
                {section} Section
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map(item => (
                  <ContentRow key={item.key} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
