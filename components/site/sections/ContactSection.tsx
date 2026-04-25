'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AnimatedHeadline from '@/components/site/ui/AnimatedHeadline';
import SectionLabel from '@/components/site/ui/SectionLabel';
import SectionRule from '@/components/site/ui/SectionRule';
import GlassPanel from '@/components/site/ui/GlassPanel';
import MagneticButton from '@/components/site/cursor/MagneticButton';
import { createClient } from '@/lib/supabase/client';
import type { ContentMap } from '@/lib/types';

interface ContactSectionProps {
  content: ContentMap;
}

const schema = z.object({
  full_name:    z.string().min(2, 'Name is required'),
  organisation: z.string().optional(),
  email:        z.string().email('Valid email required'),
  phone:        z.string().optional(),
  project_type: z.string().optional(),
  message:      z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PROJECT_TYPES = [
  'RCC Building',
  'Steel Structure',
  'Architectural Design',
  'Structural Consultancy',
  'Safety Assessment',
  'Infrastructure',
  'Real Estate',
  'Other',
];

export default function ContactSection({ content }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const { error: supaError } = await supabase.from('contact_submissions').insert([data]);
    if (supaError) {
      setError('Failed to send message. Please try again or email us directly.');
    } else {
      setSubmitted(true);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(242,240,235,0.12)',
    padding: '0.75rem 1rem',
    color: 'var(--concrete-white)',
    fontFamily: 'var(--font-lora)',
    fontSize: '0.88rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.62rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--dust-gray)',
    display: 'block',
    marginBottom: '0.4rem',
  };

  return (
    <section
      id="contact"
      style={{ background: 'var(--iron-dark)', position: 'relative' }}
      aria-label="Contact us"
    >
      <div className="blueprint-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className="section-padding max-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <SectionLabel text={content['contact.section_label'] ?? '09 / CONTACT US'} className="mb-4" />
          <SectionRule className="mb-6" />
          <AnimatedHeadline
            text={content['contact.headline'] ?? "LET'S BUILD\nSOMETHING GREAT."}
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--concrete-white)',
              marginBottom: '1rem',
            } as React.CSSProperties}
          />
          <p style={{ fontFamily: 'var(--font-lora)', fontSize: '1rem', color: 'rgba(242,240,235,0.6)', maxWidth: 540, lineHeight: 1.7 }}>
            {content['contact.intro'] ?? ''}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px,100%), 1fr))', gap: '2.5rem' }}>
          {/* Office cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              {
                title: content['contact.office1_title'] ?? 'Corporate Office',
                addr:  content['contact.office1_addr']  ?? '',
                phone: content['contact.office1_phone'] ?? '',
                email: content['contact.office1_email'] ?? '',
                web:   content['contact.office1_web']   ?? '',
              },
              {
                title: content['contact.office2_title'] ?? 'Uttara Office',
                addr:  content['contact.office2_addr']  ?? '',
                phone: content['contact.office2_phone'] ?? '',
                email: '',
                web:   '',
              },
            ].map((office, i) => (
              <GlassPanel
                key={i}
                amberBorder="left"
                cornerCut={false}
                style={{ padding: '1.5rem 1.5rem 1.5rem 1.8rem' }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {office.title}
                </p>
                {office.addr && (
                  <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.88rem', color: 'var(--concrete-white)', lineHeight: 1.7, marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>
                    {office.addr}
                  </p>
                )}
                {office.phone && (
                  <div style={{ marginBottom: '0.4rem' }}>
                    {office.phone.split('\n').map((p, j) => (
                      <a key={j} href={`tel:${p.replace(/\s/g, '')}`} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s', marginBottom: '0.2rem' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                        {p}
                      </a>
                    ))}
                  </div>
                )}
                {office.email && (
                  <a href={`mailto:${office.email}`} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s', marginBottom: '0.2rem' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                    {office.email}
                  </a>
                )}
                {office.web && (
                  <a href={`https://${office.web}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                    {office.web} ↗
                  </a>
                )}
              </GlassPanel>
            ))}
          </div>

          {/* Contact form */}
          <GlassPanel style={{ padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: 'var(--amber-glow)', marginBottom: '1rem' }}>✓</div>
                <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--concrete-white)', marginBottom: '0.75rem' }}>
                  MESSAGE RECEIVED
                </p>
                <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.9rem', color: 'var(--dust-gray)', lineHeight: 1.7 }}>
                  Thank you for reaching out to Nagar Nirmata Ltd. Our team will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input {...register('full_name')} style={inputStyle} placeholder="Your name"
                      onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')} />
                    {errors.full_name && <p style={{ color: 'var(--rebar-red)', fontSize: '0.7rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Organisation</label>
                    <input {...register('organisation')} style={inputStyle} placeholder="Company name"
                      onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input {...register('email')} type="email" style={inputStyle} placeholder="your@email.com"
                      onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')} />
                    {errors.email && <p style={{ color: 'var(--rebar-red)', fontSize: '0.7rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input {...register('phone')} type="tel" style={inputStyle} placeholder="+88 01XXX XXXXXX"
                      onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')} />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Project Type</label>
                  <select {...register('project_type')} style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')}>
                    <option value="" style={{ background: '#0d0f12' }}>Select project type</option>
                    {PROJECT_TYPES.map(t => <option key={t} value={t} style={{ background: '#0d0f12' }}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Message</label>
                  <textarea {...register('message')} style={{ ...inputStyle, height: 120, resize: 'vertical' }} placeholder="Tell us about your project..."
                    onFocus={e => (e.target.style.borderColor = 'var(--amber-glow)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(242,240,235,0.12)')} />
                </div>

                {error && (
                  <div style={{ background: 'rgba(192,57,43,0.12)', border: '1px solid var(--rebar-red)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--rebar-red)' }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: isSubmitting ? 'rgba(212,130,10,0.5)' : 'var(--amber-glow)',
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
                  {isSubmitting ? 'Sending...' : (content['contact.cta_label'] ?? 'Send Message →')}
                </button>
              </form>
            )}
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
