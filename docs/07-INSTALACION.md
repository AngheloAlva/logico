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

### Instalar Node.js (Windows)
```bash
# Descargar desde https://nodejs.org/
# O usar un manejador de versiones de Node como fnm o nvm
```

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
git clone https://github.com/AngheloAlva/logico.git logico
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

### 3.2 Alternativa: Usar Postgres en la nube (Recomendado para producción)

1. Ir a servicios como https://neon.tech o https://supabase.com
2. Crear nuevo proyecto
3. Copiar url de conexión

---

## 4. Configuración de Variables de Entorno

### 4.1 Crear Archivo .env.local

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# O crear manualmente
touch .env.local
```

### 4.2 Configurar Variables

Editar `.env.local` con el siguiente contenido:

```bash
# Base de Datos
DATABASE_URL="postgresql://logico_user:your_secure_password@localhost:5432/logico"

# Better Auth (Autenticación)
BETTER_AUTH_SECRET="clave-secreta-random"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4.3 Generar Secret Key

```bash
# Generar secret aleatorio
openssl rand -base64 32

# O usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 5. Instalación de Dependencias

```bash
# Instalar todas las dependencias
pnpm install
```


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
Datasource "db": PostgreSQL database "db_name", schema "public" at "db_url"

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

---

## 8. Iniciar Servidor de Desarrollo

### 8.1 Modo Desarrollo

```bash
pnpm dev

# Servidor inicia en: http://localhost:3000
```

**Salida esperada:**

```
> logico@0.1.0 dev <url_archivo>/logico
> next dev --turbopack

   ▲ Next.js 15.5.4 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://172.20.10.6:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Compiled middleware in 84ms
 ✓ Ready in 993ms
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

**¡Instalación Completa!** 🎉

Continúa con: **[08-DESARROLLO.md](./08-DESARROLLO.md)** - Guía de Desarrollo
