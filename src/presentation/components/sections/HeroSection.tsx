import type { HeroSection as HeroSectionData } from '../../../domain/event/Event';

interface HeroSectionProps {
  data: HeroSectionData;
}

export function HeroSection({ data }: HeroSectionProps) {
  const { pre_title, names, date, year } = data;

  return (
    <>
      {/* Top decoration */}
      <div className="animate-fade-in-up mb-8">
        <svg className="w-24 h-auto text-boda" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15C50 15 35 5 20 15C5 25 0 15 0 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M50 15C50 15 65 5 80 15C95 25 100 15 100 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="15" r="3" fill="currentColor"/>
        </svg>
      </div>

      {/* Welcome text */}
      {pre_title && (
        <p className="animate-fade-in-up-delay font-body text-boda-dark/70 text-lg tracking-[0.3em] uppercase mb-4">
          {pre_title}
        </p>
      )}

      {/* Names */}
      <h1 className="animate-fade-in-up-delay font-display text-5xl sm:text-7xl md:text-8xl font-medium text-boda-text text-center leading-tight mb-6">
        {names.map((name, index) => (
          <span key={name}>
            <span className="block">{name}</span>
            {index < names.length - 1 && (
              <span className="text-boda text-3xl sm:text-4xl md:text-5xl font-normal italic my-2 block">&</span>
            )}
          </span>
        ))}
      </h1>

      {/* Decorative line */}
      <div className="animate-fade-in-up-delay-2 flex items-center gap-4 my-6">
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-boda" />
        <div className="w-2 h-2 bg-boda rounded-full" />
        <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-boda" />
      </div>

      {/* Date */}
      <div className="animate-fade-in-up-delay-2 text-center mb-4">
        <p className="font-display text-2xl sm:text-3xl text-boda-text mb-3">
          {date}
        </p>
        <p className="font-display text-4xl sm:text-5xl text-boda font-semibold">
          {year}
        </p>
      </div>
    </>
  );
}

