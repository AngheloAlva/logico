# 💻 Guía de Desarrollo

## 1. Scripts Disponibles

### 1.1 Desarrollo

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo con Turbopack |
| `pnpm build` | Construye la aplicación para producción |
| `pnpm start` | Inicia servidor de producción |
| `pnpm lint` | Ejecuta ESLint en el código |

### 1.2 Base de Datos

| Comando | Descripción |
|---------|-------------|
| `pnpm migrate:dev` | Aplica migraciones en desarrollo |
| `pnpm prisma:reset` | Resetea BD y aplica migraciones |
| `pnpm db:push` | Sincroniza schema sin crear migración |
| `pnpm prisma:generate` | Genera cliente Prisma |
| `pnpm prisma:studio` | Abre Prisma Studio (GUI para BD) |

### 1.3 Datos y Seeds

| Comando | Descripción |
|---------|-------------|
| `pnpm create:users` | Crea usuarios de prueba |
| `pnpm import:pharmacies` | Importa farmacias desde Excel |
| `pnpm import:motorcycles` | Importa motos desde Excel |

### 1.4 Producción

| Comando | Descripción |
|---------|-------------|
| `pnpm production:build` | Build completo para producción |

---

## 2. Flujo de Trabajo de Desarrollo

### 2.1 Iniciar Desarrollo Diario

```bash
# 1. Actualizar código
git pull origin main

# 2. Instalar dependencias nuevas (si las hay)
pnpm install

# 3. Aplicar migraciones nuevas
pnpm migrate:dev

# 4. Iniciar servidor
pnpm dev
```

### 2.2 Crear Nueva Funcionalidad

#### Paso 1: Crear Branch

```bash
# Convención: feature/nombre-descriptivo
git checkout -b feature/add-driver-statistics

# O para bugs: fix/descripcion-del-bug
git checkout -b fix/driver-form-validation
```

#### Paso 2: Modificar Schema (si es necesario)

```prisma
// prisma/schema.prisma
model Driver {
  id        String   @id @default(uuid())
  // ... campos existentes
  totalDeliveries Int @default(0)  // Nuevo campo
}
```

```bash
# Crear migración
pnpm migrate:dev --name add_total_deliveries_to_driver
```

#### Paso 3: Implementar Lógica

Crear archivos necesarios siguiendo la estructura del proyecto:

```
project/driver/
├── actions/
│   └── get-driver-statistics.ts    # Nueva action
└── components/
    └── driver-statistics-card.tsx  # Nuevo componente
```

#### Paso 4: Commit y Push

```bash
# Añadir cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: add driver statistics feature

- Add totalDeliveries field to Driver model
- Create get-driver-statistics server action
- Add driver statistics card component
- Update driver detail page to show statistics"

# Push a repositorio
git push origin feature/add-driver-statistics
```

### 2.3 Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat: add export to Excel` |
| `fix` | Corrección de bug | `fix: repair form validation` |
| `docs` | Cambios en documentación | `docs: update API documentation` |
| `style` | Formato de código | `style: format with prettier` |
| `refactor` | Refactorización | `refactor: extract common logic` |
| `test` | Añadir o modificar tests | `test: add unit tests for utils` |
| `chore` | Tareas de mantenimiento | `chore: update dependencies` |

---

## 3. Crear un Nuevo Módulo

### 3.1 Ejemplo: Módulo de Clientes

#### Paso 1: Actualizar Schema de Prisma

```prisma
// prisma/schema.prisma
model Customer {
  id        String   @id @default(uuid())
  name      String
  phone     String
  email     String?
  address   String
  cityId    String
  city      City     @relation(fields: [cityId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("customer")
}
```

```bash
pnpm migrate:dev --name add_customer_model
```

#### Paso 2: Crear Estructura de Carpetas

```bash
mkdir -p src/project/customer/actions
mkdir -p src/project/customer/components
```

#### Paso 3: Crear Schema de Validación

```typescript
// src/shared/schemas/customer.ts
import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  phone: z.string().regex(/^\+?[0-9]{9,}$/, 'Teléfono inválido'),
  email: z.string().email('Email inválido').optional(),
  address: z.string().min(10, 'Dirección muy corta'),
  cityId: z.string().uuid('Ciudad inválida')
})

export type CustomerSchema = z.infer<typeof customerSchema>
```

#### Paso 4: Crear Server Actions

**Crear Cliente:**
```typescript
// src/project/customer/actions/create-customer.ts
'use server'

import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/shared/schemas/customer'
import { revalidatePath } from 'next/cache'

export async function createCustomer(data: unknown) {
  try {
    const validated = customerSchema.parse(data)
    
    const customer = await prisma.customer.create({
      data: validated,
      include: { city: true }
    })
    
    revalidatePath('/clientes')
    
    return { success: true, customer }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }
  }
}
```

**Obtener Clientes:**
```typescript
// src/project/customer/actions/get-customers.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getCustomers() {
  return await prisma.customer.findMany({
    include: {
      city: {
        include: { region: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}
```

**Obtener Cliente:**
```typescript
// src/project/customer/actions/get-customer.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getCustomer(id: string) {
  return await prisma.customer.findUnique({
    where: { id },
    include: {
      city: {
        include: { region: true }
      }
    }
  })
}
```

**Actualizar Cliente:**
```typescript
// src/project/customer/actions/update-customer.ts
'use server'

import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/shared/schemas/customer'
import { revalidatePath } from 'next/cache'

export async function updateCustomer(id: string, data: unknown) {
  try {
    const validated = customerSchema.parse(data)
    
    const customer = await prisma.customer.update({
      where: { id },
      data: validated
    })
    
    revalidatePath('/clientes')
    revalidatePath(`/clientes/${id}`)
    
    return { success: true, customer }
  } catch (error) {
    return { success: false, error: 'Error al actualizar cliente' }
  }
}
```

**Eliminar Cliente:**
```typescript
// src/project/customer/actions/delete-customer.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id } })
    
    revalidatePath('/clientes')
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar cliente' }
  }
}
```

#### Paso 5: Crear Componente de Formulario

```typescript
// src/project/customer/components/customer-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, type CustomerSchema } from '@/shared/schemas/customer'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'

interface CustomerFormProps {
  onSubmit: (data: CustomerSchema) => Promise<void>
  initialData?: CustomerSchema
  cities: Array<{ id: string; name: string }>
}

export function CustomerForm({ onSubmit, initialData, cities }: CustomerFormProps) {
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          {...form.register('phone')}
          error={form.formState.errors.phone?.message}
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email (opcional)</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
      </div>
      
      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          {...form.register('address')}
          error={form.formState.errors.address?.message}
        />
      </div>
      
      <div>
        <Label htmlFor="cityId">Ciudad</Label>
        <Select {...form.register('cityId')}>
          <option value="">Seleccionar ciudad</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
        {form.formState.errors.cityId && (
          <p className="text-red-500 text-sm">{form.formState.errors.cityId.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  )
}
```

#### Paso 6: Crear Rutas de Next.js

**Lista de Clientes:**
```typescript
// src/app/(dashboard)/clientes/page.tsx
import { getCustomers } from '@/project/customer/actions/get-customers'
import { CustomerTable } from '@/project/customer/components/customer-table'

export default async function CustomersPage() {
  const customers = await getCustomers()
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>
      <CustomerTable data={customers} />
    </div>
  )
}
```

**Crear Cliente:**
```typescript
// src/app/(dashboard)/clientes/nuevo/page.tsx
import { getCities } from '@/project/region/actions/get-cities'
import { CustomerForm } from '@/project/customer/components/customer-form'
import { createCustomer } from '@/project/customer/actions/create-customer'
import { redirect } from 'next/navigation'

export default async function NewCustomerPage() {
  const cities = await getCities()
  
  async function handleSubmit(data: unknown) {
    'use server'
    const result = await createCustomer(data)
    if (result.success) {
      redirect('/clientes')
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nuevo Cliente</h1>
      <CustomerForm onSubmit={handleSubmit} cities={cities} />
    </div>
  )
}
```

---

## 4. Mejores Prácticas

### 4.1 TypeScript

#### ✅ Hacer

```typescript
// Tipos explícitos en funciones públicas
export async function getCustomer(id: string): Promise<Customer | null> {
  return await prisma.customer.findUnique({ where: { id } })
}

// Interfaces para props
interface CustomerCardProps {
  customer: Customer
  onClick?: () => void
}

// Usar type guards
function isCustomer(data: unknown): data is Customer {
  return typeof data === 'object' && data !== null && 'id' in data
}
```

#### ❌ Evitar

```typescript
// any type
function process(data: any) { }

// Tipos implícitos en APIs públicas
export async function getCustomer(id) { }

// Aserciones innecesarias
const customer = data as Customer  // Usar validación en su lugar
```

### 4.2 Server Actions

#### ✅ Hacer

```typescript
'use server'

export async function updateCustomer(id: string, data: unknown) {
  try {
    // 1. Validar input
    const validated = customerSchema.parse(data)
    
    // 2. Verificar autorización
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error('No autorizado')
    
    // 3. Ejecutar operación
    const customer = await prisma.customer.update({
      where: { id },
      data: validated
    })
    
    // 4. Revalidar cache
    revalidatePath('/clientes')
    
    // 5. Retornar resultado consistente
    return { success: true, customer }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }
  }
}
```

#### ❌ Evitar

```typescript
// Sin validación
export async function updateCustomer(id, data) {
  return await prisma.customer.update({ where: { id }, data })
}

// Sin manejo de errores
export async function updateCustomer(id: string, data: unknown) {
  const customer = await prisma.customer.update(...)  // Puede fallar
  return customer  // No hay try/catch
}

// Sin revalidación de cache
export async function updateCustomer(id: string, data: unknown) {
  const customer = await prisma.customer.update(...)
  return { success: true, customer }
  // Falta: revalidatePath()
}
```

### 4.3 Componentes React

#### ✅ Hacer

```typescript
// Componente simple y enfocado
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}

// Composición sobre props
function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardHeader>
        <CustomerAvatar customer={customer} />
        <CustomerName customer={customer} />
      </CardHeader>
      <CardBody>
        <CustomerDetails customer={customer} />
      </CardBody>
    </Card>
  )
}
```

#### ❌ Evitar

```typescript
// Componente demasiado grande
function CustomerPage() {
  // 300 líneas de código
  // Mezclando lógica, UI, y datos
}

// Props ambiguas
function Button({ data }: { data: any }) { }

// Lógica de negocio en componentes
function CustomerCard({ customer }: { customer: Customer }) {
  // ❌ No hacer queries directas aquí
  const orders = await prisma.order.findMany(...)
}
```

### 4.4 Validación con Zod

#### ✅ Hacer

```typescript
// Esquemas reutilizables
export const emailSchema = z.string().email()
export const phoneSchema = z.string().regex(/^\+?[0-9]{9,}$/)

// Composición de esquemas
export const customerSchema = z.object({
  name: z.string().min(3),
  email: emailSchema.optional(),
  phone: phoneSchema
})

// Refinamientos personalizados
export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(data => data.endDate >= data.startDate, {
  message: 'Fecha final debe ser posterior a fecha inicial'
})
```

### 4.5 Consultas Prisma

#### ✅ Hacer

```typescript
// Include solo lo necesario
const customers = await prisma.customer.findMany({
  include: {
    city: true  // Solo ciudad
  }
})

// Select específico para performance
const customers = await prisma.customer.findMany({
  select: {
    id: true,
    name: true,
    email: true
    // Solo campos necesarios
  }
})

// Paginación
const customers = await prisma.customer.findMany({
  take: 10,
  skip: (page - 1) * 10,
  orderBy: { createdAt: 'desc' }
})
```

#### ❌ Evitar

```typescript
// Include en cadena (N+1 problem)
const customers = await prisma.customer.findMany({
  include: {
    city: {
      include: {
        region: {
          include: {
            country: true  // Demasiados niveles
          }
        }
      }
    }
  }
})

// Sin paginación en listas grandes
const allCustomers = await prisma.customer.findMany()  // Puede ser miles
```

---

## 5. Reglas de Negocio Implementadas

### 5.1 Movimientos

```typescript
// Validar código de movimiento (mínimo 10 caracteres)
export const movementSchema = z.object({
  number: z.string().min(10, 'Código debe tener mínimo 10 caracteres'),
  // ...
})

// Registrar hora de salida obligatoria
export async function startMovement(id: string) {
  return await prisma.movement.update({
    where: { id },
    data: {
      status: 'IN_TRANSIT',
      departureDate: new Date()  // Registrar hora actual
    }
  })
}

// No permitir modificar movimientos entregados
export async function updateMovement(id: string, data: unknown) {
  const movement = await prisma.movement.findUnique({ where: { id } })
  
  if (movement?.status === 'DELIVERED') {
    throw new Error('No se puede modificar un movimiento entregado')
  }
  
  // Continuar con actualización...
}
```

### 5.2 Incidencias

```typescript
// Solo usuarios autenticados pueden crear incidencias
export async function createIncident(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session) {
    throw new Error('Debe estar autenticado')
  }
  
  const validated = incidentSchema.parse(data)
  
  return await prisma.incident.create({
    data: {
      ...validated,
      createdByUserId: session.user.id,  // Registrar quién creó
      date: new Date()
    }
  })
}
```

### 5.3 Motoristas y Motos

```typescript
// Un motorista solo puede tener una moto asignada
export async function assignMotorbike(driverId: string, motorbikeId: string) {
  // Verificar que moto no esté asignada
  const motorbike = await prisma.motorbike.findUnique({
    where: { id: motorbikeId }
  })
  
  if (motorbike?.driverId && motorbike.driverId !== driverId) {
    throw new Error('Moto ya está asignada a otro motorista')
  }
  
  // Desasignar moto anterior del motorista
  await prisma.motorbike.updateMany({
    where: { driverId },
    data: { driverId: null }
  })
  
  // Asignar nueva moto
  return await prisma.motorbike.update({
    where: { id: motorbikeId },
    data: { driverId }
  })
}
```

---

## 6. Debugging y Logging

### 6.1 Logs en Server Actions

```typescript
'use server'

export async function createCustomer(data: unknown) {
  console.log('📝 Creating customer with data:', data)
  
  try {
    const validated = customerSchema.parse(data)
    console.log('✅ Validation passed:', validated)
    
    const customer = await prisma.customer.create({ data: validated })
    console.log('✅ Customer created:', customer.id)
    
    return { success: true, customer }
  } catch (error) {
    console.error('❌ Error creating customer:', error)
    return { success: false, error: 'Error al crear cliente' }
  }
}
```

### 6.2 Prisma Query Logging

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})
```

### 6.3 Debugging en Cliente

```typescript
'use client'

export function CustomerForm() {
  const form = useForm()
  
  // Observar cambios en el formulario
  useEffect(() => {
    const subscription = form.watch((data) => {
      console.log('Form data changed:', data)
    })
    return () => subscription.unsubscribe()
  }, [form])
  
  // ...
}
```

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[09-API.md](./09-API.md)** - API y Endpoints
