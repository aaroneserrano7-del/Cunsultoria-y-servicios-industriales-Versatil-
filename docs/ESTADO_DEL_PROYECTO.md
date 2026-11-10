# Estado de Versátil

## Alcance vigente

Sitio con diez páginas en HTML, CSS y JavaScript nativos, servido por Node.js 24+. Diseño aprobado con V dorada sin fondo, tipografía serif y animaciones discretas que respetan movimiento reducido.

Las tres áreas son Consultoría, Comercialización y Renta. Motorreductores y Productos industriales pertenecen a Comercialización.

## Contacto exclusivamente por correo

La instrucción más reciente del usuario sustituye el planteamiento previo de formulario único. Contacto y Cotización muestran únicamente enlaces a los tres correos oficiales:

| Área | Correo |
| --- | --- |
| Consultoría / NOM | nom@versatilconsulting.com.mx |
| Comercialización | administracion@versatilconsulting.com.mx |
| Renta | maquinaria@versatilconsulting.com.mx |

El visitante escribe desde su propia cuenta. La web no captura solicitudes, no almacena datos de contacto, no configura Gmail ni utiliza credenciales SMTP. No hay teléfono ni WhatsApp. Las rutas de envío y las comprobaciones de configuración de correo se retiraron. El servidor no lee .env.

## Desarrollo local

Abrir la carpeta que contiene package.json en VS Code. `npm run dev` inicia el servidor; `npm run check` y `npm test` verifican el proyecto. La configuración de ejecución y depuración se conserva. `npm ci` sincroniza el lockfile y elimina la dependencia de correo de instalaciones anteriores.

## Pendientes de contenido y publicación

- Incorporar el texto del aviso de privacidad que el usuario declaró aprobado.
- Confirmar razón social, trayectoria, portafolio e inventario antes de presentarlos como hechos.
- Sustituir la adaptación SVG por el archivo vectorial maestro si la empresa lo proporciona.
- Revisar alojamiento y dominio antes de publicar. El sitio sigue sin indexación; no se publicó nada.

No se verificaron los buzones de destino ni la entrega de mensajes desde cuentas reales. Los enlaces no garantizan que el visitante tenga una aplicación de correo configurada, por lo que las direcciones también se muestran completas para copiarlas.

## Validación de esta actualización

Ocho pruebas aprobadas: páginas y recursos, salud en modo correo, ausencia de recepción de solicitudes, direcciones oficiales, ausencia de formularios y dependencia SMTP, protección de archivos y métodos HTTP. Chromium verificó las diez rutas a 1440, 768 y 390 píxeles, el departamento resaltado en Cotización, los tres enlaces disponibles sin JavaScript y la conservación del menú y animaciones. No hubo desbordamientos ni excepciones JavaScript. No se enviaron correos reales.


## Auditoría estricta

Se corrigieron contraste de etiquetas, nombre accesible del logotipo, navegación móvil sin JavaScript, resolución de rutas del servidor y errores de arranque. Se incorporaron validación HTML, build aislado, pruebas de navegador y workflow de GitHub. Los resultados y la diferencia entre validación local y remota están documentados en [AUDITORIA_ESTRICTA.md](AUDITORIA_ESTRICTA.md).
