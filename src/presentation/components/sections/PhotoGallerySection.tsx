import { useState, useEffect } from 'react';
import type { PhotoGallerySection as PhotoGallerySectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';

interface PhotoGallerySectionProps {
  data: PhotoGallerySectionData;
}

export function PhotoGallerySection({ data }: PhotoGallerySectionProps) {
  const {
    title = 'NOSOTROS...',
    photos = [],
  } = data;

  const [lightbox_open, setLightboxOpen] = useState(false);
  const [current_image, setCurrentImage] = useState(0);
  const [images_loaded, setImagesLoaded] = useState<boolean[]>([]);
  const [touch_start, setTouchStart] = useState(0);
  const [touch_end, setTouchEnd] = useState(0);

  useEffect(() => {
    setImagesLoaded(new Array(photos.length).fill(false));
  }, [photos.length]);

  if (photos.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % photos.length);
  };

  const goToPrevious = () => {
    setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') closeLightbox();
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touch_start || !touch_end) return;
    
    const distance = touch_start - touch_end;
    const swipe_threshold = 50;

    if (distance > swipe_threshold) {
      goToNext();
    } else if (distance < -swipe_threshold) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <>
      <Section variant="light">
        <div className="animate-fade-in-up">
          {/* Enhanced Title with decorative elements */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-event-primary/30" />
              <svg className="w-8 h-8 text-event-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-event-primary/30" />
            </div>
            <h3 className="font-event-display text-3xl sm:text-4xl md:text-5xl tracking-elegant uppercase text-gradient-primary mb-3 drop-shadow-sm">
              {title}
            </h3>
            <p className="font-event-body text-event-text/60 text-sm sm:text-base">
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
            </p>
          </div>

          {/* Masonry grid with enhanced effects */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {photos.map((photo_url, index) => (
              <div
                key={index}
                className="break-inside-avoid animate-stagger cursor-pointer group relative"
                onClick={() => openLightbox(index)}
              >
                {/* Loading skeleton */}
                {!images_loaded[index] && (
                  <div className="absolute inset-0 bg-event-light/30 rounded-2xl shimmer" />
                )}
                
                <div className="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-smooth">
                  {/* Image */}
                  <img
                    src={photo_url}
                    alt={`Foto ${index + 1}`}
                    className={`w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ${
                      images_loaded[index] ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index)}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-strong">
                        <svg className="w-8 h-8 text-event-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Number indicator */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-event-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Enhanced Lightbox */}
      {lightbox_open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-blur animate-fade-in"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos en pantalla completa"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-20 p-3 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90 transition-smooth shadow-strong hover:scale-110"
            aria-label="Cerrar galería"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter with progress */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-black/70 backdrop-blur-md text-white rounded-full font-event-body text-sm shadow-strong">
            <div className="flex items-center gap-3">
              <span className="font-medium">{current_image + 1}</span>
              <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((current_image + 1) / photos.length) * 100}%` }}
                />
              </div>
              <span className="text-white/60">{photos.length}</span>
            </div>
          </div>

          {/* Previous button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-20 p-4 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90 transition-smooth shadow-strong hover:scale-110 active:scale-95"
              aria-label="Foto anterior"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image container with transition */}
          <div
            className="relative max-w-6xl max-h-[90vh] mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={current_image}
              src={photos[current_image]}
              alt={`Foto ${current_image + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-strong animate-fade-in"
            />
          </div>

          {/* Next button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-20 p-4 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90 transition-smooth shadow-strong hover:scale-110 active:scale-95"
              aria-label="Foto siguiente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Enhanced Thumbnail strip */}
          {photos.length > 1 && photos.length <= 20 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-x-auto max-w-[90vw] px-4 py-3 bg-black/70 backdrop-blur-md rounded-full scrollbar-hide">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    index === current_image
                      ? 'border-white scale-110 shadow-strong'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Swipe indicator for mobile */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 md:hidden">
            <div className="flex items-center gap-2 text-white/50 text-xs font-event-body">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Desliza para navegar</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbar for thumbnail strip */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
