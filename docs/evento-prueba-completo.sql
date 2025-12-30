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
--   ventana de tiempo para subir fotos. Se recomienda
--   configurar upload_start_time ~1-2 horas después del
--   event_date y upload_end_time ~12 horas después.
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
  NULL, -- Configurar si se quiere habilitar upload
  '2025-11-22T19:00:00-03:00',  -- 1 hora después de event_date
  '2025-11-23T06:00:00-03:00',  -- 12 horas después de event_date
  '{"preset": "elegant-gold"}'::jsonb,
  '[
    {
      "type": "hero",
      "pre_title": "Nos casamos",
      "names": ["Nico", "Sabri"]
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
      "type": "dresscode",
      "title": "Dress Code",
      "code": "Formal elegante",
      "description": "Vestimenta formal, colores claros",
      "icon": "👔"
    },
    {
      "type": "upload",
      "message": "¡Compartí este momento especial con nosotros!",
      "projection_note": "Las fotos se mostrarán en las pantallas del salón"
    },
    {
      "type": "calendar",
      "title": "¡Agendá la fecha!",
      "show_google": true,
      "show_outlook": true,
      "show_apple": true,
      "show_yahoo": false
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
SELECT slug, title, event_date, jsonb_array_length(sections) as num_sections 
FROM events 
WHERE slug = 'demo-completo';

