# 👨‍💼 Guía Rápida para Supervisores

## Sistema LogiCo - Gestión y Supervisión

---

## 🎯 Tu Rol

Como **Supervisor**, eres responsable de:
- ✅ Gestionar farmacias, motoristas y motos
- ✅ Supervisar operaciones diarias
- ✅ Aprobar modificaciones
- ✅ Gestionar regiones y ciudades
- ✅ Generar reportes operativos
- ✅ Resolver incidencias complejas

**No tienes acceso a:**
- ❌ Gestión de usuarios del sistema

---

## 🚀 Inicio Rápido

### Acceso al Sistema

1. Inicia sesión con tus credenciales
2. Serás redirigido al **Dashboard completo**
3. Tienes acceso a casi todos los módulos

### Tu Menú

- Dashboard
- Movimientos
- Farmacias
- Motoristas
- Motos
- Regiones
- Reportes

---

## 📊 Dashboard de Supervisión

### Métricas Principales

**Operativas:**
- Total de entregas del día
- Movimientos en tránsito
- Pendientes de asignación
- Incidencias activas

**Recursos:**
- Motoristas activos
- Motos disponibles
- Farmacias operativas

**Desempeño:**
- Tiempo promedio de entrega
- Tasa de éxito
- Incidencias por tipo

---

## 🏥 Gestión de Farmacias

### Crear Nueva Farmacia

**Cuándo:** Al incorporar un nuevo punto de despacho

**Pasos:**
1. Menú → Farmacias → "+ Nueva"
2. Complete datos:
   - Nombre oficial
   - Dirección completa
   - Región y ciudad
   - Datos de contacto
3. Guardar

**Validaciones:**
- Nombre único
- Dirección verificada
- Contacto válido

### Editar Farmacia

**Casos comunes:**
- Cambio de dirección
- Actualización de contacto
- Cambio de teléfono

**Proceso:**
1. Buscar farmacia
2. Clic en ✏ (editar)
3. Modificar campos necesarios
4. Guardar cambios

### Desactivar Farmacia

**Cuándo:** Cierre temporal o permanente

**Importante:** No se puede eliminar si tiene movimientos activos

---

## 🏍️ Gestión de Motoristas

### Incorporar Nuevo Motorista

**Documentación requerida:**
- Datos personales completos
- RUT válido
- Licencia de conducir vigente
- Contacto de emergencia

**Pasos:**
1. Menú → Motoristas → "+ Nuevo"
2. Complete formulario:
   - Nombre completo
   - RUT (formato: 12345678-9)
   - Email y teléfono
   - Dirección, región, ciudad
   - Subir licencia (PDF o imagen)
3. Guardar

**El motorista se crea en estado ACTIVO**

### Asignar Moto a Motorista

**Opciones:**

**Opción 1: Desde Motorista**
1. Abrir detalles del motorista
2. Sección "Moto Asignada"
3. Seleccionar moto disponible
4. Guardar

**Opción 2: Desde Moto**
1. Abrir detalles de la moto
2. Clic en "Asignar Motorista"
3. Seleccionar motorista
4. Confirmar

### Cambiar Estado de Motorista

**Estados:**
- 🟢 **ACTIVO** - Disponible para asignaciones
- 🔴 **INACTIVO** - No disponible (vacaciones, licencia, etc.)

**Proceso:**
1. Abrir detalles del motorista
2. Clic en "Cambiar Estado"
3. Confirmar

**⚠️ Importante:** Un motorista inactivo no aparecerá en las opciones al crear movimientos

### Gestionar Licencias

**Renovación:**
1. Editar motorista
2. Subir nueva licencia
3. Actualizar fecha de vencimiento
4. Guardar

**Alertas:** El sistema puede alertar sobre licencias próximas a vencer

---

## 🏍️ Gestión de Motos

### Registrar Nueva Moto

**Datos requeridos:**
- Marca y modelo
- Patente (única)
- Clase de vehículo
- Color
- Cilindrada
- Año de fabricación
- Kilometraje actual

**Pasos:**
1. Menú → Motos → "+ Nueva"
2. Complete todos los campos
3. Opcional: Subir foto
4. Guardar

### Mantenimiento de Motos

**Actualizar Kilometraje:**
1. Editar moto
2. Actualizar campo "Kilometraje"
3. Agregar observación si es necesario
4. Guardar

**Registrar Mantenciones:**
- Usar campo de observaciones
- Indicar fecha y tipo de mantención
- Registrar próximo servicio

### Desasignar Moto

**Cuándo:**
- Mantención programada
- Cambio de motorista
- Baja del vehículo

**Proceso:**
1. Abrir detalles de la moto
2. Clic en "Desasignar"
3. Confirmar
4. La moto queda disponible para reasignación

---

## 📍 Gestión de Regiones y Ciudades

### Crear Región

**Cuándo:** Expansión a nueva zona geográfica

**Pasos:**
1. Menú → Regiones → "+ Nueva Región"
2. Ingresar nombre
3. Guardar

### Crear Ciudad

**Pasos:**
1. Seleccionar región
2. Clic en "+ Nueva Ciudad"
3. Ingresar nombre
4. Guardar

### Organización Territorial

**Estructura:**
```
Región Metropolitana
  ├─ Santiago
  ├─ Providencia
  ├─ Las Condes
  └─ Maipú

Región de Valparaíso
  ├─ Valparaíso
  ├─ Viña del Mar
  └─ Quilpué
```

**Uso:**
- Asignar farmacias a regiones/ciudades
- Asignar motoristas a zonas
- Generar reportes por zona

---

## 📦 Supervisión de Movimientos

### Aprobar Modificaciones

**Escenarios:**
- Operadora solicita cambio de motorista
- Cambio de dirección después de asignado
- Modificación de datos críticos

**Proceso:**
1. Revisar solicitud
2. Verificar justificación
3. Aprobar o rechazar
4. Registrar decisión

### Resolver Incidencias

**Tipos de incidencias que requieren tu intervención:**

**Dirección Errónea:**
1. Contactar a farmacia/cliente
2. Verificar dirección correcta
3. Actualizar movimiento
4. Reasignar si es necesario

**Cliente No Encontrado:**
1. Revisar intentos de contacto
2. Coordinar reintento
3. Definir nueva fecha/hora
4. Actualizar estado

**Problemas de Pago:**
1. Contactar a farmacia
2. Verificar método de pago
3. Coordinar solución
4. Autorizar reintento

### Reasignar Movimientos

**Cuándo:**
- Motorista no disponible
- Cambio de zona
- Optimización de rutas

**Pasos:**
1. Abrir movimiento
2. Editar
3. Cambiar motorista
4. Agregar observación del cambio
5. Guardar

---

## 📊 Reportes Operativos

### Reporte Diario

**Contenido:**
- Total de movimientos
- Entregas completadas
- Pendientes
- Incidencias
- Desempeño por motorista

**Generar:**
1. Menú → Reportes
2. Seleccionar "Reporte Diario"
3. Fecha: Hoy
4. Clic en "Generar"
5. Exportar (CSV o PDF)

### Reporte por Farmacia

**Uso:** Evaluar desempeño de cada farmacia

**Filtros:**
- Farmacia específica
- Rango de fechas
- Estado de movimientos

### Reporte por Motorista

**Métricas:**
- Entregas realizadas
- Tiempo promedio
- Incidencias
- Tasa de éxito

**Uso:** Evaluación de desempeño

### Estadísticas Generales

**Análisis:**
- Tendencias semanales/mensuales
- Zonas con más demanda
- Horarios pico
- Tipos de incidencias más comunes

---

## 🎯 Tareas de Supervisión

### Diarias

- [ ] Revisar dashboard al inicio del día
- [ ] Verificar disponibilidad de recursos
- [ ] Supervisar movimientos en curso
- [ ] Resolver incidencias activas
- [ ] Aprobar modificaciones pendientes
- [ ] Generar reporte diario

### Semanales

- [ ] Revisar desempeño de motoristas
- [ ] Analizar incidencias recurrentes
- [ ] Verificar estado de motos
- [ ] Actualizar información de farmacias
- [ ] Generar reportes semanales

### Mensuales

- [ ] Evaluación de desempeño general
- [ ] Planificación de mantenimientos
- [ ] Renovación de licencias
- [ ] Análisis de tendencias
- [ ] Reportes ejecutivos

---

## 💡 Mejores Prácticas

### Gestión de Recursos

1. **Mantén actualizada la información**
   - Datos de contacto
   - Estados de motoristas
   - Kilometrajes de motos

2. **Planifica con anticipación**
   - Mantenimientos programados
   - Renovación de licencias
   - Incorporación de nuevos recursos

3. **Optimiza asignaciones**
   - Considera ubicación de motoristas
   - Balancea carga de trabajo
   - Respeta zonas de cobertura

### Resolución de Problemas

1. **Actúa rápido**
   - Responde incidencias en tiempo real
   - No dejes problemas sin resolver

2. **Comunica claramente**
   - Informa decisiones a operadoras
   - Coordina con motoristas
   - Mantén informada a gerencia

3. **Documenta todo**
   - Registra decisiones importantes
   - Usa observaciones en movimientos
   - Mantén historial de cambios

### Análisis de Datos

1. **Revisa reportes regularmente**
   - Identifica patrones
   - Detecta problemas recurrentes
   - Propone mejoras

2. **Comparte insights**
   - Comunica hallazgos a gerencia
   - Capacita a operadoras
   - Mejora procesos

---

## ⚠️ Situaciones Críticas

### Motorista No Disponible Repentinamente

**Acciones:**
1. Identificar movimientos asignados
2. Reasignar a motoristas disponibles
3. Priorizar entregas urgentes
4. Comunicar cambios
5. Actualizar estado del motorista

### Múltiples Incidencias en una Zona

**Análisis:**
1. Identificar patrón común
2. Revisar direcciones
3. Verificar con farmacia
4. Ajustar procedimientos
5. Capacitar equipo

### Pico de Demanda

**Gestión:**
1. Evaluar recursos disponibles
2. Priorizar entregas urgentes
3. Coordinar con farmacias
4. Comunicar tiempos de espera
5. Solicitar apoyo si es necesario

---

## 📱 Herramientas Móviles

Puedes supervisar desde tu móvil:

**Funciones disponibles:**
- ✅ Ver dashboard en tiempo real
- ✅ Revisar movimientos
- ✅ Aprobar modificaciones
- ✅ Resolver incidencias
- ✅ Comunicarte con el equipo

**Recomendación:** Usa PC para tareas administrativas complejas

---

## 📞 Contactos Importantes

**Gerencia:** [Contacto]  
**Soporte Técnico:** soporte@logico.app  
**Emergencias:** [Teléfono]  
**Farmacias:** [Directorio]

---

## ✅ Checklist de Supervisión

### Inicio de Turno
- [ ] Revisar dashboard
- [ ] Verificar motoristas activos
- [ ] Revisar motos disponibles
- [ ] Revisar incidencias pendientes
- [ ] Coordinar con operadoras

### Durante el Turno
- [ ] Monitorear movimientos en tiempo real
- [ ] Resolver incidencias
- [ ] Aprobar modificaciones
- [ ] Coordinar reasignaciones
- [ ] Mantener comunicación con equipo

### Fin de Turno
- [ ] Generar reporte diario
- [ ] Verificar cierre de incidencias
- [ ] Actualizar estados
- [ ] Informar novedades
- [ ] Planificar día siguiente

---

**¡Éxito en tu gestión! 🚀**

**Última actualización:** Octubre 2025
