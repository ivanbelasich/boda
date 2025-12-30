import { Link } from 'react-router-dom';
import type { UploadSection as UploadSectionData } from '../../../domain/event/Event';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';
import { useUploadWindow } from '../../hooks/useUploadWindow';
import { formatDate, formatTime } from '../../utils/date-formatters';

interface UploadSectionProps {
  data: UploadSectionData;
  script_url?: string;
  upload_start_time?: Date;
  upload_end_time?: Date;
  event_date: Date;
  event_slug?: string;
}

export function UploadSection({ 
  data, 
  script_url, 
  upload_start_time, 
  upload_end_time,
  event_date,
  event_slug
}: UploadSectionProps) {
  const { message, projection_note } = data;
  
  const window_status = useUploadWindow({ 
    script_url, 
    upload_start_time, 
    upload_end_time 
  });

  const { 
    status, 
    progress, 
    file_input_ref, 
    triggerFileSelect, 
    handleFileSelect 
  } = usePhotoUpload({ script_url });

  const getButtonContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subiendo... {progress}%
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ¡Fotos subidas!
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Error al subir
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Subir Fotos
          </span>
        );
    }
  };

  const getButtonClass = () => {
    const base_class = "animate-fade-in-up-delay-3 group relative px-8 py-4 font-event-body text-xl tracking-wide rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95";
    
    switch (status) {
      case 'success':
        return `${base_class} bg-green-600 text-white shadow-green-600/30`;
      case 'error':
        return `${base_class} bg-red-500 text-white shadow-red-500/30`;
      case 'uploading':
        return `${base_class} bg-event-light text-event-text shadow-event-light/30 cursor-wait`;
      default:
        return `${base_class} bg-event-light text-event-text shadow-event-light/30 hover:bg-event-primary hover:text-white hover:shadow-xl hover:shadow-event-primary/40 hover:scale-105`;
    }
  };

  // Not configured - don't render the section
  if (window_status === 'not_configured') {
    return null;
  }

  // Before the event day
  if (window_status === 'before_event' && upload_start_time) {
    return (
      <div className="animate-fade-in-up-delay-3 text-center">
        <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-md leading-relaxed mb-6">
          {message}
        </p>
        
        <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl px-8 py-6 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-3 text-event-primary mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-event-display text-lg font-medium">Galería de fotos</span>
          </div>
          <p className="font-event-body text-event-text/60 text-sm">
            Se habilitará el {formatDate(upload_start_time)}
          </p>
        </div>
      </div>
    );
  }

  // Same day, waiting for the start time
  if (window_status === 'same_day_waiting' && upload_start_time) {
    return (
      <div className="animate-fade-in-up-delay-3 text-center">
        <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-md leading-relaxed mb-6">
          {message}
        </p>
        
        <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl px-8 py-6 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-3 text-event-primary mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-event-display text-lg font-medium">¡Casi listo!</span>
          </div>
          <p className="font-event-body text-event-text/60 text-sm mb-4">
            La galería abrirá a las {formatTime(upload_start_time)}
          </p>
          {event_slug && (
            <Link
              to={`/eventos/${event_slug}/presentacion`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-event-primary/10 border border-event-primary/30 text-event-primary font-event-body text-lg rounded-full hover:bg-event-primary hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ver galería
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Upload window closed
  if (window_status === 'closed') {
    const now = new Date();
    const event_passed = now > event_date;
    
    // If the event has passed, show thank you message
    if (event_passed) {
      return (
        <div className="animate-fade-in-up-delay-3 text-center">
          <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl px-8 py-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3 text-event-primary mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-event-display text-lg font-medium">¡Gracias por participar!</span>
            </div>
            <p className="font-event-body text-event-text/60 text-sm mb-4">
              La galería de fotos está cerrada
            </p>
            {event_slug && (
              <Link
                to={`/eventos/${event_slug}/presentacion`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-event-primary text-white font-event-body text-lg rounded-full hover:bg-event-dark transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ver galería
              </Link>
            )}
          </div>
        </div>
      );
    }
    
    // Upload window closed but event hasn't passed - show that it will open
    if (upload_start_time) {
      return (
        <div className="animate-fade-in-up-delay-3 text-center">
          <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-md leading-relaxed mb-6">
            {message}
          </p>
          
          <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl px-8 py-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3 text-event-primary mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-event-display text-lg font-medium">Galería de fotos</span>
            </div>
            <p className="font-event-body text-event-text/60 text-sm">
              La galería abrirá el {formatDate(upload_start_time)} a las {formatTime(upload_start_time)}
            </p>
          </div>
        </div>
      );
    }
  }

  // Active - show upload button
  return (
    <>
      <input
        ref={file_input_ref}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar fotos para subir"
      />

      <p className="animate-fade-in-up-delay-3 font-event-body text-lg sm:text-xl text-event-text/80 text-center max-w-md leading-relaxed mb-4">
        {message}
      </p>

      {projection_note && (
        <div className="animate-fade-in-up-delay-3 bg-event-primary/10 border border-event-primary/30 rounded-2xl px-6 py-4 max-w-sm text-center mb-10">
          <p className="font-event-body text-event-text/90 text-base leading-relaxed">
            {projection_note}
          </p>
        </div>
      )}

      <button
        onClick={triggerFileSelect}
        disabled={status === 'uploading'}
        className={getButtonClass()}
      >
        {getButtonContent()}
      </button>

      {event_slug && (
        <Link
          to={`/eventos/${event_slug}/presentacion`}
          className="animate-fade-in-up-delay-3 inline-flex items-center gap-2 mt-6 px-6 py-3 bg-event-primary/10 border border-event-primary/30 text-event-primary font-event-body text-lg rounded-full hover:bg-event-primary hover:text-white transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Ver galería en vivo
        </Link>
      )}
    </>
  );
}
