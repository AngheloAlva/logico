# 📚 Documentación Completa del Proyecto LogiCo

## Índice de Documentación

Esta documentación está dividida en módulos para facilitar su lectura y mantenimiento:

### 📖 Documentos Principales

1. **[01-INTRODUCCION.md](./docs/01-INTRODUCCION.md)** - Introducción y Contexto del Negocio
   - ¿Qué es LogiCo?
   - Problema que resuelve
   - Proceso de distribución
   - Roles del sistema

2. **[02-ARQUITECTURA.md](./docs/02-ARQUITECTURA.md)** - Arquitectura del Sistema
   - Arquitectura general
   - Stack tecnológico
   - Patrones de diseño
   - Flujo de datos

3. **[03-ESTRUCTURA.md](./docs/03-ESTRUCTURA.md)** - Estructura del Proyecto
   - Estructura de directorios
   - Convenciones de código
   - Organización modular

4. **[04-MODELO-DATOS.md](./docs/04-MODELO-DATOS.md)** - Modelo de Datos
   - Diagrama de entidades
   - Descripción detallada de cada entidad
   - Relaciones entre tablas

5. **[05-FUNCIONALIDADES.md](./docs/05-FUNCIONALIDADES.md)** - Módulos y Funcionalidades
   - Dashboard
   - CRUD de entidades
   - Sistema de movimientos
   - Reportes

6. **[06-AUTENTICACION.md](./docs/06-AUTENTICACION.md)** - Sistema de Autenticación
   - Better Auth
   - Roles y permisos
   - Seguridad

7. **[07-INSTALACION.md](./docs/07-INSTALACION.md)** - Guía de Instalación
   - Requisitos previos
   - Configuración del entorno
   - Instalación paso a paso

8. **[08-DESARROLLO.md](./docs/08-DESARROLLO.md)** - Guía de Desarrollo
   - Scripts disponibles
   - Cómo crear nuevos módulos
   - Mejores prácticas
   - Reglas de negocio

9. **[09-API.md](./docs/09-API.md)** - API y Endpoints
   - Server Actions
   - API Routes
   - Documentación de endpoints

10. **[10-TESTING-Y-DEPLOYMENT.md](./docs/10-TESTING-Y-DEPLOYMENT.md)** - Testing y Deployment
    - Estrategia de testing
    - Configuración de CI/CD
    - Deployment en Vercel

11. **[11-TESTING.md](./docs/11-TESTING.md)** - Tests con Jest
    - 116 tests unitarios implementados
    - Tests para todos los módulos (8 módulos)
    - Schemas, utilidades y server actions
    - Configuración Jest, mocks y ejemplos

12. **[12-ROLES-Y-PERMISOS.md](./docs/12-ROLES-Y-PERMISOS.md)** - Sistema de Roles y Permisos
    - Control de acceso basado en roles (RBAC)
    - 4 roles: Admin, Operadora, Supervisor, Gerente
    - Matriz de permisos detallada
    - Implementación técnica y ejemplos

### 📚 Manuales de Usuario

- **[MANUAL-DE-USUARIO.md](./docs/MANUAL-DE-USUARIO.md)** - Manual General del Sistema
  - Guía completa de todas las funcionalidades
  - Instrucciones paso a paso
  - Capturas de pantalla descriptivas
  - Preguntas frecuentes

- **[GUIA-OPERADORA.md](./docs/GUIA-OPERADORA.md)** - Guía Rápida para Operadoras
  - Flujo de trabajo diario
  - Gestión de movimientos
  - Registro de incidencias
  - Consejos prácticos

- **[GUIA-SUPERVISOR.md](./docs/GUIA-SUPERVISOR.md)** - Guía Rápida para Supervisores
  - Gestión de recursos
  - Supervisión de operaciones
  - Resolución de incidencias
  - Generación de reportes

---

## 🚀 Quick Start

Para empezar rápidamente, sigue estos pasos:

1. Lee la [Introducción](./docs/01-INTRODUCCION.md) para entender el contexto
2. Consulta la [Guía de Instalación](./docs/07-INSTALACION.md) para configurar el proyecto
3. Revisa la [Guía de Desarrollo](./docs/08-DESARROLLO.md) para comenzar a desarrollar

---

## 📊 Estado Actual del Proyecto

**✅ MVP Frontend Completo** - El proyecto está listo para desarrollo backend.

### Implementado

- ✅ Sistema de autenticación completo
- ✅ **Control de acceso por roles** (Admin, Operadora, Supervisor, Gerente)
- ✅ Dashboard con métricas
- ✅ CRUD de Farmacias, Motoristas, Motos
- ✅ Gestión de Movimientos
- ✅ Sistema de Incidencias
- ✅ Gestión de Regiones/Ciudades
- ✅ Administración de Usuarios
- ✅ Módulo de Reportes
- ✅ **Sistema de auditoría** para todas las operaciones
- ✅ Diseño responsive

### En Desarrollo

- 🔄 Implementación de Server Actions
- 🔄 Lógica de negocio backend
- 🔄 Integración completa con Prisma
- 🔄 Testing automatizado

---

## 👥 Roles y Permisos

El sistema implementa un control de acceso basado en roles con 4 tipos de usuarios:

### 🔐 Roles Disponibles

#### **Admin**

- ✅ Acceso completo a todas las funcionalidades
- ✅ Gestión de usuarios, farmacias, motoristas, motos
- ✅ Gestión de movimientos e incidencias
- ✅ Acceso a reportes y auditoría
- 🏠 Ruta de inicio: `/dashboard`

#### **Operadora**

- ✅ Gestión de movimientos (crear, editar, cambiar estado)
- ✅ Registro de incidencias
- ✅ Visualización de dashboard operativo
- ❌ Sin acceso a mantenedores (farmacias, motoristas, motos)
- ❌ Sin acceso a reportes gerenciales
- 🏠 Ruta de inicio: `/movimientos`

#### **Supervisor**

- ✅ Gestión de farmacias, motoristas, motos, regiones
- ✅ Gestión de movimientos e incidencias
- ✅ Aprobación de operaciones
- ✅ Acceso a reportes
- ❌ Sin acceso a gestión de usuarios
- 🏠 Ruta de inicio: `/dashboard`

#### **Gerente**

- ✅ Visualización de reportes y estadísticas
- ✅ Dashboard ejecutivo
- ✅ Exportación de datos
- ❌ Sin acceso a operaciones de modificación
- 🏠 Ruta de inicio: `/reportes`

### 📊 Matriz de Permisos

| Módulo      | Admin | Operadora | Supervisor | Gerente |
| ----------- | ----- | --------- | ---------- | ------- |
| Dashboard   | ✅    | ✅        | ✅         | ✅      |
| Movimientos | ✅    | ✅        | ✅         | 👁️      |
| Farmacias   | ✅    | ❌        | ✅         | ❌      |
| Motoristas  | ✅    | ❌        | ✅         | ❌      |
| Motos       | ✅    | ❌        | ✅         | ❌      |
| Regiones    | ✅    | ❌        | ✅         | ❌      |
| Usuarios    | ✅    | ❌        | ❌         | ❌      |
| Reportes    | ✅    | ❌        | ✅         | ✅      |

**Leyenda:** ✅ Acceso completo | 👁️ Solo lectura | ❌ Sin acceso

### 🔑 Cuentas de Prueba

```bash
# Admin
Email: admin@logico.test
Password: Admin123!

# Operadora
Email: operadora@logico.test
Password: User123!

# Supervisor
Email: supervisor@logico.test
Password: User123!

# Gerente (pendiente de crear)
Email: gerente@logico.test
Password: User123!
```

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Lee la [Guía de Desarrollo](./docs/08-DESARROLLO.md)
2. Familiarízate con el [Modelo de Datos](./docs/04-MODELO-DATOS.md)
3. Sigue las convenciones establecidas en [Estructura del Proyecto](./docs/03-ESTRUCTURA.md)

---

## 📞 Soporte

Si tienes preguntas sobre la documentación:

1. Revisa el documento correspondiente en el índice
2. Consulta el README.md principal del proyecto
3. Contacta al equipo de desarrollo

---

**Última actualización:** Octubre 2025
**Versión:** 0.1.0
