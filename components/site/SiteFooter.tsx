import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'About Us',  href: '#about' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Services',  href: '#services' },
  { label: 'Team',      href: '#team' },
  { label: 'Safety',    href: '#safety' },
  { label: 'Contact',   href: '#contact' },
];

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: '#060709',
        borderTop: '2px solid var(--amber-glow)',
        padding: '4rem 2rem 2rem',
      }}
      role="contentinfo"
    >
      <div className="max-content" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Nagar Nirmata logo">
                <text x="2" y="34" fontFamily="var(--font-bebas)" fontSize="34" fill="var(--amber-glow)">NN</text>
                <line x1="0" y1="38" x2="40" y2="38" stroke="var(--amber-glow)" strokeWidth="2" />
              </svg>
              <div>
                <div style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>
                  Nagar Nirmata Ltd
                </div>
                <div style={{ fontFamily: 'var(--font-hind)', fontSize: '0.85rem', color: 'var(--dust-gray)' }}>
                  নগর নির্মাতা লিমিটেড
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--dust-gray)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Build for Today, Build for Tomorrow.<br />We Build Your Dreams into Reality.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(138,141,145,0.6)', letterSpacing: '0.12em' }}>
              Est. 2009 · Dhaka, Bangladesh
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber-glow)', marginBottom: '1.2rem' }}>
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {FOOTER_LINKS.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-barlow)',
                        fontSize: '0.95rem',
                        color: 'var(--dust-gray)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        letterSpacing: '0.04em',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber-glow)', marginBottom: '1.2rem' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="mailto:nagarnirmata1@gmail.com"
                 style={{ fontFamily: 'var(--font-lora)', fontSize: '0.88rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                nagarnirmata1@gmail.com
              </a>
              <a href="https://www.nagarnirmatabd.com" target="_blank" rel="noopener noreferrer"
                 style={{ fontFamily: 'var(--font-lora)', fontSize: '0.88rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                www.nagarnirmatabd.com ↗
              </a>
              <a href="tel:+8801324239079"
                 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--dust-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-glow)')}
                 onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust-gray)')}>
                +88 01324239079
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(242,240,235,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(138,141,145,0.5)', letterSpacing: '0.1em' }}>
            © 2025 Nagar Nirmata Ltd. All Rights Reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            A Complete Commitment
          </p>
        </div>
      </div>
    </footer>
  );
}
