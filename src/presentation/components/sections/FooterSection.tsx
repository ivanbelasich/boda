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
    <Section variant="secondary">
      <div className="animate-fade-in-up text-center py-4">
        <p className="font-event-body text-white/90 text-base sm:text-lg italic">
          {message}
        </p>
      </div>
    </Section>
  );
}

