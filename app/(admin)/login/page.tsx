'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      router.push('/admin');
      router.refresh();
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(242,240,235,0.12)',
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    color: 'var(--concrete-white)',
    fontFamily: 'var(--font-lora)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--iron-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blueprint grid */}
      <div className="blueprint-grid" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} aria-hidden="true" />

      {/* Amber corner triangle */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 120px 120px 0',
          borderColor: `transparent var(--amber-glow) transparent transparent`,
          opacity: 0.08,
        }}
      />

      {/* Login card */}
      <div
        style={{
          background: 'var(--glass-tint)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(242,240,235,0.1)',
          clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
          width: '100%',
          maxWidth: 420,
          padding: '3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-label="Nagar Nirmata logo" style={{ marginBottom: '1rem' }}>
            <text x="4" y="48" fontFamily="var(--font-bebas)" fontSize="50" fill="var(--amber-glow)">NN</text>
            <line x1="0" y1="53" x2="56" y2="53" stroke="var(--amber-glow)" strokeWidth="2" />
          </svg>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--amber-glow)', marginBottom: '0.4rem' }}>
            ADMIN ACCESS
          </p>
          <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>
            NAGAR NIRMATA LTD
          </h1>
        </div>

        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dust-gray)', pointerEvents: 'none' }} />
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dust-gray)', pointerEvents: 'none' }} />
            <input
              type={showPass ? 'text' : 'password'}
              id="admin-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ ...inputStyle, paddingRight: '2.75rem' }}
              onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--dust-gray)', padding: 0 }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.12)', border: '1px solid var(--rebar-red)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--rebar-red)' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            id="admin-login-submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: loading ? 'rgba(212,130,10,0.5)' : 'var(--amber-glow)',
              color: 'var(--iron-dark)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              border: 'none',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
