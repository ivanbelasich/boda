-- ===========================================
-- Evento de prueba con TODAS las secciones
-- ===========================================
-- Ejecuta este SQL en Supabase para crear un
-- evento de prueba completo con todas las 
-- secciones implementadas.
--
-- NOTAS IMPORTANTES:
-- - HeroSection: date y year se derivan de event_date
-- - CountdownSection: se renderiza automáticamente, 
--   no es necesario incluirla en sections
-- - upload_start_time/upload_end_time: determinan la
--   ventana de tiempo para subir fotos
-- ===========================================

INSERT INTO events (
  slug, 
  type, 
  title, 
  subtitle, 
  event_date, 
  drive_script_url,
  upload_start_time,
  upload_end_time,
  theme, 
  sections
) 
VALUES (
  'demo-completo',
  'wedding',
  'Nico & Sabri',
  'Nos casamos',
  '2025-11-22T18:00:00-03:00',
  NULL, -- Configurar si se quiere habilitar upload (ver google-drive-setup.md)
  '2025-11-22T19:00:00-03:00',  -- 1 hora después de event_date
  '2025-11-23T06:00:00-03:00',  -- 12 horas después de event_date
  '{"preset": "botanical-sage"}'::jsonb,
  '[
    {
      "type": "hero",
      "pre_title": "Nos casamos",
      "names": ["Nico", "Sabri"]
    },
    {
      "type": "photo_gallery",
      "title": "Nosotros...",
      "photos": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
        "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400",
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400"
      ]
    },
    {
      "type": "location",
      "title": "Ceremonia",
      "venue_name": "Iglesia Nuestra Señora del Carmen",
      "address": "Av. San Martín 1234",
      "city": "Villa Allende, Córdoba",
      "datetime": "19:00 hs",
      "google_maps_url": "https://maps.google.com/?q=Iglesia+Nuestra+Señora+del+Carmen+Villa+Allende",
      "additional_info": "Recibí debajo las indicaciones para llegar"
    },
    {
      "type": "location",
      "title": "Fiesta",
      "venue_name": "Rincón Calina",
      "address": "Camino a La Calera km 5",
      "city": "Unquillo, Córdoba",
      "datetime": "Después de la ceremonia",
      "google_maps_url": "https://maps.google.com/?q=Rincon+Calina+Unquillo",
      "additional_info": "¡Te esperamos!"
    },
    {
      "type": "gift",
      "title": "Si deseás hacernos un regalo...",
      "message": "Podés colaborar con nuestra Luna de Miel",
      "bank_info": {
        "holder_name": "Nicolás García",
        "cbu": "0000003100012345678901",
        "alias": "boda.nico.sabri",
        "bank_name": "Banco Galicia",
        "dni": "32200552"
      },
      "external_links": [
        {"label": "Lista en Falabella Novios", "url": "https://www.falabella.com.ar/novios"}
      ]
    },
    {
      "type": "instagram",
      "handle": "@bodanicoysabri",
      "message": "¡Preparate para nuestro gran día! Ya podés seguirnos en Instagram.",
      "button_text": "VER EN INSTAGRAM"
    },
    {
      "type": "dresscode",
      "title": "Dress Code",
      "code": "Formal elegante",
      "description": "Vestimenta formal, colores claros. Evitar color blanco.",
      "icon": "👔"
    },
    {
      "type": "rsvp",
      "title": "Confirmación de Asistencia",
      "message": "Esperamos que seas parte de esta gran celebración. ¡Confirmanos tu asistencia!",
      "form_url": "https://forms.google.com/example-rsvp",
      "button_text": "CONFIRMAR ASISTENCIA"
    },
    {
      "type": "upload",
      "message": "¡Compartí este momento especial con nosotros!",
      "projection_note": "Las fotos se mostrarán en las pantallas del salón"
    },
    {
      "type": "playlist",
      "title": "¿Qué canciones no pueden faltar?",
      "message": "Ayudanos a armar la playlist perfecta para la fiesta",
      "form_url": "https://forms.google.com/example-playlist",
      "button_text": "SUGERIR CANCIÓN"
    },
    {
      "type": "calendar",
      "title": "¡Agendá la fecha!",
      "show_google": true,
      "show_apple": true
    },
    {
      "type": "info",
      "title": "Info Útil",
      "message": "Te dejamos sugerencias de alojamientos y traslados para que aproveches ese fin de semana al máximo.",
      "accommodations": [
        {
          "name": "Hotel Sierras",
          "contact": "Tel: 0351-4123456",
          "address": "Av. Principal 500, Villa Allende",
          "maps_url": "https://maps.google.com/?q=Hotel+Sierras+Villa+Allende"
        },
        {
          "name": "Cabañas del Valle",
          "contact": "Tel: 0351-4789012",
          "address": "Camino del Valle km 3, Unquillo",
          "maps_url": "https://maps.google.com/?q=Cabañas+del+Valle+Unquillo"
        }
      ],
      "transfers": [
        {
          "name": "Remises La Calera",
          "contact": "Tel: 0351-4567890",
          "website": "https://www.remiseslacalera.com.ar"
        },
        {
          "name": "Transfer VIP Córdoba",
          "contact": "WhatsApp: +54 9 351 1234567"
        }
      ]
    },
    {
      "type": "footer",
      "message": "¡Gracias por acompañarnos en este momento tan importante!"
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections,
  theme = EXCLUDED.theme,
  event_date = EXCLUDED.event_date,
  upload_start_time = EXCLUDED.upload_start_time,
  upload_end_time = EXCLUDED.upload_end_time;

-- ===========================================
-- Verificar que se creó correctamente
-- ===========================================
SELECT 
  slug, 
  title, 
  event_date, 
  theme->>'preset' as theme_preset,
  jsonb_array_length(sections) as num_sections 
FROM events 
WHERE slug = 'demo-completo';

-- ===========================================
-- Resumen de secciones incluidas:
-- ===========================================
-- 1. hero           - Encabezado con nombres
-- 2. photo_gallery  - Galería de fotos pre-cargadas
-- 3. location x2    - Ceremonia y Fiesta
-- 4. gift           - Datos bancarios y links
-- 5. instagram      - Perfil de Instagram
-- 6. dresscode      - Vestimenta
-- 7. rsvp           - Confirmación de asistencia
-- 8. upload         - Subir fotos en vivo
-- 9. playlist       - Sugerir canciones
-- 10. calendar      - Agregar al calendario
-- 11. info          - Hoteles y traslados
-- 12. footer        - Mensaje de cierre
--
-- NOTA: countdown se renderiza automáticamente
-- después de hero, no se incluye en sections.
-- ===========================================
