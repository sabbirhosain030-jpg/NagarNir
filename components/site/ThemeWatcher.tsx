'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ThemeVariable } from '@/lib/types';

export default function ThemeWatcher() {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('theme_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'theme' },
        (payload) => {
          const { variable, value } = payload.new as ThemeVariable;
          document.documentElement.style.setProperty(variable, value);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return null;
}
