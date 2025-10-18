# 🗄️ Modelo de Datos

## 1. Diagrama de Relaciones

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Region    │       │    City     │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │◄──────│ id (PK)     │
│ name        │       │ name        │ 1   N │ name        │
│ email       │       │ createdAt   │       │ regionId FK │
│ role        │       │ updatedAt   │       │ createdAt   │
│ ...         │       └─────┬───────┘       └──────┬──────┘
└──────┬──────┘             │ 1                    │ 1
       │ 1                  │                      │
       │                    │ N                    │ N
       │ N          ┌───────┴──────────────────────┴───────┐
┌──────▼──────┐    │                                       │
│  Session    │    │     ┌─────────────┐     ┌────────────┴──┐
│─────────────│    │     │  Pharmacy   │     │    Driver     │
│ id (PK)     │    │     │─────────────│     │───────────────│
│ userId (FK) │    │     │ id (PK)     │     │ id (PK)       │
│ token       │    │     │ name        │     │ name          │
│ expiresAt   │    │     │ address     │     │ rut (unique)  │
│ ...         │    │     │ regionId FK │─────┤ email         │
└─────────────┘    │     │ cityId FK   │     │ regionId FK   │
                   │     └──────┬──────┘     │ cityId FK     │
┌─────────────┐    │            │ 1          └───────┬───────┘
│  Account    │    │            │                    │ 1
│─────────────│    │            │                    │
│ id (PK)     │    │            │                    │ 1
│ userId (FK) │    │            │ N          ┌───────▼───────┐
│ password    │    │            │            │  Motorbike    │
│ ...         │    │            │            │───────────────│
└─────────────┘    │            │            │ id (PK)       │
                   │            │            │ plate (unique)│
┌─────────────┐    │            │            │ brand         │
│ Incident    │    │            │            │ model         │
│─────────────│    │            │            │ driverId FK   │
│ id (PK)     │    │            │            └───────┬───────┘
│ type        │    │            │                    │
│ description │    │            │                    │
│ movementId  │◄───┼────────┐   │                    │
│ createdBy   │    │        │   │                    │
└─────────────┘    │        │   │                    │
                   │        │   │                    │
                   │   ┌────┴───▼────┐               │
                   │   │  Movement   │               │
                   │   │─────────────│               │
                   └───┤ id (PK)     │───────────────┘
                       │ number      │    N
                       │ pharmacyId  │
                       │ driverId FK │
                       │ status      │
                       │ address     │
                       │ ...         │
                       └─────────────┘
```

---

## 2. Descripción Detallada de Entidades

### 2.1 User (Usuario)

Usuarios del sistema con autenticación y autorización.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `name` | String | ✅ | Nombre completo del usuario |
| `email` | String | ✅ | Email único para login |
| `emailVerified` | Boolean | ✅ | Si el email ha sido verificado (default: false) |
| `image` | String? | ❌ | URL de imagen de perfil |
| `role` | String? | ❌ | Rol: 'admin', 'operadora', 'gerente', 'supervisor' |
| `banned` | Boolean | ✅ | Usuario bloqueado (default: false) |
| `banReason` | String? | ❌ | Razón del bloqueo |
| `banExpires` | DateTime? | ❌ | Fecha de expiración del bloqueo |
| `twoFactorEnabled` | Boolean | ✅ | 2FA habilitado (default: false) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de última actualización |

**Índices:**
- Único en `email`

**Relaciones:**
- `sessions`: Session[] (1:N) - Sesiones activas
- `accounts`: Account[] (1:N) - Cuentas de autenticación
- `twofactors`: TwoFactor[] (1:N) - Configuración 2FA
- `incidents`: Incident[] (1:N) - Incidencias creadas por el usuario

**Roles Disponibles:**

| Rol | Permisos |
|-----|----------|
| `admin` | Acceso total al sistema |
| `operadora` | Crear/editar movimientos e incidencias |
| `gerente` | Ver dashboard y reportes |
| `supervisor` | Aprobar operaciones críticas |

---

### 2.2 Session

Sesiones activas de usuarios autenticados.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `userId` | String (UUID) | ✅ | ID del usuario (FK) |
| `token` | String | ✅ | Token único de sesión |
| `expiresAt` | DateTime | ✅ | Fecha de expiración |
| `ipAddress` | String? | ❌ | IP del cliente |
| `userAgent` | String? | ❌ | User agent del navegador |
| `impersonatedBy` | String? | ❌ | ID de usuario que suplanta (admin) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Índices:**
- Único en `token`

**Relaciones:**
- `user`: User (N:1)

---

### 2.3 Account

Cuentas de autenticación (email/password).

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `userId` | String (UUID) | ✅ | ID del usuario (FK) |
| `accountId` | String | ✅ | ID de cuenta externa |
| `providerId` | String | ✅ | Proveedor (email-password) |
| `password` | String? | ❌ | Hash de contraseña (bcrypt) |
| `accessToken` | String? | ❌ | Token de acceso |
| `refreshToken` | String? | ❌ | Token de refresco |
| `idToken` | String? | ❌ | ID token |
| `accessTokenExpiresAt` | DateTime? | ❌ | Expiración access token |
| `refreshTokenExpiresAt` | DateTime? | ❌ | Expiración refresh token |
| `scope` | String? | ❌ | Scope de permisos |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Relaciones:**
- `user`: User (N:1)

---

### 2.4 Verification

Tokens de verificación (email, reset password).

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `identifier` | String | ✅ | Email o identificador |
| `value` | String | ✅ | Token de verificación |
| `expiresAt` | DateTime | ✅ | Fecha de expiración |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

---

### 2.5 TwoFactor

Configuración de autenticación de dos factores.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `userId` | String (UUID) | ✅ | ID del usuario (FK) |
| `secret` | String | ✅ | Secret TOTP |
| `backupCodes` | String | ✅ | Códigos de respaldo |

**Relaciones:**
- `user`: User (N:1)

---

### 2.6 Region (Región)

Regiones administrativas de Chile.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `name` | String | ✅ | Nombre de la región |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Relaciones:**
- `cities`: City[] (1:N) - Ciudades de la región
- `pharmacies`: Pharmacy[] (1:N) - Farmacias de la región
- `drivers`: Driver[] (1:N) - Motoristas de la región

**Ejemplos:**
- Región Metropolitana
- Región de Valparaíso
- Región del Biobío

---

### 2.7 City (Ciudad/Comuna)

Ciudades o comunas dentro de una región.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `name` | String | ✅ | Nombre de la ciudad/comuna |
| `regionId` | String (UUID) | ✅ | ID de la región (FK) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Relaciones:**
- `region`: Region (N:1) - Región a la que pertenece
- `pharmacies`: Pharmacy[] (1:N) - Farmacias de la ciudad
- `drivers`: Driver[] (1:N) - Motoristas de la ciudad

**Ejemplos:**
- Santiago
- Providencia
- Las Condes
- Valparaíso
- Concepción

---

### 2.8 Pharmacy (Farmacia)

Locales de farmacia Cruz Verde.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `name` | String | ✅ | Nombre de la farmacia |
| `address` | String | ✅ | Dirección completa |
| `contactPhone` | String | ✅ | Teléfono de contacto |
| `contactEmail` | String | ✅ | Email de contacto |
| `contactName` | String | ✅ | Nombre del encargado |
| `regionId` | String (UUID) | ✅ | ID de la región (FK) |
| `cityId` | String (UUID) | ✅ | ID de la ciudad (FK) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Relaciones:**
- `region`: Region (N:1)
- `city`: City (N:1)
- `movements`: Movement[] (1:N) - Movimientos originados
- `auditLogs`: AuditLog[] (1:N) - Logs de auditoría

**Ejemplo:**
```json
{
  "name": "Farmacia Cruz Verde - Providencia Centro",
  "address": "Av. Providencia 1234, Providencia",
  "contactPhone": "+56912345678",
  "contactEmail": "providencia@cruzverde.cl",
  "contactName": "Juan Pérez"
}
```

---

### 2.9 Driver (Motorista)

Conductores que realizan los despachos.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `name` | String | ✅ | Nombre completo |
| `rut` | String | ✅ | RUT único (identificador chileno) |
| `email` | String | ✅ | Email de contacto |
| `phone` | String | ✅ | Teléfono móvil |
| `licenseUrl` | String? | ❌ | URL de imagen de licencia de conducir |
| `active` | Boolean | ✅ | Motorista activo (default: true) |
| `address` | String? | ❌ | Dirección del motorista |
| `regionId` | String (UUID)? | ❌ | ID de la región (FK) |
| `cityId` | String (UUID)? | ❌ | ID de la ciudad (FK) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Índices:**
- Único en `rut`

**Relaciones:**
- `region`: Region? (N:1)
- `city`: City? (N:1)
- `motorbike`: Motorbike? (1:1) - Moto asignada
- `movements`: Movement[] (1:N) - Movimientos asignados
- `auditLogs`: AuditLog[] (1:N) - Logs de auditoría

**Formato RUT:**
- Formato: 12.345.678-9
- Validación con dígito verificador

---

### 2.10 Motorbike (Motocicleta)

Motocicletas utilizadas para entregas.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `brand` | String | ✅ | Marca (Yamaha, Honda, Suzuki, etc.) |
| `class` | String | ✅ | Clase de vehículo |
| `model` | String | ✅ | Modelo específico |
| `plate` | String | ✅ | Patente única (formato chileno) |
| `color` | String | ✅ | Color de la moto |
| `cylinders` | Int | ✅ | Cilindrada (125, 150, 200, etc.) |
| `year` | Int | ✅ | Año de fabricación |
| `mileage` | Int | ✅ | Kilometraje actual |
| `image` | String? | ❌ | URL de imagen de la moto |
| `driverId` | String (UUID)? | ❌ | ID del conductor asignado (FK) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Índices:**
- Único en `plate`
- Único en `driverId` (relación 1:1)

**Relaciones:**
- `driver`: Driver? (1:1) - Conductor asignado
- `auditLogs`: AuditLog[] (1:N) - Logs de auditoría

**Formato Patente:**
- Formato antiguo: AB-1234
- Formato nuevo: ABCD-12

---

### 2.11 Movement (Movimiento/Despacho)

Pedidos y despachos a domicilio.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `number` | String | ✅ | Código único del pedido (≥10 chars) |
| `pharmacyId` | String (UUID) | ✅ | ID de farmacia origen (FK) |
| `driverId` | String (UUID) | ✅ | ID del motorista (FK) |
| `address` | String | ✅ | Dirección de entrega |
| `departureDate` | DateTime? | ❌ | Fecha/hora de salida |
| `deliveryDate` | DateTime? | ❌ | Fecha/hora de entrega |
| `status` | MovementStatus | ✅ | Estado del movimiento |
| `segments` | Int? | ❌ | Número de paradas/segmentos |
| `segmentCost` | Decimal? | ❌ | Costo por segmento |
| `segmentsAddress` | String[] | ✅ | Direcciones de segmentos múltiples |
| `hasRecipe` | Boolean | ✅ | Tiene receta médica (default: false) |
| `createdAt` | DateTime | ✅ | Fecha de creación |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Índices:**
- Único en `number`

**Estados (MovementStatus):**

| Estado | Descripción | Siguiente Estado |
|--------|-------------|------------------|
| `PENDING` | Pendiente de asignación/salida | IN_TRANSIT |
| `IN_TRANSIT` | En camino hacia el cliente | DELIVERED, INCIDENT |
| `DELIVERED` | Entregado exitosamente | - |
| `INCIDENT` | Con incidencia registrada | - |

**Relaciones:**
- `pharmacy`: Pharmacy (N:1)
- `driver`: Driver (N:1)
- `incidents`: Incident[] (1:N) - Incidencias asociadas
- `auditLogs`: AuditLog[] (1:N) - Logs de auditoría

**Reglas de Negocio:**
- ⚠️ `number` debe tener mínimo 10 caracteres
- ⚠️ `departureDate` debe registrarse al salir
- ⚠️ `deliveryDate` debe registrarse al entregar
- ⚠️ Los traspasos y reenvíos NO tienen código propio

**Ejemplo de Segmentos Múltiples:**
```json
{
  "segments": 3,
  "segmentsAddress": [
    "Farmacia Local 1 - Recoger medicamento",
    "Av. Principal 123 - Entregar pedido",
    "Calle Secundaria 456 - Recoger receta"
  ]
}
```

---

### 2.12 Incident (Incidencia)

Problemas o excepciones durante el despacho.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `movementId` | String (UUID) | ✅ | ID del movimiento (FK) |
| `type` | IncidentType | ✅ | Tipo de incidencia |
| `description` | Text | ✅ | Descripción detallada |
| `date` | DateTime | ✅ | Fecha/hora de la incidencia |
| `createdByUserId` | String (UUID) | ✅ | ID del usuario que registró (FK) |
| `createdAt` | DateTime | ✅ | Fecha de creación del registro |
| `updatedAt` | DateTime | ✅ | Fecha de actualización |

**Tipos de Incidencia (IncidentType):**

| Tipo | Descripción | Acción Recomendada |
|------|-------------|-------------------|
| `direccion_erronea` | Dirección incorrecta o inexistente | Contactar cliente, reenviar |
| `cliente_no_encontrado` | Cliente no está en ubicación | Reagendar o anular |
| `reintento` | Requiere segundo intento de entrega | Programar nueva visita |
| `cobro_rechazado` | Cliente rechaza pago o no tiene dinero | Anular o cambiar método de pago |
| `otro` | Otra incidencia no categorizada | Revisar caso por caso |

**Relaciones:**
- `movement`: Movement (N:1)
- `createdBy`: User (N:1) - Usuario que registró
- `auditLogs`: AuditLog[] (1:N)

**Ejemplo:**
```json
{
  "type": "cliente_no_encontrado",
  "description": "Cliente no responde llamadas ni abre puerta. Vecino indica que no está en casa.",
  "date": "2025-10-18T14:30:00Z"
}
```

---

### 2.13 AuditLog (Log de Auditoría)

Registro de todas las operaciones críticas del sistema.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | String (UUID) | ✅ | Identificador único (PK) |
| `entity` | String | ✅ | Tipo de entidad (Pharmacy, Driver, etc.) |
| `entityId` | String (UUID) | ✅ | ID de la entidad afectada |
| `action` | String | ✅ | Acción realizada (create, update, delete) |
| `userId` | String (UUID) | ✅ | ID del usuario que realizó la acción |
| `timestamp` | DateTime | ✅ | Fecha/hora de la acción |
| `previousData` | JSON? | ❌ | Datos anteriores (en updates) |
| `newData` | JSON? | ❌ | Datos nuevos |
| `pharmacyId` | String (UUID)? | ❌ | Referencia a farmacia (FK) |
| `driverId` | String (UUID)? | ❌ | Referencia a motorista (FK) |
| `motorbikeId` | String (UUID)? | ❌ | Referencia a moto (FK) |
| `movementId` | String (UUID)? | ❌ | Referencia a movimiento (FK) |
| `incidentId` | String (UUID)? | ❌ | Referencia a incidencia (FK) |

**Índices:**
- Compuesto en `(entity, entityId)`

**Acciones Auditadas:**
- `CREATE` - Creación de entidad
- `UPDATE` - Actualización de entidad
- `DELETE` - Eliminación de entidad
- `STATUS_CHANGE` - Cambio de estado
- `ASSIGN` - Asignación (motorista a moto, etc.)

**Ejemplo:**
```json
{
  "entity": "Movement",
  "entityId": "abc123...",
  "action": "STATUS_CHANGE",
  "userId": "user456...",
  "previousData": { "status": "PENDING" },
  "newData": { "status": "IN_TRANSIT", "departureDate": "2025-10-18T10:00:00Z" }
}
```

---

## 3. Relaciones Importantes

### 3.1 Región → Ciudad → Farmacia/Motorista

Una región contiene múltiples ciudades, y tanto farmacias como motoristas pertenecen a una ciudad específica.

```sql
SELECT 
  r.name as region_name,
  c.name as city_name,
  p.name as pharmacy_name
FROM pharmacy p
JOIN city c ON p.cityId = c.id
JOIN region r ON c.regionId = r.id;
```

### 3.2 Motorista ↔ Moto (1:1)

Un motorista puede tener asignada una moto, y una moto solo puede estar asignada a un motorista.

```sql
SELECT 
  d.name as driver_name,
  m.plate,
  m.brand,
  m.model
FROM driver d
LEFT JOIN motorbike m ON d.id = m.driverId;
```

### 3.3 Movimiento → Incidencias (1:N)

Un movimiento puede tener múltiples incidencias registradas.

```sql
SELECT 
  mov.number,
  mov.status,
  i.type,
  i.description
FROM movement mov
LEFT JOIN incident i ON mov.id = i.movementId
WHERE mov.status = 'INCIDENT';
```

### 3.4 Usuario → Incidencias Creadas

Un usuario puede crear múltiples incidencias.

```sql
SELECT 
  u.name as user_name,
  COUNT(i.id) as incidents_created
FROM user u
LEFT JOIN incident i ON u.id = i.createdByUserId
GROUP BY u.id;
```

---

## 4. Queries Comunes

### 4.1 Movimientos con Detalles Completos

```sql
SELECT 
  m.number,
  m.status,
  m.address,
  p.name as pharmacy_name,
  d.name as driver_name,
  mb.plate as motorbike_plate,
  COUNT(i.id) as incident_count
FROM movement m
JOIN pharmacy p ON m.pharmacyId = p.id
JOIN driver d ON m.driverId = d.id
LEFT JOIN motorbike mb ON d.id = mb.driverId
LEFT JOIN incident i ON m.id = i.movementId
GROUP BY m.id;
```

### 4.2 Reportes Diarios por Farmacia

```sql
SELECT 
  p.name as pharmacy_name,
  COUNT(m.id) as total_movements,
  COUNT(CASE WHEN m.status = 'DELIVERED' THEN 1 END) as delivered,
  COUNT(CASE WHEN m.status = 'INCIDENT' THEN 1 END) as with_incidents,
  AVG(EXTRACT(EPOCH FROM (m.deliveryDate - m.departureDate))/3600) as avg_hours
FROM pharmacy p
LEFT JOIN movement m ON p.id = m.pharmacyId
WHERE DATE(m.createdAt) = CURRENT_DATE
GROUP BY p.id;
```

### 4.3 Motoristas Activos con Moto Asignada

```sql
SELECT 
  d.name,
  d.phone,
  d.email,
  m.plate,
  m.brand || ' ' || m.model as motorbike,
  COUNT(mov.id) as active_movements
FROM driver d
JOIN motorbike m ON d.id = m.driverId
LEFT JOIN movement mov ON d.id = mov.driverId AND mov.status IN ('PENDING', 'IN_TRANSIT')
WHERE d.active = true
GROUP BY d.id, m.id;
```

---

## 5. Consideraciones de Performance

### 5.1 Índices Recomendados

```sql
-- Índices en FKs para joins rápidos
CREATE INDEX idx_movement_pharmacy ON movement(pharmacyId);
CREATE INDEX idx_movement_driver ON movement(driverId);
CREATE INDEX idx_incident_movement ON incident(movementId);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_movement_status ON movement(status);
CREATE INDEX idx_movement_created ON movement(createdAt);
CREATE INDEX idx_driver_active ON driver(active);

-- Índices compuestos para queries complejas
CREATE INDEX idx_movement_date_status ON movement(createdAt, status);
CREATE INDEX idx_auditlog_entity ON audit_log(entity, entityId);
```

### 5.2 Particionamiento (Futuro)

Para escalar, considerar particionar la tabla `movement` por fecha:

```sql
-- Ejemplo de particionamiento por mes (PostgreSQL 10+)
CREATE TABLE movement (
  ...
) PARTITION BY RANGE (createdAt);

CREATE TABLE movement_2025_10 PARTITION OF movement
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[05-FUNCIONALIDADES.md](./05-FUNCIONALIDADES.md)** - Módulos y Funcionalidades
