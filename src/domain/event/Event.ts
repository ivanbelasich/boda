// Types for event sections
export interface HeroSection {
  type: 'hero';
  pre_title?: string;
  names: string[];
  // date and year are derived from event_date, not stored in JSON
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

// CountdownSection is automatically rendered after HeroSection
// It always shows days (if > 0), hours, minutes, and seconds
// No need to include it in sections array
export interface CountdownSection {
  type: 'countdown';
  // This interface exists for type safety but countdown is always auto-rendered
  // No configurable properties - always shows all time units
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
  | CalendarSection
  | InstagramSection
  | RSVPSection
  | PlaylistSection
  | InfoSection
  | PhotoGallerySection
  | FooterSection;

export interface InstagramSection {
  type: 'instagram';
  handle: string;
  message?: string;
  button_text?: string;
}

export interface RSVPSection {
  type: 'rsvp';
  title?: string;
  message?: string;
  form_url: string;
  button_text?: string;
}

export interface PlaylistSection {
  type: 'playlist';
  title?: string;
  message?: string;
  form_url: string;
  button_text?: string;
}

export interface InfoSection {
  type: 'info';
  title?: string;
  message?: string;
  accommodations?: Array<{
    name: string;
    contact?: string;
    address?: string;
    maps_url?: string;
  }>;
  transfers?: Array<{
    name: string;
    contact?: string;
    website?: string;
  }>;
}

export interface PhotoGallerySection {
  type: 'photo_gallery';
  title?: string;
  photos: string[];
}

export interface FooterSection {
  type: 'footer';
  message?: string;
}

export type HeroStyle = 'solid' | 'texture' | 'gradient';
export type DecorationStyle = 'none' | 'minimal' | 'botanical' | 'romantic';
export type ButtonStyle = 'rounded' | 'pill' | 'square';

// Visual event configuration
export interface EventTheme {
  preset?: string;
  // Color overrides
  primary?: string;
  secondary?: string;
  primary_light?: string;
  primary_dark?: string;
  background?: string;
  text?: string;
  // Typography overrides
  font_display?: string;
  font_body?: string;
  // Visual style options
  hero_style?: HeroStyle;
  hero_texture_url?: string;
  decorations?: DecorationStyle;
  button_style?: ButtonStyle;
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
