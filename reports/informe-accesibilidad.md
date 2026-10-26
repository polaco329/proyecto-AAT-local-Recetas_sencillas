# Informe de accesibilidad - Recetas Sencillas

## Cambios aplicados
- Se añadió un enlace de salto al contenido principal para mejorar la navegación por teclado.
- Se incorporaron etiquetas visibles en los formularios del blog y la búsqueda avanzada.
- Se mejoró el uso de botones con `type="button"` y estados accesibles en menús y filtros.
- Se ajustó la gestión de texto alternativo en las imágenes para que sea más descriptivo y útil para lectores de pantalla.
- Se añadió `lang="es"` al documento y se aseguró la estructura semántica con regiones principales.

## Evidencia de verificación
- Compilación: `npm run build` completada correctamente.
- Servidor local: `http://localhost:5173/` disponible.
- Lighthouse: reporte generado en `reports/lighthouse-accessibility.json`.

## Resultados de Lighthouse
- El reporte muestra una puntuación de accesibilidad de 0.95 en la auditoría ejecutada.
- Se detectó un problema restante de contraste de color en un texto verde claro sobre fondo claro.

## Corregidos al menos tres errores detectados
1. Falta de etiquetas en formularios: ahora los campos del blog y la búsqueda tienen `label` asociado.
2. Falta de navegación por teclado: se agregó un salto de contenido y se mejoraron los menús y botones interactivos.
3. Problemas de nombres accesibles: los controles de menú y filtros ahora exponen nombres y estados claros para lectores de pantalla.

## Uso de lectores de pantalla
### Qué información se lee correctamente
- El enlace "Saltar al contenido principal" se anuncia claramente al entrar a la página.
- Los encabezados de la página y los textos de los botones de navegación se leen de forma natural.
- Los formularios ahora anuncian sus etiquetas y campos requeridos.

### Qué elementos presentan problemas
- El contraste de algunos textos verdes claros sobre fondos claros sigue siendo insuficiente en ciertas secciones.
- Algunas imágenes decorativas o de apoyo podrían beneficiarse de un tratamiento más explícito para evitar lecturas redundantes.

## Recomendación
- Ajustar el contraste de color en los textos verdes de la interfaz para mejorar la legibilidad y subir el puntaje de Lighthouse.
