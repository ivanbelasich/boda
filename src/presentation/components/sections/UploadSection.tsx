import { useState } from 'react';
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
  const [is_dragging, setIsDragging] = useState(false);

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

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Convert FileList to DataTransfer for handleFileSelect
      const event = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  // Not configured - don't render the section
  if (window_status === 'not_configured') {
    return null;
  }

  // Before the event day
  if (window_status === 'before_event' && upload_start_time) {
    return (
      <div className="animate-fade-in-up text-center">
        <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-2xl mx-auto leading-relaxed mb-8">
          {message}
        </p>
        
        {/* Timeline visual */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            {/* Timeline bar */}
            <div className="h-2 bg-event-light/30 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-primary" />
            </div>
            
            {/* Timeline markers */}
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-event-primary mb-2" />
                <span className="text-xs text-event-text/60 font-event-body">Hoy</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-event-light border-2 border-event-primary mb-2" />
                <span className="text-xs text-event-primary font-event-body font-medium">
                  {formatDate(upload_start_time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-3xl px-8 py-8 max-w-md mx-auto shadow-strong">
          <div className="flex items-center justify-center gap-3 text-event-primary mb-3">
            <svg className="w-8 h-8 animate-pulse-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-event-display text-xl font-medium">Galería de fotos</span>
          </div>
          <p className="font-event-body text-event-text/70 text-base">
            Se habilitará el <span className="text-event-primary font-medium">{formatDate(upload_start_time)}</span>
          </p>
        </div>
      </div>
    );
  }

  // Same day, waiting for the start time
  if (window_status === 'same_day_waiting' && upload_start_time) {
    return (
      <div className="animate-fade-in-up text-center">
        <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-2xl mx-auto leading-relaxed mb-8">
          {message}
        </p>
        
        <div className="card-glass rounded-3xl px-8 py-8 max-w-md mx-auto shadow-strong animate-scale-in">
          <div className="flex items-center justify-center gap-3 text-event-primary mb-3">
            <div className="relative">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute inset-0 bg-event-primary/20 rounded-full animate-ping" />
            </div>
            <span className="font-event-display text-xl font-medium">¡Casi listo!</span>
          </div>
          <p className="font-event-body text-event-text/70 text-base mb-6">
            La galería abrirá a las <span className="text-event-primary font-medium">{formatTime(upload_start_time)}</span>
          </p>
          {event_slug && (
            <Link
              to={`/eventos/${event_slug}/presentacion`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-event-primary text-white font-event-body text-base rounded-full hover:bg-event-dark transition-smooth shadow-medium hover-lift"
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
    
    if (event_passed) {
      return (
        <div className="animate-fade-in-up text-center">
          <div className="card-glass rounded-3xl px-8 py-8 max-w-md mx-auto shadow-strong">
            <div className="flex items-center justify-center gap-3 text-event-primary mb-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-event-display text-xl font-medium">¡Gracias por participar!</span>
            </div>
            <p className="font-event-body text-event-text/70 text-base mb-6">
              La galería de fotos está cerrada
            </p>
            {event_slug && (
              <Link
                to={`/eventos/${event_slug}/presentacion`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-event-primary text-white font-event-body text-base rounded-full hover:bg-event-dark transition-smooth shadow-medium hover-lift"
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
    
    if (upload_start_time) {
      return (
        <div className="animate-fade-in-up text-center">
          <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-2xl mx-auto leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="card-glass rounded-3xl px-8 py-8 max-w-md mx-auto shadow-strong">
            <div className="flex items-center justify-center gap-3 text-event-primary mb-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-event-display text-xl font-medium">Galería de fotos</span>
            </div>
            <p className="font-event-body text-event-text/70 text-base">
              Se habilitará el {formatDate(upload_start_time)}
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Active - show enhanced upload interface
  return (
    <div className="animate-fade-in-up text-center">
      <input
        ref={file_input_ref}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar fotos para subir"
      />

      <p className="font-event-body text-lg sm:text-xl text-event-text/80 max-w-2xl mx-auto leading-relaxed mb-8">
        {message}
      </p>

      {projection_note && (
        <div className="card-glass rounded-2xl px-6 py-4 max-w-lg mx-auto mb-8 border border-event-primary/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-event-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-event-body text-event-text/90 text-sm text-left leading-relaxed">
              {projection_note}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced drag & drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={status !== 'uploading' ? triggerFileSelect : undefined}
        className={`
          max-w-2xl mx-auto mb-8 p-12 rounded-3xl border-2 border-dashed
          transition-all duration-300 cursor-pointer relative overflow-hidden
          ${is_dragging 
            ? 'border-event-primary bg-event-primary/10 scale-105' 
            : status === 'uploading'
            ? 'border-event-light bg-event-light/10 cursor-wait'
            : status === 'success'
            ? 'border-green-500 bg-green-50'
            : status === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-event-primary/30 bg-event-bg hover:border-event-primary hover:bg-event-primary/5 hover:scale-102'
          }
        `}
      >
        {/* Upload states */}
        {status === 'uploading' && (
          <div className="flex flex-col items-center">
            {/* Progress circle */}
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-event-light/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-event-primary"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-event-display text-2xl text-event-primary font-medium">
                  {progress}%
                </span>
              </div>
            </div>
            <p className="font-event-body text-event-text/80 text-lg">
              Subiendo fotos...
            </p>
            <p className="font-event-body text-event-text/50 text-sm mt-2">
              Por favor, no cierres esta ventana
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-copy-success">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-event-display text-2xl text-green-700 mb-2">
              ¡Fotos subidas con éxito!
            </p>
            <p className="font-event-body text-green-600 text-sm">
              Tus fotos están siendo procesadas
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-event-display text-2xl text-red-700 mb-2">
              Error al subir
            </p>
            <p className="font-event-body text-red-600 text-sm">
              Intenta nuevamente
            </p>
          </div>
        )}

        {status === 'idle' && (
          <div className="flex flex-col items-center">
            <div className="icon-circle p-6 mb-6 animate-pulse-soft">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-event-display text-2xl text-event-text mb-3">
              {is_dragging ? '¡Suelta las fotos aquí!' : 'Subir Fotos'}
            </p>
            <p className="font-event-body text-event-text/60 text-base">
              {is_dragging ? '' : 'Arrastra fotos aquí o haz clic para seleccionar'}
            </p>
          </div>
        )}
      </div>

      {/* View gallery link */}
      {event_slug && status !== 'uploading' && (
        <Link
          to={`/eventos/${event_slug}/presentacion`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-event-primary/10 backdrop-blur-sm border border-event-primary/30 text-event-primary font-event-body text-base rounded-full hover:bg-event-primary hover:text-white transition-smooth shadow-medium hover-lift"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Ver galería en vivo
        </Link>
      )}
    </div>
  );
}
