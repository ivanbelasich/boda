import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Event } from '../../domain/event/Event';
import { createSupabaseEventRepository } from '../../infrastructure/supabase/SupabaseEventRepository';
import { HeroSection, UploadSection } from '../components/sections';
import { useEventTheme } from '../hooks/useEventTheme';

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

  const renderSection = (section: Event['sections'][number], index: number) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={`hero-${index}`} data={section} />;
      case 'upload':
        return (
          <UploadSection
            key={`upload-${index}`}
            data={section}
            script_url={event.drive_script_url}
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
        {event.sections.map(renderSection)}

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
