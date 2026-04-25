export type ProjectType = 'rcc' | 'steel' | 'consultancy' | 'infra' | 'upcoming';
export type ProjectStatus = 'completed' | 'upcoming' | 'ongoing';
export type TeamCategory = 'board' | 'technical' | 'architecture';
export type ContentMap = Record<string, string>;

export interface Project {
  id: string;
  title: string;
  client: string | null;
  type: ProjectType;
  location: string | null;
  area_sft: number | null;
  value_crore: number | null;
  status: ProjectStatus;
  description: string | null;
  image_url: string | null;
  cloudinary_id: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  qualifications: string | null;
  category: TeamCategory;
  photo_url: string | null;
  cloudinary_id: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeVariable {
  variable: string;
  value: string;
  label: string | null;
  group_name: string;
}

export interface SiteSection {
  key: string;
  label: string;
  is_visible: boolean;
  display_order: number;
}

export interface SiteContent {
  key: string;
  value: string;
  label: string | null;
  section: string | null;
}

export interface ContactSubmission {
  id?: string;
  full_name: string;
  organisation?: string;
  email: string;
  phone?: string;
  project_type?: string;
  message?: string;
}
