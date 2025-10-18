# 🚀 Guía de Instalación

## 1. Requisitos Previos

### 1.1 Software Requerido

| Software | Versión Mínima | Recomendada | Propósito |
|----------|----------------|-------------|-----------|
| **Node.js** | 18.x | 20.x LTS | Runtime de JavaScript |
| **pnpm** | 8.x | 9.x | Gestor de paquetes |
| **PostgreSQL** | 14.x | 16.x | Base de datos |
| **Git** | 2.30+ | Latest | Control de versiones |

### 1.2 Verificar Instalaciones

```bash
# Node.js
node --version
# Debe mostrar: v20.x.x o superior

# pnpm
pnpm --version
# Debe mostrar: 9.x.x o superior

# PostgreSQL
psql --version
# Debe mostrar: psql (PostgreSQL) 14.x o superior

# Git
git --version
# Debe mostrar: git version 2.30.x o superior
```

### 1.3 Instalar Software Faltante

#### Instalar Node.js (macOS)

```bash
# Usando Homebrew
brew install node@20

# O descargar desde https://nodejs.org/
```

#### Instalar pnpm

```bash
# Usando npm (viene con Node.js)
npm install -g pnpm

# O usando Homebrew
brew install pnpm
```

#### Instalar PostgreSQL (macOS)

```bash
# Usando Homebrew
brew install postgresql@16

# Iniciar servicio
brew services start postgresql@16

# O usar Postgres.app: https://postgresapp.com/
```

---

## 2. Clonar el Repositorio

```bash
# Clonar el proyecto
git clone <repository-url> logico
cd logico

# Verificar rama actual
git branch
# Debe mostrar: * main (o la rama principal)
```

---

## 3. Configuración de Base de Datos

### 3.1 Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql postgres

# En el prompt de PostgreSQL:
CREATE DATABASE logico;
CREATE USER logico_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE logico TO logico_user;

# Salir
\q
```

### 3.2 Alternativa: Usar Vercel Postgres (Recomendado para producción)

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Crear nuevo proyecto
3. Storage → Postgres → Create Database
4. Copiar DATABASE_URL

---

## 4. Configuración de Variables de Entorno

### 4.1 Crear Archivo .env.local

```bash
# Copiar archivo de ejemplo (si existe)
cp .env.example .env.local

# O crear manualmente
touch .env.local
```

### 4.2 Configurar Variables

Editar `.env.local` con el siguiente contenido:

```bash
# Database
DATABASE_URL="postgresql://logico_user:your_secure_password@localhost:5432/logico"

# Better Auth
BETTER_AUTH_SECRET="generate-a-random-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Next.js (opcional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4.3 Generar Secret Key

```bash
# Generar secret aleatorio
openssl rand -base64 32

# O usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Ejemplo de .env.local completo:**

```bash
DATABASE_URL="postgresql://logico_user:SecurePass123@localhost:5432/logico"
BETTER_AUTH_SECRET="Kx9mP3nR7sW2vY5zC8fH4jL6qT1uA0bD3eG6iM9oN2pS5vX8"
BETTER_AUTH_URL="http://localhost:3000"
```

---

## 5. Instalación de Dependencias

```bash
# Instalar todas las dependencias
pnpm install

# Esto instalará:
# - Dependencias de producción (~70 paquetes)
# - Dependencias de desarrollo (~20 paquetes)
# Total: ~90 paquetes
```

### 5.1 Verificar Instalación

```bash
# Ver lista de paquetes instalados
pnpm list --depth=0

# Debería mostrar paquetes principales como:
# - next@15.5.4
# - react@19.1.0
# - prisma@6.17.1
# - better-auth@1.3.27
# - etc.
```

---

## 6. Configuración de Prisma

### 6.1 Generar Cliente Prisma

```bash
pnpm prisma:generate

# Esto genera el cliente tipo-seguro en:
# src/generated/prisma/
```

### 6.2 Ejecutar Migraciones

```bash
# Aplicar migraciones existentes
pnpm migrate:dev

# Esto creará todas las tablas en la BD
```

**Salida esperada:**

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "logico"

✅ Database connection successful
✅ Applied 2 migrations:
  - 20251013021839_init
  - 20251018154742_add_created_by

✔ Generated Prisma Client
```

### 6.3 Verificar Tablas Creadas

```bash
# Abrir Prisma Studio
pnpm prisma:studio

# Navegador se abrirá en: http://localhost:5555
# Podrás ver todas las tablas vacías
```

---

## 7. Poblar Base de Datos (Seeds)

### 7.1 Crear Usuarios de Prueba

```bash
pnpm create:users
```

**Usuarios creados:**

| Email | Password | Rol |
|-------|----------|-----|
| admin@logico.test | Admin123! | admin |
| operadora@logico.test | User123! | operadora |
| gerente@logico.test | User123! | gerente |

### 7.2 Importar Farmacias (Opcional)

Si tienes el archivo Excel con farmacias:

```bash
pnpm import:pharmacies

# Lee: base-data/farmacias.xlsx
# Crea registros de farmacias en BD
```

### 7.3 Importar Motos (Opcional)

Si tienes el archivo Excel con motos:

```bash
pnpm import:motorcycles

# Lee: base-data/permiso-de-circulacion-2023.xlsx
# Crea registros de motos en BD
```

---

## 8. Iniciar Servidor de Desarrollo

### 8.1 Modo Desarrollo

```bash
pnpm dev

# Servidor inicia en: http://localhost:3000
# Hot reload habilitado con Turbopack
```

**Salida esperada:**

```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Turbopack:    enabled

✓ Starting...
✓ Ready in 1.2s
```

### 8.2 Verificar Instalación

Abrir navegador en:

1. **Login**: http://localhost:3000/login
   - Probar con: admin@logico.test / Admin123!

2. **Dashboard**: http://localhost:3000/dashboard
   - Debería redirigir después del login

3. **Farmacias**: http://localhost:3000/farmacias
   - Ver lista (vacía o con datos importados)

---

## 9. Verificación de la Instalación

### 9.1 Checklist de Verificación

- [ ] Node.js instalado (v20+)
- [ ] pnpm instalado (v9+)
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos creada
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] Cliente Prisma generado
- [ ] Migraciones aplicadas
- [ ] Usuarios de prueba creados
- [ ] Servidor de desarrollo corriendo
- [ ] Login funcional

### 9.2 Comandos de Diagnóstico

```bash
# Verificar conexión a BD
pnpm prisma db push --preview-feature

# Ver estado de migraciones
pnpm migrate:dev --create-only

# Verificar build (sin errores TypeScript)
pnpm build

# Linting
pnpm lint
```

---

## 10. Solución de Problemas Comunes

### 10.1 Error: Cannot connect to database

**Problema:**
```
Error: P1001: Can't reach database server at localhost:5432
```

**Soluciones:**

```bash
# 1. Verificar que PostgreSQL está corriendo
brew services list
# Debe mostrar: postgresql@16 started

# 2. Iniciar PostgreSQL si está detenido
brew services start postgresql@16

# 3. Verificar puerto
psql -h localhost -p 5432 -U postgres
```

### 10.2 Error: Prisma Client not generated

**Problema:**
```
Error: @prisma/client did not initialize yet
```

**Solución:**
```bash
# Generar cliente nuevamente
pnpm prisma:generate

# Si persiste, reinstalar
rm -rf node_modules
rm -rf src/generated
pnpm install
pnpm prisma:generate
```

### 10.3 Error: Port 3000 already in use

**Problema:**
```
Error: Port 3000 is already in use
```

**Soluciones:**

```bash
# Opción 1: Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Opción 2: Usar otro puerto
pnpm dev --port 3001
```

### 10.4 Error: Module not found

**Problema:**
```
Error: Cannot find module '@/...'
```

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Verificar tsconfig.json paths
cat tsconfig.json | grep paths
```

### 10.5 Error: EACCES permission denied

**Problema:**
```
Error: EACCES: permission denied
```

**Solución:**
```bash
# Dar permisos al directorio
sudo chown -R $(whoami) ~/.pnpm-store

# O reinstalar pnpm globalmente
npm uninstall -g pnpm
npm install -g pnpm
```

---

## 11. Configuración Avanzada

### 11.1 Variables de Entorno para Producción

```bash
# .env.production
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/logico"
BETTER_AUTH_SECRET="production-secret-key"
BETTER_AUTH_URL="https://logico.example.com"
```

### 11.2 Optimizaciones de Base de Datos

```sql
-- Crear índices adicionales para performance
CREATE INDEX idx_movement_created_status ON movement(createdAt, status);
CREATE INDEX idx_driver_active ON driver(active);
CREATE INDEX idx_pharmacy_region_city ON pharmacy(regionId, cityId);

-- Configurar connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
```

### 11.3 Configurar Prisma para Producción

```javascript
// prisma/schema.prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../src/generated/prisma"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]  // Para Vercel
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 12. Próximos Pasos

Después de completar la instalación:

1. **Familiarízate con el proyecto**
   - Lee la [Guía de Desarrollo](./08-DESARROLLO.md)
   - Explora la [Estructura del Proyecto](./03-ESTRUCTURA.md)

2. **Comienza a desarrollar**
   - Revisa los [Módulos y Funcionalidades](./05-FUNCIONALIDADES.md)
   - Consulta la [API y Endpoints](./09-API.md)

3. **Configura tu IDE**
   - Instalar extensiones recomendadas
   - Configurar ESLint y Prettier

---

## 13. Recursos Adicionales

### 13.1 Documentación Oficial

- [Next.js 15](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [pnpm](https://pnpm.io/)

### 13.2 Comunidad

- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)

---

## Checklist Final

Antes de comenzar el desarrollo, asegúrate de:

- [ ] Todos los comandos de verificación pasan exitosamente
- [ ] Puedes hacer login en la aplicación
- [ ] Prisma Studio muestra las tablas correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Hot reload funciona (cambios se reflejan automáticamente)
- [ ] Puedes crear una farmacia de prueba
- [ ] La documentación es accesible y legible

---

**¡Instalación Completa!** 🎉

Continúa con: **[08-DESARROLLO.md](./08-DESARROLLO.md)** - Guía de Desarrollo
