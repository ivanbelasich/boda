import { useState, useEffect } from 'react';
import { formatFullDate } from '../../utils/date-formatters';
import { Section } from '../ui/Section';

interface CountdownSectionProps {
  event_date: Date;
  upload_end_time?: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total_ms: number;
}

type CountdownPhase = 
  | 'far_away'      // > 30 días
  | 'approaching'   // 7-30 días
  | 'very_close'    // < 7 días
  | 'today'         // Same day, before event_date
  | 'ongoing'       // event_date passed but upload_end_time hasn't
  | 'past';         // upload_end_time passed (or event_date if no upload_end_time)

function calculateTimeLeft(target_date: Date): TimeLeft {
  const now = new Date();
  const difference = target_date.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total_ms: difference };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total_ms: difference };
}

// Default: 12 hours after event_date
const DEFAULT_EVENT_DURATION_MS = 12 * 60 * 60 * 1000;

function getDefaultUploadEndTime(event_date: Date): Date {
  return new Date(event_date.getTime() + DEFAULT_EVENT_DURATION_MS);
}

function getCountdownPhase(
  time_left: TimeLeft, 
  event_date: Date, 
  upload_end_time?: Date
): CountdownPhase {
  const now = new Date();
  const is_same_day = now.toDateString() === event_date.toDateString();
  const event_started = now >= event_date;
  
  // If event hasn't started yet, use normal countdown logic
  if (!event_started) {
    if (is_same_day) {
      return 'today';
    }

    // If there are hours left but no days, return very_close
    if (time_left.days === 0 && time_left.hours > 0) {
      return 'very_close';
    }

    if (time_left.days < 7) {
      return 'very_close';
    }

    if (time_left.days < 30) {
      return 'approaching';
    }

    return 'far_away';
  }
  
  // Event has started - check if it has finished
  // Use upload_end_time or default (12 hours after event_date)
  const effective_end_time = upload_end_time ?? getDefaultUploadEndTime(event_date);
  const event_finished = now > effective_end_time;

  if (event_finished) {
    return 'past';
  }

  // event_date passed but effective_end_time hasn't -> event is ongoing
  return 'ongoing';
}

function getPhaseMessage(phase: CountdownPhase, time_left?: TimeLeft): string {
  switch (phase) {
    case 'far_away':
      return '¡Nos vemos pronto!';
    case 'approaching':
      return '¡Ya casi llega el gran día!';
    case 'very_close':
      // If there are hours left but no days, change message
      if (time_left && time_left.days === 0 && time_left.hours > 0) {
        return '¡Quedan horas!';
      }
      return '¡Estamos a días!';
    case 'today':
      return '¡Hoy es el gran día!';
    case 'ongoing':
      return '¡Hoy es el gran día!';
    case 'past':
      return '¡Gracias por acompañarnos!';
  }
}

export function CountdownSection({ event_date, upload_end_time }: CountdownSectionProps) {
  const [time_left, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(event_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [event_date]);

  const phase = getCountdownPhase(time_left, event_date, upload_end_time);
  const phase_message = getPhaseMessage(phase, time_left);

  // Event has passed completely (upload_end_time passed)
  if (phase === 'past') {
    return (
      <Section variant="primary">
        <div className="animate-fade-in-up text-center">
          <p className="font-event-body text-white/80 text-sm mb-3 uppercase tracking-elegant drop-shadow-sm">
            {formatFullDate(event_date)}
          </p>
          <h2 className="font-event-display text-3xl sm:text-4xl md:text-5xl text-white mb-6 drop-shadow-lg">
            {phase_message}
          </h2>
          <div className="flex items-center justify-center gap-3 text-white/70">
            <span className="text-4xl animate-pulse-soft">🎉</span>
            <span className="text-4xl animate-pulse-soft" style={{ animationDelay: '0.2s' }}>🎉</span>
            <span className="text-4xl animate-pulse-soft" style={{ animationDelay: '0.4s' }}>🎉</span>
          </div>
        </div>
      </Section>
    );
  }

  // Event is ongoing (event_date passed but upload_end_time hasn't)
  if (phase === 'ongoing') {
    return (
      <Section variant="primary">
        <div className="animate-fade-in-up text-center">
          <h2 className="font-event-display text-3xl sm:text-4xl md:text-5xl text-white mb-4 drop-shadow-lg animate-pulse-soft">
            {phase_message}
          </h2>
          <div className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span className="font-event-body text-white/90 text-sm uppercase tracking-wider">
              En vivo
            </span>
          </div>
        </div>
      </Section>
    );
  }

  // Build time units: show hours, minutes, seconds
  // Days only if > 0 (hide when less than 24 hours)
  const time_units = [
    { value: time_left.days, label: 'días', show: time_left.days > 0 },
    { value: time_left.hours, label: 'hs', show: true },
    { value: time_left.minutes, label: 'min', show: true },
    { value: time_left.seconds, label: 'seg', show: true },
  ].filter(unit => unit.show);

  return (
    <Section variant="primary">
      <div className="animate-fade-in-up text-center">
        {/* Contextual message with enhanced styling */}
        <p className="font-event-body text-white/90 text-base sm:text-lg md:text-xl mb-10 italic drop-shadow-md">
          {phase_message}
        </p>

        {/* Countdown with circular cards and glow effects */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          {time_units.map((unit, index) => (
            <div key={unit.label} className="flex items-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Circular countdown card */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                
                {/* Card */}
                <div className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 shadow-strong hover:scale-110 hover:bg-white/15 transition-all duration-300">
                  {/* SVG Progress Ring (decorative) */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * (unit.value % 60)) / 60}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  
                  {/* Number with flip animation */}
                  <span className="relative font-event-display text-2xl sm:text-3xl md:text-4xl text-white font-light tabular-nums drop-shadow-lg animate-flip">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  
                  {/* Label */}
                  <span className="relative font-event-body text-[0.6rem] sm:text-xs text-white/80 mt-1 uppercase tracking-wider drop-shadow-sm">
                    {unit.label}
                  </span>
                </div>
              </div>
              
              {/* Separator with gradient */}
              {index < time_units.length - 1 && (
                <span className="font-event-display text-2xl sm:text-3xl md:text-4xl text-white/40 mx-1 sm:mx-2 animate-pulse-soft drop-shadow-md">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Date display below countdown */}
        <p className="font-event-body text-white/60 text-xs sm:text-sm mt-8 uppercase tracking-elegant drop-shadow-sm">
          {formatFullDate(event_date)}
        </p>
      </div>
    </Section>
  );
}
