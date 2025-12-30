import type { LocationSection as LocationSectionData } from '../../../domain/event/Event';

interface LocationSectionProps {
  data: LocationSectionData;
}

export function LocationSection({ data }: LocationSectionProps) {
  const {
    title,
    venue_name,
    address,
    city,
    datetime,
    google_maps_url,
    google_maps_embed_url,
    additional_info,
  } = data;

  const handleOpenMaps = () => {
    if (google_maps_url) {
      window.open(google_maps_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-md mx-auto py-6">
      {/* Section title */}
      <h3 className="font-event-display text-xl sm:text-2xl text-event-primary text-center mb-4">
        {title}
      </h3>

      {/* Location card */}
      <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl p-6 text-center">
        {/* Datetime */}
        {datetime && (
          <p className="font-event-body text-event-text/70 text-sm mb-2">
            {datetime}
          </p>
        )}

        {/* Venue name */}
        <h4 className="font-event-display text-lg text-event-text font-medium mb-1">
          {venue_name}
        </h4>

        {/* Address */}
        <p className="font-event-body text-event-text/70 text-sm">
          {address}
        </p>

        {/* City */}
        {city && (
          <p className="font-event-body text-event-text/60 text-sm">
            {city}
          </p>
        )}

        {/* Additional info */}
        {additional_info && (
          <p className="font-event-body text-event-text/50 text-xs mt-2 italic">
            {additional_info}
          </p>
        )}

        {/* Google Maps button */}
        {google_maps_url && (
          <button
            onClick={handleOpenMaps}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-event-light text-event-text font-event-body text-sm rounded-full border border-event-primary/20 hover:bg-event-primary hover:text-white hover:border-event-primary transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cómo llegar
          </button>
        )}

        {/* Embedded map (optional) */}
        {google_maps_embed_url && (
          <div className="mt-4 rounded-xl overflow-hidden border border-event-primary/10">
            <iframe
              src={google_maps_embed_url}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ${venue_name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

