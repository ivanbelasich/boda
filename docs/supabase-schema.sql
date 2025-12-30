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
  
  -- Personalización visual
  theme JSONB DEFAULT '{"preset": "elegant-gold"}'::jsonb,
  cover_image_url TEXT,
  
  -- Secciones de la landing (dinámicas)
  sections JSONB DEFAULT '[]'::jsonb,
  
  -- Integración con Google Drive
  drive_script_url TEXT,              -- URL del Google Apps Script
  drive_folder_id VARCHAR(100),       -- ID de la carpeta (opcional, para referencia)
  
  -- Ventana de tiempo para upload de fotos
  -- RECOMENDADO: Configurar upload_start_time ~1h después de event_date
  --              y upload_end_time ~12h después de event_date
  -- Si no se configura, la app usa valores por defecto (12h después de event_date)
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
CREATE POLICY "Eventos activos son públicos"
  ON events
  FOR SELECT
  USING (is_active = true);

-- ===========================================
-- Datos de ejemplo
-- ===========================================

-- Evento de ejemplo: Boda
-- Nota: HeroSection ya no usa "date" y "year" - se derivan automáticamente de event_date
-- Nota: CountdownSection se renderiza automáticamente, no es necesario incluirla en sections
INSERT INTO events (slug, type, title, subtitle, event_date, drive_script_url, theme, sections, upload_start_time, upload_end_time)
VALUES (
  'ejemplo-boda',
  'wedding',
  'Juan & María',
  'Nos casamos',
  '2025-06-15T18:00:00-03:00',
  NULL, -- Configurar después con tu URL de Apps Script
  '{"preset": "elegant-gold"}'::jsonb,
  '[
    {
      "type": "hero",
      "pre_title": "Nos casamos",
      "names": ["Juan", "María"]
    },
    {
      "type": "upload",
      "message": "¡Compartí este momento especial con nosotros!",
      "projection_note": "Las fotos se mostrarán en las pantallas del salón"
    }
  ]'::jsonb,
  '2025-06-15T20:00:00-03:00',  -- 2 horas después de event_date
  '2025-06-16T06:00:00-03:00'   -- 12 horas después de event_date
)
ON CONFLICT (slug) DO NOTHING;

-- Evento de ejemplo: Quinceañera
INSERT INTO events (slug, type, title, subtitle, event_date, theme, sections, upload_start_time, upload_end_time)
VALUES (
  'ejemplo-quince',
  'quinceanera',
  'Sofía',
  'Mis 15',
  '2025-08-20T20:00:00-03:00',
  '{"preset": "romantic-rose"}'::jsonb,
  '[
    {
      "type": "hero",
      "pre_title": "Los 15 de",
      "names": ["Sofía"]
    },
    {
      "type": "upload",
      "message": "¡Sacate fotos y compartilas!",
      "projection_note": null
    }
  ]'::jsonb,
  '2025-08-20T21:00:00-03:00',  -- 1 hora después de event_date
  '2025-08-21T08:00:00-03:00'   -- 12 horas después de event_date
)
ON CONFLICT (slug) DO NOTHING;

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

-- Cambiar tema
-- UPDATE events SET theme = '{"preset": "romantic-rose"}'::jsonb WHERE slug = 'ejemplo-boda';

-- Desactivar evento
-- UPDATE events SET is_active = false WHERE slug = 'ejemplo-boda';

