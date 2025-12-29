/**
 * Hook to determine the upload window status based on time configuration
 */

export type UploadWindowStatus = 
  | 'not_configured' 
  | 'before_event' 
  | 'same_day_waiting' 
  | 'active' 
  | 'closed';

interface UseUploadWindowParams {
  script_url?: string;
  upload_start_time?: Date;
  upload_end_time?: Date;
}

export function getUploadWindowStatus({
  script_url,
  upload_start_time,
  upload_end_time,
}: UseUploadWindowParams): UploadWindowStatus {
  // No album service contracted
  if (!script_url) {
    return 'not_configured';
  }

  // Album contracted but no time window configured - always active
  if (!upload_start_time || !upload_end_time) {
    return 'active';
  }

  const now = new Date();

  // Before the upload window
  if (now < upload_start_time) {
    const is_same_day = now.toDateString() === upload_start_time.toDateString();
    return is_same_day ? 'same_day_waiting' : 'before_event';
  }

  // After the upload window
  if (now > upload_end_time) {
    return 'closed';
  }

  // Within the upload window
  return 'active';
}

export function useUploadWindow(params: UseUploadWindowParams): UploadWindowStatus {
  return getUploadWindowStatus(params);
}

