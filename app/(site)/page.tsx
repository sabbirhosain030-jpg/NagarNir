'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/site/canvas/LoadingScreen';
import HeroSection from '@/components/site/sections/HeroSection';
import AboutSection from '@/components/site/sections/AboutSection';
import StatsSection from '@/components/site/sections/StatsSection';
import ServicesSection from '@/components/site/sections/ServicesSection';
import ProjectsSection from '@/components/site/sections/ProjectsSection';
import ClientsSection from '@/components/site/sections/ClientsSection';
import TeamSection from '@/components/site/sections/TeamSection';
import SafetySection from '@/components/site/sections/SafetySection';
import ContactSection from '@/components/site/sections/ContactSection';
import SiteFooter from '@/components/site/SiteFooter';
import { useContent, useSections } from '@/lib/hooks/useSupabase';

export default function HomePage() {
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const { content } = useContent();
  const { isVisible } = useSections();

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    setTimeout(() => setHeroRevealed(true), 100);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (!sessionStorage.getItem('nn_loaded')) {
      setShowLoader(true);
    } else {
      setLoaderDone(true);
      setHeroRevealed(true);
    }
  }, []);

  useEffect(() => {
    if (loaderDone) sessionStorage.setItem('nn_loaded', '1');
  }, [loaderDone]);

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <main>
      {showLoader && !loaderDone && (
        <LoadingScreen onComplete={handleLoaderComplete} />
      )}

      {isVisible('hero')     && <HeroSection     content={content} revealed={heroRevealed} />}
      {isVisible('about')    && <AboutSection     content={content} />}
      {isVisible('stats')    && <StatsSection     content={content} />}
      {isVisible('services') && <ServicesSection  content={content} />}
      {isVisible('projects') && <ProjectsSection  content={content} />}
      {isVisible('clients')  && <ClientsSection   content={content} />}
      {isVisible('team')     && <TeamSection      content={content} />}
      {isVisible('safety')   && <SafetySection    content={content} />}
      {isVisible('contact')  && <ContactSection   content={content} />}
      {isVisible('footer')   && <SiteFooter />}
    </main>
  );
}
