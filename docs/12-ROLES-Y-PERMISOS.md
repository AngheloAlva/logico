# 🔐 Sistema de Roles y Permisos

## Descripción General

LogiCo implementa un sistema robusto de control de acceso basado en roles (RBAC - Role-Based Access Control) que permite gestionar de manera granular qué usuarios pueden acceder a qué funcionalidades del sistema.

## 👥 Roles del Sistema

### 1. **Admin** (Administrador)

**Descripción:** Acceso completo a todas las funcionalidades del sistema.

**Permisos:**
- ✅ Gestión completa de usuarios
- ✅ Gestión de farmacias, motoristas, motos
- ✅ Gestión de movimientos e incidencias
- ✅ Gestión de regiones y ciudades
- ✅ Acceso a reportes y auditoría
- ✅ Exportación de datos
- ✅ Eliminación de registros
- ✅ Aprobación de operaciones

**Ruta de inicio:** `/dashboard`

**Casos de uso:**
- Configuración inicial del sistema
- Gestión de usuarios y permisos
- Supervisión general del sistema
- Resolución de problemas críticos

---

### 2. **Operadora**

**Descripción:** Personal operativo encargado de la gestión diaria de movimientos y despachos.

**Permisos:**
- ✅ Crear y editar movimientos
- ✅ Cambiar estado de movimientos
- ✅ Registrar incidencias
- ✅ Visualizar dashboard operativo
- ❌ Sin acceso a mantenedores
- ❌ Sin acceso a reportes gerenciales
- ❌ Sin acceso a eliminación de registros

**Ruta de inicio:** `/movimientos`

**Casos de uso:**
- Registro de nuevos despachos
- Seguimiento de entregas en curso
- Reporte de problemas durante entregas
- Actualización de estados de movimientos

**Restricciones:**
- No puede crear, editar o eliminar farmacias
- No puede gestionar motoristas ni motos
- No puede acceder a información de usuarios
- Requiere aprobación del supervisor para modificaciones críticas

---

### 3. **Supervisor**

**Descripción:** Personal de supervisión con acceso a mantenedores y aprobación de operaciones.

**Permisos:**
- ✅ Gestión de farmacias
- ✅ Gestión de motoristas y motos
- ✅ Gestión de regiones y ciudades
- ✅ Gestión de movimientos e incidencias
- ✅ Aprobación de operaciones
- ✅ Acceso a reportes
- ✅ Exportación de datos
- ✅ Eliminación de registros
- ❌ Sin acceso a gestión de usuarios

**Ruta de inicio:** `/dashboard`

**Casos de uso:**
- Configuración de farmacias y zonas de cobertura
- Gestión de flota de motoristas y motos
- Aprobación de modificaciones solicitadas por operadoras
- Generación de reportes operativos
- Supervisión de operaciones diarias

---

### 4. **Gerente**

**Descripción:** Personal gerencial con acceso a reportes y estadísticas para toma de decisiones.

**Permisos:**
- ✅ Visualización de reportes y estadísticas
- ✅ Dashboard ejecutivo
- ✅ Exportación de datos
- ✅ Visualización de movimientos (solo lectura)
- ❌ Sin acceso a operaciones de modificación
- ❌ Sin acceso a mantenedores

**Ruta de inicio:** `/reportes`

**Casos de uso:**
- Análisis de métricas de desempeño
- Generación de reportes ejecutivos
- Toma de decisiones estratégicas
- Supervisión de KPIs

---

## 📊 Matriz Detallada de Permisos

### Módulos del Sistema

| Módulo | Admin | Operadora | Supervisor | Gerente |
|--------|-------|-----------|------------|---------|
| **Dashboard** | ✅ Completo | ✅ Operativo | ✅ Completo | ✅ Ejecutivo |
| **Movimientos** | ✅ CRUD + Estado | ✅ CRUD + Estado | ✅ CRUD + Estado | 👁️ Solo lectura |
| **Incidencias** | ✅ CRUD | ✅ Crear | ✅ CRUD | 👁️ Solo lectura |
| **Farmacias** | ✅ CRUD | ❌ | ✅ CRUD | ❌ |
| **Motoristas** | ✅ CRUD | ❌ | ✅ CRUD | ❌ |
| **Motos** | ✅ CRUD | ❌ | ✅ CRUD | ❌ |
| **Regiones/Ciudades** | ✅ CRUD | ❌ | ✅ CRUD | ❌ |
| **Usuarios** | ✅ CRUD | ❌ | ❌ | ❌ |
| **Reportes** | ✅ Todos | ❌ | ✅ Operativos | ✅ Ejecutivos |
| **Auditoría** | ✅ Completo | ❌ | ✅ Completo | 👁️ Solo lectura |

**Leyenda:**
- ✅ Acceso completo (CRUD)
- 👁️ Solo lectura
- ❌ Sin acceso

### Permisos Específicos

| Permiso | Admin | Operadora | Supervisor | Gerente |
|---------|-------|-----------|------------|---------|
| `canManageUsers` | ✅ | ❌ | ❌ | ❌ |
| `canManagePharmacies` | ✅ | ❌ | ✅ | ❌ |
| `canManageDrivers` | ✅ | ❌ | ✅ | ❌ |
| `canManageMotorbikes` | ✅ | ❌ | ✅ | ❌ |
| `canManageMovements` | ✅ | ✅ | ✅ | ❌ |
| `canManageIncidents` | ✅ | ✅ | ✅ | ❌ |
| `canManageRegions` | ✅ | ❌ | ✅ | ❌ |
| `canViewReports` | ✅ | ❌ | ✅ | ✅ |
| `canExportData` | ✅ | ❌ | ✅ | ✅ |
| `canDeleteRecords` | ✅ | ❌ | ✅ | ❌ |
| `canApproveOperations` | ✅ | ❌ | ✅ | ❌ |

---

## 🛠️ Implementación Técnica

### Archivos Principales

1. **`/src/lib/permissions.ts`** - Utilidad de permisos y roles
2. **`/src/middleware.ts`** - Middleware de autenticación
3. **`/src/shared/components/auth/route-guard.tsx`** - Protección de rutas
4. **`/src/shared/components/auth/permission-guard.tsx`** - Protección de componentes

### Uso en Código

#### 1. Proteger una Ruta Completa

```tsx
// En una página
import { RouteGuard } from "@/shared/components/auth/route-guard"

export default async function FarmaciasPage() {
  return (
    <RouteGuard requiredPath="/farmacias">
      {/* Contenido de la página */}
    </RouteGuard>
  )
}
```

#### 2. Proteger un Componente o Acción

```tsx
// En un componente
import { PermissionGuard } from "@/shared/components/auth/permission-guard"

export function DeleteButton({ userRole }: { userRole: string }) {
  return (
    <PermissionGuard
      userRole={userRole}
      permission="canDeleteRecords"
      fallback={<span>No tienes permisos</span>}
    >
      <Button variant="destructive">Eliminar</Button>
    </PermissionGuard>
  )
}
```

#### 3. Verificar Permisos en Server Actions

```tsx
// En un server action
import { hasPermission } from "@/lib/permissions"

export async function deletePharmacy(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!hasPermission(session.user.role, "canDeleteRecords")) {
    return { success: false, error: "No tienes permisos" }
  }

  // Continuar con la eliminación...
}
```

#### 4. Filtrar Rutas en el Sidebar

```tsx
// El sidebar automáticamente filtra las rutas según el rol
import { hasAccessToRoute } from "@/lib/permissions"

const filteredMenuItems = menuItems.filter((item) =>
  hasAccessToRoute(user.role, item.href)
)
```

---

## 🔑 Cuentas de Prueba

### Crear Usuarios de Prueba

```bash
# Ejecutar el script de creación de usuarios
pnpm prisma:seed
```

### Credenciales

```typescript
// Admin
{
  email: "admin@logico.test",
  password: "Admin123!",
  role: "admin"
}

// Operadora
{
  email: "operadora@logico.test",
  password: "User123!",
  role: "operadora"
}

// Supervisor
{
  email: "supervisor@logico.test",
  password: "User123!",
  role: "supervisor"
}

// Gerente (pendiente)
{
  email: "gerente@logico.test",
  password: "User123!",
  role: "gerente"
}
```

---

## 🚀 Flujos de Trabajo por Rol

### Flujo: Operadora

1. Login → Redirige a `/movimientos`
2. Ve lista de movimientos activos
3. Puede crear nuevo movimiento
4. Puede cambiar estado de movimientos
5. Puede registrar incidencias
6. **No ve** opciones de farmacias, motoristas, motos en el sidebar

### Flujo: Supervisor

1. Login → Redirige a `/dashboard`
2. Ve dashboard completo con métricas
3. Puede gestionar farmacias, motoristas, motos
4. Puede aprobar modificaciones de operadoras
5. Puede generar reportes operativos
6. **No ve** opción de usuarios en el sidebar

### Flujo: Gerente

1. Login → Redirige a `/reportes`
2. Ve reportes y estadísticas
3. Puede exportar datos
4. Puede visualizar movimientos (solo lectura)
5. **No puede** modificar ningún registro

---

## 📋 Mejores Prácticas

1. **Siempre verificar permisos en el backend** (server actions)
2. **Usar componentes de protección** para UI condicional
3. **Registrar en auditoría** todas las acciones sensibles
4. **Principio de mínimo privilegio** - dar solo los permisos necesarios
5. **Revisar periódicamente** los permisos asignados

---

## 🔄 Próximas Mejoras

- [ ] Implementar permisos granulares por entidad
- [ ] Agregar roles personalizables
- [ ] Implementar delegación temporal de permisos
- [ ] Agregar logs de acceso por usuario
- [ ] Implementar alertas de acceso no autorizado

---

**Última actualización:** Octubre 2025
