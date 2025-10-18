# 🔌 API y Endpoints

## 1. Arquitectura de API

LogiCo utiliza dos enfoques para las operaciones:

1. **Server Actions** - Mutaciones tipo-seguras (preferido)
2. **API Routes** - Endpoints REST tradicionales (cuando sea necesario)

### 1.1 Server Actions vs API Routes

| Aspecto | Server Actions | API Routes |
|---------|----------------|------------|
| **Tipo-seguridad** | ✅ End-to-end | ❌ Manual |
| **Validación** | ✅ Zod integrado | ⚠️ Manual |
| **Uso desde cliente** | ✅ Directo | ⚠️ fetch/axios |
| **Revalidación** | ✅ Automática | ❌ Manual |
| **Cuándo usar** | Mutaciones desde UI | APIs externas, webhooks |

---

## 2. Server Actions

### 2.1 Estructura Estándar

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { mySchema } from '@/shared/schemas/my-schema'

export async function myAction(data: unknown) {
  // 1. Autenticación
  const session = await auth.api.getSession({ 
    headers: await headers() 
  })
  
  if (!session) {
    return { success: false, error: 'No autorizado' }
  }
  
  // 2. Validación
  try {
    const validated = mySchema.parse(data)
  } catch (error) {
    return { success: false, error: 'Datos inválidos' }
  }
  
  // 3. Autorización (opcional)
  if (session.user.role !== 'admin') {
    return { success: false, error: 'Permiso denegado' }
  }
  
  // 4. Operación en BD
  try {
    const result = await prisma.myModel.create({
      data: validated
    })
    
    // 5. Revalidar cache
    revalidatePath('/my-path')
    
    // 6. Retornar resultado
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Error en la operación' }
  }
}
```

---

## 3. Catálogo de Server Actions

### 3.1 Farmacias

#### Obtener Farmacias
```typescript
// project/pharmacy/actions/get-pharmacies.ts
'use server'

export async function getPharmacies(filters?: {
  regionId?: string
  cityId?: string
  search?: string
}) {
  const where = {
    ...(filters?.regionId && { regionId: filters.regionId }),
    ...(filters?.cityId && { cityId: filters.cityId }),
    ...(filters?.search && {
      name: { contains: filters.search, mode: 'insensitive' }
    })
  }
  
  return await prisma.pharmacy.findMany({
    where,
    include: {
      city: { include: { region: true } }
    },
    orderBy: { name: 'asc' }
  })
}
```

#### Crear Farmacia
```typescript
// project/pharmacy/actions/create-pharmacy.ts
'use server'

import { pharmacySchema } from '@/shared/schemas/pharmacy'

export async function createPharmacy(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: 'No autorizado' }
  
  const validated = pharmacySchema.parse(data)
  
  const pharmacy = await prisma.pharmacy.create({
    data: validated,
    include: { city: true, region: true }
  })
  
  revalidatePath('/farmacias')
  return { success: true, pharmacy }
}
```

#### Actualizar Farmacia
```typescript
// project/pharmacy/actions/update-pharmacy.ts
'use server'

export async function updatePharmacy(id: string, data: unknown) {
  const validated = pharmacySchema.parse(data)
  
  const pharmacy = await prisma.pharmacy.update({
    where: { id },
    data: validated
  })
  
  revalidatePath('/farmacias')
  revalidatePath(`/farmacias/${id}`)
  return { success: true, pharmacy }
}
```

#### Eliminar Farmacia
```typescript
// project/pharmacy/actions/delete-pharmacy.ts
'use server'

export async function deletePharmacy(id: string) {
  await prisma.pharmacy.delete({ where: { id } })
  revalidatePath('/farmacias')
  return { success: true }
}
```

### 3.2 Motoristas

#### Crear Motorista
```typescript
// project/driver/actions/create-driver.ts
'use server'

import { driverSchema } from '@/shared/schemas/driver'

export async function createDriver(data: unknown) {
  const validated = driverSchema.parse(data)
  
  // Verificar que RUT no exista
  const existing = await prisma.driver.findUnique({
    where: { rut: validated.rut }
  })
  
  if (existing) {
    return { success: false, error: 'RUT ya existe' }
  }
  
  const driver = await prisma.driver.create({
    data: validated
  })
  
  revalidatePath('/motoristas')
  return { success: true, driver }
}
```

#### Activar/Desactivar Motorista
```typescript
// project/driver/actions/toggle-driver-status.ts
'use server'

export async function toggleDriverStatus(id: string) {
  const driver = await prisma.driver.findUnique({ where: { id } })
  
  if (!driver) {
    return { success: false, error: 'Motorista no encontrado' }
  }
  
  const updated = await prisma.driver.update({
    where: { id },
    data: { active: !driver.active }
  })
  
  revalidatePath('/motoristas')
  revalidatePath(`/motoristas/${id}`)
  return { success: true, driver: updated }
}
```

#### Asignar Moto a Motorista
```typescript
// project/driver/actions/assign-motorbike.ts
'use server'

export async function assignMotorbike(
  driverId: string,
  motorbikeId: string
) {
  // Verificar que moto no esté asignada
  const motorbike = await prisma.motorbike.findUnique({
    where: { id: motorbikeId }
  })
  
  if (motorbike?.driverId && motorbike.driverId !== driverId) {
    return { 
      success: false, 
      error: 'Moto ya asignada a otro motorista' 
    }
  }
  
  // Desasignar moto anterior del motorista
  await prisma.motorbike.updateMany({
    where: { driverId },
    data: { driverId: null }
  })
  
  // Asignar nueva moto
  const updated = await prisma.motorbike.update({
    where: { id: motorbikeId },
    data: { driverId }
  })
  
  revalidatePath('/motoristas')
  revalidatePath(`/motoristas/${driverId}`)
  revalidatePath('/motos')
  
  return { success: true, motorbike: updated }
}
```

### 3.3 Movimientos

#### Crear Movimiento
```typescript
// project/movement/actions/create-movement.ts
'use server'

import { movementSchema } from '@/shared/schemas/movement'

export async function createMovement(data: unknown) {
  const validated = movementSchema.parse(data)
  
  // Validar código único
  if (validated.number.length < 10) {
    return { 
      success: false, 
      error: 'Código debe tener mínimo 10 caracteres' 
    }
  }
  
  // Verificar que código no exista
  const existing = await prisma.movement.findUnique({
    where: { number: validated.number }
  })
  
  if (existing) {
    return { success: false, error: 'Código ya existe' }
  }
  
  const movement = await prisma.movement.create({
    data: {
      ...validated,
      status: 'PENDING'
    },
    include: {
      pharmacy: true,
      driver: { include: { motorbike: true } }
    }
  })
  
  revalidatePath('/movimientos')
  return { success: true, movement }
}
```

#### Cambiar Estado de Movimiento
```typescript
// project/movement/actions/update-movement-status.ts
'use server'

import { MovementStatus } from '@prisma/client'

export async function updateMovementStatus(
  id: string,
  status: MovementStatus
) {
  const movement = await prisma.movement.findUnique({ where: { id } })
  
  if (!movement) {
    return { success: false, error: 'Movimiento no encontrado' }
  }
  
  // No permitir cambiar movimientos entregados
  if (movement.status === 'DELIVERED') {
    return { 
      success: false, 
      error: 'No se puede modificar un movimiento entregado' 
    }
  }
  
  const updateData: any = { status }
  
  // Registrar fecha de salida
  if (status === 'IN_TRANSIT' && !movement.departureDate) {
    updateData.departureDate = new Date()
  }
  
  // Registrar fecha de entrega
  if (status === 'DELIVERED' && !movement.deliveryDate) {
    updateData.deliveryDate = new Date()
  }
  
  const updated = await prisma.movement.update({
    where: { id },
    data: updateData
  })
  
  revalidatePath('/movimientos')
  revalidatePath(`/movimientos/${id}`)
  return { success: true, movement: updated }
}
```

#### Agregar Incidencia
```typescript
// project/movement/actions/add-incident.ts
'use server'

import { incidentSchema } from '@/shared/schemas/incident'

export async function addIncident(movementId: string, data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { success: false, error: 'No autorizado' }
  
  const validated = incidentSchema.parse(data)
  
  const incident = await prisma.incident.create({
    data: {
      ...validated,
      movementId,
      createdByUserId: session.user.id,
      date: new Date()
    }
  })
  
  // Cambiar estado del movimiento a INCIDENT
  await prisma.movement.update({
    where: { id: movementId },
    data: { status: 'INCIDENT' }
  })
  
  revalidatePath('/movimientos')
  revalidatePath(`/movimientos/${movementId}`)
  return { success: true, incident }
}
```

### 3.4 Reportes

#### Reporte Diario
```typescript
// project/report/actions/get-daily-report.ts
'use server'

export async function getDailyReport(
  date: Date,
  pharmacyId?: string
) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  
  const where = {
    createdAt: {
      gte: startOfDay,
      lte: endOfDay
    },
    ...(pharmacyId && { pharmacyId })
  }
  
  const movements = await prisma.movement.findMany({
    where,
    include: {
      pharmacy: true,
      driver: true,
      incidents: true
    }
  })
  
  const stats = {
    total: movements.length,
    delivered: movements.filter(m => m.status === 'DELIVERED').length,
    inTransit: movements.filter(m => m.status === 'IN_TRANSIT').length,
    pending: movements.filter(m => m.status === 'PENDING').length,
    withIncidents: movements.filter(m => m.status === 'INCIDENT').length,
    averageDeliveryTime: calculateAverageTime(movements)
  }
  
  return { success: true, movements, stats }
}

function calculateAverageTime(movements: Movement[]) {
  const delivered = movements.filter(
    m => m.status === 'DELIVERED' && m.departureDate && m.deliveryDate
  )
  
  if (delivered.length === 0) return 0
  
  const totalMinutes = delivered.reduce((sum, m) => {
    const diff = m.deliveryDate!.getTime() - m.departureDate!.getTime()
    return sum + (diff / 1000 / 60) // convertir a minutos
  }, 0)
  
  return Math.round(totalMinutes / delivered.length)
}
```

#### Exportar Reporte a CSV
```typescript
// project/report/actions/export-report-csv.ts
'use server'

export async function exportReportToCSV(
  startDate: Date,
  endDate: Date,
  pharmacyId?: string
) {
  const movements = await prisma.movement.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      ...(pharmacyId && { pharmacyId })
    },
    include: {
      pharmacy: true,
      driver: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  // Generar CSV
  const headers = [
    'Código',
    'Farmacia',
    'Motorista',
    'Estado',
    'Dirección',
    'Fecha Salida',
    'Fecha Entrega',
    'Tiempo (min)'
  ]
  
  const rows = movements.map(m => [
    m.number,
    m.pharmacy.name,
    m.driver.name,
    m.status,
    m.address,
    m.departureDate?.toISOString() || '',
    m.deliveryDate?.toISOString() || '',
    calculateDeliveryTime(m)
  ])
  
  const csv = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')
  
  return { success: true, csv }
}
```

### 3.5 Dashboard

#### Estadísticas del Dashboard
```typescript
// project/home/actions/get-dashboard-stats.ts
'use server'

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [
    totalMovements,
    todayMovements,
    activeDrivers,
    pendingMovements,
    incidentsToday
  ] = await Promise.all([
    prisma.movement.count(),
    prisma.movement.count({
      where: { createdAt: { gte: today } }
    }),
    prisma.driver.count({
      where: { active: true }
    }),
    prisma.movement.count({
      where: { status: 'PENDING' }
    }),
    prisma.incident.count({
      where: { createdAt: { gte: today } }
    })
  ])
  
  // Movimientos por estado hoy
  const movementsByStatus = await prisma.movement.groupBy({
    by: ['status'],
    where: { createdAt: { gte: today } },
    _count: true
  })
  
  // Promedio de tiempo de entrega
  const deliveredToday = await prisma.movement.findMany({
    where: {
      createdAt: { gte: today },
      status: 'DELIVERED',
      departureDate: { not: null },
      deliveryDate: { not: null }
    },
    select: {
      departureDate: true,
      deliveryDate: true
    }
  })
  
  const avgDeliveryTime = deliveredToday.length > 0
    ? deliveredToday.reduce((sum, m) => {
        const diff = m.deliveryDate!.getTime() - m.departureDate!.getTime()
        return sum + (diff / 1000 / 60)
      }, 0) / deliveredToday.length
    : 0
  
  return {
    success: true,
    stats: {
      totalMovements,
      todayMovements,
      activeDrivers,
      pendingMovements,
      incidentsToday,
      movementsByStatus,
      avgDeliveryTime: Math.round(avgDeliveryTime)
    }
  }
}
```

---

## 4. API Routes (Better Auth)

### 4.1 Autenticación

Better Auth maneja automáticamente estos endpoints:

```
POST /api/auth/sign-in/email         - Login con email/password
POST /api/auth/sign-up/email         - Registro
POST /api/auth/sign-out              - Logout
POST /api/auth/forgot-password       - Solicitar reset
POST /api/auth/reset-password        - Resetear password
GET  /api/auth/session               - Obtener sesión actual
POST /api/auth/update-user           - Actualizar usuario
```

#### Uso desde Cliente

```typescript
import { authClient } from '@/lib/auth-client'

// Login
const result = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password123'
})

// Logout
await authClient.signOut()

// Obtener sesión
const session = await authClient.getSession()
```

---

## 5. Manejo de Errores

### 5.1 Errores en Server Actions

```typescript
export async function myAction(data: unknown) {
  try {
    // Intentar operación
    const result = await prisma.entity.create({ data })
    return { success: true, data: result }
  } catch (error) {
    // Logging (en producción usar servicio de logs)
    console.error('Error in myAction:', error)
    
    // Distinguir tipos de error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { 
          success: false, 
          error: 'Ya existe un registro con estos datos' 
        }
      }
    }
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Datos inválidos',
        details: error.flatten()
      }
    }
    
    // Error genérico
    return { 
      success: false, 
      error: 'Error en la operación' 
    }
  }
}
```

### 5.2 Códigos de Error Prisma

| Código | Significado |
|--------|-------------|
| P2002 | Violación de constraint único |
| P2003 | Violación de foreign key |
| P2025 | Registro no encontrado |
| P2014 | Relación requerida no encontrada |

---

## 6. Validación y Sanitización

### 6.1 Validación en Entrada

```typescript
'use server'

import { z } from 'zod'

const inputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(100),
  age: z.number().int().positive().max(150)
})

export async function processUser(data: unknown) {
  // Validar estructura
  const validated = inputSchema.parse(data)
  
  // Sanitizar (opcional)
  const sanitized = {
    ...validated,
    name: validated.name.trim(),
    email: validated.email.toLowerCase()
  }
  
  return await prisma.user.create({ data: sanitized })
}
```

### 6.2 Prevención de SQL Injection

Prisma previene automáticamente SQL injection usando prepared statements:

```typescript
// ✅ Seguro - Prisma sanitiza automáticamente
const users = await prisma.user.findMany({
  where: {
    email: userInput  // Prisma lo sanitiza
  }
})

// ❌ Nunca hacer raw queries con input del usuario
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}  // PELIGROSO
`
```

---

## 7. Rate Limiting (Futuro)

Para implementar rate limiting:

```typescript
// middleware.ts
import { ratelimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  return NextResponse.next()
}
```

---

## 8. Testing de Server Actions

```typescript
// __tests__/actions/create-pharmacy.test.ts
import { createPharmacy } from '@/project/pharmacy/actions/create-pharmacy'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

describe('createPharmacy', () => {
  it('should create pharmacy with valid data', async () => {
    const mockPharmacy = {
      id: '123',
      name: 'Test Pharmacy',
      // ...
    }
    
    ;(prisma.pharmacy.create as jest.Mock).mockResolvedValue(mockPharmacy)
    
    const result = await createPharmacy({
      name: 'Test Pharmacy',
      address: 'Test Address',
      // ...
    })
    
    expect(result.success).toBe(true)
    expect(result.pharmacy).toEqual(mockPharmacy)
  })
  
  it('should fail with invalid data', async () => {
    const result = await createPharmacy({
      name: 'A',  // Too short
    })
    
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
```

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[10-TESTING-Y-DEPLOYMENT.md](./10-TESTING-Y-DEPLOYMENT.md)** - Testing y Deployment
