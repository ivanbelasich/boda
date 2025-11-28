# Instrucciones para conectar con Google Drive

Seguí estos pasos para que las fotos que suban los invitados vayan directo a tu Google Drive.

---

## Paso 1: Crear la carpeta en Drive

1. Abrí [Google Drive](https://drive.google.com)
2. Creá una carpeta nueva (ej: "Fotos Boda Tefo y Geli")
3. Entrá a la carpeta
4. Copiá el **ID** de la URL:
   ```
   https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXXXXXXX
                                          ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                          Este es el ID de la carpeta
   ```
5. Guardá ese ID, lo vas a necesitar en el Paso 2

---

## Paso 2: Crear el Google Apps Script

1. Abrí [Google Apps Script](https://script.google.com)
2. Hacé click en **"Nuevo proyecto"**
3. Borrá todo el código que aparece
4. Pegá este código:

```javascript
// ⚠️ IMPORTANTE: Reemplazá XXXXXXX con el ID de tu carpeta de Drive
const FOLDER_ID = 'XXXXXXXXXXXXXXXXXXXXXXX';

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

5. **IMPORTANTE**: En la línea 2, reemplazá `XXXXXXXXXXXXXXXXXXXXXXX` con el ID de tu carpeta que copiaste en el Paso 1

6. Guardá el proyecto (Ctrl+S) y ponele un nombre (ej: "Boda Fotos API")

---

## Paso 3: Publicar el Script

1. Hacé click en **"Implementar"** (botón azul arriba a la derecha)
2. Seleccioná **"Nueva implementación"**
3. En "Tipo", hacé click en el engranaje ⚙️ y elegí **"Aplicación web"**
4. Configurá:
   - **Descripción**: "API Fotos Boda" (o lo que quieras)
   - **Ejecutar como**: "Yo" (tu cuenta)
   - **Quién tiene acceso**: **"Cualquier persona"** ← IMPORTANTE
5. Hacé click en **"Implementar"**
6. Te va a pedir autorización → Click en **"Autorizar acceso"**
7. Elegí tu cuenta de Google
8. Si aparece "Google no verificó esta app", hacé click en **"Avanzado"** → **"Ir a [nombre del proyecto]"**
9. Click en **"Permitir"**
10. **Copiá la URL** que te da (empieza con `https://script.google.com/macros/s/...`)

---

## Paso 4: Pegar la URL en el código

1. Abrí el archivo `src/App.tsx`
2. En la línea 4, reemplazá:
   ```typescript
   const SCRIPT_URL = ''
   ```
   por:
   ```typescript
   const SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL_AQUI/exec'
   ```

3. Hacé lo mismo en `src/Presentacion.tsx` (línea 4)

---

## ¡Listo!

Ahora cuando los invitados suban fotos desde la landing:
- Las fotos van directo a tu carpeta de Drive
- La página de presentación las muestra automáticamente

---

## Solución de problemas

### "Error al subir"
- Verificá que la URL del script esté bien copiada
- Verificá que el ID de la carpeta sea correcto
- Revisá que hayas dado los permisos correctamente

### Las fotos no aparecen en la presentación
- Esperá unos segundos (se actualiza cada 5 seg)
- Verificá que la URL sea la misma en ambos archivos
- Abrí la consola del navegador (F12) para ver errores

### Quiero cambiar la carpeta de destino
- Creá una nueva carpeta en Drive
- Copiá el nuevo ID
- Volvé a Apps Script → editá el código con el nuevo ID
- Implementá una nueva versión (Implementar → Gestionar implementaciones → editar)

