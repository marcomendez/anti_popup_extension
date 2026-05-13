# Anti-Popups Chrome Extension

Extension para Chrome que bloquea popups y pestañas abiertas automáticamente por publicidad.

## Instalación

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** (esquina superior derecha)
3. Haz clic en **"Cargar descomprimida"**
4. Selecciona la carpeta `anti_popups`

## Cómo usar

### Interfaz (popup)
Al hacer clic en el icono de la extensión se abre un menú con dos controles:

1. **Extensión global** - Toggle principal
   - **OFF (por defecto)**: La extensión no bloquea nada en ningún sitio
   - **ON**: Activa el bloqueo (sujeto al estado por sitio)

2. **Bloqueo en este sitio** - Toggle individual
   - Solo está disponible cuando el toggle global está ON
   - Permite activar/desactivar el bloqueo solo para el sitio actual

### Ejemplo de uso

1. **Quieres bloquear popups en "sitio.com"**:
   - Activa el toggle "Extensión global"
   - Activa el toggle "Bloqueo en este sitio" (o usa el botón)

2. **Quieres desactivar temporalmente**:
   - Desactiva el toggle "Extensión global"
   - No bloquea nada en ningún sitio

3. **Quieres permitir popups en un sitio específico**:
   - Mantén "Extensión global" ON
   - Desactiva "Bloqueo en este sitio" para ese dominio

### Persistencia
- El estado global y por sitio se guarda automáticamente.
- Si cierres Chrome y vuelvas a abrirlo, recordará la configuración.

## Cómo funciona

- **popup.html + popup.js**: Interfaz con toggles global y por sitio
- **content.js**: Sobreescribe `window.open()` para bloquear popups
- **background.js**: Detecta pestañas abiertas sin interacción directa y las cierra

## Comportamiento

| Global | Por sitio | Resultado |
|--------|-----------|-----------|
| OFF | OFF/ON | No bloquea nada |
| ON | OFF | No bloquea |
| ON | ON | Bloquea popups |

## Archivos

- `manifest.json` - Manifiesto de la extensión (Manifest V3)
- `popup.html` - Interfaz de la extensión
- `popup.js` - Lógica de la interfaz
- `background.js` - Service worker
- `content.js` - Script inyectado en páginas