// Theme preset definitions
export interface ThemeColors {
  primary: string;
  primary_light: string;
  primary_dark: string;
  background: string;
  text: string;
  font_display: string;
  font_body: string;
}

export const THEME_PRESETS: Record<string, ThemeColors> = {
  'elegant-gold': {
    primary: '#c59e81',
    primary_light: '#e1d4cc',
    primary_dark: '#a07a5c',
    background: '#ffffff',
    text: '#2f2f2f',
    font_display: '"Playfair Display", serif',
    font_body: '"Cormorant Garamond", serif',
  },
  'romantic-rose': {
    primary: '#d4a5a5',
    primary_light: '#f0e0e0',
    primary_dark: '#b08080',
    background: '#fff9f9',
    text: '#3d2c2c',
    font_display: '"Cormorant Garamond", serif',
    font_body: '"Lora", serif',
  },
  'modern-slate': {
    primary: '#64748b',
    primary_light: '#94a3b8',
    primary_dark: '#475569',
    background: '#f8fafc',
    text: '#1e293b',
    font_display: '"Montserrat", sans-serif',
    font_body: '"Open Sans", sans-serif',
  },
  'forest-green': {
    primary: '#4a7c59',
    primary_light: '#8fbc8f',
    primary_dark: '#2d5a3d',
    background: '#f5f9f5',
    text: '#1a3320',
    font_display: '"Merriweather", serif',
    font_body: '"Source Sans Pro", sans-serif',
  },
};

export const DEFAULT_THEME = THEME_PRESETS['elegant-gold'];

export function getThemeColors(preset?: string, overrides?: Partial<ThemeColors>): ThemeColors {
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

