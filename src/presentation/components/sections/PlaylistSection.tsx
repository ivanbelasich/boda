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
        {/* Icon with animation */}
        <div className="mb-8 flex justify-center">
          <div className="icon-circle p-5 animate-scale-in">
            <MusicNoteIcon className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
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

        {/* Button with music icon animation */}
        <a
          href={form_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-event-primary text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-event-dark transition-smooth shadow-strong hover:shadow-colored hover-lift"
        >
          <MusicNoteIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {button_text}
        </a>
      </div>
    </Section>
  );
}
