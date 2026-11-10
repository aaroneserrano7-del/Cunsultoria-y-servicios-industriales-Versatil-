# Cotizaciones exclusivamente por correo

Por instrucción expresa del usuario, el sitio muestra únicamente los tres correos oficiales como medio de contacto. Se retiraron el formulario, el procesamiento de datos personales, el transporte SMTP y la dependencia Nodemailer.

## Uso

El visitante selecciona la dirección del departamento. El enlace mailto abre su aplicación de correo; el visitante redacta y envía desde su propia cuenta. Si utiliza correo web sin asociación de enlaces, puede copiar la dirección en su servicio habitual.

Las direcciones son nom@versatilconsulting.com.mx, administracion@versatilconsulting.com.mx y maquinaria@versatilconsulting.com.mx. No se anuncian teléfono ni WhatsApp. La etiqueta Cotización se conserva y conduce a los correos.

## Actualizar la copia local

1. Detener el servidor con Ctrl+C.
2. Extraer la actualización en una carpeta temporal. Copiar todo su contenido dentro de la carpeta del proyecto que contiene package.json, aceptando reemplazar los archivos incluidos.
3. Ejecutar `npm.cmd ci` y después `npm.cmd run dev` desde esa carpeta.
4. Recargar el navegador con Ctrl+F5.

No se necesita completar .env ni generar contraseñas de aplicación. Si ya existe .env, el código actual no lo carga ni utiliza. La actualización no modifica ese archivo local.

No se envían mensajes automáticamente ni se muestra confirmación de recepción. La llegada de un correo depende de que el visitante lo envíe desde su cuenta y del funcionamiento de los buzones de destino.
