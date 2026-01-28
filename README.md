# La Fecha Eventos

Plataforma para eventos (bodas, quinceañeras, fiestas) que permite crear landing pages personalizadas con álbum de fotos en vivo.

## Documentación

- [Setup de Supabase](docs/supabase-schema.sql) - Schema SQL y estructura de secciones
- [Evento de prueba completo](docs/evento-prueba-completo.sql) - Ejemplo con todas las secciones
- [Configuración de Google Drive](docs/google-drive-setup.md) - Guía paso a paso
- [Temas y personalización](docs/temas.md) - Presets y customización visual
- [Roadmap](docs/roadmap.md) - Features futuras y pendientes

## Features

- **Landing pages dinámicas** - Una landing única por evento via URL (`/eventos/mi-evento`)
- **12 secciones modulares** - Hero, Countdown, Location, Gift, DressCode, Calendar, Upload, Instagram, RSVP, Playlist, Info, PhotoGallery, Footer
- **Álbum de fotos en vivo** - Los invitados suben fotos que se muestran en tiempo real
- **5 temas personalizables** - Presets de colores/tipografías con estilos visuales
- **Ventana de tiempo** - El upload se habilita solo durante el evento
- **Modo presentación** - Slideshow para proyectar en pantallas del evento

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Base de datos**: Supabase (PostgreSQL)
- **Storage de fotos**: Google Drive via Apps Script
- **Arquitectura**: Hexagonal (Ports & Adapters)

## Estructura del proyecto

```
src/
├── domain/                    # Entidades y contratos
│   └── event/
│       ├── Event.ts           # Tipos de dominio (secciones, temas)
│       └── EventRepository.ts # Interface (port)
│
├── infrastructure/            # Implementaciones externas
│   ├── supabase/
│   │   ├── client.ts
│   │   └── SupabaseEventRepository.ts
│   └── drive/
│       ├── DriveService.ts    # Adapter para Google Drive
│       └── index.ts
│
├── presentation/              # UI y lógica de presentación
│   ├── hooks/
│   │   ├── useEventTheme.ts       # Hook básico de tema
│   │   ├── useFullEventTheme.ts   # Hook completo (incluye hero_style, decorations)
│   │   ├── usePhotoSlideshow.ts
│   │   ├── usePhotoUpload.ts
│   │   └── useUploadWindow.ts
│   ├── utils/
│   │   └── date-formatters.ts
│   ├── components/
│   │   ├── icons/
│   │   │   └── EventIcons.tsx     # Iconos SVG para secciones
│   │   ├── ui/
│   │   │   ├── Section.tsx        # Componente base de sección
│   │   │   └── Modal.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── CountdownSection.tsx
│   │       ├── LocationSection.tsx
│   │       ├── GiftSection.tsx
│   │       ├── DressCodeSection.tsx
│   │       ├── CalendarSection.tsx
│   │       ├── UploadSection.tsx
│   │       ├── InstagramSection.tsx
│   │       ├── RSVPSection.tsx
│   │       ├── PlaylistSection.tsx
│   │       ├── InfoSection.tsx
│   │       ├── PhotoGallerySection.tsx
│   │       └── FooterSection.tsx
│   └── pages/
│       ├── EventPage.tsx          # Landing del evento
│       └── PresentationPage.tsx   # Slideshow
│
├── config/
│   └── theme-presets.ts       # Presets de temas
│
├── App.tsx                    # Router principal
├── main.tsx                   # Entry point
└── index.css                  # Estilos globales + Tailwind
```

## Setup

### 1. Clonar e instalar

```bash
git clone <repo>
cd la.fecha.eventos
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el SQL del archivo `docs/supabase-schema.sql` en el SQL Editor
3. Copia las credenciales

### 3. Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Opcional: configuración de tiempos
VITE_PHOTO_REFRESH_INTERVAL=15000  # Polling de fotos (ms)
VITE_SLIDE_DURATION=6000           # Duración por slide (ms)
```

### 4. Configurar Google Drive

Sigue las instrucciones en [`docs/google-drive-setup.md`](docs/google-drive-setup.md) para:
- Crear una carpeta en Drive
- Configurar el Google Apps Script
- Obtener la URL del script

### 5. Crear un evento de prueba

Ejecuta en Supabase SQL Editor el contenido de [`docs/evento-prueba-completo.sql`](docs/evento-prueba-completo.sql) o un evento básico:

```sql
INSERT INTO events (slug, type, title, event_date, theme, sections) 
VALUES (
  'mi-evento',
  'wedding',
  'Mi Evento',
  '2025-06-15T18:00:00-03:00',
  '{"preset": "elegant-gold"}',
  '[
    {"type": "hero", "pre_title": "Te invitamos", "names": ["Nombre 1", "Nombre 2"]},
    {"type": "upload", "message": "¡Compartí tus fotos!"}
  ]'
);
```

### 6. Ejecutar

```bash
npm run dev
```

Visita:
- Landing: http://localhost:5173/eventos/mi-evento
- Presentación: http://localhost:5173/eventos/mi-evento/presentacion

## Secciones disponibles

| Sección | Descripción |
|---------|-------------|
| `hero` | Encabezado principal con nombres y fecha |
| `countdown` | Cuenta regresiva (automática, no incluir en sections) |
| `location` | Ubicación (puede haber múltiples: ceremonia, fiesta) |
| `gift` | Datos bancarios y links de regalos |
| `dresscode` | Información de vestimenta |
| `calendar` | Agregar al calendario (Google, Apple) |
| `upload` | Subir fotos al álbum en vivo |
| `instagram` | Cuenta de Instagram del evento |
| `rsvp` | Confirmación de asistencia (Google Forms) |
| `playlist` | Sugerencias de canciones (Google Forms) |
| `info` | Info útil: hoteles, traslados |
| `photo_gallery` | Galería de fotos pre-cargadas |
| `footer` | Mensaje de cierre |

Ver estructura JSON de cada sección en [`docs/supabase-schema.sql`](docs/supabase-schema.sql).

## Temas disponibles

| Preset | Descripción | Decoraciones |
|--------|-------------|--------------|
| `elegant-gold` | Dorado elegante (bodas clásicas) | minimal |
| `romantic-rose` | Rosa romántico (quinceañeras) | romantic |
| `modern-slate` | Gris moderno (corporativo) | none |
| `forest-green` | Verde bosque (eventos al aire libre) | botanical |
| `botanical-sage` | Verde sage botánico | botanical |

Ver personalización detallada en [`docs/temas.md`](docs/temas.md).

### Usar un tema

En Supabase, configura el campo `theme` del evento:

```json
{"preset": "botanical-sage"}
```

O personaliza colores específicos:

```json
{
  "preset": "elegant-gold",
  "primary": "#d4af37",
  "hero_style": "gradient",
  "decorations": "romantic"
}
```

## Ventana de tiempo para upload

Configura cuándo los invitados pueden subir fotos:

```sql
UPDATE events 
SET 
  upload_start_time = '2025-06-15T20:00:00-03:00',
  upload_end_time = '2025-06-16T04:00:00-03:00'
WHERE slug = 'mi-evento';
```

| Estado | Comportamiento |
|--------|----------------|
| Antes de `upload_start_time` | Muestra "Se habilitará el [fecha]" |
| Mismo día, antes de la hora | Muestra "Abrirá a las [hora]" |
| Durante la ventana | Botón de subir fotos activo |
| Después de `upload_end_time` | Muestra "Gracias por participar" |

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview del build
npm run lint     # Linter
```

## Licencia

MIT
