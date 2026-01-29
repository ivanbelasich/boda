import type { HeroSection as HeroSectionData, HeroStyle, DecorationStyle } from '../../../domain/event/Event';
import type { ThemeVariant } from '../../../config/theme-variants';
import { BotanicalLeafLeft, BotanicalLeafRight, BotanicalLeafTop } from '../icons';
import { formatHeroDateParts } from '../../utils/date-formatters';

interface HeroSectionProps {
  data: HeroSectionData;
  event_date: Date;
  hero_style?: HeroStyle;
  decorations?: DecorationStyle;
  texture_url?: string;
  variant?: ThemeVariant;
}

// Minimal decorations - simple elegant flourishes with parallax
function MinimalDecorations() {
  return (
    <>
      {/* Top center flourish with parallax */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-fade-in parallax-slow">
        <svg className="w-32 h-auto text-event-primary/40 drop-shadow-sm" viewBox="0 0 100 30" fill="none">
          <path d="M50 15C50 15 35 5 20 15C5 25 0 15 0 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M50 15C50 15 65 5 80 15C95 25 100 15 100 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="15" r="3" fill="currentColor"/>
        </svg>
      </div>
      {/* Subtle accent lines */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 h-24 w-px bg-gradient-to-b from-transparent via-event-primary/30 to-transparent animate-fade-in-up-delay" />
      <div className="absolute top-1/2 right-4 -translate-y-1/2 h-24 w-px bg-gradient-to-b from-transparent via-event-primary/30 to-transparent animate-fade-in-up-delay" />
    </>
  );
}

// Botanical decorations - leaves in corners with parallax
function BotanicalDecorations() {
  return (
    <>
      {/* Top center with parallax */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-event-primary pointer-events-none parallax-slow animate-fade-in">
        <BotanicalLeafTop className="w-64 md:w-80 h-auto drop-shadow-lg" />
      </div>
      {/* Top left with subtle animation */}
      <div className="absolute top-0 left-0 text-event-primary pointer-events-none animate-fade-in-up-delay">
        <BotanicalLeafLeft className="w-28 md:w-36 h-auto drop-shadow-md" />
      </div>
      {/* Top right with subtle animation */}
      <div className="absolute top-0 right-0 text-event-primary pointer-events-none animate-fade-in-up-delay">
        <BotanicalLeafRight className="w-28 md:w-36 h-auto drop-shadow-md" />
      </div>
      {/* Bottom left */}
      <div className="absolute bottom-0 left-0 text-event-primary pointer-events-none rotate-180 animate-fade-in-up-delay-2">
        <BotanicalLeafLeft className="w-24 md:w-32 h-auto opacity-60 drop-shadow-sm" />
      </div>
      {/* Bottom right */}
      <div className="absolute bottom-0 right-0 text-event-primary pointer-events-none rotate-180 animate-fade-in-up-delay-2">
        <BotanicalLeafRight className="w-24 md:w-32 h-auto opacity-60 drop-shadow-sm" />
      </div>
    </>
  );
}

// Romantic decorations - hearts and soft flourishes with glow
function RomanticDecorations() {
  return (
    <>
      {/* Centered heart with pulse animation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-event-primary/30 animate-fade-in">
        <svg className="w-20 h-20 drop-shadow-lg animate-pulse-soft" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 56 C16 40 8 28 8 20 C8 12 14 6 22 6 C28 6 32 12 32 12 C32 12 36 6 42 6 C50 6 56 12 56 20 C56 28 48 40 32 56" />
        </svg>
      </div>
      {/* Corner flourishes with enhanced styling */}
      <div className="absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 border-event-primary/25 rounded-tl-[2rem] animate-fade-in-up-delay" />
      <div className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-event-primary/25 rounded-tr-[2rem] animate-fade-in-up-delay" />
      <div className="absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 border-event-primary/25 rounded-bl-[2rem] animate-fade-in-up-delay-2" />
      <div className="absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 border-event-primary/25 rounded-br-[2rem] animate-fade-in-up-delay-2" />
      {/* Additional small hearts */}
      <div className="absolute top-20 left-20 text-event-primary/15 animate-fade-in-up-delay">
        <svg className="w-8 h-8" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 56 C16 40 8 28 8 20 C8 12 14 6 22 6 C28 6 32 12 32 12 C32 12 36 6 42 6 C50 6 56 12 56 20 C56 28 48 40 32 56" />
        </svg>
      </div>
      <div className="absolute top-20 right-20 text-event-primary/15 animate-fade-in-up-delay-2">
        <svg className="w-8 h-8" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 56 C16 40 8 28 8 20 C8 12 14 6 22 6 C28 6 32 12 32 12 C32 12 36 6 42 6 C50 6 56 12 56 20 C56 28 48 40 32 56" />
        </svg>
      </div>
    </>
  );
}

function getBackgroundClass(hero_style: HeroStyle): string {
  switch (hero_style) {
    case 'texture':
      return 'hero-texture-paper';
    case 'gradient':
      return 'bg-gradient-to-b from-event-light/50 to-event-bg';
    default:
      return 'bg-event-bg';
  }
}

function renderDecorations(style?: DecorationStyle) {
  switch (style) {
    case 'botanical':
      return <BotanicalDecorations />;
    case 'romantic':
      return <RomanticDecorations />;
    case 'minimal':
      return <MinimalDecorations />;
    default:
      return null;
  }
}

function getHeroLayoutClasses(layout: ThemeVariant['hero_layout']): string {
  switch (layout) {
    case 'elevated':
      return 'py-16 md:py-24 px-8';
    case 'minimal':
      return 'py-10 md:py-14 px-6';
    case 'dramatic':
      return 'py-20 md:py-28 px-8';
    default:
      return 'py-12 md:py-20 px-6';
  }
}

function getHeroContentWrapperClasses(layout: ThemeVariant['hero_layout']): string {
  const base = 'relative z-10 mx-auto text-center px-4';
  switch (layout) {
    case 'elevated':
      return `${base} max-w-4xl bg-event-bg/20 backdrop-blur-md rounded-3xl py-16 px-10 shadow-strong border border-white/10`;
    case 'dramatic':
      return `${base} max-w-6xl`;
    case 'minimal':
      return `${base} max-w-3xl`;
    default:
      return `${base} max-w-5xl`;
  }
}

function getHeroTitleClasses(titleStyle: ThemeVariant['hero_title_style']): string {
  const base = 'animate-fade-in-up-delay font-event-display text-center leading-[0.9] mb-10 md:mb-12';
  switch (titleStyle) {
    case 'modern':
      return `${base} text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight`;
    case 'script':
      return `${base} text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal italic tracking-wide`;
    case 'minimal':
      return `${base} text-4xl sm:text-5xl md:text-6xl font-light tracking-widest`;
    case 'bold':
      return `${base} text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tight hero-title-style`;
    default:
      return `${base} text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-normal`;
  }
}

function getHeroDateWrapperClasses(radius: ThemeVariant['radius']): string {
  const rounded = radius === 'pill' ? 'rounded-full' : radius === 'sharp' ? 'rounded-md' : 'rounded-2xl';
  return `animate-fade-in-up-delay-2 flex items-center justify-center gap-4 md:gap-6 text-event-text/80 bg-event-bg/30 backdrop-blur-sm px-8 py-4 ${rounded} shadow-soft mx-auto max-w-fit`;
}

export function HeroSection({
  data,
  event_date,
  hero_style = 'solid',
  decorations = 'none',
  texture_url,
  variant,
}: HeroSectionProps) {
  const { pre_title, names } = data;
  const layout = variant?.hero_layout ?? 'centered';
  const title_style = variant?.hero_title_style ?? 'classic';
  const radius = variant?.radius ?? 'rounded';

  const date_parts = formatHeroDateParts(event_date);
  const background_class = getBackgroundClass(hero_style);
  const background_style = texture_url && hero_style === 'texture'
    ? { backgroundImage: `url(${texture_url})`, backgroundSize: 'cover' }
    : undefined;

  const sectionPadding = getHeroLayoutClasses(layout);
  const contentWrapperClass = getHeroContentWrapperClasses(layout);
  const titleClass = getHeroTitleClasses(title_style);
  const dateWrapperClass = getHeroDateWrapperClasses(radius);

  const showScrollIndicator = layout !== 'minimal';

  return (
    <section
      data-hero-layout={layout}
      data-hero-title-style={title_style}
      className={`
        hero-section
        w-full min-h-screen
        flex flex-col items-center justify-center
        ${sectionPadding}
        relative overflow-hidden
        ${background_class}
      `.trim().replace(/\s+/g, ' ')}
      style={background_style}
    >
      {renderDecorations(decorations)}

      <div className={contentWrapperClass}>
        {pre_title && (
          <p className="animate-fade-in-up font-event-body text-event-dark/70 text-sm sm:text-base md:text-lg tracking-elegant uppercase mb-10 drop-shadow-sm">
            {pre_title}
          </p>
        )}

        <h1 className={titleClass}>
          {names.map((name, index) => (
            <span key={name}>
              <span className="block text-gradient-primary drop-shadow-xl transform hover:scale-105 transition-transform duration-500">
                {title_style === 'script' ? name : name.toUpperCase()}
              </span>
              {index < names.length - 1 && (
                <span className="text-event-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light my-3 md:my-4 block animate-pulse-soft drop-shadow-lg">
                  &
                </span>
              )}
            </span>
          ))}
        </h1>

        <div className={dateWrapperClass}>
          <span className="font-event-body text-sm sm:text-base md:text-lg tracking-wider uppercase drop-shadow-sm">
            {date_parts.month}
          </span>
          <span className="w-px h-10 bg-gradient-to-b from-transparent via-event-primary/50 to-transparent" />
          <span className="font-event-display text-4xl sm:text-5xl md:text-6xl font-light text-gradient-primary drop-shadow-md">
            {date_parts.day}
          </span>
          <span className="w-px h-10 bg-gradient-to-b from-transparent via-event-primary/50 to-transparent" />
          <span className="font-event-body text-sm sm:text-base md:text-lg tracking-wider drop-shadow-sm">
            {date_parts.year}
          </span>
        </div>
      </div>

      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-event-primary/20 animate-ping" />
            <div className="relative bg-event-primary/10 backdrop-blur-sm p-3 rounded-full border border-event-primary/30 shadow-soft">
              <svg className="w-5 h-5 text-event-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
