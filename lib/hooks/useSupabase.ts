'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Project, TeamMember, ThemeVariable, SiteSection, ProjectType, TeamCategory, ContentMap } from '@/lib/types';

// ─── useContent ────────────────────────────────────────────────────────────────
export function useContent() {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('key, value');
      if (data) {
        const map: ContentMap = {};
        data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
        setContent(map);
      }
      setLoading(false);
    };
    fetchContent();

    const channel = supabase
      .channel('site_content_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_content' },
        (payload) => {
          const { key, value } = payload.new as { key: string; value: string };
          setContent(prev => ({ ...prev, [key]: value }));
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { content, loading };
}

// ─── useProjects ───────────────────────────────────────────────────────────────
export function useProjects(type?: ProjectType | ProjectType[]) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProjects = useCallback(async () => {
    let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
    if (type) {
      if (Array.isArray(type)) {
        query = query.in('type', type);
      } else {
        query = query.eq('type', type);
      }
    }
    const { data } = await query;
    if (data) setProjects(data as Project[]);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    fetchProjects();
    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

// ─── useTeam ───────────────────────────────────────────────────────────────────
export function useTeam(category?: TeamCategory) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTeam = useCallback(async () => {
    let query = supabase
      .from('team')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });
    if (category) query = query.eq('category', category);
    const { data } = await query;
    if (data) setTeam(data as TeamMember[]);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchTeam();
    const channel = supabase
      .channel(`team_changes_${category ?? 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, fetchTeam)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTeam, category]);

  return { team, loading };
}

// ─── useAllTeam (for admin — includes hidden) ──────────────────────────────────
export function useAllTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTeam = useCallback(async () => {
    const { data } = await supabase.from('team').select('*').order('display_order', { ascending: true });
    if (data) setTeam(data as TeamMember[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeam();
    const channel = supabase
      .channel('all_team_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, fetchTeam)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTeam]);

  return { team, loading, refetch: fetchTeam };
}

// ─── useSections ───────────────────────────────────────────────────────────────
export function useSections() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchSections = useCallback(async () => {
    const { data } = await supabase
      .from('sections')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setSections(data as SiteSection[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSections();
    const channel = supabase
      .channel('sections_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sections' }, fetchSections)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchSections]);

  const isVisible = useCallback((key: string) => {
    const section = sections.find(s => s.key === key);
    return section ? section.is_visible : true;
  }, [sections]);

  return { sections, isVisible, loading };
}

// ─── useTheme ──────────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<ThemeVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabase.from('theme').select('*');
      if (data) {
        setTheme(data as ThemeVariable[]);
        data.forEach((t: ThemeVariable) => {
          document.documentElement.style.setProperty(t.variable, t.value);
        });
      }
      setLoading(false);
    };
    fetchTheme();

    const channel = supabase
      .channel('theme_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'theme' },
        (payload) => {
          const { variable, value } = payload.new as ThemeVariable;
          document.documentElement.style.setProperty(variable, value);
          setTheme(prev => prev.map(t => t.variable === variable ? { ...t, value } : t));
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { theme, loading };
}
