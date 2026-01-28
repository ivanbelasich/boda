import type { ReactNode } from 'react';

export type SectionVariant = 'light' | 'primary' | 'secondary' | 'transparent';

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
};

export function Section({
  variant = 'light',
  children,
  className = '',
  id,
  full_height = false,
}: SectionProps) {
  const variant_classes = VARIANT_CLASSES[variant];
  const height_classes = full_height ? 'min-h-screen' : '';

  return (
    <section
      id={id}
      className={`
        w-full
        py-16 md:py-24
        ${variant_classes}
        ${height_classes}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="max-w-5xl mx-auto px-6">
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
        return 'bg-gradient-to-b from-event-light to-event-bg';
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
