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
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="icon-circle p-5 animate-scale-in">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-event-display text-xl sm:text-2xl md:text-3xl tracking-elegant uppercase text-event-text mb-6 drop-shadow-sm">
          {title}
        </h3>

        {/* Message */}
        <p className="font-event-body text-event-text/70 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {message}
        </p>

        {/* Button with enhanced hover effect */}
        <a
          href={form_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-event-primary text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-event-dark transition-smooth shadow-strong hover:shadow-colored hover-lift"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {button_text}
        </a>
      </div>
    </Section>
  );
}
