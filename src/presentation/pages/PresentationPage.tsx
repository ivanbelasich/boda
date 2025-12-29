import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Event } from '../../domain/event/Event';
import { createSupabaseEventRepository } from '../../infrastructure/supabase/SupabaseEventRepository';
import { getDriveImageUrl } from '../../infrastructure/drive/DriveService';
import { useEventTheme } from '../hooks/useEventTheme';
import { usePhotoSlideshow } from '../hooks/usePhotoSlideshow';
import { formatFullDate, formatTime } from '../utils/date-formatters';

// Intervals (configurable via env vars)
const REFRESH_INTERVAL = Number(import.meta.env.VITE_PHOTO_REFRESH_INTERVAL) || 15000;
const SLIDE_DURATION = Number(import.meta.env.VITE_SLIDE_DURATION) || 6000;

type LoadingState = 'loading' | 'success' | 'not_found' | 'error';

const event_repository = createSupabaseEventRepository();

export function PresentationPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Event state
  const [event, setEvent] = useState<Event | null>(null);
  const [loading_state, setLoadingState] = useState<LoadingState>('loading');

  const theme_vars = useEventTheme(event?.theme);

  // Photo slideshow
  const {
    photos,
    current_index,
    current_photo,
    is_transitioning,
    has_new_photo,
    goToPhoto,
  } = usePhotoSlideshow({
    script_url: event?.drive_script_url,
    refresh_interval: REFRESH_INTERVAL,
    slide_duration: SLIDE_DURATION,
    is_enabled: loading_state === 'success',
  });

  // Update page title dynamically
  useEffect(() => {
    if (event) {
      document.title = `${event.title} - Presentación | La Fecha Eventos`;
    }
    return () => {
      document.title = 'La Fecha Eventos';
    };
  }, [event]);

  // Load event from Supabase
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

  // Loading state
  if (loading_state === 'loading') {
    return (
      <div className="min-h-screen bg-event-text flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-8 border-4 border-event-primary border-t-transparent rounded-full animate-spin" />
          <h2 className="font-event-display text-3xl text-event-primary mb-4">
            Cargando...
          </h2>
        </div>
      </div>
    );
  }

  // Not found state
  if (loading_state === 'not_found') {
    return (
      <div className="min-h-screen bg-event-text flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-event-display text-4xl text-white mb-4">Evento no encontrado</h1>
          <p className="font-event-body text-event-light/70">
            El evento que buscas no existe o ya no está disponible.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (loading_state === 'error' || !event) {
    return (
      <div className="min-h-screen bg-event-text flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-event-display text-4xl text-white mb-4">Error</h1>
          <p className="font-event-body text-event-light/70">
            Ocurrió un error al cargar el evento.
          </p>
        </div>
      </div>
    );
  }

  // Waiting for photos
  if (photos.length === 0) {
    return (
      <div 
        className="min-h-screen bg-event-text flex items-center justify-center"
        style={theme_vars as React.CSSProperties}
      >
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-8 border-4 border-event-primary border-t-transparent rounded-full animate-spin" />
          <h2 className="font-event-display text-3xl text-event-primary mb-4">
            Esperando fotos...
          </h2>
          <p className="font-event-body text-event-light/70">
            Las fotos aparecerán aquí cuando los invitados las suban
          </p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatted_date = formatFullDate(event.event_date);

  return (
    <div 
      className="min-h-screen bg-event-text relative overflow-hidden"
      style={theme_vars as React.CSSProperties}
    >
      {/* Current photo */}
      {current_photo && (
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            is_transitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img
            src={getDriveImageUrl(current_photo.id)}
            alt={current_photo.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain bg-black"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Header - Dynamic from event */}
      <header className="absolute top-4 left-4 pt-8 pb-8 pl-12 pr-8 sm:pt-10 sm:pb-10 sm:pl-16 sm:pr-10 z-10">
        <div>
          <h1 className="font-event-display text-2xl sm:text-3xl text-white/90">
            {event.title}
          </h1>
          <p className="font-event-body text-event-light text-sm">
            {formatted_date}
          </p>
        </div>
      </header>

      {/* New photo alert */}
      {has_new_photo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-fade-in-up">
          <div className="bg-event-primary text-white px-8 py-4 rounded-2xl shadow-2xl">
            <p className="font-event-display text-2xl">¡Nueva foto!</p>
          </div>
        </div>
      )}

      {/* Thumbnails sidebar */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-10">
        {photos.slice(
          Math.max(0, current_index - 2),
          Math.min(photos.length, current_index + 3)
        ).map((photo, idx) => {
          const actual_index = Math.max(0, current_index - 2) + idx;
          return (
            <button
              key={photo.id}
              onClick={() => goToPhoto(actual_index)}
              aria-label={`Ver foto ${actual_index + 1}`}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                actual_index === current_index
                  ? 'border-event-primary scale-110'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={getDriveImageUrl(photo.id)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Photo counter and timestamp */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="font-event-body text-white/60 text-sm">
          {current_index + 1} / {photos.length}
        </p>
        {current_photo && (
          <p className="font-event-body text-white/40 text-xl mt-1">
            📸 {formatTime(new Date(current_photo.timestamp))}
          </p>
        )}
      </div>
    </div>
  );
}
