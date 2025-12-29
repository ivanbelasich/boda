# Configuración de Google Drive

Esta guía explica cómo conectar un evento con Google Drive para que los invitados puedan subir fotos.

## Resumen del flujo

```
Invitado sube foto → Google Apps Script → Carpeta en Drive → App lee fotos → Slideshow
```

---

## Paso 1: Crear la carpeta en Drive

1. Abrí [Google Drive](https://drive.google.com)
2. Creá una carpeta nueva (ej: "Fotos Boda 2025")
3. **Compartí la carpeta** como pública:
   - Click derecho → "Compartir"
   - "Configuración general" → "Cualquier persona con el enlace"
   - Rol: "Lector"
4. Copiá el **ID de la carpeta** desde la URL:
   ```
   https://drive.google.com/drive/folders/1ABCDefGHIjKLmnOPqrsTUvWXyz
                                          └─────────────────────────────┘
                                          Este es el FOLDER_ID
   ```

---

## Paso 2: Crear el Google Apps Script

1. Abrí [Google Apps Script](https://script.google.com)
2. Click en **"Nuevo proyecto"**
3. Borrá todo el código existente
4. Pegá este código:

```javascript
// ⚠️ IMPORTANTE: Reemplazá con el ID de tu carpeta de Drive
const FOLDER_ID = 'TU_FOLDER_ID_AQUI';

function doPost(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);
    
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.file),
      data.mimeType,
      data.fileName
    );
    
    const file = folder.createFile(blob);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        fileId: file.getId(),
        fileName: file.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'list') {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const files = folder.getFiles();
      const photos = [];
      
      while (files.hasNext()) {
        const file = files.next();
        const mimeType = file.getMimeType();
        
        if (mimeType.startsWith('image/')) {
          photos.push({
            id: file.getId(),
            name: file.getName(),
            url: 'https://drive.google.com/uc?export=view&id=' + file.getId(),
            timestamp: file.getDateCreated().getTime()
          });
        }
      }
      
      // Ordenar por fecha (más recientes primero)
      photos.sort((a, b) => b.timestamp - a.timestamp);
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          photos: photos 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Acción no válida' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. **Reemplazá** `TU_FOLDER_ID_AQUI` con el ID de tu carpeta
6. Guardá el proyecto (Ctrl+S) y ponele un nombre

---

## Paso 3: Publicar el Script

1. Click en **"Implementar"** → **"Nueva implementación"**
2. En "Tipo", click en ⚙️ y elegí **"Aplicación web"**
3. Configurá:
   - **Descripción**: "API Fotos Evento"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: **"Cualquier persona"** ← IMPORTANTE
4. Click en **"Implementar"**
5. Autorizá el acceso cuando te lo pida
6. **Copiá la URL** que te da (empieza con `https://script.google.com/macros/s/...`)

---

## Paso 4: Configurar en Supabase

Ejecutá este SQL en Supabase, reemplazando con tu URL:

```sql
UPDATE events 
SET drive_script_url = 'https://script.google.com/macros/s/TU_URL_AQUI/exec'
WHERE slug = 'tu-evento';
```

O al crear un evento nuevo:

```sql
INSERT INTO events (slug, type, title, event_date, drive_script_url, theme, sections) 
VALUES (
  'mi-boda',
  'wedding',
  'Mi Boda',
  '2025-06-15T18:00:00-03:00',
  'https://script.google.com/macros/s/TU_URL_AQUI/exec',
  '{"preset": "elegant-gold"}',
  '[...]'
);
```

---

## Verificar que funciona

### Test de lectura (GET)

Abrí en el navegador:
```
https://script.google.com/macros/s/TU_URL/exec?action=list
```

Deberías ver:
```json
{"success": true, "photos": [...]}
```

### Test de escritura (POST)

Desde la app, subí una foto y verificá que aparece en la carpeta de Drive.

---

## Solución de problemas

### "Error al subir fotos"

1. Verificá que la URL del script esté correcta en Supabase
2. Verificá que el FOLDER_ID sea correcto en el script
3. Revisá la consola del navegador (F12) para ver errores

### "Las fotos no aparecen en la presentación"

1. Verificá que la carpeta de Drive esté compartida públicamente
2. Esperá 15 segundos (el polling es cada 15s)
3. Verificá que `drive_script_url` esté configurado en Supabase

### "403 Forbidden al ver imágenes"

La carpeta de Drive no está compartida públicamente:
1. Click derecho en la carpeta → "Compartir"
2. "Cualquier persona con el enlace" → "Lector"

### "Quiero cambiar la carpeta de destino"

1. Creá una nueva carpeta en Drive (y compartila públicamente)
2. Copiá el nuevo FOLDER_ID
3. En Apps Script: editá el código con el nuevo ID
4. Implementá una nueva versión:
   - "Implementar" → "Gestionar implementaciones"
   - Click en ✏️ para editar
   - Cambiá la versión a "Nueva versión"
   - "Implementar"

---

## Arquitectura

```
┌─────────────┐     POST      ┌──────────────────┐     createFile     ┌──────────────┐
│   App Web   │ ──────────────▶ │ Google Apps Script│ ─────────────────▶│ Google Drive │
│  (React)    │               │    (doPost)       │                   │   (Carpeta)  │
└─────────────┘               └──────────────────┘                   └──────────────┘
       │                              │
       │         GET?action=list      │         getFiles
       │ ◀──────────────────────────▶ │ ◀────────────────────────────────▶
       │                              │
       ▼                              ▼
┌─────────────┐               ┌──────────────────┐
│ Slideshow   │               │    (doGet)       │
│ (Polling)   │               └──────────────────┘
└─────────────┘
```

El `DriveService` en la app abstrae estas llamadas:
- `uploadPhoto(file)` → POST al script
- `listPhotos()` → GET al script con `?action=list`
