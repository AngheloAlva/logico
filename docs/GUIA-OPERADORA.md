# 👩‍💼 Guía Rápida para Operadoras

## Sistema LogiCo - Gestión de Movimientos

---

## 🎯 Tu Rol

Como **Operadora**, eres responsable de:
- ✅ Crear y gestionar movimientos diarios
- ✅ Hacer seguimiento de entregas
- ✅ Registrar incidencias
- ✅ Actualizar estados de movimientos

**No tienes acceso a:**
- ❌ Gestión de farmacias
- ❌ Gestión de motoristas y motos
- ❌ Gestión de usuarios
- ❌ Reportes gerenciales

---

## 🚀 Inicio Rápido

### 1. Iniciar Sesión

1. Ingresa tu email y contraseña
2. Serás redirigida automáticamente a **Movimientos**

### 2. Tu Pantalla Principal

Verás dos opciones en el menú:
- **Dashboard** - Vista operativa del día
- **Movimientos** - Tu herramienta principal

---

## 📦 Flujo de Trabajo Diario

### Paso 1: Recibir Solicitud de Despacho

Cuando recibes una solicitud (por teléfono, email, etc.):

1. Anota los datos del cliente:
   - Dirección completa
   - Teléfono de contacto
   - Productos solicitados
   - ¿Tiene receta médica?

### Paso 2: Crear Movimiento

1. Clic en **"Movimientos"** en el menú
2. Clic en **"+ Nuevo"**
3. Completa el formulario:

```
Número de Movimiento: [Código único, mín. 10 caracteres]
Farmacia: [Selecciona la farmacia origen]
Motorista: [Selecciona motorista disponible]
Dirección: [Dirección completa del cliente]
☐ Tiene Receta Asociada [Marca si aplica]
Observaciones: [Notas importantes]
```

4. Clic en **"Guardar"**

**✅ El movimiento se crea con estado PENDIENTE**

### Paso 3: Seguimiento

#### Ver Estado Actual

1. En la lista de movimientos, busca el número
2. El color indica el estado:
   - 🟡 PENDIENTE
   - 🔵 EN TRÁNSITO
   - 🟢 ENTREGADO
   - 🔴 INCIDENTE

#### Cambiar Estado

1. Clic en el movimiento
2. Clic en **"Cambiar Estado"**
3. Selecciona el nuevo estado:
   - **EN TRÁNSITO** cuando el motorista sale
   - **ENTREGADO** cuando se completa
   - **INCIDENTE** si hay problemas

### Paso 4: Registrar Incidencias

Si hay un problema durante la entrega:

1. Abre el movimiento
2. Clic en **"+ Registrar Incidencia"**
3. Selecciona el tipo:
   - **Dirección errónea** - La dirección no existe o es incorrecta
   - **Cliente no encontrado** - El cliente no está en el lugar
   - **Reintento necesario** - Hay que volver a intentar
   - **Cobro rechazado** - Problema con el pago
   - **Otro** - Cualquier otra situación

4. Describe detalladamente qué pasó
5. Clic en **"Registrar"**

**⚠️ El estado cambiará automáticamente a INCIDENTE**

---

## 💡 Consejos Prácticos

### ✅ Buenas Prácticas

1. **Verifica los datos antes de guardar**
   - Dirección completa y clara
   - Teléfono correcto
   - Motorista disponible

2. **Actualiza estados en tiempo real**
   - Cuando el motorista sale → EN TRÁNSITO
   - Cuando confirma entrega → ENTREGADO

3. **Registra incidencias inmediatamente**
   - Describe claramente el problema
   - Incluye todos los detalles relevantes

4. **Usa las observaciones**
   - "Cliente solicita llamar antes"
   - "Edificio sin ascensor"
   - "Portero recibe pedidos"

### ❌ Errores Comunes

1. **No verificar disponibilidad del motorista**
   - Asegúrate que el motorista esté activo
   - Verifica que tenga moto asignada

2. **Direcciones incompletas**
   - Siempre incluye número, piso, depto
   - Agrega referencias si es necesario

3. **No registrar incidencias**
   - Toda situación anormal debe quedar registrada
   - Ayuda a mejorar el servicio

4. **Olvidar marcar "Tiene Receta"**
   - Es importante para el seguimiento
   - Afecta el proceso de entrega

---

## 🔍 Funciones Principales

### Buscar Movimientos

**Por número:**
```
Buscar: [12345678901]
```

**Por estado:**
```
Estado: [En Tránsito ▼]
```

**Por fecha:**
```
Fecha: [18/10/2025]
```

### Ver Detalles

Clic en 👁 para ver:
- Información completa del movimiento
- Historial de cambios de estado
- Incidencias registradas
- Datos de contacto

### Editar Movimiento

Puedes editar:
- ✅ Dirección de entrega
- ✅ Observaciones
- ✅ Número de segmentos
- ❌ No puedes cambiar: Número, Farmacia

**Pasos:**
1. Clic en ✏ (editar)
2. Modifica lo necesario
3. Guardar cambios

---

## 📊 Dashboard Operativo

Tu dashboard muestra:

### Métricas del Día

- **Entregas Hoy** - Completadas hasta ahora
- **En Tránsito** - Motoristas en ruta
- **Pendientes** - Esperando asignación
- **Incidencias** - Problemas activos

### Movimientos Recientes

Lista de los últimos movimientos que creaste o modificaste.

### Acciones Rápidas

- Crear nuevo movimiento
- Ver movimientos pendientes
- Ver incidencias activas

---

## ⚠️ Situaciones Especiales

### Cliente No Responde

1. Registra incidencia "Cliente no encontrado"
2. Describe: "Se llamó X veces sin respuesta"
3. El movimiento queda en INCIDENTE
4. Coordina reintento con supervisor

### Dirección Incorrecta

1. Registra incidencia "Dirección errónea"
2. Describe el problema
3. Si tienes la dirección correcta, edita el movimiento
4. Cambia estado a EN TRÁNSITO nuevamente

### Problema con el Pago

1. Registra incidencia "Cobro rechazado"
2. Describe qué método de pago falló
3. Coordina solución con farmacia
4. Actualiza según resolución

### Múltiples Paradas

Si el movimiento tiene varias direcciones:

1. En "Número de Segmentos" indica cuántas
2. En "Direcciones de Segmentos" lista todas
3. En "Costo por Segmento" indica el valor
4. El sistema calculará el total

---

## 🎯 Objetivos Diarios

Como operadora, tus metas son:

1. **Registro Rápido**
   - Crear movimientos en menos de 2 minutos
   - Datos completos y correctos

2. **Seguimiento Activo**
   - Actualizar estados en tiempo real
   - Responder consultas de motoristas

3. **Comunicación Clara**
   - Observaciones detalladas
   - Incidencias bien descritas

4. **Resolución de Problemas**
   - Identificar incidencias rápidamente
   - Coordinar soluciones

---

## 📱 Acceso Móvil

Puedes usar LogiCo desde tu teléfono:

1. Abre el navegador
2. Ingresa la URL del sistema
3. Inicia sesión normalmente
4. La interfaz se adapta a tu pantalla

**Funciones disponibles en móvil:**
- ✅ Ver movimientos
- ✅ Cambiar estados
- ✅ Registrar incidencias
- ✅ Crear movimientos (recomendado en PC)

---

## ❓ Preguntas Frecuentes

### ¿Puedo eliminar un movimiento?

No, solo el Administrador puede eliminar movimientos.

### ¿Qué hago si no hay motoristas disponibles?

Contacta a tu supervisor para asignar recursos.

### ¿Puedo cambiar la farmacia de un movimiento?

No, la farmacia no se puede cambiar una vez creado el movimiento.

### ¿Cómo sé si un motorista está disponible?

En la lista de motoristas aparecen solo los activos y con moto asignada.

### ¿Puedo ver movimientos de otros días?

Sí, usa los filtros de fecha en la lista de movimientos.

### ¿Qué pasa si me equivoco al crear un movimiento?

Puedes editarlo si aún está en PENDIENTE. Si ya está EN TRÁNSITO, contacta a tu supervisor.

---

## 📞 ¿Necesitas Ayuda?

**Supervisor:** [Nombre y teléfono]  
**Soporte Técnico:** soporte@logico.app  
**Emergencias:** [Teléfono de emergencia]

---

## ✅ Checklist Diario

Al inicio del turno:
- [ ] Iniciar sesión
- [ ] Revisar movimientos pendientes
- [ ] Verificar incidencias del día anterior
- [ ] Confirmar motoristas disponibles

Durante el turno:
- [ ] Crear movimientos según solicitudes
- [ ] Actualizar estados en tiempo real
- [ ] Registrar incidencias inmediatamente
- [ ] Responder consultas de motoristas

Al final del turno:
- [ ] Verificar que todos los movimientos estén actualizados
- [ ] Revisar incidencias pendientes
- [ ] Informar novedades al siguiente turno
- [ ] Cerrar sesión

---

**¡Éxito en tu trabajo diario! 🚀**

**Última actualización:** Octubre 2025
