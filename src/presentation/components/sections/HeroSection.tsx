import type { HeroSection as HeroSectionData, HeroStyle, DecorationStyle } from '../../../domain/event/Event';
import { BotanicalLeafLeft, BotanicalLeafRight, BotanicalLeafTop } from '../icons';
import { formatHeroDateParts } from '../../utils/date-formatters';

interface HeroSectionProps {
  data: HeroSectionData;
  event_date: Date;
  hero_style?: HeroStyle;
  decorations?: DecorationStyle;
  texture_url?: string;
}

// Minimal decorations - simple elegant flourishes
function MinimalDecorations() {
  return (
    <>
      {/* Top center flourish */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-fade-in">
        <svg className="w-24 h-auto text-event-primary/40" viewBox="0 0 100 30" fill="none">
          <path d="M50 15C50 15 35 5 20 15C5 25 0 15 0 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M50 15C50 15 65 5 80 15C95 25 100 15 100 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="15" r="3" fill="currentColor"/>
        </svg>
      </div>
    </>
  );
}

// Botanical decorations - leaves in corners
function BotanicalDecorations() {
  return (
    <>
      {/* Top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-event-primary pointer-events-none">
        <BotanicalLeafTop className="w-64 md:w-80 h-auto" />
      </div>
      {/* Top left */}
      <div className="absolute top-0 left-0 text-event-primary pointer-events-none">
        <BotanicalLeafLeft className="w-24 md:w-32 h-auto" />
      </div>
      {/* Top right */}
      <div className="absolute top-0 right-0 text-event-primary pointer-events-none">
        <BotanicalLeafRight className="w-24 md:w-32 h-auto" />
      </div>
      {/* Bottom left */}
      <div className="absolute bottom-0 left-0 text-event-primary pointer-events-none rotate-180">
        <BotanicalLeafLeft className="w-20 md:w-28 h-auto opacity-60" />
      </div>
      {/* Bottom right */}
      <div className="absolute bottom-0 right-0 text-event-primary pointer-events-none rotate-180">
        <BotanicalLeafRight className="w-20 md:w-28 h-auto opacity-60" />
      </div>
    </>
  );
}

// Romantic decorations - hearts and soft flourishes
function RomanticDecorations() {
  return (
    <>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-event-primary/30 animate-fade-in">
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 56 C16 40 8 28 8 20 C8 12 14 6 22 6 C28 6 32 12 32 12 C32 12 36 6 42 6 C50 6 56 12 56 20 C56 28 48 40 32 56" />
        </svg>
      </div>
      {/* Corner flourishes */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-event-primary/20 rounded-tl-3xl" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-event-primary/20 rounded-tr-3xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-event-primary/20 rounded-bl-3xl" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-event-primary/20 rounded-br-3xl" />
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

export function HeroSection({
  data,
  event_date,
  hero_style = 'solid',
  decorations = 'none',
  texture_url,
}: HeroSectionProps) {
  const { pre_title, names } = data;

  // Derive date parts from event_date (single source of truth)
  const date_parts = formatHeroDateParts(event_date);

  const background_class = getBackgroundClass(hero_style);
  const background_style = texture_url && hero_style === 'texture'
    ? { backgroundImage: `url(${texture_url})`, backgroundSize: 'cover' }
    : undefined;

  return (
    <section
      className={`
        w-full min-h-screen
        flex flex-col items-center justify-center
        py-12 md:py-20 px-6
        relative overflow-hidden
        ${background_class}
      `.trim().replace(/\s+/g, ' ')}
      style={background_style}
    >
      {/* Decorations layer */}
      {renderDecorations(decorations)}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Welcome text */}
        {pre_title && (
          <p className="animate-fade-in-up font-event-body text-event-dark/70 text-sm sm:text-base tracking-elegant uppercase mb-8">
            {pre_title}
          </p>
        )}

        {/* Names */}
        <h1 className="animate-fade-in-up-delay font-event-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-event-text text-center leading-tight mb-8">
          {names.map((name, index) => (
            <span key={name}>
              <span className="block">{name.toUpperCase()}</span>
              {index < names.length - 1 && (
                <span className="text-event-primary text-3xl sm:text-4xl md:text-5xl font-light my-2 block">&</span>
              )}
            </span>
          ))}
        </h1>

        {/* Date in MES | DIA | AÑO format */}
        <div className="animate-fade-in-up-delay-2 flex items-center justify-center gap-4 text-event-text/80">
          <span className="font-event-body text-sm sm:text-base tracking-wider uppercase">
            {date_parts.month}
          </span>
          <span className="w-px h-8 bg-event-primary/40" />
          <span className="font-event-display text-3xl sm:text-4xl md:text-5xl font-light">
            {date_parts.day}
          </span>
          <span className="w-px h-8 bg-event-primary/40" />
          <span className="font-event-body text-sm sm:text-base tracking-wider">
            {date_parts.year}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <svg className="w-6 h-6 text-event-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
