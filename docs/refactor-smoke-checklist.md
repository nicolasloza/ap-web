# Refactor Smoke Checklist

Checklist manual para ejecutar al cerrar cada PR del refactor.

## Validaciones técnicas

- Correr TypeScript: `npm run build` (o equivalente del proyecto).
- Correr lint: `npm run lint`.
- Confirmar que no hay errores nuevos.

## Navegación general

- Abrir home (`/`) y verificar que carga sin errores.
- Navegar desde menú a `Propiedades`, `Tasaciones`, `Contacto`.
- Volver al home y confirmar que el drawer/header siguen funcionando.

## Listado de propiedades (`/propiedades`)

- Buscar por texto y confirmar resultados.
- Filtrar por tipo y por operación (Venta/Alquiler).
- Ordenar por nombre asc/desc y precio asc/desc.
- Limpiar filtros y confirmar URL limpia.
- Abrir una card y validar navegación al detalle.

## Detalle de propiedad (`/propiedades/:id`)

- Verificar carga normal del detalle.
- Verificar rama de error/not found con un ID inválido.
- Confirmar botón de volver al listado.

## Home destacadas

- Confirmar que las destacadas cargan.
- Si hay más de un slide: probar dots, prev/next y navegación de card.
- Confirmar que autoplay pausa con hover/focus (si corresponde).

## Contacto y Tasaciones

- Probar validaciones de campos vacíos.
- Probar envío exitoso en modo contacto.
- Probar envío exitoso en modo tasación.
- Forzar error de red/API y verificar mensaje de error.

## Criterio de cierre del PR

- Sin cambios funcionales perceptibles respecto al baseline.
- Sin cambios de rutas ni contratos de API.
- UI estable en desktop y mobile básico.
