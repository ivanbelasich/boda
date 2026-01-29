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
        {/* Icon with gradient background */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Instagram gradient background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 blur-xl opacity-30 animate-pulse-soft" />
            <div className="relative icon-circle p-5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-scale-in">
              <InstagramIcon className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Handle with enhanced styling */}
        <h3 className="font-event-display text-3xl sm:text-4xl md:text-5xl text-event-text mb-6 drop-shadow-sm hover:text-gradient-primary transition-all duration-300">
          {handle.startsWith('@') ? handle : `@${handle}`}
        </h3>

        {/* Message */}
        <p className="font-event-body text-event-text/70 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {message}
        </p>

        {/* Button with Instagram colors */}
        <a
          href={instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:shadow-colored hover:scale-105 transition-smooth shadow-strong"
        >
          <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {button_text}
        </a>
      </div>
    </Section>
  );
}
