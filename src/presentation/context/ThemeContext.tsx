import { createContext, useContext, type ReactNode } from 'react';
import type { ThemeVariant } from '../../config/theme-variants';

interface ThemeContextValue {
  preset: string;
  variant: ThemeVariant;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  preset,
  variant,
  children,
}: ThemeContextValue & { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ preset, variant }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
