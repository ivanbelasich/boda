# Temas y Personalización

La app soporta personalización visual por evento a través del campo `theme` en Supabase.

## Presets disponibles

### `elegant-gold` (Default)
Dorado elegante, ideal para bodas clásicas.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#c59e81` |
| Light | `#e1d4cc` |
| Dark | `#a07a5c` |
| Background | `#ffffff` |
| Text | `#2f2f2f` |
| Font Display | Playfair Display |
| Font Body | Cormorant Garamond |

### `romantic-rose`
Rosa romántico, ideal para quinceañeras.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#d4a5a5` |
| Light | `#f0e0e0` |
| Dark | `#b08080` |
| Background | `#fff9f9` |
| Text | `#3d2c2c` |
| Font Display | Cormorant Garamond |
| Font Body | Lora |

### `modern-slate`
Gris moderno, ideal para eventos corporativos.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#64748b` |
| Light | `#e2e8f0` |
| Dark | `#475569` |
| Background | `#f8fafc` |
| Text | `#1e293b` |
| Font Display | Inter |
| Font Body | Inter |

### `forest-green`
Verde bosque, ideal para eventos al aire libre.

| Propiedad | Valor |
|-----------|-------|
| Primary | `#6b8e6b` |
| Light | `#d4e5d4` |
| Dark | `#4a6b4a` |
| Background | `#fafdf7` |
| Text | `#2d3a2d` |
| Font Display | Playfair Display |
| Font Body | Source Sans Pro |

---

## Cómo usar

### Opción 1: Usar un preset

```sql
UPDATE events 
SET theme = '{"preset": "romantic-rose"}'::jsonb
WHERE slug = 'mi-evento';
```

### Opción 2: Personalizar colores sobre un preset

```sql
UPDATE events 
SET theme = '{
  "preset": "elegant-gold",
  "primary_color": "#d4af37"
}'::jsonb
WHERE slug = 'mi-evento';
```

### Opción 3: Tema completamente personalizado

```sql
UPDATE events 
SET theme = '{
  "primary_color": "#8B0000",
  "primary_light": "#CD5C5C",
  "primary_dark": "#5C0000",
  "background_color": "#FFF5F5",
  "text_color": "#2D1515",
  "font_display": "Georgia",
  "font_body": "Arial"
}'::jsonb
WHERE slug = 'mi-evento';
```

---

## Propiedades del tema

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `preset` | Nombre del preset base | `"elegant-gold"` |
| `primary_color` | Color principal (botones, acentos) | `"#c59e81"` |
| `primary_light` | Variante clara del primario | `"#e1d4cc"` |
| `primary_dark` | Variante oscura del primario | `"#a07a5c"` |
| `background_color` | Color de fondo | `"#ffffff"` |
| `text_color` | Color de texto | `"#2f2f2f"` |
| `font_display` | Tipografía para títulos | `"Playfair Display"` |
| `font_body` | Tipografía para cuerpo | `"Cormorant Garamond"` |

---

## Agregar nuevos presets

Editar el archivo `src/config/theme-presets.ts`:

```typescript
export const THEME_PRESETS = {
  // ... presets existentes ...
  
  'mi-nuevo-tema': {
    primary_color: '#...',
    primary_light: '#...',
    primary_dark: '#...',
    background_color: '#...',
    text_color: '#...',
    font_display: 'Mi Fuente',
    font_body: 'Otra Fuente',
  },
};
```

**Importante**: Si usas fuentes de Google Fonts, agregalas en `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Mi+Fuente&display=swap" rel="stylesheet">
```

---

## Cómo funciona técnicamente

1. El evento se carga desde Supabase con su `theme`
2. El hook `useEventTheme` procesa el tema:
   - Si hay `preset`, carga los valores base
   - Aplica cualquier override personalizado
3. Se setean CSS custom properties en `:root`
4. Tailwind usa esas variables via `@theme` en `index.css`

```css
/* index.css */
@theme {
  --color-event-primary: #c59e81;  /* Se sobrescribe dinámicamente */
  --font-event-display: "Playfair Display";
  /* ... */
}
```

```tsx
// Componentes usan clases de Tailwind
<h1 className="text-event-primary font-event-display">
  Título
</h1>
```

