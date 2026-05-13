# Anti-Popups Chrome Extension

Extension para Chrome que bloquea popups y pestañas abiertas automáticamente por publicidad.

## Instalación

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** (esquina superior derecha)
3. Haz clic en **"Cargar descomprimida"**
4. Selecciona la carpeta `anti_popups`

## Cómo usar

### Por defecto: APAGADO
La extensión no bloquea ningún popup hasta que tú la actives manualmente.

### Activar el bloqueo en un sitio
1. Navega al sitio donde quieres bloquear popups
2. Haz **clic en el icono de la extensión** (esquina superior derecha del navegador)
3. El título del icono cambiará a `Anti-Popups: ON (dominio.com)`
4. A partir de ahora, todos los popups en ese sitio serán bloqueados

### Desactivar el bloqueo
1. Haz **clic en el icono de la extensión** nuevamente
2. El título cambiará a `Anti-Popups: OFF (dominio.com)`
3. Los popups funcionarán normalmente en ese sitio

### Persistencia
El estado (activado/desactivado) se guarda automáticamente por cada dominio. Si cierras Chrome y vuelves a abrirlo, recordarás qué sitios tenías activos.

## Cómo funciona

- **Content Script (`content.js`)**: Se inyecta en todas las páginas. Sobreescribe `window.open()` para que devuelva `null` cuando está activo, impidiendo que se abran ventanas emergentes.

- **Background Script (`background.js`)**: Detecta cuando se crean nuevas pestañas sin interacción directa del usuario y las cierra automáticamente si el bloqueo está activo para ese sitio.

## Archivos

- `manifest.json` - Manifiesto de la extensión (Manifest V3)
- `background.js` - Service worker
- `content.js` - Script inyectado en páginas