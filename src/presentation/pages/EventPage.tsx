import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Event, LocationSection as LocationSectionData } from '../../domain/event/Event';
import { createSupabaseEventRepository } from '../../infrastructure/supabase/SupabaseEventRepository';
import { HeroSection } from '../components/sections/HeroSection';
import { UploadSection } from '../components/sections/UploadSection';
import { CountdownSection } from '../components/sections/CountdownSection';
import { LocationsContainer } from '../components/sections/LocationSection';
import { GiftSection } from '../components/sections/GiftSection';
import { DressCodeSection } from '../components/sections/DressCodeSection';
import { CalendarSection } from '../components/sections/CalendarSection';
import { InstagramSection } from '../components/sections/InstagramSection';
import { RSVPSection } from '../components/sections/RSVPSection';
import { PlaylistSection } from '../components/sections/PlaylistSection';
import { InfoSection } from '../components/sections/InfoSection';
import { PhotoGallerySection } from '../components/sections/PhotoGallerySection';
import { FooterSection } from '../components/sections/FooterSection';
import { Section } from '../components/ui/Section';
import { ThemeProvider } from '../context/ThemeContext';
import { useFullEventTheme } from '../hooks/useEventTheme';
import { getUploadWindowStatus } from '../hooks/useUploadWindow';

type LoadingState = 'loading' | 'success' | 'not_found' | 'error';

const event_repository = createSupabaseEventRepository();

export function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading_state, setLoadingState] = useState<LoadingState>('loading');

  const theme_config = useFullEventTheme(event?.theme);

  // Update page title dynamically
  useEffect(() => {
    if (event) {
      document.title = `${event.title} | La Fecha Eventos`;
    }
    return () => {
      document.title = 'La Fecha Eventos';
    };
  }, [event]);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) {
        setLoadingState('not_found');
        return;
      }

      try {
        const found_event = await event_repository.findBySlug(slug);
        
        if (!found_event) {
          setLoadingState('not_found');
          return;
        }

        setEvent(found_event);
        setLoadingState('success');
      } catch (error) {
        console.error('Error loading event:', error);
        setLoadingState('error');
      }
    }

    loadEvent();
  }, [slug]);

  // Determine upload window status (must be before early returns)
  const upload_status = useMemo(() => {
    if (!event) return 'not_configured';
    return getUploadWindowStatus({
      script_url: event.drive_script_url,
      upload_start_time: event.upload_start_time,
      upload_end_time: event.upload_end_time,
    });
  }, [event]);

  // Check if event is close (less than 7 days away)
  const is_event_close = useMemo(() => {
    if (!event) return false;
    const days_until_event = Math.floor(
      (event.event_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days_until_event >= 0 && days_until_event < 7;
  }, [event]);

  // Reorder sections to prioritize upload when event is close or gallery is active
  const reordered_sections = useMemo(() => {
    if (!event) return [];
    
    const sections = [...event.sections];
    
    // Find upload section index
    const upload_index = sections.findIndex(s => s.type === 'upload');
    
    // If upload section exists and should be prioritized
    if (
      upload_index !== -1 && 
      (upload_status === 'active' || 
       upload_status === 'same_day_waiting' || 
       is_event_close)
    ) {
      // Find hero and countdown indices
      const hero_index = sections.findIndex(s => s.type === 'hero');
      const countdown_index = sections.findIndex(s => s.type === 'countdown');
      
      // Determine target position (after hero and countdown, whichever comes last)
      const last_priority_index = Math.max(
        hero_index !== -1 ? hero_index : -1,
        countdown_index !== -1 ? countdown_index : -1
      );
      
      // If we have a priority section, move upload right after it
      if (last_priority_index !== -1 && upload_index > last_priority_index) {
        const upload_section = sections.splice(upload_index, 1)[0];
        sections.splice(last_priority_index + 1, 0, upload_section);
      }
    }
    
    return sections;
  }, [event, upload_status, is_event_close]);

  // Group consecutive location sections for side-by-side display
  const grouped_sections = useMemo(() => {
    const result: Array<{ type: 'single'; section: Event['sections'][number] } | { type: 'locations'; sections: LocationSectionData[] }> = [];
    let location_buffer: LocationSectionData[] = [];

    for (const section of reordered_sections) {
      if (section.type === 'location') {
        location_buffer.push(section);
      } else {
        // Flush location buffer
        if (location_buffer.length > 0) {
          result.push({ type: 'locations', sections: location_buffer });
          location_buffer = [];
        }
        result.push({ type: 'single', section });
      }
    }

    // Flush remaining locations
    if (location_buffer.length > 0) {
      result.push({ type: 'locations', sections: location_buffer });
    }

    return result;
  }, [reordered_sections]);

  if (loading_state === 'loading') {
    return (
      <main 
        className="min-h-screen bg-event-bg flex items-center justify-center"
        style={theme_config.style_vars as React.CSSProperties}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-event-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-event-body text-event-text/70">Cargando evento...</p>
        </div>
      </main>
    );
  }

  if (loading_state === 'not_found') {
    return (
      <main className="min-h-screen bg-event-bg flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-event-display text-4xl text-event-text mb-4">Evento no encontrado</h1>
          <p className="font-event-body text-event-text/70">
            El evento que buscas no existe o ya no está disponible.
          </p>
        </div>
      </main>
    );
  }

  if (loading_state === 'error' || !event) {
    return (
      <main className="min-h-screen bg-event-bg flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-event-display text-4xl text-event-text mb-4">Error</h1>
          <p className="font-event-body text-event-text/70">
            Ocurrió un error al cargar el evento. Intenta nuevamente.
          </p>
        </div>
      </main>
    );
  }

  // Get first location for calendar (if any)
  const first_location = event.sections.find(s => s.type === 'location') as 
    | Extract<Event['sections'][number], { type: 'location' }> 
    | undefined;

  const renderSection = (section: Event['sections'][number], index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <HeroSection 
              key={`hero-${index}`} 
              data={section}
              event_date={event.event_date}
              hero_style={theme_config.hero_style}
              decorations={theme_config.decorations}
              texture_url={theme_config.hero_texture_url}
              variant={theme_config.variant}
            />
            <CountdownSection 
              key="countdown" 
              event_date={event.event_date} 
              upload_end_time={event.upload_end_time}
            />
          </>
        );
      
      case 'countdown':
        // Countdown is automatically rendered after hero, ignore if in sections array
        return null;
      
      case 'location':
        // Handled by grouped sections
        return null;
      
      case 'gift':
        return <GiftSection key={`gift-${index}`} data={section} />;
      
      case 'dresscode':
        return <DressCodeSection key={`dresscode-${index}`} data={section} />;
      
      case 'calendar':
        return (
          <CalendarSection 
            key={`calendar-${index}`} 
            data={section}
            event_title={event.title}
            event_date={event.event_date}
            event_location={first_location?.venue_name}
          />
        );
      
      case 'upload':
        return (
          <Section key={`upload-${index}`} variant="light">
            <UploadSection
              data={section}
              script_url={event.drive_script_url}
              upload_start_time={event.upload_start_time}
              upload_end_time={event.upload_end_time}
              event_date={event.event_date}
              event_slug={slug}
            />
          </Section>
        );

      case 'instagram':
        return <InstagramSection key={`instagram-${index}`} data={section} />;

      case 'rsvp':
        return <RSVPSection key={`rsvp-${index}`} data={section} />;

      case 'playlist':
        return <PlaylistSection key={`playlist-${index}`} data={section} />;

      case 'info':
        return <InfoSection key={`info-${index}`} data={section} />;

      case 'photo_gallery':
        return <PhotoGallerySection key={`photo_gallery-${index}`} data={section} />;

      case 'footer':
        return <FooterSection key={`footer-${index}`} data={section} />;
      
      case 'gallery':
        // TODO: Implement live GallerySection (photo upload gallery)
        return null;
      
      default:
        return null;
    }
  };

  const renderGroupedSection = (group: typeof grouped_sections[number], index: number) => {
    if (group.type === 'locations') {
      return <LocationsContainer key={`locations-${index}`} locations={group.sections} />;
    }
    return renderSection(group.section, index);
  };

  return (
    <ThemeProvider preset={theme_config.preset} variant={theme_config.variant}>
      <main 
        className="min-h-screen bg-event-bg theme-root"
        style={theme_config.style_vars as React.CSSProperties}
        data-theme={theme_config.preset}
      >
        {/* Render sections */}
        {grouped_sections.map(renderGroupedSection)}

        {/* Footer de contenido (si existe en sections) se renderiza en grouped_sections */}
        {/* Si no hay sección footer, mostramos mensaje de cierre */}
        {!event.sections.some(s => s.type === 'footer') && (
          <FooterSection 
            key="footer-fallback" 
            data={{ type: 'footer', message: `${event.title} · Gracias por acompañarnos` }} 
          />
        )}
        {/* Barra final siempre visible */}
        <footer className="page-footer-strip border-t border-event-primary/20 bg-event-bg/95 py-6 text-center">
          <p className="font-event-body text-sm text-event-text/50">
            {event.title} ♥ La Fecha
          </p>
        </footer>
      </main>
    </ThemeProvider>
  );
}
