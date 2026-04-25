import LenisProvider from '@/components/site/scroll/LenisProvider';
import CrosshairCursor from '@/components/site/cursor/CrosshairCursor';
import ThemeWatcher from '@/components/site/ThemeWatcher';
import SiteNav from '@/components/site/SiteNav';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <CrosshairCursor />
      <ThemeWatcher />
      <SiteNav />
      {children}
    </LenisProvider>
  );
}
