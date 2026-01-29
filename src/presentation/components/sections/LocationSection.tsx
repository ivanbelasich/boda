import type { LocationSection as LocationSectionData } from '../../../domain/event/Event';
import { ChurchIcon, ChampagneIcon, MapPinIcon } from '../icons';

interface LocationSectionProps {
  data: LocationSectionData;
}

// Determine icon type based on title/venue keywords
function getLocationIconType(title: string, venue_name: string): 'church' | 'champagne' | 'pin' {
  const combined = `${title} ${venue_name}`.toLowerCase();
  
  if (combined.includes('iglesia') || combined.includes('ceremonia') || combined.includes('church') || combined.includes('capilla')) {
    return 'church';
  }
  
  if (combined.includes('fiesta') || combined.includes('recepción') || combined.includes('salón') || combined.includes('party')) {
    return 'champagne';
  }
  
  return 'pin';
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

  const icon_type = getLocationIconType(title, venue_name);

  return (
    <div className="animate-fade-in-up flex flex-col items-center text-center h-full">
      {/* Card container with glassmorphism */}
      <div className="w-full max-w-md card-glass rounded-theme p-8 shadow-strong hover-lift transition-smooth">
        {/* Icon with gradient background circle */}
        <div className="mb-6 flex justify-center">
          <div className="icon-circle p-4">
            {icon_type === 'church' && <ChurchIcon className="w-14 h-14 md:w-16 md:h-16 text-white" />}
            {icon_type === 'champagne' && <ChampagneIcon className="w-14 h-14 md:w-16 md:h-16 text-white" />}
            {icon_type === 'pin' && <MapPinIcon className="w-14 h-14 md:w-16 md:h-16 text-white" />}
          </div>
        </div>

        {/* Section title */}
        <h3 className="font-event-display text-xl sm:text-2xl tracking-elegant uppercase text-event-text mb-6 drop-shadow-sm">
          {title}
        </h3>

        {/* Embedded map (if available) */}
        {google_maps_embed_url && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-medium border border-event-primary/20">
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

        {/* Location details */}
        <div className="space-y-2 mb-6">
          {/* Datetime with icon */}
          {datetime && (
            <div className="flex items-center justify-center gap-2 text-event-text/80">
              <svg className="w-4 h-4 text-event-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-event-body text-sm sm:text-base">
                {datetime}
              </p>
            </div>
          )}

          {/* Venue name - emphasized */}
          <p className="font-event-display text-lg sm:text-xl text-event-text font-medium drop-shadow-sm">
            {venue_name}
          </p>

          {/* City */}
          {city && (
            <p className="font-event-body text-event-text/70 text-sm sm:text-base">
              {city}
            </p>
          )}

          {/* Address with icon */}
          {address && (
            <div className="flex items-start justify-center gap-2 text-event-text/60 mt-3">
              <svg className="w-4 h-4 text-event-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-event-body text-sm text-left">
                {address}
              </p>
            </div>
          )}

          {/* Additional info */}
          {additional_info && (
            <p className="font-event-body text-event-text/50 text-xs mt-3 italic bg-event-primary/5 px-3 py-2 rounded-lg">
              {additional_info}
            </p>
          )}
        </div>

        {/* Google Maps button with animated icon */}
        {google_maps_url && (
          <button
            onClick={handleOpenMaps}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-event-primary text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-event-dark transition-smooth shadow-medium hover:shadow-colored cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            CÓMO LLEGAR
          </button>
        )}
      </div>
    </div>
  );
}

// Container component for multiple locations side by side
interface LocationsContainerProps {
  locations: LocationSectionData[];
}

export function LocationsContainer({ locations }: LocationsContainerProps) {
  if (locations.length === 0) return null;

  if (locations.length === 1) {
    return (
      <div className="py-16 md:py-24 px-6 bg-event-bg">
        <div className="max-w-xl mx-auto">
          <LocationSection data={locations[0]} />
        </div>
      </div>
    );
  }

  // Enhanced grid layout for 2+ locations with better spacing
  return (
    <div className="py-16 md:py-24 px-6 bg-event-bg">
      <div className="max-w-7xl mx-auto">
        <div className={`grid gap-8 md:gap-10 place-items-center ${
          locations.length === 2 ? 'md:grid-cols-2' : 
          locations.length === 3 ? 'lg:grid-cols-3 md:grid-cols-2' : 
          'lg:grid-cols-3 md:grid-cols-2'
        }`}>
          {locations.map((location, index) => (
            <div key={`location-${index}`} className="flex justify-center w-full">
              <LocationSection data={location} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
