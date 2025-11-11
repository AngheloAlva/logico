# 📁 Estructura del Proyecto

## 1. Árbol de Directorios Completo

```
logico/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/              # Grupo de rutas protegidas
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── farmacias/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nueva/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── motoristas/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nuevo/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── motos/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nueva/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── movimientos/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nuevo/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── regiones/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nueva/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── ciudades/
│   │   │   │           └── [cityId]/
│   │   │   │               └── page.tsx
│   │   │   ├── reportes/
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios/
│   │   │   │   ├── page.tsx
│   │   │   │   └── nuevo/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── project/                      # Módulos de dominio
│   │   ├── auth/
│   │   │   └── actions/
│   │   │       ├── login.ts
│   │   │       ├── logout.ts
│   │   │       └── forgot-password.ts
│   │   │
│   │   ├── driver/
│   │   │   ├── actions/
│   │   │   │   ├── create-driver.ts
│   │   │   │   ├── update-driver.ts
│   │   │   │   ├── delete-driver.ts
│   │   │   │   ├── get-driver.ts
│   │   │   │   ├── get-drivers.ts
│   │   │   │   ├── assign-motorbike.ts
│   │   │   │   └── toggle-status.ts
│   │   │   └── components/
│   │   │       └── driver-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-driver.ts
│   │   │   └── lib/
│   │   │       └── driver.ts
│   │   │
│   │   ├── motorbike/
│   │   │   ├── actions/
│   │   │   │   ├── create-motorbike.ts
│   │   │   │   ├── update-motorbike.ts
│   │   │   │   ├── delete-motorbike.ts
│   │   │   │   ├── get-motorbike.ts
│   │   │   │   ├── get-motorbikes.ts
│   │   │   │   ├── assign-driver.ts
│   │   │   │   └── unassign-driver.ts
│   │   │   └── components/
│   │   │       └── motorbike-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-motorbike.ts
│   │   │   └── lib/
│   │   │       └── motorbike.ts
│   │   │
│   │   ├── movement/
│   │   │   ├── actions/
│   │   │   │   ├── create-movement.ts
│   │   │   │   ├── update-movement.ts
│   │   │   │   ├── delete-movement.ts
│   │   │   │   ├── get-movement.ts
│   │   │   │   ├── get-movements.ts
│   │   │   │   ├── update-status.ts
│   │   │   │   ├── add-incident.ts
│   │   │   │   ├── get-incidents.ts
│   │   │   │   ├── get-stats.ts
│   │   │   │   └── export-movements.ts
│   │   │   └── components/
│   │   │       ├── movement-form.tsx
│   │   │       └── incident-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-movement.ts
│   │   │   └── lib/
│   │   │       └── movement.ts
│   │   │
│   │   ├── pharmacy/
│   │   │   ├── actions/
│   │   │   │   ├── create-pharmacy.ts
│   │   │   │   ├── update-pharmacy.ts
│   │   │   │   ├── delete-pharmacy.ts
│   │   │   │   ├── get-pharmacy.ts
│   │   │   │   └── get-pharmacies.ts
│   │   │   └── components/
│   │   │       └── pharmacy-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-pharmacy.ts
│   │   │   └── lib/
│   │   │       └── pharmacy.ts
│   │   │
│   │   ├── region/
│   │   │   ├── actions/
│   │   │   │   ├── create-region.ts
│   │   │   │   ├── update-region.ts
│   │   │   │   ├── delete-region.ts
│   │   │   │   ├── get-region.ts
│   │   │   │   ├── get-regions.ts
│   │   │   │   ├── create-city.ts
│   │   │   │   ├── update-city.ts
│   │   │   │   └── delete-city.ts
│   │   │   └── components/
│   │   │       ├── region-form.tsx
│   │   │       └── city-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-region.ts
│   │   │   └── lib/
│   │   │       └── region.ts
│   │   │
│   │   ├── report/
│   │   │   └── actions/
│   │   │       ├── get-daily-report.ts
│   │   │       ├── get-statistics.ts
│   │   │       └── export-report.ts
│   │   │   └── hooks/
│   │   │       └── use-report.ts
│   │   │   └── lib/
│   │   │       └── report.ts
│   │   │
│   │   ├── user/
│   │   │   ├── actions/
│   │   │   │   ├── create-user.ts
│   │   │   │   ├── update-user.ts
│   │   │   │   ├── delete-user.ts
│   │   │   │   ├── get-user.ts
│   │   │   │   ├── get-users.ts
│   │   │   │   └── update-role.ts
│   │   │   └── components/
│   │   │       └── user-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-user.ts
│   │   │   └── lib/
│   │   │       └── user.ts
│   │   │
│   │   └── home/
│   │       ├── actions/
│   │       │   ├── get-dashboard-stats.ts
│   │       │   └── get-recent-movements.ts
│   │       └── components/
│   │           ├── stats-card.tsx
│   │           └── recent-movements.tsx
│   │
│   ├── shared/                       # Código compartido
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── sidebar/
│   │   │   │   ├── app-sidebar.tsx
│   │   │   │   ├── nav-main.tsx
│   │   │   │   └── nav-user.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── theme-provider.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-mobile.ts
│   │   │   ├── use-toast.ts
│   │   │   └── use-form-state.ts
│   │   │
│   │   └── schemas/
│   │       ├── driver.ts
│   │       ├── pharmacy.ts
│   │       ├── movement.ts
│   │       ├── motorbike.ts
│   │       └── user.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   │
│   ├── generated/
│   │   └── prisma/                   # Cliente Prisma generado
│   │
│   └── types.ts
│
├── prisma/
│   ├── migrations/
│   │   ├── 20251013021839_init/
│   │   │   └── migration.sql
│   │   ├── 20251018154742_add_created_by/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   │
│   ├── scripts/
│   │   ├── create-users.ts
│   │   ├── import-pharmacies.ts
│   │   ├── import-motorcycles.ts
│   │   └── seed.ts
│   │
│   └── schema.prisma
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── base-data/
│   ├── farmacias.xlsx
│   └── permiso-de-circulacion-2023.xlsx
│
├── docs/                             # Esta documentación
│   ├── 00-INDICE.md
│   ├── 01-INTRODUCCION.md
│   ├── 02-ARQUITECTURA.md
│   └── ...
│
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 2. Convenciones de Nomenclatura

### 2.1 Archivos y Carpetas

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| **Componentes React** | PascalCase | `PharmacyForm.tsx` |
| **Server Actions** | kebab-case | `create-pharmacy.ts` |
| **Utilidades** | kebab-case | `format-date.ts` |
| **Tipos/Interfaces** | PascalCase | `PharmacySchema.ts` |
| **Hooks** | kebab-case + prefijo use | `use-mobile.ts` |
| **Carpetas** | kebab-case | `pharmacy/`, `driver/` |
| **Rutas Next.js** | kebab-case | `farmacias/`, `nuevo/` |

### 2.2 Código TypeScript

```typescript
// Interfaces y Tipos: PascalCase
interface PharmacyData {
  name: string
  address: string
}

// Variables y funciones: camelCase
const pharmacyList = []
function getPharmacies() {}

// Constantes globales: UPPER_SNAKE_CASE
const MAX_PHARMACIES = 100

// Componentes: PascalCase
function PharmacyCard() {}

// Enums: PascalCase
enum MovementStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT'
}
```

---

## 3. Organización por Módulos

### 3.1 Estructura de un Módulo Típico

Cada módulo de dominio sigue esta estructura estandarizada:

```
module-name/
├── actions/              # Server Actions (lógica de negocio)
│   ├── create-*.ts      # Crear entidad
│   ├── update-*.ts      # Actualizar entidad
│   ├── delete-*.ts      # Eliminar entidad
│   ├── get-*.ts         # Obtener una entidad
│   └── get-*s.ts        # Obtener lista de entidades
│
├── components/           # Componentes React específicos
│   ├── *-form.tsx       # Formularios
│   ├── *-table.tsx      # Tablas de datos
│   └── *-card.tsx       # Tarjetas de visualización
│
├── schemas/             # Esquemas Zod (opcional si en /shared)
│   └── *.ts
│
├── types/               # Tipos TypeScript (opcional)
│   └── *.ts
│
├── utils/               # Utilidades específicas (opcional)
│   └── *.ts
│
└── hooks/               # Custom hooks (opcional)
    └── use-*.ts
```

### 3.2 Ejemplo Real: Módulo Pharmacy

```
pharmacy/
├── actions/
│   ├── create-pharmacy.ts
│   ├── update-pharmacy.ts
│   ├── delete-pharmacy.ts
│   ├── get-pharmacy-by-id.ts
│   └── get-pharmacies.ts
│
├── components/
│   └── pharmacy-form.tsx
│
└── hooks/
    └── use-pharmacies.ts
```

**create-pharmacy.ts:**
```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { pharmacySchema } from '@/shared/schemas/pharmacy'
import { revalidatePath } from 'next/cache'

export async function createPharmacy(data: unknown) {
  // 1. Validación
  const validated = pharmacySchema.parse(data)
  
  // 2. Lógica de negocio
  const pharmacy = await prisma.pharmacy.create({
    data: validated
  })
  
  // 3. Revalidación de cache
  revalidatePath('/farmacias')
  
  // 4. Respuesta
  return { success: true, pharmacy }
}
```

**use-pharmacies.ts:**
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPharmacies } from '../actions/get-pharmacies'
import { createPharmacy } from '../actions/create-pharmacy'

// Query Keys
export const pharmacyKeys = {
  all: ['pharmacies'] as const,
  lists: () => [...pharmacyKeys.all, 'list'] as const,
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    [...pharmacyKeys.lists(), params] as const,
}

// Hook para obtener lista de farmacias
export function usePharmacies(params?: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: pharmacyKeys.list(params),
    queryFn: () => getPharmacies(params),
  })
}

// Hook para crear farmacia
export function useCreatePharmacy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PharmacyInput) => createPharmacy(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })
        toast.success('Farmacia creada exitosamente')
      }
    },
  })
}
```

---

## 4. Rutas de Next.js

### 4.1 Convención App Router

```
app/
├── (auth)/                   # Grupo de ruta (no afecta URL)
│   ├── login/               # /login
│   │   └── page.tsx
│   └── layout.tsx           # Layout para auth
│
├── (dashboard)/             # Grupo de ruta protegida
│   ├── dashboard/           # /dashboard
│   │   └── page.tsx
│   ├── farmacias/           # /farmacias
│   │   ├── page.tsx
│   │   ├── nueva/           # /farmacias/nueva
│   │   │   └── page.tsx
│   │   └── [id]/            # /farmacias/:id (dinámico)
│   │       └── page.tsx
│   └── layout.tsx           # Layout compartido
│
└── api/                     # /api/*
    └── auth/
        └── [...all]/        # Catch-all route
            └── route.ts
```

### 4.2 Tipos de Rutas

#### Ruta Estática
```typescript
// app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>
}
```

#### Ruta Dinámica
```typescript
// app/(dashboard)/farmacias/[id]/page.tsx
export default function PharmacyDetailPage({
  params
}: {
  params: { id: string }
}) {
  return <h1>Farmacia {params.id}</h1>
}
```

#### Ruta con Múltiples Segmentos Dinámicos
```typescript
// app/(dashboard)/regiones/[id]/ciudades/[cityId]/page.tsx
export default function CityDetailPage({
  params
}: {
  params: { id: string; cityId: string }
}) {
  return <h1>Ciudad {params.cityId} de Región {params.id}</h1>
}
```

---

## 5. Componentes Compartidos

### 5.1 Sistema de Componentes shadcn/ui

Los componentes base están en `/src/shared/components/ui/`:

```typescript
// Importación típica
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Dialog } from '@/shared/components/ui/dialog'
```

### 5.2 Componentes Personalizados

```
shared/components/
├── ui/                    # Componentes base (shadcn)
│   └── button.tsx
│
├── sidebar/               # Navegación
│   ├── app-sidebar.tsx
│   ├── nav-main.tsx
│   └── nav-user.tsx
│
├── data-table.tsx        # Tabla genérica reutilizable
├── theme-provider.tsx    # Provider de tema
└── loading-spinner.tsx   # Spinner de carga
```

### 5.3 Ejemplo de Uso

```typescript
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Dialog } from '@/shared/components/ui/dialog'

function MyForm() {
  return (
    <Dialog>
      <Input placeholder="Nombre" />
      <Button>Guardar</Button>
    </Dialog>
  )
}
```

---

## 6. Validación con Zod

### 6.1 Ubicación de Esquemas

```
shared/schemas/
├── driver.ts
├── pharmacy.ts
├── movement.ts
├── motorbike.ts
└── user.ts
```

### 6.2 Ejemplo de Esquema

```typescript
// shared/schemas/pharmacy.ts
import { z } from 'zod'

export const pharmacySchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  address: z.string().min(10, 'Dirección muy corta'),
  contactPhone: z.string().regex(/^\+?[0-9]{9,}$/, 'Teléfono inválido'),
  contactEmail: z.string().email('Email inválido'),
  contactName: z.string().min(3),
  regionId: z.string().uuid('ID de región inválido'),
  cityId: z.string().uuid('ID de ciudad inválido')
})

export type PharmacySchema = z.infer<typeof pharmacySchema>
```

### 6.3 Uso en Formularios

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pharmacySchema } from '@/shared/schemas/pharmacy'

function PharmacyForm() {
  const form = useForm({
    resolver: zodResolver(pharmacySchema)
  })
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

---

## 7. Prisma y Base de Datos

### 7.1 Cliente Prisma Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 7.2 Uso en Server Actions

```typescript
'use server'

import { prisma } from '@/lib/prisma'

export async function getPharmacies() {
  return await prisma.pharmacy.findMany({
    include: {
      city: true,
      region: true
    }
  })
}
```

### 7.3 Migraciones

```bash
# Crear nueva migración
pnpm migrate:dev --name add_new_field

# Aplicar migraciones
pnpm migrate:dev

# Resetear base de datos
pnpm prisma:reset
```

---

## 8. Configuración de Alias

### 8.1 TypeScript Path Mapping

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 8.2 Ejemplos de Importación

```typescript
// ✅ Correcto - usando alias
import { Button } from '@/shared/components/ui/button'
import { prisma } from '@/lib/prisma'
import { createPharmacy } from '@/project/pharmacy/actions/create-pharmacy'

// ❌ Evitar - rutas relativas largas
import { Button } from '../../../shared/components/ui/button'
```

---

## 9. Archivos de Configuración

### 9.1 package.json

Scripts principales:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "migrate:dev": "dotenv -e .env.local -- prisma migrate dev",
    "prisma:studio": "dotenv -e .env.local -- prisma studio",
    "import:pharmacies": "dotenv -e .env.local -- tsx ./prisma/scripts/import-pharmacies.ts"
  }
}
```

### 9.2 next.config.ts

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Configuraciones futuras aquí
}

export default nextConfig
```

### 9.3 .prettierrc.json

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 9.4 eslint.config.mjs

Configuración de linting para el proyecto.

---

## 10. TanStack React Query

### 10.1 Configuración

El proyecto utiliza **TanStack React Query** (anteriormente React Query) para la gestión del estado del servidor, caché y sincronización de datos.

**Configuración del QueryClient:**
```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
```

**Provider en el Layout:**
```typescript
// app/layout.tsx
import { QueryProvider } from '@/components/providers/query-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

### 10.2 Estructura de Hooks

Cada módulo tiene su carpeta `hooks/` con custom hooks que conectan los server actions con React Query:

```
module-name/
├── actions/
│   ├── get-items.ts
│   ├── create-item.ts
│   └── update-item.ts
└── hooks/
    └── use-items.ts
```

### 10.3 Convenciones de Query Keys

Las query keys siguen un patrón jerárquico y consistente:

```typescript
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (params?: FilterParams) => [...itemKeys.lists(), params] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
}
```

### 10.4 Hooks de Queries (GET)

Para obtener datos del servidor:

```typescript
export function usePharmacies(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: pharmacyKeys.list(params),
    queryFn: () => getPharmacies(params),
  })
}

export function usePharmacy(id: string) {
  return useQuery({
    queryKey: pharmacyKeys.detail(id),
    queryFn: () => getPharmacyById(id),
    enabled: !!id, // Solo ejecutar si hay ID
  })
}
```

**Uso en componentes:**
```typescript
function PharmacyList() {
  const { data, isLoading, error } = usePharmacies({ page: 1, search: '' })

  if (isLoading) return <Loading />
  if (error) return <Error />

  return <div>{data?.data.map(pharmacy => ...)}</div>
}
```

### 10.5 Hooks de Mutations (POST/PUT/DELETE)

Para modificar datos en el servidor:

```typescript
export function useCreatePharmacy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PharmacyInput) => createPharmacy(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidar queries relacionadas para refrescar datos
        queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })
        toast.success('Farmacia creada exitosamente')
      } else {
        toast.error(result.error || 'Error al crear farmacia')
      }
    },
    onError: () => {
      toast.error('Error al crear farmacia')
    },
  })
}
```

**Uso en componentes:**
```typescript
function CreatePharmacyForm() {
  const createPharmacy = useCreatePharmacy()

  const onSubmit = async (data: PharmacyInput) => {
    await createPharmacy.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos del formulario */}
      <button disabled={createPharmacy.isPending}>
        {createPharmacy.isPending ? 'Creando...' : 'Crear'}
      </button>
    </form>
  )
}
```

### 10.6 Invalidación de Caché

Después de mutaciones, se invalidan las queries relacionadas:

```typescript
// Invalidar todas las listas
queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })

// Invalidar un detalle específico
queryClient.invalidateQueries({ queryKey: pharmacyKeys.detail(id) })

// Invalidar múltiples queries relacionadas
queryClient.invalidateQueries({ queryKey: pharmacyKeys.all })
```

### 10.7 Módulos con Hooks Implementados

Todos los módulos del proyecto tienen hooks de React Query:

- **pharmacy**: `use-pharmacies.ts`
- **driver**: `use-drivers.ts`
- **motorbike**: `use-motorbikes.ts`
- **movement**: `use-movements.ts`, `use-incidents.ts`
- **region**: `use-regions.ts`, `use-cities.ts`
- **user**: `use-users.ts`
- **report**: `use-reports.ts`
- **home**: `use-dashboard.ts`

### 10.8 Refetch Automático

Para datos que cambian frecuentemente (dashboard, estadísticas):

```typescript
export function useTodayStats() {
  return useQuery({
    queryKey: dashboardKeys.todayStats(),
    queryFn: () => getTodayStats(),
    refetchInterval: 60000, // Refrescar cada minuto
  })
}
```

---

## 11. Variables de Entorno

### 11.1 Estructura

```bash
# .env.local (NO commitear)
DATABASE_URL="postgresql://user:password@localhost:5432/logico"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### 11.2 Uso en el Código

```typescript
// Acceso a variables de entorno
const databaseUrl = process.env.DATABASE_URL
```

---

## 12. Mejores Prácticas

### 12.1 Organización de Código

✅ **Hacer:**
- Un componente por archivo
- Agrupar por funcionalidad (feature-based)
- Usar aliases de TypeScript (@/)
- Colocar tipos cerca de su uso

❌ **Evitar:**
- Archivos de más de 300 líneas
- Lógica de negocio en componentes
- Importaciones circulares
- Código duplicado

### 12.2 Nomenclatura

✅ **Hacer:**
- Nombres descriptivos y claros
- Consistencia en todo el proyecto
- Verbos para funciones (get, create, update)
- Sustantivos para componentes

❌ **Evitar:**
- Abreviaturas ambiguas
- Nombres de un solo carácter (excepto loops)
- Mezclar idiomas (inglés/español)

### 12.3 Comentarios

```typescript
// ✅ Bueno - explica el "por qué"
// Usamos un timeout aquí porque la API externa tiene rate limiting
await sleep(1000)

// ❌ Malo - explica el "qué" (obvio)
// Crea un usuario
const user = await createUser()
```

---

## 13. Guía de Estilo de Código

### 13.1 TypeScript

```typescript
// ✅ Usar tipos explícitos en funciones públicas
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Interfaces para objetos públicos
export interface User {
  id: string
  name: string
  email: string
}

// ✅ Type aliases para uniones
export type Status = 'pending' | 'active' | 'completed'
```

### 13.2 React Components

```typescript
// ✅ Props interface
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

// ✅ Componente funcional con tipos
export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  )
}
```

### 13.3 Server Actions

```typescript
'use server'

// ✅ Validación explícita
export async function createItem(data: unknown) {
  const validated = itemSchema.parse(data)
  return await prisma.item.create({ data: validated })
}

// ✅ Manejo de errores
export async function deleteItem(id: string) {
  try {
    await prisma.item.delete({ where: { id } })
    revalidatePath('/items')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'No se pudo eliminar' }
  }
}
```

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[04-MODELO-DATOS.md](./04-MODELO-DATOS.md)** - Modelo de Datos
