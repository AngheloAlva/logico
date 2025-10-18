# LogiCo — Sistema de Distribución de Pedidos

> Sistema web completo para automatizar los procesos de distribución de despachos a domicilio para farmacias Cruz Verde, desarrollado por Discopro Ltda.

## 📚 Documentación Completa

**¡Nueva documentación detallada disponible!** Para una guía completa del proyecto, consulta:

### 🚀 Quick Start
- **[Guía Rápida](./docs/GUIA-RAPIDA.md)** - Comandos esenciales y referencia rápida
- **[Instalación](./docs/07-INSTALACION.md)** - Guía paso a paso para configurar el proyecto

### 📖 Documentación Detallada
- **[Índice General](./docs/00-INDICE.md)** - Navegación completa de la documentación
- **[Introducción](./docs/01-INTRODUCCION.md)** - Contexto del negocio y problema que resuelve
- **[Arquitectura](./docs/02-ARQUITECTURA.md)** - Stack tecnológico y patrones de diseño
- **[Estructura](./docs/03-ESTRUCTURA.md)** - Organización del código y convenciones
- **[Modelo de Datos](./docs/04-MODELO-DATOS.md)** - Base de datos y relaciones
- **[Desarrollo](./docs/08-DESARROLLO.md)** - Guía para desarrolladores

---

## 🎉 Estado del Proyecto: MVP Frontend Completo

El proyecto está **listo para desarrollo backend**. Toda la interfaz de usuario ha sido implementada con las siguientes características:

### ✅ Implementado
- 🎨 **UI/UX Completa** con tema verde Cruz Verde
- 🔐 **Sistema de autenticación** (Login, Recuperación de contraseña)
- 📊 **Dashboard interactivo** con métricas y estadísticas
- 🏥 **CRUD de Farmacias** con búsqueda y filtros
- 🏍️ **CRUD de Motoristas** con gestión de licencias
- 🏍️ **CRUD de Motos** con asignación a motoristas
- 📦 **Gestión de Movimientos** con seguimiento de estados
- ⚠️ **Sistema de Incidencias** para reportar problemas
- 📍 **Gestión de Regiones y Ciudades**
- 👥 **Administración de Usuarios** con roles
- 📈 **Módulo de Reportes** con exportación
- 🎨 **Diseño responsive** y moderno
- 🌱 **Seeds de datos** para pruebas

### 📋 Próximos Pasos
Consulta [`NEXT_STEPS.md`](./NEXT_STEPS.md) para la implementación de **Server Actions** y lógica de negocio.

---

# 📖 Documento Técnico Original

> Documento técnico y operativo que describe **todo lo necesario** para construir la primera versión funcional (MVP) de la plataforma _LogiCo_ (sistema de distribución de pedidos de farmacias).
>
> Incluye: alcance, tecnologías, arquitectura, entidades, endpoints, wireframes funcionales, tareas por etapa, criterios de aceptación, seeds, pruebas, despliegue y checklist entregable.

---

## 1. Resumen ejecutivo

**Objetivo MVP:** Aplicación web que automatiza la distribución de pedidos a domicilio para farmacias. Funcionalidades mínimas: registro y CRUD de farmacias, motoristas y motos; registro de movimientos/despachos; incidencias; autenticación y roles; reportes básicos; despliegue en Vercel.

**Alcance (MVP):**

- Usuarios: Administrador, Operadora, Gerente.
- Mantenedores: Farmacias, Motoristas, Motos, Usuarios.
- Transacciones: Movimientos/Despachos y Incidencias.
- Reportes: Reporte diario por farmacia (CSV/PDF básico) y métricas simples.

**Duración estimada:** 6 semanas (960 HH, equipo de 4: JP + 3 devs).

---

## 2. Tecnologías recomendadas (stack)

**Frontend**

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- shadcn/ui (componentes)
- Zustand (estado global)
- React Hook Form + Zod
- Lucide-react (iconos)

**Backend**

- Server actions + API routes (Next.js)
- Prisma + PostgreSQL
- Better-auth (Auth)

---

## 3. Estructura del repo y carpetas

```
/logico
├─ src/
│  ├─ app/                # Next.js frontend
│  └─ api/                # NestJS backend
├─ shared/
|  └─ components/
|     |- hooks/           # hooks compartidos
|     |- utils/           # utils compartidos
│     └─ ui/              # componentes compartidos (shadcn)
├─ project/
│  |─ users/              # Carpeta de usuarios
│     |─ actions/         # Server actions
│     |─ components/      # componentes
│        |─ data/         # componentes data
│        |─ ui/           # componentes ui
│        └─ forms/        # componentes forms
│     |─ store/           # store
│     |─ hooks/           # hooks
│     |─ utils/           # utils
│     |─ types/           # types
│     |─ schemas/         # schemas para validaciones
│     └─ columns/         # columns para tablas
│  └─ farmacias/          # Carpeta de farmacias
├─ prisma/                # esquema y seeds
├─ scripts/               # seeds, migrations helpers
├─ .env.example           # archivo de variables de entorno (ejemplo)
├─ .env.local             # archivo de variables de entorno local
├─ package.json           # archivo de paquetes
└─ README.md              # archivo de documentación
```

---

## 4. Entidades y esquema de base de datos (modelo lógico)

> Versión simplificada (usar migrations para crear tablas). Identificadores en `UUID`.

### Tablas principales

**usuario**

- id: uuid PK
- name: string
- email: string
- emailVerified: boolean
- image: string?
- createdAt: datetime
- updatedAt: datetime
- role: string?
- banned: boolean
- banReason: string?
- banExpires: datetime?
- twoFactorEnabled: boolean?

**session**

- id: uuid PK
- expiresAt: datetime
- token: string
- createdAt: datetime
- updatedAt: datetime
- ipAddress: string?
- userAgent: string?
- userId: uuid
- user: usuario @relation(fields: [userId], references: [id], onDelete: Cascade)
- impersonatedBy: string?

**account**

- id: uuid PK
- accountId: string
- providerId: string
- userId: uuid
- user: usuario @relation(fields: [userId], references: [id], onDelete: Cascade)
- accessToken: string?
- refreshToken: string?
- idToken: string?
- accessTokenExpiresAt: datetime?
- refreshTokenExpiresAt: datetime?
- scope: string?
- password: string?
- createdAt: datetime
- updatedAt: datetime

**verification**

- id: uuid PK
- identifier: string
- value: string
- expiresAt: datetime
- createdAt: datetime
- updatedAt: datetime

**twoFactor**

- id: uuid PK
- secret: string
- backupCodes: string
- userId: uuid
- user: usuario @relation(fields: [userId], references: [id], onDelete: Cascade)

**pharmacy**

- id: uuid PK
- name: string
- address: string
- contactPhone: string
- contactEmail: string
- contactName: string
- regionId: uuid FK
- cityId: uuid FK
- createdAt: datetime
- updatedAt: datetime
- drivers: driver[]
- auditLogs: auditLog[]

**region**

- id: uuid PK
- name: string
- createdAt: datetime
- updatedAt: datetime
- cities: city[]

**city**

- id: uuid PK
- name: string
- regionId: uuid FK
- createdAt: datetime
- updatedAt: datetime

**driver**

- id: uuid PK
- name: string
- rut: string (unique)
- email: string
- phone: string
- licenseUrl: string (nullable)
- active: boolean
- createdAt: datetime
- updatedAt: datetime
- regionId: uuid FK nullable
- cityId: uuid FK nullable
- address: string?
- bike: motorbike?
- auditLogs: auditLog[]

**motorbike**

- id: uuid PK
- brand: string
- class: string
- model: string
- plate: string (unique)
- color: string
- cylinders: int
- year: int
- mileage: int
- image: string?
- driverId: uuid FK nullable
- createdAt: datetime
- updatedAt: datetime
- movements: movement[]
- auditLogs: auditLog[]

**movement**

- id: uuid PK
- number: string unique (>=10 chars según reglas negocio)
- pharmacyId: uuid FK
- driverId: uuid FK
- address: string
- departureDate: timestamptz nullable
- deliveryDate: timestamptz nullable
- status: enum('PENDING','IN_TRANSIT','DELIVERED','INCIDENT')
- segments: int nullable
- segmentCost: numeric nullable
- segmentsAddress: string[] nullable
- createdAt: datetime
- updatedAt: datetime
- incidents: incident[]
- auditLogs: auditLog[]

**incident**

- id: uuid PK
- movementId: uuid FK
- type: enum('direccion_erronea', 'cliente_no_encontrado', 'reintento', 'cobro_rechazado', 'otro')
- description: text
- date: timestamptz
- createdByUserId: uuid
- createdAt: datetime
- updatedAt: datetime
- auditLogs: auditLog[]

**auditLog**

- id: uuid PK
- entity: string
- entityId: uuid
- action: string
- userId: uuid
- timestamp: timestamptz
- previousData: jsonb
- newData: jsonb

---

## 5. Endpoints REST API (resumen)

_Todas las rutas pueden ser Server Actions para mejor manejo del tipado - Todas las rutas/server actions requieren autenticación_

> Prefijo: `/api/v1`

**Auth**

- POST `/auth/login` → body `{email, password}` → JWT
- POST `/auth/forgot` → request reset (email)
- POST `/auth/reset` → reset password token

**Usuarios** (Admin only for management)

- GET `/users` (list, paginado)
- POST `/users` (crear)
- GET `/users/:id` (detalle)
- PUT `/users/:id` (editar)
- DELETE `/users/:id` (baja)

**Farmacias**

- GET `/farmacias`
- POST `/farmacias`
- GET `/farmacias/:id`
- PUT `/farmacias/:id`
- DELETE `/farmacias/:id`

**Motoristas**

- GET `/motoristas`
- POST `/motoristas` (multipart para licencia)
- GET `/motoristas/:id`
- PUT `/motoristas/:id`
- DELETE `/motoristas/:id`

**Motos**

- GET `/motos`
- POST `/motos`
- GET `/motos/:id`
- PUT `/motos/:id`
- DELETE `/motos/:id`

**Movimientos**

- GET `/movimientos` (filtros: fecha, farmacia, estado)
- POST `/movimientos` (crear despacho)
- GET `/movimientos/:id`
- PUT `/movimientos/:id` (actualizar estado)
- POST `/movimientos/:id/incidencias` (crear incidencia)

**Reportes**

- GET `/reportes/dia?fecha=YYYY-MM-DD&farmaciaId=` → CSV/JSON
- GET `/reportes/estadisticas` → metrics (avg time, total entregas)

---

## 6. Reglas de negocio críticas (extraídas de Modelo de Negocios)

- `numero_despacho` debe tener >= 10 caracteres.
- Traspasos y reenvíos no tienen código propio; deben relacionarse a un `movimiento` padre.
- No almacenar datos personales: guardar sólo lo mínimo necesario (dirección parcial si aplica). **Documentar** cómo se anonimizan datos.
- Cada operación debe registrar hora de inicio mínimo.
- Operaciones del día deben exportarse al final del turno.
- Sólo Admin / Supervisor pueden modificar pedidos/traspasos/reenvíos; operadores requieren aprobación.
- Indicar si existe receta asociada (boolean en movimiento o flag `tiene_receta`).
- Registrar observaciones de excepción en `incidencia`.

---

## 7. UI: rutas y componentes (detalle)

**Páginas principales**

- `/login`
- `/dashboard` — panel resumen (cards: entregas hoy, incidencias)
- `/farmacias` — lista, filtro, botón nuevo
- `/farmacias/new`
- `/farmacias/[id]` — detalle + editar
- `/motoristas`, `/motos`, `/usuarios` — CRUDs
- `/movimientos` — listado con filtros y botón "Nuevo movimiento"
- `/movimientos/new` — formulario creación (farmacia select, motorista select, direcciones múltiples opcionales)
- `/movimientos/[id]` — detalle y crear incidencia
- `/reportes` — vista para seleccionar fecha y farmacia; exportar CSV/PDF

**Componentes**

- `Layout` (Sidebar + Header)
- `Table` genérico (Tanstack table)
- `Form` + validación (React Hook Form + Zod)
- `FileUploader` (licencia motorista)
- `Chart` simple para métricas (chart.js)

**Accesos por rol**

- Admin: acceso completo a todos los CRUDs
- Operadora: crear/editar movimientos; registrar incidencias
- Gerente: ver reportes y dashboard

---

## 8. Seeds y cuentas de prueba

Crea seeds para facilitar pruebas:

- Admin: `admin@logico.test` / `Admin123!`
- Operadora: `operadora@logico.test` / `User123!`
- Gerente: `gerente@logico.test` / `User123!`

Crear 3 farmacias ejemplo, 5 motoristas, 3 motos asignadas, 15 movimientos con distintos estados e incidencias.

## 9. Pruebas (plan mínimo)

**Test unitarios** (jest)

- Test unitarios para servicios y helpers
- Test unitarios para componentes

**Test de integración** (jest + supertest)

- Test de integración para endpoints
- Test de integración para servicios

**Caja negra (5 pruebas sugeridas)**

1. Crear farmacia nueva → verificar en lista y en BD.
2. Crear motorista con licencia (archivo) → verificar subida y asociación con moto.
3. Crear movimiento y cambiar estado a `ENTREGADO` → verificar timestamps.
4. Registrar incidencia `cliente_no_encontrado` → asegurar vínculo con movimiento.
5. Generar reporte diario → validar números y export CSV.

**Pruebas de rendimiento**

- Generar 1000 movimientos en BD (seed) y medir tiempos de listado con paginación.
- Prueba de carga ligera en endpoint `/movimientos` con 50 concurrentes.

**Pruebas de seguridad**

- Revisar endpoints sin token → asegurar 401.
- Revisar roles para endpoints restringidos.

---

## 10. Seguridad y políticas mínimas (resumen)

- Validación de inputs en backend (DTOs + class-validator / Zod).
- Sanitización de datos y protección contra SQL Injection.
- Logs de auditoría para cambios críticos.
- Política de contraseñas fuertes.
- Control de acceso por roles.

---

## 11. Criterios de aceptación por módulo

- **Auth:** login devuelve JWT y roles funcionan (3 cuentas de seed).
- **Mantenedores:** CRUD completos con validaciones y pruebas manuales.
- **Movimientos:** creo, edito estado, puedo registrar incidencias vinculadas.
- **Reportes:** puedo generar CSV con métricas correctas.
- **UI:** responsive, sin errores JS, navegación clara.

---

**Fin del documento.**

_Nota:_ Este documento está pensado para servir como una **hoja de ruta exhaustiva** para la construcción del MVP.

## Mas informacion del proyecto

1. Introducción
   Hoy en día las empresas que trabajan con el objetivo de hacer llegar productos a
   los consumidores presentan problemas asociados a la gestión del reparto o
   también llamado procesos de distribución de pedidos, lo cual consiste en hacer
   llegar físicamente el producto al cliente. En la que algunas empresas no tienen
   normalizadas sus actividades que realizan desde la captura del pedido del cliente
   hasta el origen al punto de consumo.
   Este proyecto se enfoca en presentar una alternativa de solución en los procesos
   de distribución de despachos a domicilio para la empresa Discopro Ltda., cuyas
   actividades son prestar servicios a farmacias Cruz Verde para el despacho de
   productos farmacéuticos y de salud a domicilio por medio de motoristas.
   Discopro Ltda. es una empresa que solo usa plantillas Excel como medio de
   administración y gestión de datos. No posee un control sobre la información en el
   marco de los servicios de distribución de pedidos a domicilio, lo que tiene como
   consecuencia una pérdida de tiempo al momento de gestionar los datos.
   La presente tesis elabora un análisis en el área de distribución para detectar los
   problemas y automatizar, a través del desarrollo de una aplicación Web, los
   procesos de distribución que facilitan el acceso a la información y reportes de
   actividad para tener mayor capacidad empresarial en todos los niveles del ciclo de
   vida de pedidos y distribución.

   1.1 Sistema WEB
   Ante las exigencias del mundo de hoy, existe una necesidad constante de aplicar
   tecnologías de información a los procesos de las organizaciones en general. El
   área de las distribuciones o despachos a domicilios no está exenta de esto, existe
   una gran cantidad de empresas que requieren contar con excelente soporte de
   sistemas de información que permitan que la administración, el control y la gestión
   estén a un nivel de mejoramiento de sus procesos, ya que si es bien gestionado el
   ciclo de la gestión de pedidos puede llegar a ser relevante para el futuro
   crecimiento de la empresa.
   En la actualidad, la empresa Discopro Ltda., realiza gran parte de sus actividades
   de forma manual, de esta forma se produce una dificultad al momento de realizar
   una búsqueda de información, dado que esta se encuentra archivada en carpetas
   o en plantillas Excel, siendo este el motivo por el cual se pierde tiempo al
   momento de tener acceso a la información.
   De acuerdo a lo anterior, se desarrolla un proyecto para automatizar y mejorar el
   proceso de gestión y distribución de pedidos a domicilio según las actividades
   realizadas por Discopro Ltda. La administración comprende el manejo de la
   información en el área de gestión de logística, reporte de las actividades, reportes
   estadísticos según criterios y estados de entrega del producto en pedido. Lo que
   ofrece oportunidades para mejorar las operaciones y crear nuevas ventajas
   competitivas en la organización.
   .
   1.3 Objetivos
   1.3.1 Objetivo General
   Desarrollar una aplicación web, capaz de automatizar los procesos de distribución
   de despachos a domicilio de la empresa Discopro Ltda., esto con el objetivo de
   mejorar tanto la atención al cliente, como los tiempos de entrega y los procesos de
   flujo de información. El software mencionado debe ser capaz de entregar informes
   que permitan asistir a la toma de decisiones por parte del equipo de gerencia.
   2.2.1 Descripción General
   El contexto actual de la problemática de distribución de despachos a domicilio
   entre el cliente, la farmacia y la empresa externa, se ilustra en la Figura N° II.1
   Figura N° II.1: Proceso General entre: Cliente, Farmacia y Empresa
   La secuencia de pasos descrita en la Figura Nº II.1 se describe a continuación:
   Proceso General:
    El cliente realiza la compra y la solicita para ser despachada a su domicilio,
   indicando dirección, teléfono y datos personales.
    La Farmacia Central obtiene el pedido y los datos del despacho y los emite
   a una de muchas farmacias, basado en un sistema predefinido de
   jurisdicción de cada local con capacidades de despachar pedidos.
    El local de despacho recibe la orden y confecciona el pedido. El local le
   entrega al motorista el pedido e indica los datos del despacho.
    El motorista informa a Control de despachos acerca del despacho y sus
   datos de entrega y se dirige a la dirección del Cliente.
    El motorista entrega su pedido al Cliente.
    El motorista informa a Control de despachos que el pedido fue entregado
   exitosamente.
    La central de control de despacho analiza el trabajo efectuado por locales y
   emite reportes diarios para posteriormente ser entregados a la farmacia
   central.
   Condiciones y Excepciones del Despacho a Domicilio vía Telefónica:
    El cliente puede realizar la compra tanto por internet o por medio de
   contacto telefónico.
    El local de despacho podría no tener el o los productos solicitados y tendría
   que instruir al motorista a que los obtenga en otro local previo a visitar al
   Cliente.
    Otro local puede requerir un producto que se encuentre en un local de
   despacho y solicitar que le sea enviado en la próxima ruta del motorista.
   Por lo tanto el motorista tendría que realizar esa visita durante la visita al
   cliente.
    Puede que el cliente, por diversos
   motivos, no se encuentre en la ubicación indicada y el despacho tenga que
   ser anulado o reenviado posteriormente.
    Se pueden realizar varias visitas en una sola ruta.
    En el caso de que los medicamentos del cliente estén sujetos a receta
   médica retenida, implica que el motorista tiene el deber de realizar una
   visita con la finalidad de retirar la receta previa a la visita de entrega.
    Puede que el método de pago sea en efectivo por lo que el motorista debe
   salir con la boleta correspondiente, la bitácora de despacho, el pedido y el
   cambio o máquina de pago POS.

Dentro del marco del proyecto existen pocas reglas de negocio, sin embargo las pocas reglas existentes son de carácter indispensable para la correcta operación del servicio. Estas reglas son:
• Dentro de lo que corresponde a los pedidos, el código único de estos no deben ser inferiores a 10 caracteres.
• El traspaso y los reenvíos no poseen un código y son parte de un proceso de pedido.
• Cada traspaso o reenvió debe estar enlazado a un pedido.
• Los datos de carácter personal del cliente, no deben ser almacenados.
• Cada operación debe tener registrada al menos la hora de su inicio.
• Las operaciones del día deben ser enviadas a la central de farmacia al final de cada turno.
• Los correos entre la farmacia o central de farmacia y la central de pedidos son de carácter confidencial.
• Modificación de Pedidos, Reenvíos y Traspasos los puede realizar solo el administrador y /o supervidor. El operador puede realizar modificaciones con la aprobación del supervisor
• Los pedidos pueden ser ingresados con posterioridad a la fecha de realización.
• Se debe indicar si un pedido posee una receta asociada.
• Se deben registrar en forma de observaciones cualquier excepción que se genere en el transcurso de proceso de distribución a domicilio.
