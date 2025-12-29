// Types for event sections
export interface HeroSection {
  type: 'hero';
  pre_title?: string;
  names: string[];
  date: string;
  year: string;
}

export interface UploadSection {
  type: 'upload';
  message: string;
  projection_note?: string;
}

export interface GallerySection {
  type: 'gallery';
  is_enabled: boolean;
}

export type EventSection = HeroSection | UploadSection | GallerySection;

// Visual event configuration
export interface EventTheme {
  primary_color: string;
  font_family?: string;
}

// Main event entity
export interface Event {
  id: string;
  slug: string;
  type: EventType;
  title: string;
  subtitle?: string;
  event_date: Date;
  theme: EventTheme;
  cover_image_url?: string;
  sections: EventSection[];
  drive_script_url?: string;
  drive_folder_id?: string;
  is_active: boolean;
}

export type EventType = 'wedding' | 'quinceanera' | 'corporate' | 'other';