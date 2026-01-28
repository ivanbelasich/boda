import type { PlaylistSection as PlaylistSectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';
import { MusicNoteIcon } from '../icons';

interface PlaylistSectionProps {
  data: PlaylistSectionData;
}

export function PlaylistSection({ data }: PlaylistSectionProps) {
  const {
    title = '¿QUÉ CANCIONES NO PUEDEN FALTAR?',
    message = '¡Ayudanos sugiriendo las canciones que pensás que no pueden faltar en la fiesta!',
    form_url,
    button_text = 'SUGERIR CANCIÓN',
  } = data;

  return (
    <Section variant="light">
      <div className="animate-fade-in-up text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <MusicNoteIcon className="w-12 h-12 md:w-14 md:h-14 text-event-text/70" />
        </div>

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

