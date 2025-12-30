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

export interface CountdownSection {
  type: 'countdown';
  title?: string;
  show_days?: boolean;
  show_hours?: boolean;
  show_minutes?: boolean;
  show_seconds?: boolean;
}

export interface LocationSection {
  type: 'location';
  title: string;
  venue_name: string;
  address: string;
  city?: string;
  datetime?: string;
  google_maps_url?: string;
  google_maps_embed_url?: string;
  additional_info?: string;
}

export interface GiftSection {
  type: 'gift';
  title?: string;
  message?: string;
  bank_info?: {
    holder_name: string;
    cbu: string;
    alias: string;
    bank_name: string;
    dni?: string;
  };
  external_links?: Array<{
    label: string;
    url: string;
  }>;
  mercadopago_link?: string;
}

export interface DressCodeSection {
  type: 'dresscode';
  title?: string;
  code: string;
  description?: string;
  icon?: string;
  pinterest_url?: string;
}

export interface CalendarSection {
  type: 'calendar';
  title?: string;
  show_google?: boolean;
  show_apple?: boolean;
}

export type EventSection = 
  | HeroSection 
  | UploadSection 
  | GallerySection
  | CountdownSection
  | LocationSection
  | GiftSection
  | DressCodeSection
  | CalendarSection;

// Visual event configuration
export interface EventTheme {
  preset?: string;
  // Optional overrides
  primary?: string;
  primary_light?: string;
  primary_dark?: string;
  background?: string;
  text?: string;
  font_display?: string;
  font_body?: string;
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
  upload_start_time?: Date;
  upload_end_time?: Date;
  is_active: boolean;
}

export type EventType = 'wedding' | 'quinceanera' | 'corporate' | 'other';
