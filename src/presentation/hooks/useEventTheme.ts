import { useMemo } from 'react';
import type { EventTheme } from '../../domain/event/Event';
import { getThemeColors, type ThemeColors } from '../../config/theme-presets';

export interface ThemeStyleVars {
  '--color-event-primary': string;
  '--color-event-light': string;
  '--color-event-dark': string;
  '--color-event-bg': string;
  '--color-event-text': string;
  '--font-event-display': string;
  '--font-event-body': string;
}

export function useEventTheme(theme?: EventTheme): ThemeStyleVars {
  return useMemo(() => {
    const colors: ThemeColors = getThemeColors(theme?.preset, {
      primary: theme?.primary,
      primary_light: theme?.primary_light,
      primary_dark: theme?.primary_dark,
      background: theme?.background,
      text: theme?.text,
      font_display: theme?.font_display,
      font_body: theme?.font_body,
    });

    return {
      '--color-event-primary': colors.primary,
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
    theme?.primary_light,
    theme?.primary_dark,
    theme?.background,
    theme?.text,
    theme?.font_display,
    theme?.font_body,
  ]);
}

