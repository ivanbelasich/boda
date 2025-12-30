import { useState, useEffect } from 'react';

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
      <div className="animate-fade-in-up text-center py-8">
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

  // Event is ongoing (event_date passed but upload_end_time hasn't)
  if (phase === 'ongoing') {
    return (
      <div className="animate-fade-in-up text-center py-8">
        <h2 className="font-event-display text-2xl sm:text-3xl text-event-primary mb-4">
          {phase_message}
        </h2>
      </div>
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
    <div className="animate-fade-in-up text-center py-8">
      {/* Contextual message */}
      <p className="font-event-body text-event-text/60 text-sm mb-2 uppercase tracking-wider">
        {phase_message}
      </p>

      {/* Title - dynamic based on phase */}
      {phase !== 'today' && (
        <h2 className="font-event-display text-xl sm:text-2xl text-event-text/70 mb-6">
          ¡Faltan...
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
