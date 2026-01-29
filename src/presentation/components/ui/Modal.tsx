import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  is_open: boolean;
  on_close: () => void;
  title?: string;
  children: React.ReactNode;
  show_close_button?: boolean;
  close_on_backdrop_click?: boolean;
}

export function Modal({
  is_open,
  on_close,
  title,
  children,
  show_close_button = true,
  close_on_backdrop_click = true,
}: ModalProps) {
  // Handle ESC key press
  useEffect(() => {
    if (!is_open) return;

    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        on_close();
      }
    };

    document.addEventListener('keydown', handle_escape);
    return () => document.removeEventListener('keydown', handle_escape);
  }, [is_open, on_close]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (is_open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [is_open]);

  const handle_backdrop_click = (e: React.MouseEvent<HTMLDivElement>) => {
    if (close_on_backdrop_click && e.target === e.currentTarget) {
      on_close();
    }
  };

  if (!is_open) return null;

  const modal_content = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 modal-backdrop-blur animate-fade-in"
      onClick={handle_backdrop_click}
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className="relative rounded-3xl shadow-strong max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{
          backgroundColor: 'var(--color-event-bg, #ffffff)',
          color: 'var(--color-event-text, #2f2f2f)',
          zIndex: 10000,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with enhanced styling */}
        {(title || show_close_button) && (
          <div className="flex items-center justify-between p-6 border-b border-event-primary/10">
            {title && (
              <h2 className="font-event-display text-2xl sm:text-3xl text-gradient-primary drop-shadow-sm">
                {title}
              </h2>
            )}
            {show_close_button && (
              <button
                onClick={on_close}
                className="ml-auto p-2.5 text-event-text/60 hover:text-event-text hover:bg-event-primary/10 rounded-full transition-smooth shadow-soft hover:shadow-medium"
                aria-label="Cerrar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content with better padding */}
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal_content, document.body);
}
