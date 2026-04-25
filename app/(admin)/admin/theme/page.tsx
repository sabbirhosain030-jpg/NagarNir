'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HexColorPicker } from 'react-colorful';
import { RefreshCcw } from 'lucide-react';
import type { ThemeVariable } from '@/lib/types';

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function AdminThemePage() {
  const [variables, setVariables] = useState<ThemeVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVar, setActiveVar] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    setLoading(true);
    const { data } = await supabase.from('theme').select('*').order('variable');
    if (data) setVariables(data as ThemeVariable[]);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateThemeDebounced = useCallback(
    debounce(async (variable: string, value: string) => {
      await supabase.from('theme').update({ value }).eq('variable', variable);
    }, 300),
    []
  );

  const handleColorChange = (variable: string, newValue: string) => {
    setVariables(prev => prev.map(v => v.variable === variable ? { ...v, value: newValue } : v));
    updateThemeDebounced(variable, newValue);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>DESIGN SYSTEM</p>
          <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>Theme Studio</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Editor */}
        <div>
          {loading ? (
            <p style={{ color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)' }}>Loading theme...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {variables.map(v => (
                <div key={v.variable} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(242,240,235,0.06)', padding: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--concrete-white)' }}>{v.variable}</label>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      onClick={() => setActiveVar(activeVar === v.variable ? null : v.variable)}
                      style={{
                        width: 32, height: 32, borderRadius: 4, background: v.value, cursor: 'pointer',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <input
                      type="text"
                      value={v.value}
                      onChange={e => handleColorChange(v.variable, e.target.value)}
                      style={{
                        flex: 1, background: 'transparent', border: '1px solid rgba(242,240,235,0.1)', color: 'var(--concrete-white)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.4rem 0.5rem'
                      }}
                    />
                  </div>

                  {activeVar === v.variable && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, marginTop: '0.5rem', background: '#0D0F12', border: '1px solid rgba(242,240,235,0.1)', padding: '1rem', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)' }}>Pick Color</span>
                        <button onClick={() => setActiveVar(null)} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                      </div>
                      <HexColorPicker color={v.value} onChange={color => handleColorChange(v.variable, color)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div style={{ position: 'sticky', top: '2rem', background: 'var(--iron-dark)', border: '1px solid rgba(242,240,235,0.1)', padding: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--amber-glow)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Live Preview
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Buttons */}
            <div>
              <button style={{
                background: 'var(--amber-glow)', color: 'var(--iron-dark)', border: 'none', padding: '0.75rem 1.5rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', width: '100%'
              }}>
                Primary Action
              </button>
            </div>

            {/* Card */}
            <div style={{
              background: 'var(--glass-tint)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(242,240,235,0.08)', padding: '1.5rem',
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
            }}>
              <div style={{ width: 32, height: 2, background: 'var(--amber-glow)', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--concrete-white)', marginBottom: '0.5rem' }}>
                Preview Card
              </h3>
              <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.85rem', color: 'var(--dust-gray)', lineHeight: 1.6 }}>
                This card demonstrates how the current color variables interact. Backgrounds use glass-tint, borders use subtle white transparency.
              </p>
            </div>

            {/* Typography */}
            <div>
              <p style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--amber-glow)', lineHeight: 1, marginBottom: '0.5rem' }}>
                450+
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--blueprint-line)', letterSpacing: '0.2em' }}>
                PROJECTS COMPLETED
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--rebar-red)', fontFamily: 'var(--font-barlow)', fontWeight: 600 }}>Error State</span>
              <span style={{ color: 'var(--steel-blue)', fontFamily: 'var(--font-barlow)', fontWeight: 600 }}>Brand Accent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
