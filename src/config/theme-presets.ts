import type { HeroStyle, DecorationStyle } from '../domain/event/Event';

// Theme preset definitions
export interface ThemeColors {
  primary: string;
  secondary: string;
  primary_light: string;
  primary_dark: string;
  background: string;
  text: string;
  font_display: string;
  font_body: string;
  // Visual style defaults for preset
  hero_style?: HeroStyle;
  decorations?: DecorationStyle;
}

export const THEME_PRESETS: Record<string, ThemeColors> = {
  'elegant-gold': {
    primary: '#c59e81',
    secondary: '#d4c4b8',
    primary_light: '#e1d4cc',
    primary_dark: '#a07a5c',
    background: '#ffffff',
    text: '#2f2f2f',
    font_display: '"Playfair Display", serif',
    font_body: '"Cormorant Garamond", serif',
    hero_style: 'solid',
    decorations: 'minimal',
  },
  'romantic-rose': {
    primary: '#d4a5a5',
    secondary: '#e8d4d4',
    primary_light: '#f0e0e0',
    primary_dark: '#b08080',
    background: '#fff9f9',
    text: '#3d2c2c',
    font_display: '"Cormorant Garamond", serif',
    font_body: '"Lora", serif',
    hero_style: 'gradient',
    decorations: 'romantic',
  },
  'modern-slate': {
    primary: '#64748b',
    secondary: '#94a3b8',
    primary_light: '#cbd5e1',
    primary_dark: '#475569',
    background: '#f8fafc',
    text: '#1e293b',
    font_display: '"Montserrat", sans-serif',
    font_body: '"Open Sans", sans-serif',
    hero_style: 'solid',
    decorations: 'none',
  },
  'forest-green': {
    primary: '#4a7c59',
    secondary: '#6b9b7a',
    primary_light: '#8fbc8f',
    primary_dark: '#2d5a3d',
    background: '#f5f9f5',
    text: '#1a3320',
    font_display: '"Merriweather", serif',
    font_body: '"Source Sans Pro", sans-serif',
    hero_style: 'solid',
    decorations: 'botanical',
  },
  'botanical-sage': {
    primary: '#A8B5A0',
    secondary: '#C5CEC5',
    primary_light: '#D4DDD0',
    primary_dark: '#6B7A62',
    background: '#FAFAFA',
    text: '#3D4A3A',
    font_display: '"Cormorant Garamond", serif',
    font_body: '"Lato", sans-serif',
    hero_style: 'texture',
    decorations: 'botanical',
  },
};

export const DEFAULT_THEME = THEME_PRESETS['elegant-gold'];

export interface ThemeOverrides {
  primary?: string;
  secondary?: string;
  primary_light?: string;
  primary_dark?: string;
  background?: string;
  text?: string;
  font_display?: string;
  font_body?: string;
  hero_style?: HeroStyle;
  decorations?: DecorationStyle;
}

export function getThemeColors(preset?: string, overrides?: ThemeOverrides): ThemeColors {
  const base_theme = preset && THEME_PRESETS[preset] 
    ? THEME_PRESETS[preset] 
    : DEFAULT_THEME;

  if (!overrides) {
    return base_theme;
  }

  return {
    ...base_theme,
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, value]) => value !== undefined)
    ),
  } as ThemeColors;
}

// Helper to determine if text should be light or dark based on background
export function getContrastTextColor(hex_color: string): 'light' | 'dark' {
  const hex = hex_color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
}

