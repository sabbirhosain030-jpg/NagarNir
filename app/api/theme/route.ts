import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase.from('theme').select('variable, value');
  const css = `:root { ${(data ?? []).map((t: { variable: string; value: string }) => `${t.variable}: ${t.value};`).join(' ')} }`;
  return new NextResponse(css, {
    headers: { 'Content-Type': 'text/css', 'Cache-Control': 'no-store' },
  });
}
