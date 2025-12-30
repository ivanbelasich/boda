# Roadmap - La Fecha Eventos

Plan de desarrollo de secciones para las landing pages de eventos.

## Secciones Actuales (Implementadas)

### HeroSection
Sección principal con nombres y mensaje de bienvenida.

```typescript
interface HeroSection {
  type: 'hero';
  pre_title?: string;    // "La boda de", "Te invitamos a"
  names: string[];       // ["Nombre 1", "Nombre 2"]
}
```

> **Nota:** La fecha y año se derivan automáticamente de `event_date`. Ya no es necesario especificar `date` ni `year` en el JSON.

### CountdownSection (Automática)
Cuenta regresiva hasta la fecha del evento.

> **Nota:** Esta sección se renderiza automáticamente para todos los eventos. No es necesario incluirla en el array `sections` del JSON. Siempre muestra días (excepto cuando quedan menos de 24h), horas, minutos y segundos.

**Comportamiento:**
- Calcula diferencia con `event_date`
- Actualización cada segundo
- **Fases:**
  - `far_away`: "¡Faltan..." (más de 7 días)
  - `approaching`: "¡Estamos a días!" (1-7 días)
  - `very_close`: "¡Quedan horas!" (menos de 24h, no muestra días)
  - `today`: "¡Hoy es el gran día!" (mismo día, antes de la hora del evento)
  - `ongoing`: "¡Hoy es el gran día!" (evento en curso, ventana de upload activa)
  - `past`: "¡Gracias por acompañarnos!" (después de `upload_end_time`)

### UploadSection
Sección para subir fotos al álbum en vivo.

```typescript
interface UploadSection {
  type: 'upload';
  message: string;           // "¡Compartí tus fotos!"
  projection_note?: string;  // "Se mostrarán en las pantallas"
}
```

**Ventana de upload:**
- Controlada por `upload_start_time` y `upload_end_time` del evento
- Valor recomendado: `upload_start_time` = 1h después de `event_date`, `upload_end_time` = 12h después
- La galería se prioriza visualmente solo cuando está activa o próxima a abrir

---

## Fase 1: Core (MVP Completo)

### LocationSection
Información de ubicación (ceremonia, fiesta, o ambas).

```typescript
interface LocationSection {
  type: 'location';
  title: string;                    // "Ceremonia", "Fiesta"
  venue_name: string;               // "Iglesia San José"
  address: string;                  // "Av. Corrientes 1234"
  city?: string;                    // "Buenos Aires"
  datetime?: string;                // "19:00 hs"
  google_maps_url?: string;         // Link para "Cómo llegar"
  google_maps_embed_url?: string;   // URL del iframe (opcional)
  additional_info?: string;         // "Estacionamiento disponible"
}
```

**Implementación:**
- Múltiples LocationSection para ceremonia y fiesta separadas
- Botón "Cómo llegar" abre Google Maps en nueva pestaña
- Mapa embebido opcional (Google Maps iframe gratuito)

---

### GiftSection
Información para regalos y datos bancarios.

```typescript
interface GiftSection {
  type: 'gift';
  title?: string;              // "Si deseás hacernos un regalo..."
  message?: string;            // Texto introductorio
  bank_info?: {
    holder_name: string;       // "Juan Pérez"
    cbu: string;               // "0000003100..."
    alias: string;             // "boda.juan.maria"
    bank_name: string;         // "Banco Galicia"
    dni?: string;              // "12345678"
  };
  external_links?: Array<{
    label: string;             // "Lista en Falabella"
    url: string;
  }>;
  mercadopago_link?: string;   // Link de MercadoPago
}
```

**Implementación:**
- Mostrar datos bancarios con botón "Copiar"
- Links externos a listas de regalos
- Link de MercadoPago opcional

---

### DressCodeSection
Información sobre vestimenta.

```typescript
interface DressCodeSection {
  type: 'dresscode';
  title?: string;        // "Dress Code"
  code: string;          // "Formal elegante"
  description?: string;  // "Vestimenta formal, colores claros"
  icon?: string;         // Emoji o icono: "👔"
}
```

**Implementación:**
- Icono visual representativo
- Texto descriptivo

---

### CalendarSection
Agregar evento al calendario.

```typescript
interface CalendarSection {
  type: 'calendar';
  title?: string;        // "¡Agendá la fecha!"
  show_google: boolean;
  show_outlook: boolean;
  show_apple: boolean;
  show_yahoo: boolean;
}
```

**Implementación:**
- Genera links con formato ICS/Google Calendar
- Usa `event_date`, `title` y ubicación del evento
- Librería sugerida: sin dependencias, generar URLs manualmente

**URLs de calendarios:**
```
Google: https://calendar.google.com/calendar/render?action=TEMPLATE&text=...
Outlook: https://outlook.live.com/calendar/0/deeplink/compose?...
Apple/ICS: data:text/calendar;charset=utf8,BEGIN:VCALENDAR...
```

---

## Fase 2: Engagement

### RSVPSection
Confirmación de asistencia.

```typescript
interface RSVPSection {
  type: 'rsvp';
  title?: string;               // "Confirmá tu asistencia"
  message?: string;             // "Esperamos que seas parte..."
  form_url: string;             // URL de Google Forms
  button_text?: string;         // "Confirmar asistencia"
}
```

**Decisión técnica:** Para el MVP, redirige a Google Forms externo. 
Evita complejidad de guardar respuestas en Supabase.

---

### InstagramSection
Cuenta de Instagram del evento.

```typescript
interface InstagramSection {
  type: 'instagram';
  title?: string;           // "¡Seguinos!"
  message?: string;         // "Etiquetanos en tus fotos"
  username: string;         // "bodanicoysabri"
  hashtag?: string;         // "#bodanicoysabri"
}
```

**Implementación:**
- Link a perfil de Instagram
- Mostrar hashtag para etiquetar

---

### InfoSection
Información útil (hoteles, traslados).

```typescript
interface InfoSection {
  type: 'info';
  title?: string;           // "Info Útil"
  categories: Array<{
    name: string;           // "Hoteles", "Traslados"
    items: Array<{
      title: string;        // "Hotel Plaza"
      description?: string; // "A 5 min del evento"
      phone?: string;
      url?: string;
      maps_url?: string;
    }>;
  }>;
}
```

---

## Fase 3: Premium

### PlaylistSection
Sugerencias de canciones.

```typescript
interface PlaylistSection {
  type: 'playlist';
  title?: string;           // "¿Qué canciones no pueden faltar?"
  message?: string;
  form_url: string;         // URL de Google Forms
  button_text?: string;     // "Sugerir canción"
}
```

**Decisión técnica:** Usa Google Forms externo en lugar de integración con Spotify.
La API de Spotify requiere OAuth y aprobación para apps públicas.

---

### BackgroundMusicSection
Música de fondo en la landing.

```typescript
interface BackgroundMusicSection {
  type: 'background_music';
  audio_url: string;        // URL del archivo de audio
  autoplay: boolean;        // Autoplay (browsers pueden bloquearlo)
  show_controls: boolean;   // Mostrar botón play/pause
}
```

**Consideraciones:**
- Muchos navegadores bloquean autoplay
- Mostrar botón de play visible
- Archivo de audio hosteado externamente

---

## Orden de implementación sugerido

```
Fase 1 (Core): ✅ COMPLETADO
1. CountdownSection      - ✅ (automático, siempre presente)
2. LocationSection       - ✅
3. GiftSection           - ✅
4. DressCodeSection      - ✅
5. CalendarSection       - ✅

Fase 2 (Engagement):
6. RSVPSection           - 20 min
7. InstagramSection      - 15 min
8. InfoSection           - 45 min

Fase 3 (Premium):
9. PlaylistSection       - 20 min
10. BackgroundMusicSection - 30 min
```

---

## Notas técnicas

### Agregar una nueva sección

1. Agregar interface en `src/domain/event/Event.ts`
2. Agregar al union type `EventSection`
3. Crear componente en `src/presentation/components/sections/`
4. Exportar en `sections/index.ts`
5. Agregar case en `EventPage.tsx` → `renderSection()`

### Ejemplo de evento con múltiples secciones

```json
{
  "event_date": "2025-11-29T18:00:00-03:00",
  "upload_start_time": "2025-11-29T19:00:00-03:00",
  "upload_end_time": "2025-11-30T06:00:00-03:00",
  "sections": [
    {"type": "hero", "pre_title": "La boda de", "names": ["Tefo", "Geli"]},
    {"type": "location", "title": "Ceremonia", "venue_name": "Iglesia San José", "address": "...", "google_maps_url": "..."},
    {"type": "location", "title": "Fiesta", "venue_name": "Salón Las Rosas", "address": "...", "google_maps_url": "..."},
    {"type": "gift", "bank_info": {"holder_name": "...", "cbu": "...", "alias": "..."}},
    {"type": "dresscode", "code": "Formal elegante"},
    {"type": "upload", "message": "¡Compartí tus fotos!"},
    {"type": "calendar", "show_google": true, "show_apple": true},
    {"type": "rsvp", "form_url": "https://forms.google.com/..."}
  ]
}
```

> **Notas:**
> - `date` y `year` ya no van en HeroSection - se derivan de `event_date`
> - `countdown` no va en sections - se renderiza automáticamente
> - `upload_start_time` / `upload_end_time` determinan la ventana de la galería

