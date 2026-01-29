import { useState } from 'react';
import type { InfoSection as InfoSectionData } from '../../../domain/event/Event';
import { Section } from '../ui/Section';
import { Modal } from '../ui';

interface InfoSectionProps {
  data: InfoSectionData;
}

export function InfoSection({ data }: InfoSectionProps) {
  const [is_modal_open, setIsModalOpen] = useState(false);

  const {
    title = 'INFO ÚTIL',
    message = 'Te dejamos sugerencias de alojamientos y traslados para que aproveches ese fin de semana al máximo.',
    accommodations = [],
    transfers = [],
  } = data;

  const has_content = accommodations.length > 0 || transfers.length > 0;

  return (
    <Section variant="primary">
      <div className="animate-fade-in-up text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="icon-circle p-5 bg-white/10 backdrop-blur-md animate-scale-in">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-event-display text-xl sm:text-2xl md:text-3xl tracking-elegant uppercase text-white mb-6 drop-shadow-sm">
          {title}
        </h3>

        {/* Message */}
        <p className="font-event-body text-white/90 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          {message}
        </p>

        {/* Button */}
        {has_content && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md text-white font-event-body text-sm tracking-wider uppercase rounded-full border-2 border-white/30 hover:bg-white hover:text-event-primary transition-smooth shadow-strong hover:shadow-colored hover-lift cursor-pointer"
          >
            VER MÁS
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}

        {/* Info modal with enhanced styling */}
        <Modal
          is_open={is_modal_open}
          on_close={() => setIsModalOpen(false)}
          title="Información Útil"
        >
          <div className="space-y-8 text-left">
            {/* Accommodations */}
            {accommodations.length > 0 && (
              <div>
                <h4 className="font-event-display text-xl text-event-primary mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Hoteles
                </h4>
                <div className="space-y-4">
                  {accommodations.map((acc, index) => (
                    <div key={index} className="p-4 bg-event-light/30 rounded-xl border border-event-primary/10 hover:border-event-primary/30 transition-smooth">
                      <p className="font-event-body text-event-text font-medium text-lg mb-1">
                        {acc.name}
                      </p>
                      {acc.contact && (
                        <p className="font-event-body text-event-text/70 text-sm mb-1">
                          📞 {acc.contact}
                        </p>
                      )}
                      {acc.address && (
                        <p className="font-event-body text-event-text/70 text-sm mb-2">
                          📍 {acc.address}
                        </p>
                      )}
                      {acc.maps_url && (
                        <a
                          href={acc.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-event-primary text-sm font-medium hover:underline"
                        >
                          Cómo llegar
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transfers */}
            {transfers.length > 0 && (
              <div>
                <h4 className="font-event-display text-xl text-event-primary mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Traslados
                </h4>
                <div className="space-y-4">
                  {transfers.map((transfer, index) => (
                    <div key={index} className="p-4 bg-event-light/30 rounded-xl border border-event-primary/10 hover:border-event-primary/30 transition-smooth">
                      <p className="font-event-body text-event-text font-medium text-lg mb-1">
                        {transfer.name}
                      </p>
                      {transfer.contact && (
                        <p className="font-event-body text-event-text/70 text-sm mb-2">
                          📞 {transfer.contact}
                        </p>
                      )}
                      {transfer.website && (
                        <a
                          href={transfer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-event-primary text-sm font-medium hover:underline"
                        >
                          Ver web
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Section>
  );
}
