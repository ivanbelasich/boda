import { useState, useEffect } from 'react';
import type { CountdownSection as CountdownSectionData } from '../../../domain/event/Event';
import { formatFullDate } from '../../utils/date-formatters';

interface CountdownSectionProps {
  data: CountdownSectionData;
  event_date: Date;
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
  | 'today'         // Mismo día
  | 'past';         // Ya pasó

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

function getCountdownPhase(time_left: TimeLeft, event_date: Date): CountdownPhase {
  const now = new Date();
  const is_same_day = now.toDateString() === event_date.toDateString();

  if (time_left.total_ms <= 0) {
    return 'past';
  }

  if (is_same_day) {
    return 'today';
  }

  if (time_left.days < 7) {
    return 'very_close';
  }

  if (time_left.days < 30) {
    return 'approaching';
  }

  return 'far_away';
}

function getPhaseMessage(phase: CountdownPhase): string {
  switch (phase) {
    case 'far_away':
      return '¡Nos vemos pronto!';
    case 'approaching':
      return '¡Ya casi llega el gran día!';
    case 'very_close':
      return '¡Estamos a días!';
    case 'today':
      return '¡Hoy es el gran día!';
    case 'past':
      return '¡Gracias por acompañarnos!';
  }
}

export function CountdownSection({ data, event_date }: CountdownSectionProps) {
  const [time_left, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(event_date));

  const {
    title = '¡Faltan...',
    show_days = true,
    show_hours = true,
    show_minutes = true,
    show_seconds = true,
  } = data;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [event_date]);

  const phase = getCountdownPhase(time_left, event_date);
  const phase_message = getPhaseMessage(phase);

  // Event has passed
  if (phase === 'past') {
    return (
      <div className="animate-fade-in-up text-center py-8">
        <p className="font-event-body text-event-text/60 text-sm mb-2 uppercase tracking-wider">
          {formatFullDate(event_date)}
        </p>
        <h2 className="font-event-display text-2xl sm:text-3xl text-event-primary mb-4">
          {phase_message}
        </h2>
        <div className="flex items-center justify-center gap-2 text-event-text/60">
          <span className="text-3xl">🎉</span>
          <span className="text-3xl">🎉</span>
          <span className="text-3xl">🎉</span>
        </div>
      </div>
    );
  }

  // Build time units based on phase
  const time_units = [
    { value: time_left.days, label: 'días', show: show_days && phase !== 'today' },
    { value: time_left.hours, label: 'hs', show: show_hours },
    { value: time_left.minutes, label: 'min', show: show_minutes },
    { value: time_left.seconds, label: 'seg', show: show_seconds },
  ].filter(unit => unit.show);

  return (
    <div className="animate-fade-in-up text-center py-8">
      {/* Contextual message */}
      <p className="font-event-body text-event-text/60 text-sm mb-2 uppercase tracking-wider">
        {phase_message}
      </p>

      {/* Title */}
      {title && phase !== 'today' && (
        <h2 className="font-event-display text-xl sm:text-2xl text-event-text/70 mb-6">
          {title}
        </h2>
      )}

      {/* Today special title */}
      {phase === 'today' && (
        <h2 className="font-event-display text-xl sm:text-2xl text-event-primary mb-6">
          ¡Quedan...
        </h2>
      )}

      {/* Countdown numbers */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {time_units.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="bg-event-primary/10 border border-event-primary/20 rounded-xl px-3 py-2 sm:px-5 sm:py-3 min-w-[60px] sm:min-w-[80px]">
                <span className="font-event-display text-2xl sm:text-4xl text-event-primary font-semibold tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <span className="font-event-body text-xs sm:text-sm text-event-text/60 mt-2 uppercase tracking-wider">
                {unit.label}
              </span>
            </div>
            
            {index < time_units.length - 1 && (
              <span className="font-event-display text-xl sm:text-2xl text-event-primary/50 mx-1 sm:mx-2 self-start mt-3">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
