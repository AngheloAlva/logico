# 📘 Introducción y Contexto del Negocio

## 1. ¿Qué es LogiCo?

**LogiCo** (Logística Completa) es una aplicación web moderna y completa desarrollada para **Discopro Ltda.**, empresa que presta servicios de distribución de pedidos farmacéuticos a domicilio para las farmacias **Cruz Verde**.

### Objetivo Principal

Automatizar completamente el proceso de gestión de despachos de productos farmacéuticos y de salud mediante motoristas, desde la captura del pedido hasta la entrega al cliente final.

---

## 2. Problema que Resuelve

### 2.1 Situación Actual

Discopro Ltda. actualmente gestiona toda su operación mediante:
- 📊 Plantillas Excel como único medio de administración
- 📁 Archivos en carpetas dispersas
- ✍️ Procesos manuales

### 2.2 Consecuencias

Esta forma de trabajo genera:

| Problema | Impacto |
|----------|---------|
| **Pérdida de tiempo** | Búsqueda manual de información en múltiples archivos |
| **Falta de control** | No hay trazabilidad de los datos ni auditoría |
| **Dificultad en reportes** | Generación manual de reportes toma horas |
| **Errores humanos** | Datos duplicados, inconsistencias, pérdidas de información |
| **Imposibilidad de escalar** | No soporta crecimiento del negocio |
| **Baja visibilidad** | No hay métricas en tiempo real |

### 2.3 Necesidades Identificadas

1. Sistema centralizado de información
2. Acceso rápido a datos históricos
3. Reportes automáticos y en tiempo real
4. Control de usuarios y permisos
5. Trazabilidad de operaciones
6. Interfaz moderna e intuitiva

---

## 3. La Solución: LogiCo

### 3.1 Características Principales

LogiCo proporciona una solución integral que incluye:

#### ✅ Gestión Centralizada
- Base de datos relacional PostgreSQL
- Información accesible desde cualquier lugar
- Backup automático y seguridad

#### ✅ Automatización de Procesos
- Flujos de trabajo automatizados
- Notificaciones en tiempo real
- Validaciones automáticas

#### ✅ Dashboard Interactivo
- Métricas en tiempo real
- Visualización de datos
- KPIs del negocio

#### ✅ Control de Acceso
- Sistema de roles (Admin, Operadora, Gerente)
- Permisos granulares
- Auditoría de acciones

#### ✅ Reportes Automáticos
- Generación de reportes diarios
- Exportación a CSV/Excel
- Estadísticas personalizadas

### 3.2 Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Panel principal con métricas y estadísticas |
| **Farmacias** | Gestión de locales de farmacia |
| **Motoristas** | Administración de conductores |
| **Motos** | Control de vehículos |
| **Movimientos** | Gestión de despachos y entregas |
| **Incidencias** | Registro de problemas en entregas |
| **Regiones/Ciudades** | Gestión geográfica |
| **Usuarios** | Administración de usuarios del sistema |
| **Reportes** | Generación y exportación de reportes |

---

## 4. Contexto del Negocio

### 4.1 Proceso General de Distribución

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ Cliente │────▶│   Farmacia   │────▶│   Farmacia   │
│         │     │   Central    │     │    Local     │
└─────────┘     └──────────────┘     └──────┬───────┘
                                            │
                                            ▼
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ Cliente │◀────│  Motorista   │◀────│   Control    │
│         │     │              │     │  Despachos   │
└─────────┘     └──────────────┘     └──────────────┘
```

### 4.2 Flujo Detallado

#### Paso 1: Solicitud del Cliente
- Cliente realiza compra en farmacia o por internet/teléfono
- Proporciona dirección de entrega y datos de contacto
- Indica método de pago (efectivo o tarjeta)

#### Paso 2: Procesamiento Central
- Farmacia Central recibe el pedido
- Emite orden a farmacia local según jurisdicción
- Sistema predefinido de asignación geográfica

#### Paso 3: Preparación del Pedido
- Farmacia Local recibe la orden
- Confecciona el pedido con los productos
- Prepara documentación (boleta, bitácora)

#### Paso 4: Asignación a Motorista
- Farmacia entrega pedido a motorista
- Proporciona datos del despacho
- Motorista registra información en sistema

#### Paso 5: Entrega
- Motorista se dirige a dirección del cliente
- Realiza la entrega del pedido
- Obtiene confirmación/firma del cliente

#### Paso 6: Cierre
- Motorista informa éxito o incidencia
- Control de despachos actualiza estado
- Sistema genera reportes para farmacia central

### 4.3 Casos Especiales y Excepciones

#### 🔄 Traspasos entre Locales
- Un local puede solicitar productos de otro local
- Motorista debe hacer parada adicional en su ruta
- Se registra como parte del movimiento principal

#### 📦 Producto No Disponible
- Si el local no tiene el producto, motorista debe obtenerlo en otra farmacia
- Se registra la farmacia de origen alternativa

#### ❌ Cliente No Encontrado
- Cliente no está en ubicación indicada
- Motivos: ausente, dirección incorrecta, etc.
- Acciones posibles:
  - Anular el pedido
  - Reenviar en otro horario/día
  - Contactar al cliente

#### 🔁 Reenvíos
- Pedido debe volver a ser despachado
- Se vincula al movimiento original
- No genera nuevo código de despacho

#### 📋 Receta Médica Retenida
- Medicamentos sujetos a receta
- Requiere 2 visitas:
  1. Retirar receta del cliente
  2. Entregar medicamentos

#### 💰 Pago en Efectivo
- Motorista debe llevar:
  - Boleta correspondiente
  - Bitácora de despacho
  - Cambio o máquina POS
  - Pedido completo

#### 🚚 Rutas Múltiples
- Una ruta puede incluir varias entregas
- Se optimiza el recorrido
- Cada entrega se registra como segmento

---

## 5. Roles del Sistema

### 5.1 Administrador

**Responsabilidades:**
- Gestión completa del sistema
- Configuración de parámetros
- Administración de usuarios
- Acceso a todos los módulos

**Permisos:**
- ✅ Crear, editar, eliminar cualquier entidad
- ✅ Acceder a todos los reportes
- ✅ Modificar configuraciones del sistema
- ✅ Gestionar roles y permisos

### 5.2 Operadora

**Responsabilidades:**
- Creación y seguimiento de movimientos
- Registro de incidencias
- Coordinación con motoristas
- Atención de excepciones

**Permisos:**
- ✅ Crear y editar movimientos
- ✅ Registrar incidencias
- ✅ Ver información de farmacias y motoristas
- ⚠️ Requiere aprobación de supervisor para modificaciones críticas

### 5.3 Gerente

**Responsabilidades:**
- Supervisión general del servicio
- Análisis de métricas
- Toma de decisiones estratégicas
- Revisión de reportes

**Permisos:**
- ✅ Acceso completo a dashboard
- ✅ Generación y exportación de reportes
- ✅ Visualización de todas las métricas
- ❌ No puede modificar datos operacionales

### 5.4 Supervisor

**Responsabilidades:**
- Validación de operaciones
- Aprobación de modificaciones de operadores
- Resolución de conflictos
- Control de calidad

**Permisos:**
- ✅ Aprobar modificaciones de operadores
- ✅ Modificar pedidos/traspasos/reenvíos
- ✅ Acceso a reportes operacionales
- ✅ Gestionar incidencias críticas

---

## 6. Beneficios Esperados

### 6.1 Operacionales

| Beneficio | Descripción |
|-----------|-------------|
| **Eficiencia** | Reducción del 60% en tiempo de gestión de datos |
| **Precisión** | Eliminación de errores manuales |
| **Trazabilidad** | Registro completo de todas las operaciones |
| **Disponibilidad** | Acceso 24/7 desde cualquier lugar |

### 6.2 Estratégicos

- 📈 **Escalabilidad**: Capacidad para crecer sin limitaciones técnicas
- 📊 **Toma de decisiones**: Datos en tiempo real para decisiones informadas
- 💰 **Reducción de costos**: Menos tiempo administrativo, menos errores
- 🎯 **Mejora continua**: Métricas para identificar áreas de mejora

### 6.3 Para el Cliente Final

- ⏱️ **Tiempos de entrega mejorados**: Optimización de rutas
- 📱 **Mejor comunicación**: Notificaciones de estado
- ✅ **Mayor confiabilidad**: Menos errores en entregas
- 🔍 **Transparencia**: Seguimiento del pedido

---

## 7. Alcance del MVP

### 7.1 Funcionalidades Incluidas

#### ✅ Módulos Principales
- Sistema de autenticación y autorización
- Dashboard con métricas básicas
- CRUD completo de entidades principales
- Gestión de movimientos y estados
- Sistema de incidencias
- Reportes básicos

#### ✅ Características Técnicas
- Interfaz responsive (desktop y mobile)
- Diseño moderno con tema Cruz Verde
- Validaciones en tiempo real
- Notificaciones toast
- Exportación de datos

### 7.2 Funcionalidades Fuera del Alcance Inicial

#### 🔜 Fase 2 (Futuras Implementaciones)
- Notificaciones por email/SMS
- Integración con sistemas de farmacia
- App móvil nativa para motoristas
- Geolocalización en tiempo real
- Chat en vivo
- Sistema de calificaciones
- Análisis predictivo con IA

---

## 8. Cronograma y Fases

### Fase 1: MVP (Actual)
**Duración:** 6 semanas
- ✅ Diseño de arquitectura
- ✅ Implementación de UI/UX
- ✅ Modelo de datos
- 🔄 Backend y Server Actions (en desarrollo)
- 🔄 Testing (en desarrollo)

### Fase 2: Mejoras Post-MVP
**Duración:** 4 semanas
- Optimizaciones de rendimiento
- Funcionalidades adicionales
- Testing exhaustivo
- Deployment a producción

### Fase 3: Expansión
**Duración:** Continuo
- Nuevas características basadas en feedback
- Integraciones con otros sistemas
- Escalabilidad

---

## 9. Métricas de Éxito

### KPIs Principales

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Tiempo de gestión** | -60% vs Excel | Minutos por operación |
| **Entregas exitosas** | >95% | % de entregas sin incidencias |
| **Tiempo de respuesta** | <2s | Tiempo de carga promedio |
| **Adopción de usuarios** | 100% | Usuarios activos/total |
| **Satisfacción** | >4.5/5 | Encuesta a usuarios |

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[02-ARQUITECTURA.md](./02-ARQUITECTURA.md)** - Arquitectura del Sistema
