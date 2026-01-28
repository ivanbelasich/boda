-- ===========================================
-- La Fecha Eventos - Supabase Schema
-- ===========================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- para crear la estructura de la base de datos.
-- ===========================================

-- Tabla principal de eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identificación
  slug VARCHAR(100) UNIQUE NOT NULL,  -- URL amigable (ej: "boda-juan-maria")
  type VARCHAR(50) NOT NULL,          -- wedding, quinceanera, birthday, corporate
  
  -- Información básica
  title VARCHAR(255) NOT NULL,        -- Nombre mostrado (ej: "Juan & María")
  subtitle VARCHAR(255),              -- Subtítulo opcional
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Personalización visual (ver docs/temas.md para detalle)
  -- Campos disponibles en theme:
  --   preset: string (elegant-gold, romantic-rose, modern-slate, forest-green, botanical-sage)
  --   primary, secondary, primary_light, primary_dark: string (colores hex)
  --   background, text: string (colores hex)
  --   font_display, font_body: string (fuentes CSS)
  --   hero_style: 'solid' | 'texture' | 'gradient'
  --   hero_texture_url: string (URL de imagen para textura)
  --   decorations: 'none' | 'minimal' | 'botanical' | 'romantic'
  theme JSONB DEFAULT '{"preset": "elegant-gold"}'::jsonb,
  cover_image_url TEXT,
  
-- Secciones de la landing (dinámicas)
-- Tipos de secciones disponibles:
--   hero, location, gift, dresscode, calendar, upload, gallery,
--   instagram, rsvp, playlist, info, photo_gallery, footer
-- NOTA: countdown se renderiza automáticamente después de hero, no incluirlo aquí
sections JSONB DEFAULT '[]'::jsonb,
  
  -- Integración con Google Drive
  drive_script_url TEXT,              -- URL del Google Apps Script
  drive_folder_id VARCHAR(100),       -- ID de la carpeta (opcional, para referencia)
  
  -- Ventana de tiempo para upload de fotos
  upload_start_time TIMESTAMP WITH TIME ZONE,
  upload_end_time TIMESTAMP WITH TIME ZONE,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda por slug
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Índice para filtrar eventos activos
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active) WHERE is_active = true;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Habilitar RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública de eventos activos
DROP POLICY IF EXISTS "Eventos activos son públicos" ON events;
CREATE POLICY "Eventos activos son públicos"
  ON events
  FOR SELECT
  USING (is_active = true);

-- ===========================================
-- Estructura de Secciones (JSON)
-- ===========================================
-- 
-- HERO:
-- {
--   "type": "hero",
--   "pre_title": "¡NOS CASAMOS!",
--   "names": ["Nico", "Sabri"]
-- }
-- NOTA: date y year se derivan automáticamente de event_date (single source of truth)
--
-- COUNTDOWN:
-- Esta sección se renderiza AUTOMÁTICAMENTE después de HeroSection.
-- NO es necesario incluirla en el array sections.
-- Siempre muestra días (si > 0), horas, minutos y segundos.
-- Tiene 6 fases: far_away, approaching, very_close, today, ongoing, past
--
-- LOCATION (se pueden tener múltiples, se muestran en grid):
-- {
--   "type": "location",
--   "title": "Ceremonia",
--   "venue_name": "Iglesia Nuestra Señora del Carmen",
--   "address": "Av. Principal 123",
--   "city": "Villa Allende, Córdoba",
--   "datetime": "22 de Noviembre - 19:00 hs",
--   "google_maps_url": "https://maps.google.com/...",
--   "additional_info": "Recibí debajo las indicaciones para llegar."
-- }
--
-- GIFT:
-- {
--   "type": "gift",
--   "title": "NOSOTROS...",
--   "message": "Si deseás realizarnos un regalo podés colaborar con nuestra Luna de Miel...",
--   "bank_info": {
--     "holder_name": "Juan Pérez",
--     "cbu": "0000003100000000000000",
--     "alias": "BODA.JUAN.MARIA",
--     "bank_name": "Banco Galicia",
--     "dni": "12345678"
--   },
--   "external_links": [{"label": "Falabella Novios", "url": "https://..."}],
--   "mercadopago_link": "https://..."
-- }
--
-- DRESSCODE:
-- {
--   "type": "dresscode",
--   "title": "DRESS CODE",
--   "code": "Vestimenta formal, elegante",
--   "description": "Evitar color blanco",
--   "pinterest_url": "https://pinterest.com/..."
-- }
--
-- CALENDAR:
-- {
--   "type": "calendar",
--   "title": "¡Agendá la fecha en tu calendario!",
--   "show_google": true,
--   "show_apple": true
-- }
--
-- UPLOAD:
-- {
--   "type": "upload",
--   "message": "¡Compartí este momento especial con nosotros!",
--   "projection_note": "Las fotos se mostrarán en las pantallas del salón"
-- }
--
-- INSTAGRAM:
-- {
--   "type": "instagram",
--   "handle": "@bodanicoysabri",
--   "message": "¡Preparate para nuestro gran día! Ya podés seguirnos...",
--   "button_text": "VER EN INSTAGRAM"
-- }
--
-- RSVP:
-- {
--   "type": "rsvp",
--   "title": "CONFIRMACIÓN DE ASISTENCIA",
--   "message": "Esperamos que seas parte de esta gran celebración...",
--   "form_url": "https://forms.google.com/...",
--   "button_text": "CONFIRMAR ASISTENCIA"
-- }
--
-- PLAYLIST:
-- {
--   "type": "playlist",
--   "title": "¿QUÉ CANCIONES NO PUEDEN FALTAR?",
--   "message": "¡Ayudanos sugiriendo las canciones...",
--   "form_url": "https://forms.google.com/...",
--   "button_text": "SUGERIR CANCIÓN"
-- }
--
-- INFO:
-- {
--   "type": "info",
--   "title": "INFO ÚTIL",
--   "message": "Te dejamos sugerencias de alojamientos y traslados...",
--   "accommodations": [
--     {"name": "Hotel X", "contact": "Tel: 123", "address": "Calle 1", "maps_url": "..."}
--   ],
--   "transfers": [
--     {"name": "Remis Y", "contact": "Tel: 456", "website": "..."}
--   ]
-- }
--
-- PHOTO_GALLERY (fotos pre-cargadas de los novios):
-- {
--   "type": "photo_gallery",
--   "title": "NOSOTROS...",
--   "photos": ["url1", "url2", "url3"]
-- }
--
-- FOOTER:
-- {
--   "type": "footer",
--   "message": "¡Gracias por acompañarnos en este momento tan importante!"
-- }
--

-- ===========================================
-- Presets de Tema Disponibles
-- ===========================================
-- 
-- elegant-gold: Dorado elegante (default)
--   primary: #c59e81, secondary: #d4c4b8
--   Fuentes: Playfair Display / Cormorant Garamond
--   Decoraciones: minimal
--
-- romantic-rose: Rosa romántico
--   primary: #d4a5a5, secondary: #e8d4d4
--   Fuentes: Cormorant Garamond / Lora
--   Decoraciones: romantic
--
-- modern-slate: Gris moderno
--   primary: #64748b, secondary: #94a3b8
--   Fuentes: Montserrat / Open Sans
--   Decoraciones: none
--
-- forest-green: Verde bosque
--   primary: #4a7c59, secondary: #6b9b7a
--   Fuentes: Merriweather / Source Sans Pro
--   Decoraciones: botanical
--
-- botanical-sage: Verde sage botánico (estilo agendalafecha)
--   primary: #A8B5A0, secondary: #C5CEC5
--   Fuentes: Cormorant Garamond / Lato
--   Hero: texture, Decoraciones: botanical
--

-- ===========================================
-- Consultas útiles
-- ===========================================

-- Ver todos los eventos
-- SELECT * FROM events;

-- Ver evento por slug
-- SELECT * FROM events WHERE slug = 'ejemplo-boda';

-- Actualizar URL de Google Apps Script
-- UPDATE events SET drive_script_url = 'https://script.google.com/...' WHERE slug = 'ejemplo-boda';

-- Configurar ventana de upload
-- UPDATE events SET upload_start_time = '2025-06-15T20:00:00-03:00', upload_end_time = '2025-06-16T04:00:00-03:00' WHERE slug = 'ejemplo-boda';

-- Cambiar tema a botanical-sage
-- UPDATE events SET theme = '{"preset": "botanical-sage"}'::jsonb WHERE slug = 'ejemplo-boda';

-- Personalizar tema (override de colores)
-- UPDATE events SET theme = '{"preset": "botanical-sage", "primary": "#8BA888", "decorations": "minimal"}'::jsonb WHERE slug = 'ejemplo-boda';

-- Desactivar evento
-- UPDATE events SET is_active = false WHERE slug = 'ejemplo-boda';
