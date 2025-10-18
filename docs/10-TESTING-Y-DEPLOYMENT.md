# 🧪 Testing y Deployment

## 1. Estrategia de Testing

### 1.1 Pirámide de Testing

```
                    /\
                   /  \
                  / E2E \          ~ 10%
                 /______\
                /        \
               /Integration\       ~ 30%
              /____________\
             /              \
            /  Unit Tests    \    ~ 60%
           /__________________\
```

---

## 2. Unit Testing

### 2.1 Setup con Jest

```bash
# Instalar dependencias
pnpm add -D jest @testing-library/react @testing-library/jest-dom
pnpm add -D @types/jest ts-jest
```

**jest.config.js:**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### 2.2 Test de Utilidades

```typescript
// src/lib/__tests__/utils.test.ts
import { formatRut, validateRut } from '../utils'

describe('RUT utils', () => {
  describe('formatRut', () => {
    it('should format RUT correctly', () => {
      expect(formatRut('123456789')).toBe('12.345.678-9')
      expect(formatRut('12345678K')).toBe('12.345.678-K')
    })
    
    it('should handle empty string', () => {
      expect(formatRut('')).toBe('')
    })
  })
  
  describe('validateRut', () => {
    it('should validate correct RUT', () => {
      expect(validateRut('12.345.678-9')).toBe(true)
    })
    
    it('should reject invalid RUT', () => {
      expect(validateRut('12.345.678-0')).toBe(false)
    })
  })
})
```

### 2.3 Test de Schemas Zod

```typescript
// src/shared/schemas/__tests__/pharmacy.test.ts
import { pharmacySchema } from '../pharmacy'

describe('pharmacySchema', () => {
  it('should validate correct pharmacy data', () => {
    const validData = {
      name: 'Farmacia Test',
      address: 'Av. Principal 123',
      contactPhone: '+56912345678',
      contactEmail: 'test@farmacia.cl',
      contactName: 'Juan Pérez',
      regionId: '123e4567-e89b-12d3-a456-426614174000',
      cityId: '123e4567-e89b-12d3-a456-426614174001'
    }
    
    const result = pharmacySchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
  
  it('should reject invalid email', () => {
    const invalidData = {
      name: 'Farmacia Test',
      contactEmail: 'invalid-email',
      // ...
    }
    
    const result = pharmacySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('contactEmail')
    }
  })
})
```

---

## 3. Integration Testing

### 3.1 Test de Server Actions

```typescript
// src/project/pharmacy/actions/__tests__/create-pharmacy.test.ts
import { createPharmacy } from '../create-pharmacy'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  pharmacy: {
    create: jest.fn(),
    findUnique: jest.fn()
  }
}))

// Mock Auth
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn()
    }
  }
}))

describe('createPharmacy', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should create pharmacy successfully', async () => {
    // Mock authenticated session
    const mockSession = {
      user: { id: '123', role: 'admin' }
    }
    
    require('@/lib/auth').auth.api.getSession.mockResolvedValue(mockSession)
    
    // Mock DB response
    const mockPharmacy = {
      id: 'pharmacy-123',
      name: 'Test Pharmacy',
      address: 'Test Address',
      // ...
    }
    
    ;(prisma.pharmacy.create as jest.Mock).mockResolvedValue(mockPharmacy)
    
    // Execute action
    const result = await createPharmacy({
      name: 'Test Pharmacy',
      address: 'Test Address',
      contactPhone: '+56912345678',
      contactEmail: 'test@test.cl',
      contactName: 'Test',
      regionId: 'region-id',
      cityId: 'city-id'
    })
    
    // Assertions
    expect(result.success).toBe(true)
    expect(result.pharmacy).toEqual(mockPharmacy)
    expect(prisma.pharmacy.create).toHaveBeenCalledTimes(1)
  })
  
  it('should fail without authentication', async () => {
    require('@/lib/auth').auth.api.getSession.mockResolvedValue(null)
    
    const result = await createPharmacy({})
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('No autorizado')
  })
})
```

### 3.2 Test de Componentes React

```typescript
// src/project/pharmacy/components/__tests__/pharmacy-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PharmacyForm } from '../pharmacy-form'

describe('PharmacyForm', () => {
  const mockOnSubmit = jest.fn()
  const mockCities = [
    { id: 'city-1', name: 'Santiago' },
    { id: 'city-2', name: 'Valparaíso' }
  ]
  
  it('should render form fields', () => {
    render(
      <PharmacyForm 
        onSubmit={mockOnSubmit} 
        cities={mockCities} 
      />
    )
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
  })
  
  it('should show validation errors', async () => {
    render(
      <PharmacyForm 
        onSubmit={mockOnSubmit} 
        cities={mockCities} 
      />
    )
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /guardar/i })
    fireEvent.click(submitButton)
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/nombre.*requerido/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
  
  it('should submit valid form', async () => {
    render(
      <PharmacyForm 
        onSubmit={mockOnSubmit} 
        cities={mockCities} 
      />
    )
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Farmacia Test' }
    })
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: 'Av. Test 123' }
    })
    // ... más campos
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })
})
```

---

## 4. E2E Testing con Playwright

### 4.1 Setup

```bash
pnpm add -D @playwright/test
pnpm playwright install
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 4.2 Test de Login

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    // Fill form
    await page.fill('input[name="email"]', 'admin@logico.test')
    await page.fill('input[name="password"]', 'Admin123!')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForURL('/dashboard')
    
    // Verify logged in
    expect(await page.textContent('h1')).toContain('Dashboard')
  })
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'invalid@test.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible()
  })
})
```

### 4.3 Test de CRUD Farmacias

```typescript
// e2e/pharmacies.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Pharmacies CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@logico.test')
    await page.fill('input[name="password"]', 'Admin123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })
  
  test('should create new pharmacy', async ({ page }) => {
    await page.goto('/farmacias')
    await page.click('text=Nueva Farmacia')
    
    // Fill form
    await page.fill('input[name="name"]', 'Farmacia E2E Test')
    await page.fill('input[name="address"]', 'Av. Test 123')
    await page.fill('input[name="contactPhone"]', '+56912345678')
    await page.fill('input[name="contactEmail"]', 'test@test.cl')
    await page.fill('input[name="contactName"]', 'Test User')
    await page.selectOption('select[name="cityId"]', { index: 1 })
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForURL('/farmacias')
    
    // Verify pharmacy appears in list
    await expect(page.locator('text=Farmacia E2E Test')).toBeVisible()
  })
  
  test('should edit pharmacy', async ({ page }) => {
    await page.goto('/farmacias')
    
    // Click first pharmacy
    await page.click('table tbody tr:first-child a')
    
    // Click edit button
    await page.click('text=Editar')
    
    // Change name
    await page.fill('input[name="name"]', 'Farmacia Editada')
    await page.click('button[type="submit"]')
    
    // Verify change
    await expect(page.locator('text=Farmacia Editada')).toBeVisible()
  })
  
  test('should delete pharmacy', async ({ page }) => {
    await page.goto('/farmacias')
    
    // Get first pharmacy name
    const pharmacyName = await page.textContent('table tbody tr:first-child td:first-child')
    
    // Click delete
    await page.click('table tbody tr:first-child button[aria-label="Eliminar"]')
    
    // Confirm dialog
    await page.click('text=Confirmar')
    
    // Verify deleted
    await expect(page.locator(`text=${pharmacyName}`)).not.toBeVisible()
  })
})
```

---

## 5. CI/CD con GitHub Actions

### 5.1 Workflow de Testing

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: logico_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup database
        run: |
          pnpm prisma generate
          pnpm prisma db push
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/logico_test
      
      - name: Run linter
        run: pnpm lint
      
      - name: Run unit tests
        run: pnpm test
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/logico_test
```

---

## 6. Deployment en Vercel

### 6.1 Setup Inicial

1. **Conectar Repositorio:**
   - Ir a [vercel.com](https://vercel.com)
   - New Project → Import Git Repository
   - Seleccionar repositorio

2. **Configurar Build:**
   ```
   Framework Preset: Next.js
   Build Command: pnpm production:build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Variables de Entorno:**
   ```
   DATABASE_URL=postgres://...vercel-postgres-url
   BETTER_AUTH_SECRET=production-secret-key
   BETTER_AUTH_URL=https://tu-dominio.vercel.app
   ```

### 6.2 Vercel Configuration

**vercel.json:**
```json
{
  "buildCommand": "pnpm production:build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "BETTER_AUTH_SECRET": "@better_auth_secret",
    "BETTER_AUTH_URL": "@better_auth_url"
  }
}
```

### 6.3 Database en Vercel

1. **Crear Postgres Database:**
   - Dashboard → Storage → Create Database
   - Seleccionar Postgres
   - Region: Same as deployment

2. **Configurar Conexión:**
   - Copiar `DATABASE_URL` de la configuración
   - Agregar a Environment Variables del proyecto

3. **Ejecutar Migraciones:**
   ```bash
   # Localmente con DATABASE_URL de producción
   DATABASE_URL="tu-url-de-produccion" pnpm prisma migrate deploy
   ```

### 6.4 Workflow de Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 7. Monitoring y Logs

### 7.1 Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 7.2 Error Tracking con Sentry (Opcional)

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 7.3 Logging Estructurado

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  },
  
  error: (message: string, error: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
}
```

---

## 8. Checklist de Pre-Deployment

### 8.1 Seguridad

- [ ] Variables de entorno configuradas
- [ ] Secrets rotados
- [ ] CORS configurado
- [ ] Rate limiting implementado
- [ ] Headers de seguridad configurados
- [ ] HTTPS forzado

### 8.2 Performance

- [ ] Images optimizadas
- [ ] Lazy loading implementado
- [ ] Bundle size verificado
- [ ] Database indices creados
- [ ] Caching configurado

### 8.3 Funcionalidad

- [ ] Todos los tests pasan
- [ ] Migraciones aplicadas
- [ ] Seeds ejecutados
- [ ] Email templates configurados
- [ ] Error handling implementado

### 8.4 Monitoreo

- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Logs estructurados
- [ ] Uptime monitoring

---

## 9. Rollback Strategy

### 9.1 Revertir Deployment

```bash
# Ver deployments
vercel ls

# Revertir a deployment anterior
vercel rollback <deployment-url>
```

### 9.2 Revertir Migración

```bash
# Ver historial
pnpm prisma migrate status

# Revertir última migración (manual)
# Ejecutar SQL de rollback
```

---

## 10. Performance Optimization

### 10.1 Next.js Config

```typescript
// next.config.ts
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}
```

### 10.2 Database Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Connection pool settings en DATABASE_URL
// ?connection_limit=10&pool_timeout=20
```

---

## Resumen

Esta guía cubre:

✅ Testing unitario, integración y E2E
✅ CI/CD con GitHub Actions
✅ Deployment en Vercel
✅ Monitoring y logging
✅ Optimizaciones de performance
✅ Estrategias de rollback

---

**Fin de la Documentación Técnica**

Volver al **[Índice Principal](./00-INDICE.md)**
