import { useState } from 'react';
import type { GiftSection as GiftSectionData } from '../../../domain/event/Event';
import { Modal } from '../ui';
import { Section } from '../ui/Section';
import { GiftIcon } from '../icons';

interface GiftSectionProps {
  data: GiftSectionData;
}

type CopiedField = 'cbu' | 'alias' | null;

export function GiftSection({ data }: GiftSectionProps) {
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [copied_field, setCopiedField] = useState<CopiedField>(null);

  const {
    title = 'NOSOTROS...',
    message = 'Si deseás realizarnos un regalo podés colaborar con nuestra Luna de Miel...',
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
    <Section variant="primary">
      <div className="animate-fade-in-up text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <GiftIcon className="w-14 h-14 md:w-16 md:h-16 text-white" />
        </div>

        {/* Message */}
        {message && (
          <p className="font-event-body text-white/90 text-base sm:text-lg mb-8 max-w-md mx-auto">
            {message}
          </p>
        )}

        {/* Bank info button - outline style on dark bg */}
        {bank_info && (
          <button
            onClick={open_modal}
            className="mb-4 inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-event-body text-sm tracking-wider uppercase rounded-full border-2 border-white hover:bg-white hover:text-event-primary transition-all duration-300 cursor-pointer"
          >
            VER DATOS BANCARIOS
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
          <div className="mt-6 space-y-3">
            <h4 className="font-event-display text-sm text-white/70 mb-3 tracking-elegant uppercase">
              Lista de Regalos
            </h4>
            {external_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-transparent text-white font-event-body text-sm tracking-wider uppercase rounded-full border border-white/50 hover:bg-white hover:text-event-primary transition-all duration-300"
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
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-event-primary font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-white/90 transition-all duration-300"
          >
            MercadoPago
          </a>
        )}
      </div>
    </Section>
  );
}
