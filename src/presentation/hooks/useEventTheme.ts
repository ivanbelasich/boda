import { useMemo } from 'react';
import type { EventTheme, HeroStyle, DecorationStyle } from '../../domain/event/Event';
import { getThemeColors, type ThemeColors } from '../../config/theme-presets';
import { getThemeVariant, getThemeVariantKey, type ThemeVariant } from '../../config/theme-variants';

export interface ThemeStyleVars {
  '--color-event-primary': string;
  '--color-event-secondary': string;
  '--color-event-light': string;
  '--color-event-dark': string;
  '--color-event-bg': string;
  '--color-event-text': string;
  '--font-event-display': string;
  '--font-event-body': string;
}

export interface ThemeConfig {
  style_vars: ThemeStyleVars;
  hero_style: HeroStyle;
  hero_texture_url?: string;
  decorations: DecorationStyle;
  /** Preset name for data-theme and CSS targeting */
  preset: string;
  /** Variant: animaciones, espaciado, hero, iconos, etc. */
  variant: ThemeVariant;
}

export function useEventTheme(theme?: EventTheme): ThemeStyleVars {
  return useMemo(() => {
    const colors: ThemeColors = getThemeColors(theme?.preset, {
      primary: theme?.primary,
      secondary: theme?.secondary,
      primary_light: theme?.primary_light,
      primary_dark: theme?.primary_dark,
      background: theme?.background,
      text: theme?.text,
      font_display: theme?.font_display,
      font_body: theme?.font_body,
      hero_style: theme?.hero_style,
      decorations: theme?.decorations,
    });

    return {
      '--color-event-primary': colors.primary,
      '--color-event-secondary': colors.secondary,
      '--color-event-light': colors.primary_light,
      '--color-event-dark': colors.primary_dark,
      '--color-event-bg': colors.background,
      '--color-event-text': colors.text,
      '--font-event-display': colors.font_display,
      '--font-event-body': colors.font_body,
    };
  }, [
    theme?.preset,
    theme?.primary,
    theme?.secondary,
    theme?.primary_light,
    theme?.primary_dark,
    theme?.background,
    theme?.text,
    theme?.font_display,
    theme?.font_body,
    theme?.hero_style,
    theme?.decorations,
  ]);
}

// Extended hook that returns full theme configuration
export function useFullEventTheme(theme?: EventTheme): ThemeConfig {
  return useMemo(() => {
    const preset = getThemeVariantKey(theme?.preset);
    const colors: ThemeColors = getThemeColors(theme?.preset, {
      primary: theme?.primary,
      secondary: theme?.secondary,
      primary_light: theme?.primary_light,
      primary_dark: theme?.primary_dark,
      background: theme?.background,
      text: theme?.text,
      font_display: theme?.font_display,
      font_body: theme?.font_body,
      hero_style: theme?.hero_style,
      decorations: theme?.decorations,
    });

    const style_vars: ThemeStyleVars = {
      '--color-event-primary': colors.primary,
      '--color-event-secondary': colors.secondary,
      '--color-event-light': colors.primary_light,
      '--color-event-dark': colors.primary_dark,
      '--color-event-bg': colors.background,
      '--color-event-text': colors.text,
      '--font-event-display': colors.font_display,
      '--font-event-body': colors.font_body,
    };

    const variant = getThemeVariant(theme?.preset);

    return {
      style_vars,
      hero_style: theme?.hero_style ?? colors.hero_style ?? 'solid',
      hero_texture_url: theme?.hero_texture_url,
      decorations: theme?.decorations ?? colors.decorations ?? 'none',
      preset,
      variant,
    };
  }, [
    theme?.preset,
    theme?.primary,
    theme?.secondary,
    theme?.primary_light,
    theme?.primary_dark,
    theme?.background,
    theme?.text,
    theme?.font_display,
    theme?.font_body,
    theme?.hero_style,
    theme?.hero_texture_url,
    theme?.decorations,
    theme?.preset,
  ]);
}

