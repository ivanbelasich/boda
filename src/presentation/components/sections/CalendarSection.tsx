import { useState } from 'react';
import { SiGooglecalendar } from 'react-icons/si';
import { FaApple } from 'react-icons/fa';
import type { CalendarSection as CalendarSectionData } from '../../../domain/event/Event';
import { Modal } from '../ui';

interface CalendarSectionProps {
  data: CalendarSectionData;
  event_title: string;
  event_date: Date;
  event_location?: string;
}

interface CalendarLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

function formatDateForGoogle(date: Date): string {
  // Format: YYYYMMDDTHHMMSSZ
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function generateICSContent(title: string, date: Date, location?: string): string {
  const start = formatDateForGoogle(date);
  // Event duration: 4 hours
  const end_date = new Date(date.getTime() + 4 * 60 * 60 * 1000);
  const end = formatDateForGoogle(end_date);

  const ics_content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Fecha Eventos//ES',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return ics_content;
}

function generateCalendarLinks(
  title: string,
  date: Date,
  location?: string,
): Record<string, CalendarLink> {
  const start = formatDateForGoogle(date);
  const end_date = new Date(date.getTime() + 4 * 60 * 60 * 1000);
  const end = formatDateForGoogle(end_date);
  const encoded_title = encodeURIComponent(title);
  const encoded_location = location ? encodeURIComponent(location) : '';

  // ICS file for Apple
  const ics_content = generateICSContent(title, date, location);
  const ics_blob = new Blob([ics_content], { type: 'text/calendar' });
  const ics_url = URL.createObjectURL(ics_blob);

  return {
    google: {
      name: 'Google',
      icon: <SiGooglecalendar className="w-5 h-5" />,
      url: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encoded_title}&dates=${start}/${end}${encoded_location ? `&location=${encoded_location}` : ''}&sf=true`,
    },
    apple: {
      name: 'Apple',
      icon: <FaApple className="w-5 h-5" />,
      url: ics_url,
    },
  };
}

export function CalendarSection({ data, event_title, event_date, event_location }: CalendarSectionProps) {
  const [is_modal_open, setIsModalOpen] = useState(false);

  const {
    title = '¡Agendá la fecha!',
    show_google = true,
    show_apple = true,
  } = data;

  const calendar_links = generateCalendarLinks(event_title, event_date, event_location);

  const visible_calendars = [
    show_google && calendar_links.google,
    show_apple && calendar_links.apple,
  ].filter(Boolean) as CalendarLink[];

  const handleClick = (link: CalendarLink) => {
    if (link.name === 'Apple') {
      // For ICS, trigger download
      const a = document.createElement('a');
      a.href = link.url;
      a.download = `${event_title.replace(/\s+/g, '_')}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in-up w-full max-w-md mx-auto py-6 text-center">
      {/* Title */}
      <h3 className="font-event-display text-xl sm:text-2xl text-event-primary mb-4">
        {title}
      </h3>

      {/* Main button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-event-primary text-white font-event-body text-lg rounded-full shadow-lg hover:bg-event-dark transition-all duration-300 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Agendar en mi calendario
      </button>

      {/* Calendar options modal */}
      <Modal
        is_open={is_modal_open}
        on_close={() => setIsModalOpen(false)}
        title="Elegí tu calendario"
      >
        <div className="space-y-3">
          {visible_calendars.map((link) => (
            <button
              key={link.name}
              onClick={() => handleClick(link)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-event-light text-event-text font-event-body text-base rounded-full border border-event-primary/20 hover:bg-event-primary hover:text-white hover:border-event-primary transition-all duration-300 cursor-pointer"
            >
              {link.icon}
              <span>Agregar a {link.name}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

