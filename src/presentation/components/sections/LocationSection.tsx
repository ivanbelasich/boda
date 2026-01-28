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
    additional_info,
  } = data;

  const handleOpenMaps = () => {
    if (google_maps_url) {
      window.open(google_maps_url, '_blank', 'noopener,noreferrer');
    }
  };

  const icon_type = getLocationIconType(title, venue_name);

  return (
    <div className="animate-fade-in-up flex flex-col items-center text-center">
      {/* Icon */}
      <div className="mb-4 text-event-text/70">
        {icon_type === 'church' && <ChurchIcon className="w-12 h-12 md:w-14 md:h-14" />}
        {icon_type === 'champagne' && <ChampagneIcon className="w-12 h-12 md:w-14 md:h-14" />}
        {icon_type === 'pin' && <MapPinIcon className="w-12 h-12 md:w-14 md:h-14" />}
      </div>

      {/* Section title */}
      <h3 className="font-event-display text-lg sm:text-xl tracking-elegant uppercase text-event-text mb-6">
        {title}
      </h3>

      {/* Location details */}
      <div className="space-y-1 mb-6">
        {/* Datetime */}
        {datetime && (
          <p className="font-event-body text-event-text/80 text-sm sm:text-base">
            {datetime}
          </p>
        )}

        {/* Venue name */}
        <p className="font-event-body text-event-text/80 text-sm sm:text-base">
          {venue_name}
        </p>

        {/* City */}
        {city && (
          <p className="font-event-body text-event-text/70 text-sm sm:text-base">
            {city}
          </p>
        )}

        {/* Address */}
        {address && (
          <p className="font-event-body text-event-text/60 text-sm">
            {address}
          </p>
        )}

        {/* Additional info */}
        {additional_info && (
          <p className="font-event-body text-event-text/50 text-xs mt-2 italic">
            {additional_info}
          </p>
        )}
      </div>

      {/* Google Maps button */}
      {google_maps_url && (
        <button
          onClick={handleOpenMaps}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-event-primary text-white font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-event-dark transition-all duration-300 cursor-pointer"
        >
          LLEGAR A {title.toUpperCase().includes('CEREMONIA') ? 'LA CEREMONIA' : 
                    title.toUpperCase().includes('FIESTA') ? 'LA FIESTA' : 
                    title.toUpperCase()}
        </button>
      )}
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
        <div className="max-w-md mx-auto">
          <LocationSection data={locations[0]} />
        </div>
      </div>
    );
  }

  // Grid layout for 2+ locations
  return (
    <div className="py-16 md:py-24 px-6 bg-event-bg">
      <div className="max-w-5xl mx-auto">
        <div className={`grid gap-12 md:gap-16 ${
          locations.length === 2 ? 'md:grid-cols-2' : 
          locations.length === 3 ? 'md:grid-cols-3' : 
          'md:grid-cols-2'
        }`}>
          {locations.map((location, index) => (
            <LocationSection key={`location-${index}`} data={location} />
          ))}
        </div>
      </div>
    </div>
  );
}
