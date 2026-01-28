import type { PhotoGallerySection as PhotoGallerySectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';

interface PhotoGallerySectionProps {
  data: PhotoGallerySectionData;
}

export function PhotoGallerySection({ data }: PhotoGallerySectionProps) {
  const {
    title = 'NOSOTROS...',
    photos = [],
  } = data;

  if (photos.length === 0) {
    return null;
  }

  return (
    <Section variant="light">
      <div className="animate-fade-in-up">
        {/* Title */}
        <h3 className="font-event-display text-lg sm:text-xl tracking-elegant uppercase text-event-text text-center mb-8">
          {title}
        </h3>

        {/* Photo grid - 4 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {photos.map((photo_url, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-sm"
            >
              <img
                src={photo_url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

