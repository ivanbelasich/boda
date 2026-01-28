import type { RSVPSection as RSVPSectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';

interface RSVPSectionProps {
  data: RSVPSectionData;
}

export function RSVPSection({ data }: RSVPSectionProps) {
  const {
    title = 'CONFIRMACIÓN DE ASISTENCIA',
    message = 'Esperamos que seas parte de esta gran celebración. ¡Confirmanos tu asistencia!',
    form_url,
    button_text = 'CONFIRMAR ASISTENCIA',
  } = data;

  return (
    <Section variant="light">
      <div className="animate-fade-in-up text-center">
        {/* Title */}
        <h3 className="font-event-display text-lg sm:text-xl tracking-elegant uppercase text-event-text mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="font-event-body text-event-text/70 text-sm sm:text-base mb-8 max-w-md mx-auto">
          {message}
        </p>

        {/* Button */}
        <a
          href={form_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3 bg-event-primary text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-event-dark transition-all duration-300"
        >
          {button_text}
        </a>
      </div>
    </Section>
  );
}

