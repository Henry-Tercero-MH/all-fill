# HEMITH · Impresión 3D

Sitio web one-page para **HEMITH**, un negocio de impresión 3D. Diseño editorial y
cálido, pensado para clientes que **no saben nada de impresión 3D**: lenguaje sencillo,
fondo blanco y fotografía real.

## Stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **Framer Motion** (animaciones de scroll, hover y lightbox)
- **react-icons** (íconos)
- Tipografía: **Fraunces** (títulos, serif con carácter) + **Nunito** (cuerpo)

## Paleta

Tomada de las tarjetas de color proporcionadas:

| Uso | Color | Hex |
| --- | --- | --- |
| Fondo | Blanco cálido | `#FBFAF7` |
| Texto | Army Black | `#171818` |
| Primario | Algerian Coral | `#F95C4B` |
| Verde (footer) | Off-Road Green | `#023A22` |
| Acento | Chrysocolla Blue | `#23ABBD` |
| Suaves | Soft Blue / Cream | `#AAD1F1` / `#FFF0BA` |

Se editan en [tailwind.config.js](tailwind.config.js).

## Secciones

1. **Hero** — collage de fotos reales, titular cercano y CTA a WhatsApp.
2. **Catálogo** — grid filtrable con fotos de Unsplash y precios en Quetzales.
3. **Cómo funciona** — proceso en 3 pasos (humaniza el servicio).
4. **Precios (Cotizador)** — wizard de 3 preguntas con estimado en tiempo real.
5. **Trabajos (Galería)** — masonry con lightbox.
6. **Opiniones** — testimonios.
7. **Contacto** — formulario validado + WhatsApp como canal principal.
8. **Footer** — en verde, con redes y cierre de marca.

## Imágenes

Las fotos son de **Unsplash** y se centralizan en
[src/data/images.js](src/data/images.js) (IDs verificados + helper `U(id, ancho)`).
Para usar fotos propias, reemplaza las URLs por las tuyas en ese archivo y en
[src/data/products.js](src/data/products.js).

## Correr el proyecto

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción en /dist
npm run preview  # previsualizar el build
```

## Pendientes para producción

- **WhatsApp:** reemplaza el número placeholder `50200000000` (aparece en Hero,
  Cotizador, Contacto y Footer).
- **Formulario de contacto:** valida en cliente; falta conectar el envío a un backend
  o servicio de correo (hay un comentario marcando el punto en `Contact.jsx`).
- **Precios:** las tablas del cotizador (`WHAT`, `SIZE`, `BASE`) están en
  [src/components/Quoter.jsx](src/components/Quoter.jsx).
- **Unsplash:** si esperas mucho tráfico, usa tus propias fotos o la API oficial de
  Unsplash con atribución.
