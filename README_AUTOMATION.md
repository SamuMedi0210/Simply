# Aplicación de Automatización para SimplyCodes Extension

Esta aplicación permite automatizar el funcionamiento de la extensión SimplyCodes de Chrome, facilitando la verificación masiva de cupones y el llenado rápido de formularios.

## Características Principales

### 1. Auto-verificación de Cupones
- Presiona automáticamente el botón "Verificar cupón" a intervalos configurables
- Intervalo ajustable de 1 a 30 segundos
- Botón de inicio/pausa para control total

### 2. Atajos de Teclado

Los siguientes atajos están disponibles cuando la funcionalidad está habilitada:

- **P**: Marcar cupón como inválido (usa el texto del portapapeles)
- **V**: Marcar cupón como válido (usa el texto del portapapeles)
- **C**: Copiar el código actual al portapapeles
- **N**: Avanzar al siguiente cupón
- **Espacio**: Verificar cupón manualmente

### 3. Registro de Actividad
- Visualiza todas las acciones realizadas en tiempo real
- Tipos de actividad: auto-verificación, atajos, llenado de formularios
- Estados: éxito, error, pendiente

### 4. Resultados de Cupones
- Estadísticas en tiempo real (válidos, inválidos, tasa de éxito)
- Historial completo de cupones probados
- Indicadores visuales de estado

### 5. Almacenamiento en Supabase
- Todas las configuraciones y logs se guardan automáticamente
- Sincronización en tiempo real
- Historial persistente de resultados

## Estructura del Proyecto

```
src/
├── components/
│   ├── AutomationControls.tsx    # Panel de control principal
│   ├── ShortcutsGuide.tsx         # Guía de atajos de teclado
│   ├── ActivityLog.tsx            # Registro de actividades
│   ├── CouponResults.tsx          # Resultados y estadísticas
│   └── AutomationRunner.tsx       # Motor de automatización
├── hooks/
│   └── useAutomation.ts           # Hook para gestión de datos
├── lib/
│   └── supabase.ts                # Cliente y tipos de Supabase
├── scripts/
│   └── automation.ts              # Lógica de automatización
└── App.tsx                        # Componente principal
```

## Base de Datos (Supabase)

### Tablas

#### automation_configs
- Almacena las configuraciones de automatización por usuario
- Campos: auto_verify_enabled, verify_interval, shortcuts_enabled

#### automation_logs
- Registra todas las acciones realizadas
- Campos: action_type, status, details, created_at

#### coupon_results
- Guarda los resultados de cupones probados
- Campos: coupon_code, is_valid, discount_amount, tested_at

## Uso

1. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

2. **Activar auto-verificación**:
   - Haz clic en el botón "Iniciar" en el panel de control
   - Ajusta el intervalo según tus necesidades

3. **Usar atajos de teclado**:
   - Asegúrate de que los atajos estén habilitados
   - Copia un código de cupón al portapapeles
   - Presiona 'P' para marcar como inválido o 'V' para marcar como válido

4. **Monitorear actividad**:
   - Revisa el registro de actividad en tiempo real
   - Observa las estadísticas de cupones
   - Actualiza los datos con los botones de refrescar

## Cómo Funciona la Automatización

### Auto-verificación
El sistema busca el botón de verificación usando múltiples estrategias:
- Selectores específicos (data-testid, class, id)
- Búsqueda por texto del botón
- Análisis del DOM en tiempo real

### Atajos de Teclado
Los atajos funcionan mediante:
1. Lectura del portapapeles del navegador
2. Búsqueda de campos de formulario
3. Llenado automático y dispatch de eventos
4. Registro en la base de datos

### Llenado de Formularios
El sistema identifica campos de cupones buscando:
- Atributos name/id con palabras clave (coupon, promo, discount)
- Placeholders relacionados
- Atributos data-testid

## Seguridad y Permisos

La aplicación requiere:
- Acceso al portapapeles (para copiar/pegar códigos)
- Permisos de la extensión SimplyCodes activa
- Conexión a Supabase (para persistencia de datos)

## Notas Importantes

- La extensión SimplyCodes debe estar instalada y activa
- Los atajos no funcionan cuando estás escribiendo en un campo de texto
- La auto-verificación se detiene automáticamente si el botón no está disponible
- Todos los datos se sincronizan con Supabase en tiempo real

## Solución de Problemas

### El botón no se presiona automáticamente
- Verifica que la extensión SimplyCodes esté activa
- Comprueba que el botón de verificación sea visible
- Revisa el registro de actividad para ver errores

### Los atajos no funcionan
- Asegúrate de que los atajos estén habilitados en el panel
- Verifica que no estés dentro de un campo de texto
- Comprueba los permisos del portapapeles del navegador

### No se guardan los datos
- Verifica la conexión a Supabase
- Revisa las variables de entorno (.env)
- Comprueba la consola del navegador para errores

## Desarrollo

Para contribuir o modificar:

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura las variables de entorno en `.env`
4. Ejecuta en desarrollo: `npm run dev`
5. Construye para producción: `npm run build`
