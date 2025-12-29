import { useState, useEffect, useCallback } from 'react';
import { createDriveService, type Photo } from '../../infrastructure/drive/DriveService';

interface UsePhotoSlideshowParams {
  script_url?: string;
  refresh_interval?: number;
  slide_duration?: number;
  is_enabled?: boolean;
}

interface UsePhotoSlideshowReturn {
  photos: Photo[];
  current_index: number;
  current_photo: Photo | null;
  is_transitioning: boolean;
  has_new_photo: boolean;
  goToPhoto: (index: number) => void;
}

const DEFAULT_REFRESH_INTERVAL = 15000; // 15 seconds
const DEFAULT_SLIDE_DURATION = 6000; // 6 seconds

export function usePhotoSlideshow({
  script_url,
  refresh_interval = DEFAULT_REFRESH_INTERVAL,
  slide_duration = DEFAULT_SLIDE_DURATION,
  is_enabled = true,
}: UsePhotoSlideshowParams): UsePhotoSlideshowReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current_index, setCurrentIndex] = useState(0);
  const [is_transitioning, setIsTransitioning] = useState(false);
  const [last_photo_count, setLastPhotoCount] = useState(0);
  const [has_new_photo, setHasNewPhoto] = useState(false);

  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Fetch photos from Drive
  const fetchPhotos = useCallback(async () => {
    if (!script_url) return;

    const drive_service = createDriveService(script_url);
    const fetched_photos = await drive_service.listPhotos();

    // Detect new photos
    if (fetched_photos.length > last_photo_count && last_photo_count > 0) {
      setHasNewPhoto(true);
      setTimeout(() => setHasNewPhoto(false), 3000);
      setCurrentIndex(0);
    }

    setPhotos(fetched_photos);
    setLastPhotoCount(fetched_photos.length);
  }, [script_url, last_photo_count]);

  // Polling for new photos
  useEffect(() => {
    if (!is_enabled || !script_url) return;

    // Initial fetch with small delay
    const initial_timeout = setTimeout(fetchPhotos, 100);
    const interval = setInterval(fetchPhotos, refresh_interval);

    return () => {
      clearTimeout(initial_timeout);
      clearInterval(interval);
    };
  }, [fetchPhotos, is_enabled, script_url, refresh_interval]);

  // Auto-advance slides
  useEffect(() => {
    if (photos.length === 0 || !is_enabled) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsTransitioning(false);
      }, 500);
    }, slide_duration);

    return () => clearInterval(interval);
  }, [photos.length, slide_duration, is_enabled]);

  const current_photo = photos.length > 0 ? photos[current_index] : null;

  return {
    photos,
    current_index,
    current_photo,
    is_transitioning,
    has_new_photo,
    goToPhoto,
  };
}

