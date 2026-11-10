# Estado de Versátil

## Integración en GitHub

El proyecto completo y su documentación están en `main`. El propietario autorizó la fusión del [PR #1](https://github.com/aaroneserrano7-del/Cunsultoria-y-servicios-industriales-Versatil-/pull/1) el 10 de noviembre de 2026, después de aprobar sus cinco comprobaciones: Node.js 24 y 26 en Ubuntu y Windows, y Chromium con accesibilidad y diseño adaptable. El historial de revisión se conserva. La validación de cada actualización de `main` puede consultarse en [GitHub Actions](https://github.com/aaroneserrano7-del/Cunsultoria-y-servicios-industriales-Versatil-/actions).

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
- Revisar contenido y dominio antes de una publicación definitiva. La copia de prueba está disponible en https://frolicking-kleicha-53d5d3.netlify.app/ y conserva noindex.

No se verificaron los buzones de destino ni la entrega de mensajes desde cuentas reales. Los enlaces no garantizan que el visitante tenga una aplicación de correo configurada, por lo que las direcciones también se muestran completas para copiarlas.

## Validación de esta actualización

La primera actualización de contacto aprobó ocho pruebas: páginas y recursos, salud en modo correo, ausencia de recepción de solicitudes, direcciones oficiales, ausencia de formularios y dependencia SMTP, protección de archivos y métodos HTTP. Chromium verificó las diez rutas a 1440, 768 y 390 píxeles, el departamento resaltado en Cotización, los tres enlaces disponibles sin JavaScript y la conservación del menú y animaciones. No hubo desbordamientos ni excepciones JavaScript. No se enviaron correos reales.


## Auditoría estricta

Se corrigieron contraste de etiquetas, nombre accesible del logotipo, navegación móvil sin JavaScript, resolución de rutas del servidor y errores de arranque. Se incorporaron validación HTML, build aislado, pruebas de navegador y workflow de GitHub. Los resultados y la diferencia entre validación local y remota están documentados en [AUDITORIA_ESTRICTA.md](AUDITORIA_ESTRICTA.md).


## Documentación completa y publicación de prueba

El repositorio es público por decisión del usuario. El índice docs/README.md reúne empresa, arquitectura, diseño, esquema de páginas, desarrollo y despliegue. El PDF fuente interno queda fuera de la subida pública. Se versionaron las plantillas de Netlify y el comando build:static, con una prueba de regresión que comprueba index.html en la raíz; la suite de servidor/contenido/entrega pasa ahora trece pruebas. El dominio correcto de Netlify, con kleicha en el nombre, responde con 200 en diez páginas y cuatro recursos. La referencia anteriormente transcrita con otro nombre no corresponde a esa publicación.
