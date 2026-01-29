# Temas y Personalización

La app soporta personalización visual por evento a través del campo `theme` en Supabase.

## Presets disponibles

### `elegant-gold` (Default)
Dorado elegante, ideal para bodas clásicas.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#c59e81` |
| Secondary | `#d4c4b8` |
| Light | `#e1d4cc` |
| Dark | `#a07a5c` |
| Background | `#ffffff` |
| Text | `#2f2f2f` |
| Font Display | Playfair Display |
| Font Body | Cormorant Garamond |
| Hero Style | solid |
| Decorations | minimal |

### `romantic-rose`
Rosa romántico, ideal para quinceañeras y bodas románticas.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#d4a5a5` |
| Secondary | `#e8d4d4` |
| Light | `#f0e0e0` |
| Dark | `#b08080` |
| Background | `#fff9f9` |
| Text | `#3d2c2c` |
| Font Display | Cormorant Garamond |
| Font Body | Lora |
| Hero Style | gradient |
| Decorations | romantic |

### `modern-slate`
Gris moderno, ideal para eventos corporativos.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#64748b` |
| Secondary | `#94a3b8` |
| Light | `#cbd5e1` |
| Dark | `#475569` |
| Background | `#f8fafc` |
| Text | `#1e293b` |
| Font Display | Montserrat |
| Font Body | Open Sans |
| Hero Style | solid |
| Decorations | none |

### `forest-green`
Verde bosque, ideal para eventos al aire libre.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#4a7c59` |
| Secondary | `#6b9b7a` |
| Light | `#8fbc8f` |
| Dark | `#2d5a3d` |
| Background | `#f5f9f5` |
| Text | `#1a3320` |
| Font Display | Merriweather |
| Font Body | Source Sans Pro |
| Hero Style | solid |
| Decorations | botanical |

### `botanical-sage`
Verde sage botánico, estilo inspirado en agendalafecha.com.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#A8B5A0` |
| Secondary | `#C5CEC5` |
| Light | `#D4DDD0` |
| Dark | `#6B7A62` |
| Background | `#FAFAFA` |
| Text | `#3D4A3A` |
| Font Display | Cormorant Garamond |
| Font Body | Lato |
| Hero Style | texture |
| Decorations | botanical |

### `midnight-navy`
Azul noche elegante, ideal para eventos formales o nocturnos.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#2c3e50` |
| Secondary | `#34495e` |
| Light | `#5d6d7e` |
| Dark | `#1a252f` |
| Background | `#ecf0f1` |
| Text | `#1a252f` |
| Font Display | Cinzel |
| Font Body | Raleway |
| Hero Style | gradient |
| Decorations | minimal |

### `terracotta-warm`
Terracota cálido mediterráneo, ideal para bodas rústicas o al aire libre.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#c17f59` |
| Secondary | `#d4a574` |
| Light | `#e8c9a8` |
| Dark | `#8b5a3c` |
| Background | `#fdf8f5` |
| Text | `#3d2914` |
| Font Display | DM Serif Display |
| Font Body | Lora |
| Hero Style | texture |
| Decorations | minimal |

### `lavender-dream`
Lavanda suave, estilo dreamy ideal para bodas de jardín o vintage.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#9b8aa6` |
| Secondary | `#b8a9c4` |
| Light | `#d4c5dc` |
| Dark | `#6b5d73` |
| Background | `#f8f6fa` |
| Text | `#3d3545` |
| Font Display | Quicksand |
| Font Body | Lora |
| Hero Style | gradient |
| Decorations | romantic |

---

## Identidad por tema (variantes)

Cada preset tiene una **identidad visual** que va más allá de los colores:

| Preset | Animación | Espaciado | Hero | Iconos | Bordes |
|--------|-----------|-----------|------|--------|--------|
| elegant-gold | elegante | normal | centrado | círculo | redondeado |
| romantic-rose | dreamy | aireado | elevado (card) | ornate | pill |
| modern-slate | minimal | compacto | minimal | outline (sin relleno) | sharp |
| forest-green | orgánico | normal | centrado | círculo | redondeado |
| botanical-sage | orgánico | aireado | centrado | soft | soft |
| midnight-navy | dramático | normal | dramático (grande) | square | sharp |
| terracotta-warm | orgánico | aireado | centrado | círculo | redondeado |
| lavender-dream | dreamy | aireado | elevado | ornate | pill |

- **Espaciado**: compact (menos padding en secciones), normal, airy (más espacio).
- **Hero**: centered, elevated (contenido en card con blur), minimal (más compacto), dramatic (tipografía más grande y bold).
- **Iconos**: minimal (solo borde), circle (fondo circular), ornate (círculo con sombra suave), square (esquinas rectas).
- **Bordes**: sharp (0), rounded, soft (1.5rem), pill (9999px).
- **Animaciones**: duración y estilo (elegant, dreamy, minimal, dramatic, organic) aplicados vía `data-theme` en el `<main>`.

El frontend aplica `data-theme="{preset}"` en el contenedor principal; los estilos por tema están en `src/index.css` bajo `[data-theme="..."]`.

---

## Propiedades del tema

### Colores
| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `preset` | Nombre del preset base | `"elegant-gold"` |
| `primary` | Color principal (botones, acentos) | `"#c59e81"` |
| `secondary` | Color secundario (secciones alternadas) | `"#d4c4b8"` |
| `primary_light` | Variante clara del primario | `"#e1d4cc"` |
| `primary_dark` | Variante oscura del primario | `"#a07a5c"` |
| `background` | Color de fondo | `"#ffffff"` |
| `text` | Color de texto | `"#2f2f2f"` |

### Tipografía
| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `font_display` | Tipografía para títulos | `"Playfair Display"` |
| `font_body` | Tipografía para cuerpo | `"Cormorant Garamond"` |

### Estilos visuales (NUEVO)
| Propiedad | Descripción | Valores |
|-----------|-------------|---------|
| `hero_style` | Estilo de fondo del hero | `"solid"`, `"texture"`, `"gradient"` |
| `hero_texture_url` | URL de imagen para textura (opcional) | `"https://..."` |
| `decorations` | Tipo de decoraciones en el hero | `"none"`, `"minimal"`, `"botanical"`, `"romantic"` |

---

## Cómo usar

### Opción 1: Usar un preset

```sql
UPDATE events 
SET theme = '{"preset": "botanical-sage"}'::jsonb
WHERE slug = 'mi-evento';
```

### Opción 2: Personalizar sobre un preset

```sql
UPDATE events 
SET theme = '{
  "preset": "botanical-sage",
  "primary": "#8BA888",
  "decorations": "minimal"
}'::jsonb
WHERE slug = 'mi-evento';
```

### Opción 3: Tema completamente personalizado

```sql
UPDATE events 
SET theme = '{
  "primary": "#8B0000",
  "secondary": "#A52A2A",
  "primary_light": "#CD5C5C",
  "primary_dark": "#5C0000",
  "background": "#FFF5F5",
  "text": "#2D1515",
  "font_display": "Georgia",
  "font_body": "Arial",
  "hero_style": "gradient",
  "decorations": "romantic"
}'::jsonb
WHERE slug = 'mi-evento';
```

---

## Estilos de Hero

### `solid`
Fondo con el color de background del tema. Simple y limpio.

### `texture`
Fondo con textura tipo papel/acuarela. Ideal para temas elegantes y naturales.
Se puede personalizar con `hero_texture_url` para usar una imagen propia.

### `gradient`
Gradiente de `primary_light` a `background`. Suave y romántico.

---

## Tipos de Decoraciones

### `none`
Sin decoraciones. El hero se muestra limpio sin elementos decorativos.

### `minimal`
Decoración mínima con un simple flourish elegante en el centro superior.

### `botanical`
Hojas y ramas en las esquinas del hero. Estilo natural y fresco.
Ideal para bodas en jardín o eventos al aire libre.

### `romantic`
Corazón sutil en el centro y marcos decorativos en las esquinas.
Ideal para bodas y eventos románticos.

---

## Secciones con fondos alternados

Las secciones alternan automáticamente entre diferentes fondos:

| Variante | Color de fondo | Color de texto |
|----------|----------------|----------------|
| `light` | Background del tema | Texto del tema |
| `primary` | Color primary | Blanco |
| `secondary` | Color secondary | Blanco |

El orden típico de secciones:
- Hero → transparent/texture
- Countdown → primary
- Locations → light
- Gift → primary
- Instagram → light
- DressCode → secondary
- RSVP → light
- Calendar → light
- Playlist → light
- Info → primary
- Footer → secondary

---

## Google Fonts

Si usas fuentes de Google Fonts, asegurate de agregarlas en `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
```

Las fuentes incluidas por defecto son:
- Playfair Display
- Cormorant Garamond
- Lora
- Montserrat
- Open Sans
- Merriweather
- Source Sans Pro
- Lato
- Cinzel (midnight-navy)
- Raleway (midnight-navy)
- DM Serif Display (terracotta-warm)
- Quicksand (lavender-dream)

---

## Cómo funciona técnicamente

1. El evento se carga desde Supabase con su `theme`
2. El hook `useFullEventTheme` procesa el tema:
   - Si hay `preset`, carga los valores base del preset
   - Aplica cualquier override personalizado
   - Retorna `style_vars` (CSS), `hero_style` y `decorations`
3. Se setean CSS custom properties en el `<main>`
4. Tailwind usa esas variables via `@theme` en `index.css`
5. El `HeroSection` recibe `hero_style` y `decorations` como props

```tsx
// EventPage.tsx
const theme_config = useFullEventTheme(event?.theme);

<main style={theme_config.style_vars}>
  <HeroSection 
    data={section}
    hero_style={theme_config.hero_style}
    decorations={theme_config.decorations}
  />
</main>
```
