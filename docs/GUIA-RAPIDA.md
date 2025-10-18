# ⚡ Guía Rápida - LogiCo

## 🚀 Quick Start

```bash
# 1. Clonar e instalar
git clone <repo-url> logico && cd logico
pnpm install

# 2. Configurar BD
createdb logico
cp .env.example .env.local  # Editar con tus credenciales

# 3. Migrar y seed
pnpm migrate:dev
pnpm create:users

# 4. Iniciar
pnpm dev
# Abrir: http://localhost:3000
```

**Login de prueba:**
- Email: `admin@logico.test`
- Password: `Admin123!`

---

## 📁 Estructura de Archivos

```
logico/
├── src/
│   ├── app/                    # Rutas Next.js
│   │   ├── (auth)/            # Login
│   │   └── (dashboard)/       # App principal
│   ├── project/               # Módulos de negocio
│   │   ├── driver/           # Motoristas
│   │   ├── pharmacy/         # Farmacias
│   │   ├── movement/         # Movimientos
│   │   └── ...
│   ├── shared/               # Componentes compartidos
│   │   ├── components/ui/   # shadcn/ui
│   │   └── schemas/         # Validaciones Zod
│   └── lib/                 # Utilidades
├── prisma/
│   ├── schema.prisma        # Modelo de datos
│   └── migrations/          # Migraciones
└── docs/                    # Esta documentación
```

---

## 💾 Comandos Esenciales

### Desarrollo
```bash
pnpm dev           # Servidor desarrollo
pnpm build         # Build producción
pnpm lint          # Linter
```

### Base de Datos
```bash
pnpm migrate:dev        # Aplicar migraciones
pnpm prisma:studio      # GUI para BD
pnpm prisma:generate    # Regenerar cliente Prisma
```

### Datos
```bash
pnpm create:users           # Crear usuarios de prueba
pnpm import:pharmacies      # Importar farmacias
pnpm import:motorcycles     # Importar motos
```

---

## 🗄️ Modelos Principales

### User
```prisma
model User {
  id        String  @id
  name      String
  email     String  @unique
  role      String? // admin, operadora, gerente
  ...
}
```

### Pharmacy
```prisma
model Pharmacy {
  id           String @id @default(uuid())
  name         String
  address      String
  contactPhone String
  regionId     String
  cityId       String
  ...
}
```

### Driver
```prisma
model Driver {
  id         String  @id @default(uuid())
  name       String
  rut        String  @unique
  email      String
  active     Boolean @default(true)
  motorbike  Motorbike?
  ...
}
```

### Movement
```prisma
model Movement {
  id            String         @id @default(uuid())
  number        String         @unique  // >=10 chars
  pharmacyId    String
  driverId      String
  status        MovementStatus
  departureDate DateTime?
  deliveryDate  DateTime?
  hasRecipe     Boolean
  ...
}

enum MovementStatus {
  PENDING
  IN_TRANSIT
  DELIVERED
  INCIDENT
}
```

---

## 🛠️ Crear Nuevo Módulo

### 1. Actualizar Schema
```prisma
// prisma/schema.prisma
model NewEntity {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("new_entity")
}
```

### 2. Migrar
```bash
pnpm migrate:dev --name add_new_entity
```

### 3. Crear Estructura
```bash
mkdir -p src/project/new-entity/{actions,components}
```

### 4. Schema Zod
```typescript
// src/shared/schemas/new-entity.ts
import { z } from 'zod'

export const newEntitySchema = z.object({
  name: z.string().min(3)
})

export type NewEntitySchema = z.infer<typeof newEntitySchema>
```

### 5. Server Actions
```typescript
// src/project/new-entity/actions/create-new-entity.ts
'use server'

import { prisma } from '@/lib/prisma'
import { newEntitySchema } from '@/shared/schemas/new-entity'
import { revalidatePath } from 'next/cache'

export async function createNewEntity(data: unknown) {
  const validated = newEntitySchema.parse(data)
  const entity = await prisma.newEntity.create({ data: validated })
  revalidatePath('/new-entities')
  return { success: true, entity }
}
```

### 6. Componente
```typescript
// src/project/new-entity/components/new-entity-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newEntitySchema } from '@/shared/schemas/new-entity'

export function NewEntityForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(newEntitySchema)
  })
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

### 7. Página
```typescript
// src/app/(dashboard)/new-entities/page.tsx
import { NewEntityForm } from '@/project/new-entity/components/new-entity-form'
import { createNewEntity } from '@/project/new-entity/actions/create-new-entity'

export default function NewEntitiesPage() {
  return (
    <div>
      <h1>New Entities</h1>
      <NewEntityForm onSubmit={createNewEntity} />
    </div>
  )
}
```

---

## 🔐 Autenticación

### Verificar Usuario en Server Action
```typescript
'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function protectedAction() {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  })
  
  if (!session) {
    throw new Error('No autorizado')
  }
  
  // Continuar con lógica...
}
```

### Verificar Rol
```typescript
if (session.user.role !== 'admin') {
  throw new Error('Requiere rol de administrador')
}
```

---

## 📝 Validación con Zod

### Esquemas Comunes
```typescript
import { z } from 'zod'

// Email
const email = z.string().email()

// Teléfono
const phone = z.string().regex(/^\+?[0-9]{9,}$/)

// RUT chileno
const rut = z.string().regex(/^[0-9]{7,8}-[0-9Kk]$/)

// UUID
const uuid = z.string().uuid()

// Fecha
const date = z.string().datetime()

// Número positivo
const positiveInt = z.number().int().positive()

// Enum
const status = z.enum(['ACTIVE', 'INACTIVE'])

// Opcional
const optional = z.string().optional()

// Con default
const withDefault = z.boolean().default(false)
```

### Validar en Server Action
```typescript
'use server'

export async function myAction(data: unknown) {
  try {
    const validated = mySchema.parse(data)
    // usar validated (tipo-seguro)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.flatten() 
      }
    }
  }
}
```

---

## 🎨 Componentes UI (shadcn/ui)

### Importar y Usar
```typescript
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Dialog } from '@/shared/components/ui/dialog'
import { Select } from '@/shared/components/ui/select'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'

function MyForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" placeholder="Juan Pérez" />
      </div>
      
      <Button type="submit">Guardar</Button>
    </div>
  )
}
```

### Variantes de Button
```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Pequeño</Button>
<Button size="lg">Grande</Button>
```

---

## 🔄 Revalidación de Cache

### Revalidar Ruta Específica
```typescript
import { revalidatePath } from 'next/cache'

revalidatePath('/farmacias')
revalidatePath(`/farmacias/${id}`)
```

### Revalidar Todo
```typescript
import { revalidateTag } from 'next/cache'

revalidateTag('pharmacies')
```

---

## 🐛 Debugging

### Logs en Server Actions
```typescript
'use server'

export async function myAction(data: unknown) {
  console.log('📝 Data received:', data)
  
  try {
    const result = await prisma.entity.create({ data })
    console.log('✅ Success:', result)
    return { success: true, result }
  } catch (error) {
    console.error('❌ Error:', error)
    return { success: false, error }
  }
}
```

### Ver Queries de Prisma
```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']  // En desarrollo
})
```

### Prisma Studio
```bash
pnpm prisma:studio
# Abrir: http://localhost:5555
```

---

## 📊 Queries Prisma Comunes

### Listar con Relaciones
```typescript
const items = await prisma.pharmacy.findMany({
  include: {
    city: true,
    region: true
  },
  orderBy: { createdAt: 'desc' }
})
```

### Buscar por ID
```typescript
const item = await prisma.pharmacy.findUnique({
  where: { id },
  include: { city: true }
})
```

### Buscar con Filtros
```typescript
const items = await prisma.pharmacy.findMany({
  where: {
    name: { contains: 'Cruz Verde' },
    cityId: cityId,
    active: true
  }
})
```

### Contar
```typescript
const count = await prisma.pharmacy.count({
  where: { active: true }
})
```

### Paginación
```typescript
const items = await prisma.pharmacy.findMany({
  take: 10,
  skip: (page - 1) * 10,
  orderBy: { createdAt: 'desc' }
})
```

### Crear con Relaciones
```typescript
const movement = await prisma.movement.create({
  data: {
    number: '1234567890',
    address: 'Av. Principal 123',
    pharmacy: { connect: { id: pharmacyId } },
    driver: { connect: { id: driverId } }
  }
})
```

### Actualizar
```typescript
const updated = await prisma.pharmacy.update({
  where: { id },
  data: { name: 'Nuevo nombre' }
})
```

### Eliminar
```typescript
await prisma.pharmacy.delete({
  where: { id }
})
```

---

## 🎯 Reglas de Negocio Críticas

### Movimientos
- ⚠️ `number` debe tener ≥ 10 caracteres
- ⚠️ Registrar `departureDate` al salir
- ⚠️ Registrar `deliveryDate` al entregar
- ⚠️ Traspasos y reenvíos no tienen código propio

### Motoristas y Motos
- ⚠️ Relación 1:1 entre motorista y moto
- ⚠️ RUT debe ser único

### Incidencias
- ⚠️ Deben estar vinculadas a un movimiento
- ⚠️ Registrar usuario que creó la incidencia

### Datos Personales
- ⚠️ No almacenar datos del cliente final
- ⚠️ Solo dirección de entrega

---

## 🔧 Troubleshooting

### Puerto 3000 ocupado
```bash
lsof -ti:3000 | xargs kill -9
pnpm dev
```

### Prisma Client desactualizado
```bash
pnpm prisma:generate
```

### Migraciones desincronizadas
```bash
pnpm prisma:reset  # ⚠️ Borra todos los datos
pnpm create:users
```

### Error de TypeScript
```bash
# Reiniciar servidor TypeScript en VS Code
Cmd + Shift + P → "TypeScript: Restart TS Server"
```

---

## 📚 Documentación Completa

- **[00-INDICE.md](./00-INDICE.md)** - Índice general
- **[01-INTRODUCCION.md](./01-INTRODUCCION.md)** - Contexto del negocio
- **[02-ARQUITECTURA.md](./02-ARQUITECTURA.md)** - Arquitectura técnica
- **[03-ESTRUCTURA.md](./03-ESTRUCTURA.md)** - Estructura del código
- **[04-MODELO-DATOS.md](./04-MODELO-DATOS.md)** - Base de datos
- **[07-INSTALACION.md](./07-INSTALACION.md)** - Instalación completa
- **[08-DESARROLLO.md](./08-DESARROLLO.md)** - Guía de desarrollo

---

## 🆘 Ayuda Rápida

### Usuarios de Prueba
```
admin@logico.test     / Admin123!   (Admin)
operadora@logico.test / User123!    (Operadora)
gerente@logico.test   / User123!    (Gerente)
```

### URLs Importantes
```
http://localhost:3000/login              - Login
http://localhost:3000/dashboard          - Dashboard
http://localhost:3000/farmacias          - Farmacias
http://localhost:5555                    - Prisma Studio
```

### Variables de Entorno
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/logico"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

---

**¿Necesitas más ayuda?** Consulta la documentación completa en `/docs/`
