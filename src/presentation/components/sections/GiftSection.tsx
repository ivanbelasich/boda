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
        {/* Icon with enhanced styling */}
        <div className="mb-8 flex justify-center">
          <div className="icon-circle p-5 animate-scale-in">
            <GiftIcon className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Message with better typography */}
        {message && (
          <p className="font-event-body text-white/95 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {message}
          </p>
        )}

        {/* Bank info button - enhanced with glassmorphism */}
        {bank_info && (
          <button
            onClick={open_modal}
            className="group mb-6 inline-flex items-center justify-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md text-white font-event-body text-sm tracking-wider uppercase rounded-full border-2 border-white/30 hover:bg-white hover:text-event-primary transition-smooth shadow-strong hover:shadow-colored cursor-pointer"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            VER DATOS BANCARIOS
          </button>
        )}

        {/* Bank info modal with card design */}
        {bank_info && (
          <Modal
            is_open={is_modal_open}
            on_close={close_modal}
            title="Datos Bancarios"
          >
            {/* Bank card visual design */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-primary text-white shadow-strong relative overflow-hidden">
              {/* Card background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <pattern id="card-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#card-pattern)" />
                </svg>
              </div>

              <div className="relative space-y-4">
                {/* Card chip icon */}
                <div className="flex justify-between items-start">
                  <svg className="w-12 h-10" viewBox="0 0 48 40" fill="none">
                    <rect width="48" height="40" rx="4" fill="rgba(255,255,255,0.2)" />
                    <rect x="6" y="8" width="12" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
                    <rect x="20" y="8" width="12" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
                    <rect x="6" y="22" width="12" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
                    <rect x="20" y="22" width="12" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
                  </svg>
                  <svg className="w-10 h-10 opacity-40" viewBox="0 0 40 40">
                    <circle cx="15" cy="20" r="12" fill="white" />
                    <circle cx="25" cy="20" r="12" fill="white" />
                  </svg>
                </div>

                {/* Holder name */}
                <div className="mt-6">
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Titular</p>
                  <p className="text-white text-lg font-medium tracking-wide">
                    {bank_info.holder_name}
                  </p>
                </div>

                {/* Bank name */}
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Banco</p>
                  <p className="text-white text-base font-medium">
                    {bank_info.bank_name}
                  </p>
                </div>
              </div>
            </div>

            {/* CBU and Alias with copy buttons */}
            <div className="space-y-4">
              {/* CBU */}
              <div className="p-4 bg-event-light/30 rounded-xl border border-event-primary/20 hover:border-event-primary/40 transition-smooth">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 text-left">
                    <span className="font-event-body text-event-text/60 text-xs uppercase tracking-wider block mb-1">CBU</span>
                    <span className="font-event-body text-event-text font-medium text-sm md:text-base tracking-wide block">
                      {bank_info.cbu}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(bank_info.cbu, 'cbu')}
                    className="flex-shrink-0 p-3 text-event-primary hover:bg-event-primary/10 rounded-xl transition-smooth cursor-pointer shadow-soft hover:shadow-medium"
                    title="Copiar CBU"
                  >
                    {copied_field === 'cbu' ? (
                      <svg className="w-6 h-6 text-green-600 animate-copy-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Alias */}
              <div className="p-4 bg-event-light/30 rounded-xl border border-event-primary/20 hover:border-event-primary/40 transition-smooth">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1 text-left">
                    <span className="font-event-body text-event-text/60 text-xs uppercase tracking-wider block mb-1">Alias</span>
                    <span className="font-event-body text-event-text font-medium text-base md:text-lg block">
                      {bank_info.alias}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(bank_info.alias, 'alias')}
                    className="flex-shrink-0 p-3 text-event-primary hover:bg-event-primary/10 rounded-xl transition-smooth cursor-pointer shadow-soft hover:shadow-medium"
                    title="Copiar Alias"
                  >
                    {copied_field === 'alias' ? (
                      <svg className="w-6 h-6 text-green-600 animate-copy-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* DNI */}
              {bank_info.dni && (
                <div className="p-4 bg-event-light/20 rounded-xl border border-event-primary/10">
                  <div className="flex justify-between items-center">
                    <span className="font-event-body text-event-text/60 text-xs uppercase tracking-wider">DNI</span>
                    <span className="font-event-body text-event-text font-medium text-base">
                      {bank_info.dni}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Success message */}
            {copied_field && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-slide-up">
                <p className="text-green-800 text-sm text-center font-event-body">
                  ✓ {copied_field === 'cbu' ? 'CBU' : 'Alias'} copiado al portapapeles
                </p>
              </div>
            )}
          </Modal>
        )}

        {/* External links as cards */}
        {external_links && external_links.length > 0 && (
          <div className="mt-8 space-y-3 max-w-md mx-auto">
            <h4 className="font-event-display text-sm text-white/80 mb-4 tracking-elegant uppercase drop-shadow-sm">
              Listas de Regalos
            </h4>
            {external_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md text-white font-event-body text-sm tracking-wider rounded-2xl border border-white/20 hover:bg-white hover:text-event-primary transition-smooth shadow-medium hover:shadow-strong"
              >
                <span>{link.label}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* MercadoPago link with logo */}
        {mercadopago_link && (
          <a
            href={mercadopago_link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-3 px-8 py-4 bg-white text-event-primary font-event-body text-sm tracking-wider uppercase rounded-full hover:bg-white/95 transition-smooth shadow-strong hover:shadow-colored hover-lift"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.576 15.895c-.413.441-1.096.457-1.525.034l-2.051-2.051-2.051 2.051c-.429.423-1.112.407-1.525-.034-.412-.441-.417-1.148.006-1.571l2.05-2.051-2.05-2.051c-.423-.423-.418-1.13-.006-1.571.413-.441 1.096-.457 1.525-.034l2.051 2.051 2.051-2.051c.429-.423 1.112-.407 1.525.034.412.441.417 1.148-.006 1.571l-2.05 2.051 2.05 2.051c.423.423.418 1.13.006 1.571z"/>
            </svg>
            MercadoPago
          </a>
        )}
      </div>
    </Section>
  );
}
