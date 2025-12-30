import { useState } from 'react';
import type { GiftSection as GiftSectionData } from '../../../domain/event/Event';
import { Modal } from '../ui';

interface GiftSectionProps {
  data: GiftSectionData;
}

type CopiedField = 'cbu' | 'alias' | null;

export function GiftSection({ data }: GiftSectionProps) {
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [copied_field, setCopiedField] = useState<CopiedField>(null);

  const {
    title = 'Si deseás hacernos un regalo...',
    message,
    bank_info,
    external_links,
    mercadopago_link,
  } = data;

  const handleCopy = async (text: string, field: CopiedField) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const open_modal = () => setIsModalOpen(true);
  const close_modal = () => setIsModalOpen(false);

  return (
    <div className="animate-fade-in-up w-full max-w-md mx-auto py-6 text-center">
      {/* Title */}
      <h3 className="font-event-display text-xl sm:text-2xl text-event-primary mb-3">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="font-event-body text-event-text/70 text-sm mb-6">
          {message}
        </p>
      )}

      {/* Bank info button */}
      {bank_info && (
        <button
          onClick={open_modal}
          className="mb-4 inline-flex items-center gap-2 px-5 py-2.5 bg-event-light text-event-text font-event-body text-sm rounded-full border border-event-primary/20 hover:bg-event-primary hover:text-white hover:border-event-primary transition-all duration-300 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Ver Datos Bancarios
        </button>
      )}

      {/* Bank info modal */}
      {bank_info && (
        <Modal
          is_open={is_modal_open}
          on_close={close_modal}
          title="Datos Bancarios"
        >
          <div className="space-y-4">
            {/* Holder name */}
            <div className="flex justify-between items-center pb-3 border-b border-event-primary/10">
              <span className="font-event-body text-event-text/60">Titular:</span>
              <span className="font-event-body text-event-text font-medium">
                {bank_info.holder_name}
              </span>
            </div>

            {/* CBU */}
            <div className="flex justify-between items-center gap-2 pb-3 border-b border-event-primary/10">
              <span className="font-event-body text-event-text/60">CBU:</span>
              <div className="flex items-center gap-2">
                <span className="font-event-body text-event-text font-medium text-sm">
                  {bank_info.cbu}
                </span>
                <button
                  onClick={() => handleCopy(bank_info.cbu, 'cbu')}
                  className="p-1.5 text-event-primary hover:bg-event-primary/10 rounded transition-colors cursor-pointer"
                  title="Copiar CBU"
                >
                  {copied_field === 'cbu' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Alias */}
            <div className="flex justify-between items-center gap-2 pb-3 border-b border-event-primary/10">
              <span className="font-event-body text-event-text/60">Alias:</span>
              <div className="flex items-center gap-2">
                <span className="font-event-body text-event-text font-medium">
                  {bank_info.alias}
                </span>
                <button
                  onClick={() => handleCopy(bank_info.alias, 'alias')}
                  className="p-1.5 text-event-primary hover:bg-event-primary/10 rounded transition-colors cursor-pointer"
                  title="Copiar Alias"
                >
                  {copied_field === 'alias' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bank name */}
            <div className="flex justify-between items-center pb-3 border-b border-event-primary/10">
              <span className="font-event-body text-event-text/60">Banco:</span>
              <span className="font-event-body text-event-text font-medium">
                {bank_info.bank_name}
              </span>
            </div>

            {/* DNI */}
            {bank_info.dni && (
              <div className="flex justify-between items-center">
                <span className="font-event-body text-event-text/60">DNI:</span>
                <span className="font-event-body text-event-text font-medium">
                  {bank_info.dni}
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* External links (gift registries) */}
      {external_links && external_links.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="font-event-display text-sm text-event-text/60 mb-2">
            Lista de Regalos
          </h4>
          {external_links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 bg-event-light text-event-text font-event-body text-sm rounded-full border border-event-primary/20 hover:bg-event-primary hover:text-white hover:border-event-primary transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* MercadoPago link */}
      {mercadopago_link && (
        <a
          href={mercadopago_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#009ee3] text-white font-event-body text-sm rounded-full hover:bg-[#007eb5] transition-all duration-300"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Enviar regalo por MercadoPago
        </a>
      )}
    </div>
  );
}

