# 🏗️ Arquitectura del Sistema

## 1. Arquitectura General

### 1.1 Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
│                  React 19 + Next.js 15                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │    Pages     │  │    Hooks     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   NEXT.JS APP ROUTER                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Server     │  │  API Routes  │  │  Middleware  │     │
│  │   Actions    │  │              │  │  (Auth)      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
└─────────┼──────────────────┼──────────────────────────────┘
          │                  │
          │   Type-safe      │  REST API
          │   RPC-like       │
          │                  │
┌─────────▼──────────────────▼──────────────────────────────┐
│                    CAPA DE SERVICIOS                        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │         Prisma ORM (Type-safe queries)           │     │
│  │                                                   │     │
│  │  • Schema validation                             │     │
│  │  • Query builder                                 │     │
│  │  • Migrations                                    │     │
│  └────────────────────┬─────────────────────────────┘     │
└───────────────────────┼───────────────────────────────────┘
                        │
                        │ TCP Connection Pool
                        │
┌───────────────────────▼───────────────────────────────────┐
│              PostgreSQL Database (Vercel)                  │
│                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Users   │ │Pharmacies│ │ Drivers  │ │Movements │   │
│  │ Sessions │ │  Cities  │ │ Motos    │ │Incidents │   │
│  │ Accounts │ │ Regions  │ │          │ │AuditLogs │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└────────────────────────────────────────────────────────────┘
```

### 1.2 Patrón de Arquitectura

El proyecto utiliza una **arquitectura modular basada en características (Feature-based)** combinada con:

- **Clean Architecture**: Separación de preocupaciones en capas
- **DDD (Domain-Driven Design)**: Organización por dominios de negocio
- **Server-Side First**: Renderizado y lógica en el servidor

---

## 2. Stack Tecnológico Completo

### 2.1 Frontend

#### Framework y Bibliotecas Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.5.4 | Framework full-stack React |
| **React** | 19.1.0 | Biblioteca UI |
| **TypeScript** | 5.x | Tipado estático y mejor DX |
| **Turbopack** | - | Bundler ultra-rápido (next-gen webpack) |

#### Estilos y UI

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 4.x | Framework CSS utilitario |
| **PostCSS** | - | Procesador de CSS |
| **shadcn/ui** | - | Sistema de componentes copiables |
| **Radix UI** | - | Primitivos UI accesibles sin estilos |
| **class-variance-authority** | 0.7.1 | Gestión de variantes de componentes |
| **clsx** | 2.1.1 | Utilidad para clases condicionales |
| **tailwind-merge** | 3.3.1 | Merge inteligente de clases Tailwind |

#### Componentes UI Específicos

```typescript
// Componentes Radix UI utilizados:
- Accordion      - Dialog          - Radio Group
- Alert Dialog   - Dropdown Menu   - Scroll Area
- Avatar         - Hover Card      - Select
- Checkbox       - Label           - Separator
- Collapsible    - Menubar         - Slider
- Context Menu   - Navigation Menu - Switch
- Popover        - Progress        - Tabs
- Toggle         - Tooltip         - Slot
```

#### Gestión de Estado y Formularios

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | 7.65.0 | Gestión de formularios performante |
| **Zod** | 4.1.12 | Validación de esquemas tipo-segura |
| **@hookform/resolvers** | 5.2.2 | Integración Zod + React Hook Form |

#### Utilidades y Helpers

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **date-fns** | 4.1.0 | Manipulación y formateo de fechas |
| **Lucide React** | 0.545.0 | Biblioteca de iconos SVG |
| **Sonner** | 2.0.7 | Sistema de notificaciones toast |
| **next-themes** | 0.4.6 | Gestión de tema claro/oscuro |
| **cmdk** | 1.1.1 | Command palette (búsqueda rápida) |

#### Visualización de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Recharts** | 2.15.4 | Gráficos y visualizaciones |
| **react-day-picker** | 9.11.1 | Selector de fechas |
| **embla-carousel-react** | 8.6.0 | Carruseles |

### 2.2 Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Prisma** | 6.17.1 | ORM tipo-seguro para PostgreSQL |
| **@prisma/client** | 6.17.1 | Cliente generado de Prisma |
| **PostgreSQL** | 14+ | Base de datos relacional |
| **Better Auth** | 1.3.27 | Sistema de autenticación |
| **Next.js Server Actions** | - | Mutaciones RPC-like tipo-seguras |
| **Next.js API Routes** | - | Endpoints REST tradicionales |

### 2.3 DevOps y Tooling

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **pnpm** | 8+ | Gestor de paquetes eficiente |
| **ESLint** | 9.x | Linter de JavaScript/TypeScript |
| **Prettier** | 3.6.2 | Formateador de código |
| **tsx** | 4.20.6 | Ejecutor de TypeScript para scripts |
| **dotenv-cli** | 10.0.0 | Cargar variables de entorno en scripts |
| **prettier-plugin-tailwindcss** | 0.6.14 | Ordenar clases Tailwind |

---

## 3. Patrones de Diseño

### 3.1 Server-Side Rendering (SSR)

```typescript
// app/(dashboard)/farmacias/page.tsx
export default async function FarmaciasPage() {
  // Datos fetched en el servidor
  const farmacias = await getPharmacies()
  
  return <PharmaciesTable data={farmacias} />
}
```

**Ventajas:**
- ✅ SEO optimizado
- ✅ Tiempo inicial de carga rápido
- ✅ Datos siempre actualizados
- ✅ Menor bundle de JavaScript

### 3.2 Server Actions

```typescript
// project/pharmacy/actions/create-pharmacy.ts
'use server'

export async function createPharmacy(data: PharmacySchema) {
  const user = await auth.api.getSession({ headers: await headers() })
  
  // Validación con Zod
  const validated = pharmacySchema.parse(data)
  
  // Creación en BD
  const pharmacy = await prisma.pharmacy.create({
    data: validated
  })
  
  revalidatePath('/farmacias')
  return { success: true, pharmacy }
}
```

**Ventajas:**
- ✅ Tipado end-to-end
- ✅ No necesita API Routes
- ✅ Validación centralizada
- ✅ Revalidación automática

### 3.3 Optimistic Updates

```typescript
function useOptimisticUpdate() {
  const [isPending, startTransition] = useTransition()
  
  const handleUpdate = (newData) => {
    startTransition(async () => {
      // UI se actualiza inmediatamente
      setOptimisticData(newData)
      
      // Luego se sincroniza con servidor
      await updateServerAction(newData)
    })
  }
}
```

### 3.4 Repository Pattern

```typescript
// Capa de abstracción sobre Prisma
class PharmacyRepository {
  async findAll(filters?: PharmacyFilters) {
    return prisma.pharmacy.findMany({
      where: this.buildWhereClause(filters),
      include: { city: true, region: true }
    })
  }
  
  async findById(id: string) {
    return prisma.pharmacy.findUnique({ where: { id } })
  }
  
  // ... más métodos
}
```

---

## 4. Flujo de Datos

### 4.1 Flujo de Lectura (Query)

```
┌──────────────┐
│   UI Page    │ → Renderizado en servidor (SSR)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ → Función async en componente
│ Component    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Data Fetcher │ → Función auxiliar (get*)
│ (get*.ts)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Prisma     │ → Query tipo-segura
│   Client     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │ → Base de datos
└──────────────┘
```

### 4.2 Flujo de Escritura (Mutation)

```
┌──────────────┐
│  UI Form     │ → Usuario interactúa
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ React Hook   │ → Manejo del formulario
│ Form         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Zod        │ → Validación en cliente
│ Validation   │
└──────┬───────┘
       │ (si válido)
       ▼
┌──────────────┐
│ Server       │ → 'use server' directive
│ Action       │
└──────┬───────┘
       │
       ├─▶ Zod Validation (servidor)
       │
       ├─▶ Authorization Check
       │
       ▼
┌──────────────┐
│   Prisma     │ → Mutación en BD
│   Client     │
└──────┬───────┘
       │
       ├─▶ revalidatePath() → Invalidar cache
       │
       ▼
┌──────────────┐
│  Response    │ → Retorno al cliente
└──────────────┘
```

### 4.3 Flujo de Autenticación

```
┌──────────────┐
│ Login Form   │
└──────┬───────┘
       │ POST /api/auth/login
       ▼
┌──────────────┐
│ Better Auth  │ → Valida credenciales
│ Handler      │
└──────┬───────┘
       │
       ├─▶ Verifica password hash
       │
       ├─▶ Crea sesión en BD
       │
       ├─▶ Genera cookie segura
       │
       ▼
┌──────────────┐
│  Middleware  │ → Valida en cada request
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Protected    │ → Acceso a rutas protegidas
│ Routes       │
└──────────────┘
```

---

## 5. Estructura de Capas

### 5.1 Capa de Presentación

**Responsabilidad:** Interfaz de usuario y experiencia

```
src/app/
└── (dashboard)/
    ├── dashboard/
    │   └── page.tsx           # Vista principal
    ├── farmacias/
    │   ├── page.tsx           # Lista
    │   ├── nueva/
    │   │   └── page.tsx       # Crear
    │   └── [id]/
    │       └── page.tsx       # Detalle/Editar
    └── layout.tsx             # Layout compartido
```

**Tecnologías:**
- React Server Components
- Client Components (para interactividad)
- Tailwind CSS

### 5.2 Capa de Componentes

**Responsabilidad:** Componentes reutilizables

```
src/shared/components/
├── ui/                         # Componentes base (shadcn)
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── sidebar/                    # Navegación
└── data-table.tsx             # Tablas genéricas
```

### 5.3 Capa de Dominio

**Responsabilidad:** Lógica de negocio

```
src/project/
└── pharmacy/
    ├── actions/                # Server Actions
    │   ├── create-pharmacy.ts
    │   ├── update-pharmacy.ts
    │   └── get-pharmacies.ts
    ├── components/             # Componentes específicos
    │   ├── pharmacy-form.tsx
    │   └── pharmacy-table.tsx
    └── schemas/                # Validaciones
        └── pharmacy.ts
```

### 5.4 Capa de Datos

**Responsabilidad:** Acceso a base de datos

```
src/lib/
└── prisma.ts                   # Cliente Prisma singleton

prisma/
├── schema.prisma              # Esquema de BD
└── migrations/                # Historial de cambios
```

### 5.5 Capa de Infraestructura

**Responsabilidad:** Configuración y utilidades

```
src/lib/
├── auth.ts                     # Configuración Better Auth
├── auth-client.ts             # Cliente de autenticación
└── utils.ts                   # Utilidades generales
```

---

## 6. Decisiones Arquitectónicas

### 6.1 ¿Por qué Next.js 15 App Router?

| Aspecto | Beneficio |
|---------|-----------|
| **SSR por defecto** | Mejor SEO y performance inicial |
| **Server Actions** | Mutaciones tipo-seguras sin API Routes |
| **Streaming** | Renderizado progresivo |
| **Layouts anidados** | Reducción de re-renders |
| **Colocation** | Código relacionado junto |

### 6.2 ¿Por qué Prisma?

- ✅ **Type-safety**: Autocomplete y validación en tiempo de compilación
- ✅ **Migrations**: Control de versiones de BD
- ✅ **Developer Experience**: Prisma Studio, formateo automático
- ✅ **Performance**: Connection pooling, lazy loading
- ✅ **Ecosystem**: Gran comunidad y recursos

### 6.3 ¿Por qué Better Auth?

- ✅ **Framework-agnostic**: Funciona con cualquier framework
- ✅ **Type-safe**: Tipado completo
- ✅ **Plugins**: Two-factor, admin, etc.
- ✅ **Moderno**: Utiliza últimas prácticas de seguridad
- ✅ **Flexible**: Adaptable a cualquier flujo

### 6.4 ¿Por qué PostgreSQL?

- ✅ **ACID compliant**: Transacciones seguras
- ✅ **Relacional**: Perfecto para este dominio
- ✅ **Escalable**: Soporta crecimiento
- ✅ **JSON support**: Flexibilidad cuando se necesita
- ✅ **Open source**: Sin costos de licencia

---

## 7. Seguridad en la Arquitectura

### 7.1 Capas de Seguridad

```
┌────────────────────────────────────┐
│  1. Network Layer                  │
│  • HTTPS obligatorio               │
│  • CORS configurado                │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  2. Authentication Layer           │
│  • Better Auth                     │
│  • Sesiones seguras                │
│  • Password hashing (bcrypt)       │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  3. Authorization Layer            │
│  • Role-based access control       │
│  • Middleware de permisos          │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  4. Validation Layer               │
│  • Zod schemas                     │
│  • Sanitización de inputs          │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  5. Data Layer                     │
│  • Prepared statements (Prisma)    │
│  • SQL injection protected         │
└────────────────────────────────────┘
```

### 7.2 Principios de Seguridad

- **Defense in Depth**: Múltiples capas de seguridad
- **Least Privilege**: Permisos mínimos necesarios
- **Fail Securely**: Errores no exponen información sensible
- **Audit Trail**: Registro de acciones críticas

---

## 8. Escalabilidad

### 8.1 Horizontal Scaling

El sistema está diseñado para escalar horizontalmente en Vercel:

- **Stateless**: Sin estado en servidores
- **Database pooling**: Conexiones eficientes
- **CDN**: Assets estáticos en edge
- **Caching**: Estrategias de cache agresivas

### 8.2 Optimizaciones

```typescript
// 1. Suspense boundaries para streaming
<Suspense fallback={<Loading />}>
  <DataComponent />
</Suspense>

// 2. Prefetching automático
<Link href="/farmacias" prefetch={true}>

// 3. Partial prerendering (experimental)
export const experimental_ppr = true

// 4. Image optimization
<Image src="/logo.png" width={200} height={100} />
```

---

## Próximo Paso

Para continuar con la documentación, consulta:
- **[03-ESTRUCTURA.md](./03-ESTRUCTURA.md)** - Estructura del Proyecto
