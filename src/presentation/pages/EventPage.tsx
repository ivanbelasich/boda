import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Event } from '../../domain/event/Event';
import { createSupabaseEventRepository } from '../../infrastructure/supabase/SupabaseEventRepository';
import { HeroSection } from '../components/sections/HeroSection';
import { UploadSection } from '../components/sections/UploadSection';
import { CountdownSection } from '../components/sections/CountdownSection';
import { LocationSection } from '../components/sections/LocationSection';
import { GiftSection } from '../components/sections/GiftSection';
import { DressCodeSection } from '../components/sections/DressCodeSection';
import { CalendarSection } from '../components/sections/CalendarSection';
import { useEventTheme } from '../hooks/useEventTheme';
import { getUploadWindowStatus } from '../hooks/useUploadWindow';

type LoadingState = 'loading' | 'success' | 'not_found' | 'error';

const event_repository = createSupabaseEventRepository();

export function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading_state, setLoadingState] = useState<LoadingState>('loading');

  const theme_vars = useEventTheme(event?.theme);

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

  if (loading_state === 'loading') {
    return (
      <main className="min-h-screen bg-event-bg flex items-center justify-center">
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
        return <HeroSection key={`hero-${index}`} data={section} />;
      
      case 'countdown':
        return (
          <CountdownSection 
            key={`countdown-${index}`} 
            data={section} 
            event_date={event.event_date} 
          />
        );
      
      case 'location':
        return <LocationSection key={`location-${index}`} data={section} />;
      
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
          <UploadSection
            key={`upload-${index}`}
            data={section}
            script_url={event.drive_script_url}
            upload_start_time={event.upload_start_time}
            upload_end_time={event.upload_end_time}
            event_date={event.event_date}
            event_slug={slug}
          />
        );
      
      case 'gallery':
        // TODO: Implement GallerySection
        return null;
      
      default:
        return null;
    }
  };

  return (
    <main 
      className="min-h-screen bg-event-bg relative overflow-hidden"
      style={theme_vars as React.CSSProperties}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-event-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-event-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-event-light/30 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {reordered_sections.map(renderSection)}

        {/* Bottom decoration */}
        <div className="animate-fade-in-up-delay-3 mt-12 animate-float">
          <svg className="w-16 h-auto text-event-primary/50" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C30 0 40 10 40 20C40 30 30 40 30 40C30 40 20 30 20 20C20 10 30 0 30 0Z" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M30 10C30 10 35 15 35 20C35 25 30 30 30 30C30 30 25 25 25 20C25 15 30 10 30 10Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="font-event-body text-sm text-event-dark/40">
          {event.title} ♥
        </p>
      </footer>
    </main>
  );
}
