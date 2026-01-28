/**
 * Date formatting utilities for event display
 */

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-AR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats date for hero display with capitalized weekday and month
 * Example: "Sábado 22 de Noviembre"
 */
export function formatHeroDate(date: Date): string {
  const formatted = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Capitalize first letter and month
  return formatted
    .replace(/^\w/, (char) => char.toUpperCase())
    .replace(/ de (\w)/, (_, char) => ` de ${char.toUpperCase()}`);
}

/**
 * Extracts the year from a date as string
 */
export function getYear(date: Date): string {
  return date.getFullYear().toString();
}

/**
 * Formats date in MES | DIA | AÑO format for hero section
 * Returns object with month abbreviation, day number, and year
 */
export function formatHeroDateParts(date: Date): { month: string; day: string; year: string } {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const month_index = date.getMonth();
  const month_name = months[month_index];
  const month_abbr = month_name.charAt(0).toUpperCase() + month_name.slice(1, 3).toUpperCase();
  
  return {
    month: month_abbr,
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  };
}
