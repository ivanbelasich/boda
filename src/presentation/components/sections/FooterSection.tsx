import type { FooterSection as FooterSectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';

interface FooterSectionProps {
  data: FooterSectionData;
}

export function FooterSection({ data }: FooterSectionProps) {
  const {
    message = '¡Gracias por acompañarnos en este momento tan importante!',
  } = data;

  return (
    <Section variant="secondary" className="page-footer border-t-2 border-white/20">
      <div className="animate-fade-in-up text-center py-8">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30" />
          <svg className="w-8 h-8 text-white/40" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 56 C16 40 8 28 8 20 C8 12 14 6 22 6 C28 6 32 12 32 12 C32 12 36 6 42 6 C50 6 56 12 56 20 C56 28 48 40 32 56" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30" />
        </div>

        {/* Message */}
        <p className="font-event-body text-white/90 text-lg sm:text-xl italic leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
          {message}
        </p>

        {/* Decorative bottom element */}
        <div className="mt-8 flex items-center justify-center gap-2 text-white/30">
          <span className="text-sm">✦</span>
          <span className="text-xs">✦</span>
          <span className="text-sm">✦</span>
        </div>
      </div>
    </Section>
  );
}
