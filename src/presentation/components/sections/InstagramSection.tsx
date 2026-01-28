import type { InstagramSection as InstagramSectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';
import { InstagramIcon } from '../icons';

interface InstagramSectionProps {
  data: InstagramSectionData;
}

export function InstagramSection({ data }: InstagramSectionProps) {
  const {
    handle,
    message = '¡Preparate para nuestro gran día! Ya podés seguirnos en nuestra cuenta para ver todas las novedades del casamiento y etiquetarnos en tus fotos y videos.',
    button_text = 'VER EN INSTAGRAM',
  } = data;

  const instagram_url = `https://instagram.com/${handle.replace('@', '')}`;

  return (
    <Section variant="light">
      <div className="animate-fade-in-up text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <InstagramIcon className="w-12 h-12 md:w-14 md:h-14 text-event-text/70" />
        </div>

        {/* Handle */}
        <h3 className="font-event-display text-2xl sm:text-3xl text-event-text mb-4">
          {handle.startsWith('@') ? handle : `@${handle}`}
        </h3>

        {/* Message */}
        <p className="font-event-body text-event-text/70 text-sm sm:text-base mb-8 max-w-md mx-auto">
          {message}
        </p>

        {/* Button */}
        <a
          href={instagram_url}
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

