/**
 * Theme variants: identidad visual por preset.
 * Cada tema tiene animaciones, espaciado, hero, iconos y estructura propios.
 */

export type AnimationStyle = 'elegant' | 'dreamy' | 'minimal' | 'dramatic' | 'organic' | 'playful' | 'bold';
export type SpacingScale = 'compact' | 'normal' | 'airy';
export type HeroLayout = 'centered' | 'elevated' | 'minimal' | 'dramatic' | 'split';
export type IconStyle = 'minimal' | 'circle' | 'ornate' | 'square' | 'soft';
export type RadiusStyle = 'sharp' | 'rounded' | 'pill' | 'soft';
export type SectionStyle = 'flat' | 'cards' | 'bordered' | 'floating';

export interface ThemeVariant {
  animation: AnimationStyle;
  spacing: SpacingScale;
  hero_layout: HeroLayout;
  icon_style: IconStyle;
  radius: RadiusStyle;
  section_style: SectionStyle;
  /** Clase CSS para el hero (nombres grandes, fecha, etc.) */
  hero_title_style: 'classic' | 'modern' | 'script' | 'minimal' | 'bold';
  /** Intensidad de sombras: none | soft | medium | strong */
  shadow_level: 'none' | 'soft' | 'medium' | 'strong';
}

const VARIANTS: Record<string, ThemeVariant> = {
  'elegant-gold': {
    animation: 'elegant',
    spacing: 'normal',
    hero_layout: 'centered',
    icon_style: 'circle',
    radius: 'rounded',
    section_style: 'flat',
    hero_title_style: 'classic',
    shadow_level: 'soft',
  },
  'romantic-rose': {
    animation: 'dreamy',
    spacing: 'airy',
    hero_layout: 'elevated',
    icon_style: 'ornate',
    radius: 'pill',
    section_style: 'floating',
    hero_title_style: 'script',
    shadow_level: 'medium',
  },
  'modern-slate': {
    animation: 'minimal',
    spacing: 'compact',
    hero_layout: 'minimal',
    icon_style: 'minimal',
    radius: 'sharp',
    section_style: 'flat',
    hero_title_style: 'modern',
    shadow_level: 'none',
  },
  'forest-green': {
    animation: 'organic',
    spacing: 'normal',
    hero_layout: 'centered',
    icon_style: 'circle',
    radius: 'rounded',
    section_style: 'cards',
    hero_title_style: 'classic',
    shadow_level: 'soft',
  },
  'botanical-sage': {
    animation: 'organic',
    spacing: 'airy',
    hero_layout: 'centered',
    icon_style: 'soft',
    radius: 'soft',
    section_style: 'cards',
    hero_title_style: 'classic',
    shadow_level: 'soft',
  },
  'midnight-navy': {
    animation: 'dramatic',
    spacing: 'normal',
    hero_layout: 'dramatic',
    icon_style: 'square',
    radius: 'sharp',
    section_style: 'bordered',
    hero_title_style: 'bold',
    shadow_level: 'strong',
  },
  'terracotta-warm': {
    animation: 'organic',
    spacing: 'airy',
    hero_layout: 'centered',
    icon_style: 'circle',
    radius: 'rounded',
    section_style: 'cards',
    hero_title_style: 'classic',
    shadow_level: 'medium',
  },
  'lavender-dream': {
    animation: 'dreamy',
    spacing: 'airy',
    hero_layout: 'elevated',
    icon_style: 'ornate',
    radius: 'pill',
    section_style: 'floating',
    hero_title_style: 'script',
    shadow_level: 'soft',
  },
};

const DEFAULT_VARIANT: ThemeVariant = VARIANTS['elegant-gold'];

export function getThemeVariant(preset?: string): ThemeVariant {
  if (!preset || !VARIANTS[preset]) {
    return DEFAULT_VARIANT;
  }
  return VARIANTS[preset];
}

export function getThemeVariantKey(preset?: string): string {
  return preset && VARIANTS[preset] ? preset : 'elegant-gold';
}
