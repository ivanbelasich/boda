# Roadmap - La Fecha Eventos

Plan de desarrollo y estado actual de las secciones.

> **Nota:** La estructura JSON de cada sección está documentada en [`supabase-schema.sql`](supabase-schema.sql).

---

## Estado de Implementación

### Secciones Implementadas

| Sección | Estado | Notas |
|---------|--------|-------|
| HeroSection | Implementado | `date` y `year` se derivan de `event_date` |
| CountdownSection | Implementado | Automática, no incluir en sections |
| LocationSection | Implementado | Soporta múltiples (ceremonia, fiesta) |
| GiftSection | Implementado | Datos bancarios + links externos |
| DressCodeSection | Implementado | Con icono y Pinterest opcional |
| CalendarSection | Implementado | Google Calendar y Apple/ICS |
| UploadSection | Implementado | Ventana de tiempo configurable |
| InstagramSection | Implementado | Link a perfil + handle |
| RSVPSection | Implementado | Redirección a Google Forms |
| PlaylistSection | Implementado | Redirección a Google Forms |
| InfoSection | Implementado | Alojamientos y traslados en modal |
| PhotoGallerySection | Implementado | Galería de fotos pre-cargadas |
| FooterSection | Implementado | Mensaje de cierre |

---

### Secciones Pendientes

| Sección | Prioridad | Descripción |
|---------|-----------|-------------|
| BackgroundMusicSection | Baja | Música de fondo en la landing |

**Consideraciones para BackgroundMusic:**
- Muchos navegadores bloquean autoplay
- Requiere botón de play visible
- Archivo de audio hosteado externamente

---

## Features Futuras

### Panel de Administración
- Dashboard para crear/editar eventos sin SQL
- Preview en tiempo real
- Gestión de fotos subidas

### Mejoras de Seguridad
- Migración a Cloudinary (upload más seguro)
- Rate limiting en uploads
- Validación de archivos

### Mejoras de UX
- Animaciones de transición entre secciones
- Lazy loading de imágenes
- PWA para invitados

---

## Notas Técnicas

### Agregar una nueva sección

1. Agregar interface en `src/domain/event/Event.ts`
2. Agregar al union type `EventSection`
3. Crear componente en `src/presentation/components/sections/`
4. Exportar en `sections/index.ts`
5. Agregar case en `EventPage.tsx` → `renderSection()`
6. Documentar estructura JSON en `supabase-schema.sql`

### Decisiones de Diseño

| Decisión | Razón |
|----------|-------|
| Google Forms para RSVP/Playlist | Evita complejidad de guardar respuestas en Supabase |
| Google Drive para fotos | Gratis, fácil de configurar, sin backend adicional |
| Countdown automático | Siempre relevante, simplifica configuración |
| Secciones como JSON | Flexibilidad total sin migraciones de schema |

### Ventana de Upload

La ventana de tiempo se configura con `upload_start_time` y `upload_end_time`:

| Fase | Descripción |
|------|-------------|
| `not_configured` | Sin `drive_script_url` → sección oculta |
| `before_event` | Antes del día → "Se habilitará el [fecha]" |
| `same_day_waiting` | Mismo día, antes de hora → "Abrirá a las [hora]" |
| `active` | Durante ventana → Botón de upload activo |
| `closed` | Después de ventana → "Gracias por participar" |

---

## Historial de Cambios

### v1.0 - MVP Completo
- Todas las secciones core implementadas (Hero, Countdown, Location, Gift, DressCode, Calendar, Upload)
- Sistema de temas con 5 presets
- Integración con Google Drive

### v1.1 - Engagement
- Secciones de engagement: Instagram, RSVP, Info, Playlist
- Secciones adicionales: PhotoGallery, Footer
- Componente Section reutilizable con variantes
- Estilos visuales: hero_style, decorations
- Iconos SVG personalizados
