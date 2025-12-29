import { useState, useRef } from 'react';
import type { UploadSection as UploadSectionData } from '../../../domain/event/Event';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadSectionProps {
  data: UploadSectionData;
  script_url?: string;
}

export function UploadSection({ data, script_url }: UploadSectionProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [upload_progress, setUploadProgress] = useState(0);
  const file_input_ref = useRef<HTMLInputElement>(null);

  const { message, projection_note } = data;
  const is_upload_enabled = Boolean(script_url);

  const handleUploadClick = () => {
    file_input_ref.current?.click();
  };

  const uploadFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          
          if (!script_url) {
            reject(new Error('Upload not configured'));
            return;
          }

          const response = await fetch(script_url, {
            method: 'POST',
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              mimeType: file.type,
            }),
          });

          const result = await response.json();
          
          if (result.success) {
            resolve();
          } else {
            reject(new Error(result.error || 'Unknown error'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setStatus('uploading');
    setUploadProgress(0);

    const total_files = files.length;
    let uploaded_count = 0;

    for (const file of Array.from(files)) {
      try {
        await uploadFile(file);
        uploaded_count++;
        setUploadProgress(Math.round((uploaded_count / total_files) * 100));
      } catch (error) {
        console.error('Error uploading file:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
    }

    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setUploadProgress(0);
    }, 3000);

    if (file_input_ref.current) {
      file_input_ref.current.value = '';
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subiendo... {upload_progress}%
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

  // Show alternative message when upload is not configured
  if (!is_upload_enabled) {
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
            Próximamente podrás compartir tus fotos aquí
          </p>
        </div>
      </div>
    );
  }

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
        onClick={handleUploadClick}
        disabled={status === 'uploading'}
        className={getButtonClass()}
      >
        {getButtonContent()}
      </button>
    </>
  );
}
