import type { HeroSection as HeroSectionData } from '../../../domain/event/Event';
import { formatHeroDate, getYear } from '../../utils/date-formatters';

interface HeroSectionProps {
  data: HeroSectionData;
  event_date: Date;
}

export function HeroSection({ data, event_date }: HeroSectionProps) {
  const { pre_title, names } = data;
  
  const formatted_date = formatHeroDate(event_date);
  const year = getYear(event_date);

  return (
    <>
      {/* Top decoration */}
      <div className="animate-fade-in-up mb-8">
        <svg className="w-24 h-auto text-event-primary" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15C50 15 35 5 20 15C5 25 0 15 0 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M50 15C50 15 65 5 80 15C95 25 100 15 100 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="15" r="3" fill="currentColor"/>
        </svg>
      </div>

      {/* Welcome text */}
      {pre_title && (
        <p className="animate-fade-in-up-delay font-event-body text-event-dark/70 text-lg tracking-[0.3em] uppercase mb-4">
          {pre_title}
        </p>
      )}

      {/* Names */}
      <h1 className="animate-fade-in-up-delay font-event-display text-5xl sm:text-7xl md:text-8xl font-medium text-event-text text-center leading-tight mb-6">
        {names.map((name, index) => (
          <span key={name}>
            <span className="block">{name}</span>
            {index < names.length - 1 && (
              <span className="text-event-primary text-3xl sm:text-4xl md:text-5xl font-normal italic my-2 block">&</span>
            )}
          </span>
        ))}
      </h1>

      {/* Decorative line */}
      <div className="animate-fade-in-up-delay-2 flex items-center gap-4 my-6">
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-event-primary" />
        <div className="w-2 h-2 bg-event-primary rounded-full" />
        <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-event-primary" />
      </div>

      {/* Date */}
      <div className="animate-fade-in-up-delay-2 text-center mb-4">
        <p className="font-event-display text-2xl sm:text-3xl text-event-text mb-3">
          {formatted_date}
        </p>
        <p className="font-event-display text-4xl sm:text-5xl text-event-primary font-semibold">
          {year}
        </p>
      </div>
    </>
  );
}
