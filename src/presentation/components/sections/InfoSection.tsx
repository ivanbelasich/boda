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
        {/* Title */}
        <h3 className="font-event-display text-lg sm:text-xl tracking-elegant uppercase text-white mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="font-event-body text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">
          {message}
        </p>

        {/* Button */}
        {has_content && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-event-body text-sm tracking-wider uppercase rounded-full border-2 border-white hover:bg-white hover:text-event-primary transition-all duration-300 cursor-pointer"
          >
            VER MÁS
          </button>
        )}

        {/* Info modal */}
        <Modal
          is_open={is_modal_open}
          on_close={() => setIsModalOpen(false)}
          title="Información Útil"
        >
          <div className="space-y-6 text-left">
            {/* Accommodations */}
            {accommodations.length > 0 && (
              <div>
                <h4 className="font-event-display text-lg text-event-primary mb-4">
                  Hoteles
                </h4>
                <div className="space-y-4">
                  {accommodations.map((acc, index) => (
                    <div key={index} className="border-b border-event-primary/10 pb-4 last:border-0">
                      <p className="font-event-body text-event-text font-medium">
                        {acc.name}
                      </p>
                      {acc.contact && (
                        <p className="font-event-body text-event-text/60 text-sm">
                          {acc.contact}
                        </p>
                      )}
                      {acc.address && (
                        <p className="font-event-body text-event-text/60 text-sm">
                          {acc.address}
                        </p>
                      )}
                      {acc.maps_url && (
                        <a
                          href={acc.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-event-primary text-sm hover:underline"
                        >
                          Cómo llegar
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
                <h4 className="font-event-display text-lg text-event-primary mb-4">
                  Traslados
                </h4>
                <div className="space-y-4">
                  {transfers.map((transfer, index) => (
                    <div key={index} className="border-b border-event-primary/10 pb-4 last:border-0">
                      <p className="font-event-body text-event-text font-medium">
                        {transfer.name}
                      </p>
                      {transfer.contact && (
                        <p className="font-event-body text-event-text/60 text-sm">
                          {transfer.contact}
                        </p>
                      )}
                      {transfer.website && (
                        <a
                          href={transfer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-event-primary text-sm hover:underline"
                        >
                          Ver web
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

