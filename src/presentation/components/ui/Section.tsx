import type { ReactNode } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import type { SectionStyle } from '../../../config/theme-variants';

export type SectionVariant = 'light' | 'primary' | 'secondary' | 'transparent' | 'gradient' | 'card';

interface SectionProps {
  variant?: SectionVariant;
  children: ReactNode;
  className?: string;
  id?: string;
  full_height?: boolean;
}

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  light: 'bg-event-bg text-event-text',
  primary: 'bg-event-primary text-white',
  secondary: 'bg-event-secondary text-white',
  transparent: 'bg-transparent text-event-text',
  gradient: 'bg-gradient-primary text-white',
  card: 'bg-event-bg text-event-text',
};

function getSectionStyleClass(section_style?: SectionStyle): string {
  switch (section_style) {
    case 'bordered':
      return 'section-style-bordered border-y border-event-primary/20';
    case 'cards':
      return 'section-style-cards rounded-2xl shadow-soft mx-2 md:mx-6';
    case 'floating':
      return 'section-style-floating shadow-medium mx-2 md:mx-4 rounded-2xl';
    case 'flat':
    default:
      return 'section-style-flat';
  }
}

export function Section({
  variant = 'light',
  children,
  className = '',
  id,
  full_height = false,
}: SectionProps) {
  const theme = useThemeContext();
  const variant_classes = VARIANT_CLASSES[variant];
  const height_classes = full_height ? 'min-h-screen' : '';
  const section_style_class = theme ? getSectionStyleClass(theme.variant.section_style) : '';

  // Special styling for card variant
  const card_classes = variant === 'card' 
    ? 'mx-4 md:mx-auto rounded-3xl shadow-strong my-8' 
    : '';

  return (
    <section
      id={id}
      data-section-style={theme?.variant.section_style ?? 'flat'}
      className={`
        section-container
        w-full
        py-16 md:py-24
        ${variant_classes}
        ${height_classes}
        ${section_style_class}
        ${card_classes}
        ${className}
        transition-smooth
        scroll-snap-child
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className={`max-w-5xl ${variant === 'card' ? '' : 'mx-auto'} px-6`}>
        {children}
      </div>
    </section>
  );
}

// Variant for hero section with different padding and optional full height
export function HeroSectionWrapper({
  children,
  className = '',
  hero_style = 'solid',
  texture_url,
}: {
  children: ReactNode;
  className?: string;
  hero_style?: 'solid' | 'texture' | 'gradient';
  texture_url?: string;
}) {
  const getBackgroundClass = () => {
    switch (hero_style) {
      case 'texture':
        return 'hero-texture-paper';
      case 'gradient':
        return 'bg-gradient-soft';
      default:
        return 'bg-event-bg';
    }
  };

  const background_style = texture_url && hero_style === 'texture'
    ? { backgroundImage: `url(${texture_url})`, backgroundSize: 'cover' }
    : undefined;

  return (
    <section
      className={`
        w-full
        min-h-screen
        flex flex-col items-center justify-center
        py-12 md:py-20
        relative
        scroll-snap-child
        ${getBackgroundClass()}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={background_style}
    >
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {children}
      </div>
    </section>
  );
}
