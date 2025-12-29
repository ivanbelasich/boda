import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { Event } from '../../domain/event/Event';
import { createSupabaseEventRepository } from '../../infrastructure/supabase/SupabaseEventRepository';
import { useEventTheme } from '../hooks/useEventTheme';

// Intervals (configurable via env vars)
const REFRESH_INTERVAL = Number(import.meta.env.VITE_PHOTO_REFRESH_INTERVAL) || 15000; // 15 seconds default
const SLIDE_DURATION = Number(import.meta.env.VITE_SLIDE_DURATION) || 6000; // 6 seconds per photo

interface Photo {
  id: string;
  url: string;
  name: string;
  timestamp: number;
}

type LoadingState = 'loading' | 'success' | 'not_found' | 'error';

const event_repository = createSupabaseEventRepository();

function getDriveImageUrl(photo: Photo): string {
  return `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600`;
}

export function PresentationPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Event state
  const [event, setEvent] = useState<Event | null>(null);
  const [loading_state, setLoadingState] = useState<LoadingState>('loading');
  
  // Photos state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current_index, setCurrentIndex] = useState(0);
  const [is_transitioning, setIsTransitioning] = useState(false);
  const [last_photo_count, setLastPhotoCount] = useState(0);
  const [should_show_new_photo_alert, setShouldShowNewPhotoAlert] = useState(false);

  const theme_vars = useEventTheme(event?.theme);

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

  const drive_script_url = event?.drive_script_url;

  // Fetch photos from Drive
  const fetchPhotos = useCallback(async () => {
    if (!drive_script_url) {
      console.log('No drive_script_url configured');
      return;
    }

    try {
      const response = await fetch(`${drive_script_url}?action=list`, {
        method: 'GET',
        redirect: 'follow',
      });
      
      const data = await response.json();
      
      if (data.success && data.photos) {
        const new_photos = data.photos as Photo[];
        
        // Detect new photos
        if (new_photos.length > last_photo_count && last_photo_count > 0) {
          setShouldShowNewPhotoAlert(true);
          setTimeout(() => setShouldShowNewPhotoAlert(false), 3000);
          setCurrentIndex(0);
        }
        
        setPhotos(new_photos);
        setLastPhotoCount(new_photos.length);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }, [drive_script_url, last_photo_count]);

  // Polling for new photos
  useEffect(() => {
    if (loading_state !== 'success' || !drive_script_url) return;

    // Initial fetch with small delay to avoid cascading renders
    const initial_timeout = setTimeout(fetchPhotos, 100);
    const interval = setInterval(fetchPhotos, REFRESH_INTERVAL);
    
    return () => {
      clearTimeout(initial_timeout);
      clearInterval(interval);
    };
  }, [fetchPhotos, loading_state, drive_script_url]);

  // Auto-advance slides
  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsTransitioning(false);
      }, 500);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [photos.length]);

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

  const current_photo = photos[current_index];
  
  // Format date for display
  const formatted_date = event.event_date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="min-h-screen bg-event-text relative overflow-hidden"
      style={theme_vars as React.CSSProperties}
    >
      {/* Current photo */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          is_transitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={getDriveImageUrl(current_photo)}
          alt={current_photo.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain bg-black"
        />
      </div>

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
      {should_show_new_photo_alert && (
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
              onClick={() => setCurrentIndex(actual_index)}
              aria-label={`Ver foto ${actual_index + 1}`}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                actual_index === current_index
                  ? 'border-event-primary scale-110'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={getDriveImageUrl(photo)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Photo counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <p className="font-event-body text-white/60 text-sm">
          {current_index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
