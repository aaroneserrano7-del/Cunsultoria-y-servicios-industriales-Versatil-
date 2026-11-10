# Diseño e identidad visual de Versátil

## Composición aprobada

La marca combina una **V dorada con flecha ascendente**, sin fondo, y la palabra **Versátil** en tipografía serif. Se integra al encabezado claro y al pie azul marino. La fotografía negra del logotipo no se utiliza como bloque visual de la web.

![Símbolo de Versátil](../public/assets/versatil-symbol.svg)

El símbolo está trazado en SVG a partir de la referencia proporcionada y aprobada visualmente por el usuario. Es una adaptación para web; no se presenta como el archivo vectorial maestro original. El archivo está en `public/assets/versatil-symbol.svg` y la composición de la palabra y el descriptor está en HTML/CSS.

## Paleta implementada

| Variable CSS | Color | Uso |
| --- | --- | --- |
| `--ink` | `#142e3c` | Texto y detalles de alto contraste. |
| `--navy` | `#102f40` | Encabezados, botones principales y pie. |
| `--paper` | `#f6f5f0` | Fondo claro corporativo. |
| `--white` | `#ffffff` | Tarjetas y superficies. |
| `--line` | `#d8dcd8` | Separadores y bordes. |
| `--muted` | `#54636b` | Texto secundario. |
| `--accent` | `#be6734` | Acento cálido, indicadores y decoración. |
| `--accent-text` | `#a8592b` | Etiquetas pequeñas con contraste corregido. |
| `--gold` | `#efc071` | Botón claro y detalles sobre azul marino. |

La V emplea un degradado propio en el SVG. La paleta describe la implementación actual; no sustituye un manual de marca impreso con equivalencias CMYK o Pantone aprobadas.

## Tipografía

- Cuerpo, navegación y textos técnicos: Arial, Helvetica, sans-serif.
- Marca Versátil: Georgia, Times New Roman, serif, con peso regular.
- Énfasis del titular del inicio: Georgia en cursiva.
- Titulares principales: tamaños fluidos con clamp, jerarquía de un H1 por página y H2/H3 para contenido.

Se emplean fuentes del sistema, sin descargas de servicios externos. El logotipo conserva el mismo símbolo y modifica el color del texto para mantener legibilidad sobre fondos claro y oscuro.

## Componentes y orden visual

- Franja superior de las tres líneas de negocio y estado del sitio.
- Cabecera con marca, navegación y botón Cotización.
- Hero con titular, introducción y llamada a la acción; ilustración conceptual en Inicio.
- Tarjetas numeradas de departamentos y categorías.
- Bloques de proceso de atención, paneles técnicos y cierre de cotización.
- Tarjetas de correos con dirección completa y enlace para escribir.
- Pie con la marca, departamentos, tres correos y enlace de privacidad.

Los botones son sobrios, de forma rectangular y acompañados por una flecha dibujada con CSS. El sitio prioriza la lectura y la orientación por área.

## Adaptación a pantallas

El contenedor principal tiene un máximo de 1240 px. Los ajustes principales están definidos a 1100, 900 y 600 px. El menú se convierte en un control desplegable cuando JavaScript está disponible en pantallas pequeñas. Sin JavaScript, los enlaces quedan visibles.

Las pruebas cubren 1440, 768, 390 y 320 px. Las tarjetas pasan de varias columnas a una, los correos pueden partirse para evitar desbordamiento y la marca mantiene una composición proporcional.

## Movimiento

| Elemento | Comportamiento |
| --- | --- |
| Encabezados de contenido, ilustración, tarjetas y pasos | Entrada única al aparecer en pantalla, con desplazamiento de 18 px y desvanecimiento durante 560 ms. |
| Grupos de contenido | Secuencia de 45 ms por elemento, limitada a 135 ms. |
| Tarjetas | Elevación discreta de 4 px al interactuar. |
| Botones y flechas | Movimiento breve de 2 px y transiciones de 220 ms. |
| Menú móvil | Apertura de 220 ms. |

La preferencia de movimiento reducido desactiva las animaciones. El foco de teclado cancela la entrada del bloque para que el control permanezca visible. El contenido es visible por defecto y no depende de un observador para poder leerse.

## Accesibilidad y mantenimiento

Se mantienen contraste, foco visible, navegación por teclado, enlace para saltar al contenido, nombre accesible de la marca y texto alternativo de las imágenes. Las comprobaciones automatizadas con axe complementan la revisión visual.

Al modificar estilos compartidos se deben revisar Inicio, Contacto y Cotización en móvil y escritorio y ejecutar las suites. Nuevos logotipos, fotografías de equipo o marcas comerciales requieren confirmar su origen y autorización antes de incorporarlos.


## Vistas de la publicación

Capturas de la publicación real de Netlify, comprobada en escritorio y móvil, con movimiento reducido para registrar estados estables:

- [Inicio en escritorio](assets/inicio-escritorio.png).
- [Inicio en móvil](assets/inicio-movil.png).

Las diez páginas y los cuatro recursos públicos devolvieron 200. Sus catorce archivos se compararon por SHA-256 con el frontend auditado y coincidieron byte por byte.
