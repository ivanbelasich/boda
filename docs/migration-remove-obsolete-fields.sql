-- ===========================================
-- Migración: Eliminar campos obsoletos de secciones
-- ===========================================
-- Este script elimina campos que ya no son necesarios:
-- - HeroSection: date, year (ahora se derivan de event_date)
-- - CountdownSection: show_days, show_hours, show_minutes, show_seconds
--                     (ahora siempre se muestran todos)
--
-- Ejecuta este script si tienes eventos creados antes de estos cambios.
-- ===========================================

-- Función para limpiar secciones de un evento
CREATE OR REPLACE FUNCTION clean_event_sections(event_sections JSONB)
RETURNS JSONB AS $$
DECLARE
  cleaned_sections JSONB := '[]'::jsonb;
  section JSONB;
  cleaned_section JSONB;
BEGIN
  -- Iterar sobre cada sección
  FOR section IN SELECT * FROM jsonb_array_elements(event_sections)
  LOOP
    cleaned_section := section;
    
    -- Si es HeroSection, eliminar date y year
    IF section->>'type' = 'hero' THEN
      cleaned_section := cleaned_section - 'date' - 'year';
    END IF;
    
    -- Si es CountdownSection, eliminar show_* (aunque no debería estar en sections)
    IF section->>'type' = 'countdown' THEN
      cleaned_section := cleaned_section - 'show_days' - 'show_hours' - 'show_minutes' - 'show_seconds';
    END IF;
    
    -- Agregar sección limpiada al array
    cleaned_sections := cleaned_sections || jsonb_build_array(cleaned_section);
  END LOOP;
  
  RETURN cleaned_sections;
END;
$$ LANGUAGE plpgsql;

-- Actualizar todos los eventos activos
UPDATE events
SET sections = clean_event_sections(sections)
WHERE is_active = true;

-- Limpiar función temporal
DROP FUNCTION IF EXISTS clean_event_sections(JSONB);

-- ===========================================
-- Verificar cambios
-- ===========================================
-- Ver eventos que tenían campos obsoletos (si quieres verificar antes de ejecutar)
-- SELECT 
--   slug,
--   title,
--   jsonb_pretty(sections) as sections_before
-- FROM events
-- WHERE is_active = true
--   AND (
--     sections::text LIKE '%"date"%' 
--     OR sections::text LIKE '%"year"%'
--     OR sections::text LIKE '%"show_days"%'
--     OR sections::text LIKE '%"show_hours"%'
--   );

-- ===========================================
-- Notas importantes
-- ===========================================
-- 1. HeroSection: date y year ahora se derivan automáticamente de event_date
--    No es necesario (ni recomendado) incluirlos en el JSON.
--
-- 2. CountdownSection: Se renderiza automáticamente después de HeroSection.
--    No debe incluirse en el array sections. Si está presente, se ignorará.
--
-- 3. Después de ejecutar esta migración, los eventos existentes seguirán
--    funcionando correctamente, pero sin los campos obsoletos.


