import { useState, useRef, useCallback } from 'react';
import { createDriveService } from '../../infrastructure/drive/DriveService';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UsePhotoUploadParams {
  script_url?: string;
  on_success?: () => void;
  on_error?: (error: Error) => void;
}

interface UsePhotoUploadReturn {
  status: UploadStatus;
  progress: number;
  file_input_ref: React.RefObject<HTMLInputElement | null>;
  triggerFileSelect: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  resetStatus: () => void;
}

export function usePhotoUpload({
  script_url,
  on_success,
  on_error,
}: UsePhotoUploadParams): UsePhotoUploadReturn {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const file_input_ref = useRef<HTMLInputElement>(null);

  const triggerFileSelect = useCallback(() => {
    file_input_ref.current?.click();
  }, []);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setProgress(0);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!script_url) {
      console.error('Upload not configured: missing script_url');
      setStatus('error');
      setTimeout(resetStatus, 3000);
      return;
    }

    const drive_service = createDriveService(script_url);

    setStatus('uploading');
    setProgress(0);

    const total_files = files.length;
    let uploaded_count = 0;

    for (const file of Array.from(files)) {
      try {
        const result = await drive_service.uploadPhoto(file);
        
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        uploaded_count++;
        setProgress(Math.round((uploaded_count / total_files) * 100));
      } catch (error) {
        console.error('Error uploading file:', error);
        setStatus('error');
        on_error?.(error instanceof Error ? error : new Error('Upload failed'));
        setTimeout(resetStatus, 3000);
        return;
      }
    }

    setStatus('success');
    on_success?.();
    
    setTimeout(() => {
      resetStatus();
    }, 3000);

    // Reset file input
    if (file_input_ref.current) {
      file_input_ref.current.value = '';
    }
  }, [script_url, on_success, on_error, resetStatus]);

  return {
    status,
    progress,
    file_input_ref,
    triggerFileSelect,
    handleFileSelect,
    resetStatus,
  };
}

