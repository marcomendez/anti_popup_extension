# Anti-Popups Chrome Extension

Extension para Chrome que bloquea popups y pestañas abiertas automáticamente por publicidad.

## Instalación

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** (esquina superior derecha)
3. Haz clic en **"Cargar descomprimida"**
4. Selecciona la carpeta `anti_popups`

## Cómo usar

Al hacer clic en el icono de la extensión se abre un menú con un único toggle:

- **OFF (por defecto)**: La extensión no bloquea nada
- **ON**: Bloquea todos los popups en todos los sitios

El estado se guarda automáticamente.

## Cómo funciona

- **popup.html + popup.js**: Interfaz con toggle de activación
- **content.js**: Sobreescribe `window.open()` para bloquear popups
- **background.js**: Detecta pestañas abiertas sin interacción directa y las cierra

## Archivos

- `manifest.json` - Manifiesto de la extensión (Manifest V3)
- `popup.html` - Interfaz de la extensión
- `popup.js` - Lógica de la interfaz
- `background.js` - Service worker
- `content.js` - Script inyectado en páginas