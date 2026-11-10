# Versátil · Sitio corporativo

Frontend con HTML, CSS y JavaScript nativos; servidor Node.js 24 o superior. Se conservan el diseño aprobado, la V dorada sin fondo y las animaciones.

## Contacto acordado

El único medio de contacto es el correo electrónico:

- Consultoría / NOM: nom@versatilconsulting.com.mx
- Comercialización: administracion@versatilconsulting.com.mx
- Renta: maquinaria@versatilconsulting.com.mx

Las páginas Contacto y Cotización muestran las direcciones como enlaces `mailto:`. El visitante redacta y envía desde su propia cuenta usando su aplicación o servicio de correo. También puede copiar la dirección. El sitio no recibe formularios ni envía mensajes desde el servidor.

No se requieren contraseñas, SMTP, Nodemailer ni configuración de Gmail. No se utiliza el archivo `.env`. No hay teléfono ni WhatsApp. Las dependencias de desarrollo se utilizan sólo para auditoría; el servidor no tiene dependencias de producción.

## Ejecutar en VS Code

1. Abre la carpeta que contiene `package.json` o abre `Versatil.code-workspace`.
2. Si actualizas desde la versión que instaló correo SMTP, detén el servidor y ejecuta `npm ci` para retirar esa dependencia. En PowerShell utiliza `npm.cmd ci`.
3. Ejecuta `npm run dev` (PowerShell: `npm.cmd run dev`) o usa F5 con **Versátil: iniciar y depurar Node.js**.
4. Abre `http://127.0.0.1:3000` y conserva la terminal abierta mientras usas el sitio.

Después de editar HTML, CSS o JavaScript, guarda y actualiza el navegador. Ctrl+F5 fuerza una recarga. Las opciones de VS Code están en `.vscode/`; no necesitas extensiones adicionales.

## Archivos principales

- `server.js`: servidor de páginas y recursos, sin envío de correo.
- `public/`: diez páginas HTML.
- `public/assets/styles.css`: estilos y transiciones.
- `public/assets/app.js`: menú móvil, selección del departamento y animaciones.
- `public/assets/versatil-symbol.svg`: V dorada.
- `lib/quotations.js`: catálogo de los tres correos, sin transporte SMTP.
- `test/`: pruebas de páginas, enlaces y rutas.

`GET /api/health` informa `{ "status": "ok", "contact": "email" }`. No existe una API de recepción de cotizaciones. Un POST no envía ni almacena mensajes.

## Verificar

```sh
npm run validate
npx --no-install playwright install chromium
npm run test:ui
```

`npm run validate` revisa sintaxis, JSON, HTML, pruebas del servidor, generación de `dist` y arranque de la entrega en una carpeta aislada. La suite de navegador revisa las diez páginas a 1440, 768, 390 y 320 píxeles, incluyendo accesibilidad automatizada. En PowerShell utiliza `npm.cmd` y `npx.cmd`.

Para abrir siempre la raíz correcta, usa **File → Open Workspace from File** y elige `Versatil.code-workspace`. Al actualizar, copia el contenido en la carpeta que contiene `package.json`, evitando crear otra carpeta del proyecto dentro de ella.

## Arquitectura y auditoría

El frontend está en `public`; Node.js sólo sirve páginas y recursos. Los enlaces de correo abren la aplicación del visitante. `npm run build` genera una entrega en `dist` que funciona con `node server.js`, sin instalar dependencias.

Consulta [la auditoría estricta](docs/AUDITORIA_ESTRICTA.md) para resultados y límites. El workflow de GitHub se ejecutó correctamente en Linux y Windows con Node 24 y 26, además de Chromium. El código está en el [PR #1 en borrador](https://github.com/aaroneserrano7-del/Cunsultoria-y-servicios-industriales-Versatil-/pull/1), sin fusionar en main.

## Estado

El sitio está en desarrollo, sin indexación y sin despliegue. El aviso de privacidad aprobado sigue pendiente de incorporar cuando se facilite el texto. Eso no exige configurar Gmail ni activar un formulario: el modelo actual es exclusivamente contacto por correo.
