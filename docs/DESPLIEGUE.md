# Desarrollo, entrega y publicación

## Abrir el proyecto correcto en VS Code

Usa **File → Open Workspace from File** y selecciona `Versatil.code-workspace` de la versión que quieras ejecutar. Este archivo toma como raíz su propia carpeta, donde deben estar package.json y server.js.

Al descargar un ZIP completo puede quedar una carpeta nueva dentro de otra anterior con el mismo nombre. Los comandos se ejecutan en la carpeta que contiene package.json. El archivo del workspace permite abrir directamente esa raíz sin adivinar la ruta.

## Servidor local

Con Node.js 24 o superior, desde la raíz del proyecto:

```sh
npm ci
npm run dev
```

En PowerShell:

```powershell
npm.cmd ci
$env:PORT = "3001"
npm.cmd run dev
```

El puerto predeterminado es 3000; el ejemplo usa 3001. Una vez iniciado, abre la dirección local del puerto indicado y conserva la terminal abierta. La dirección 127.0.0.1 sólo corresponde al equipo que ejecuta el servidor; no es un enlace público para otras personas.

Para abrir la entrega Node.js:

```sh
npm run build
cd dist
node server.js
```

No se necesita un archivo .env ni credenciales de correo.

## Entrega estática para Netlify

```sh
npm run build:static
```

La salida es:

```text
dist-static/
├── index.html
├── assets/
├── nosotros/
├── consultoria/
├── comercializacion/
├── renta/
├── contacto/
├── cotizar/
├── aviso-de-privacidad/
├── _headers
└── _redirects
```

index.html debe estar directamente en la raíz de la entrega. Este requisito evita el error de una publicación que contiene otra carpeta contenedora y no encuentra la portada.

### Subida manual

En el proyecto de Netlify, abre **Deploys** y utiliza el área de despliegue manual. Puedes subir la carpeta dist-static completa. Si prefieres un ZIP, comprime su contenido, con index.html en la raíz del archivo comprimido.

Desde PowerShell, estando en la raíz del proyecto y con la entrega ya generada:

```powershell
Compress-Archive -Path ".\dist-static\*" -DestinationPath ".\Versatil_Netlify.zip"
```

Sube ese ZIP en el área de Deploys. No subas la carpeta de desarrollo completa: la entrega estática ya contiene únicamente los archivos que necesita la web. Se puede abrir el enlace HTTPS resultante sin mantener el servidor local encendido.

### Conexión opcional con GitHub

`netlify.toml` establece:

- Comando de construcción: `npm run build:static`.
- Directorio publicado: `dist-static`.
- Node.js para la construcción: 24.

El archivo prepara el repositorio para Netlify, pero no conecta cuentas, crea proyectos ni ejecuta una publicación por sí mismo. El proyecto completo está en `main` desde la integración autorizada del PR #1 el 10 de noviembre de 2026. Si se configura una conexión de Netlify con GitHub, puede seleccionarse `main` como rama de publicación, con el comando y directorio indicados arriba.

### Rutas y cabeceras

Las plantillas están en `deploy/netlify`. El script las copia a dist-static:

- `_redirects`: resuelve las nueve rutas internas sin extensión hacia su index.html.
- `_headers`: CSP, nosniff, referente, permisos y noindex para la copia de revisión.

La copia estática permite que app.netlify.com la muestre dentro de su vista previa. El servidor Node.js conserva frame-ancestors none. Ambas variantes conservan el contacto exclusivamente por correo y bloquean formularios.

## Estado del enlace de prueba

El usuario compartió como enlace público correcto https://frolicking-kleicha-53d5d3.netlify.app/. La referencia anterior había sido transcrita con un nombre diferente; sus respuestas 404 no corresponden a este dominio. La comprobación del dominio correcto devolvió HTTP 200 en las diez páginas y los cuatro recursos principales. Los catorce archivos publicados coinciden por SHA-256 con el frontend auditado. También se abrieron y capturaron la portada en escritorio y móvil en Chromium.

## Antes de una publicación definitiva

- Incorporar el texto íntegro del aviso de privacidad aprobado.
- Confirmar contenido corporativo y los activos que se quieran publicar.
- Definir dominio y comprobar las rutas, los estilos, las imágenes y los tres correos en el enlace real.
- Revisar las políticas de indexación: la copia de revisión contiene noindex en HTML y cabeceras; el servidor local también bloquea robots.
- Conservar una entrega anterior para volver a ella si fuera necesario.

El PDF interno no forma parte de la entrega web ni del repositorio público. No hay envío SMTP, contraseña de Google ni base de datos en este modelo.
