import type { Metadata } from 'next';
import { Bebas_Neue, Barlow_Condensed, Lora, JetBrains_Mono, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { createClient } from '@/lib/supabase/server';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nagar Nirmata Ltd — Engineering Construction & Consultancy | Dhaka, Bangladesh',
  description:
    'Nagar Nirmata Ltd is a premier Bangladeshi engineering and construction company established in 2009. Specialising in RCC structures, steel construction, architectural consultancy, safety assessment, and real estate across Bangladesh.',
  keywords: [
    'Nagar Nirmata',
    'construction company Bangladesh',
    'engineering consultancy Dhaka',
    'RCC construction',
    'steel structure Bangladesh',
    'building contractor Dhaka',
  ],
  openGraph: {
    title: 'Nagar Nirmata Ltd — A Complete Commitment',
    description: 'Engineering Construction · Design · Consultancy · Real Estate since 2009.',
    locale: 'en_BD',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

async function getThemeCSS(): Promise<string> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('theme').select('variable, value');
    if (!data) return '';
    return `:root { ${data.map((t: { variable: string; value: string }) => `${t.variable}: ${t.value};`).join(' ')} }`;
  } catch {
    return '';
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeCSS = await getThemeCSS();

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${lora.variable} ${jetbrainsMono.variable} ${hindSiliguri.variable}`}
    >
      <head>
        {themeCSS && (
          <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        )}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
