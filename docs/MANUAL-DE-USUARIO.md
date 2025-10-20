# 📖 Manual de Usuario - LogiCo

## Sistema de Distribución de Pedidos para Farmacias

**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Empresa:** Discopro Ltda.

---

## 📑 Índice

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Dashboard](#4-dashboard)
5. [Gestión de Movimientos](#5-gestión-de-movimientos)
6. [Gestión de Farmacias](#6-gestión-de-farmacias)
7. [Gestión de Motoristas](#7-gestión-de-motoristas)
8. [Gestión de Motos](#8-gestión-de-motos)
9. [Gestión de Regiones](#9-gestión-de-regiones-y-ciudades)
10. [Gestión de Usuarios](#10-gestión-de-usuarios)
11. [Reportes](#11-reportes)
12. [Preguntas Frecuentes](#12-preguntas-frecuentes)

---

## 1. Introducción

### ¿Qué es LogiCo?

LogiCo es un sistema web diseñado para automatizar y optimizar los procesos de distribución de despachos a domicilio para farmacias Cruz Verde.

**Funcionalidades principales:**
- 📦 Gestión de movimientos y despachos
- 🏥 Administración de farmacias
- 🏍️ Control de motoristas y motos
- 📊 Generación de reportes
- ⚠️ Registro de incidencias
- 👥 Gestión de usuarios y permisos

### Objetivos

- ✅ Reducir tiempos de gestión
- ✅ Mejorar trazabilidad de entregas
- ✅ Facilitar toma de decisiones
- ✅ Optimizar asignación de recursos

---

## 2. Acceso al Sistema

### 2.1 Inicio de Sesión

1. Abra su navegador web
2. Ingrese la URL del sistema
3. Complete sus credenciales:
   - Email
   - Contraseña
4. Haga clic en "Iniciar Sesión"

### 2.2 Recuperación de Contraseña

1. Clic en "¿Olvidaste tu contraseña?"
2. Ingrese su email
3. Revise su correo
4. Siga el enlace recibido
5. Ingrese nueva contraseña

### 2.3 Requisitos de Contraseña

- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial

### 2.4 Cerrar Sesión

1. Clic en su avatar (esquina inferior izquierda)
2. Clic en botón de "Cerrar Sesión"

---

## 3. Roles y Permisos

### 3.1 👑 Administrador

**Acceso:** Completo

**Permisos:**
- ✅ Gestionar usuarios
- ✅ Gestionar farmacias, motoristas, motos
- ✅ Gestionar movimientos e incidencias
- ✅ Ver reportes
- ✅ Eliminar registros

**Menú visible:** Todos los módulos

---

### 3.2 👩‍💼 Operadora

**Acceso:** Operativo

**Permisos:**
- ✅ Crear y editar movimientos
- ✅ Cambiar estado de movimientos
- ✅ Registrar incidencias
- ❌ No gestiona farmacias/motoristas/motos

**Menú visible:** Dashboard, Movimientos

**Flujo típico:**
1. Recibe solicitud de despacho
2. Crea movimiento
3. Asigna recursos
4. Hace seguimiento
5. Registra incidencias

---

### 3.3 👨‍💼 Supervisor

**Acceso:** Gestión y supervisión

**Permisos:**
- ✅ Gestionar farmacias, motoristas, motos
- ✅ Gestionar movimientos
- ✅ Aprobar modificaciones
- ✅ Ver reportes
- ❌ No gestiona usuarios

**Menú visible:** Dashboard, Movimientos, Farmacias, Motoristas, Motos, Regiones, Reportes

---

### 3.4 📊 Gerente

**Acceso:** Solo lectura y reportes

**Permisos:**
- ✅ Ver dashboard ejecutivo
- ✅ Ver reportes
- ✅ Exportar datos
- ❌ No modifica registros

**Menú visible:** Dashboard, Reportes

---

## 4. Dashboard

### 4.1 Tarjetas de Métricas

**Entregas Hoy**
- Total de entregas completadas hoy
- Indicador de cumplimiento de objetivo

**En Tránsito**
- Movimientos actualmente en proceso
- Actualización en tiempo real

**Pendientes**
- Movimientos sin asignar
- Requieren atención

**Incidencias**
- Incidencias activas
- Alertas críticas

### 4.2 Movimientos Recientes

- Lista de últimos 10 movimientos
- Información resumida
- Acceso rápido a detalles

### 4.3 Gráficos

- Tendencia de entregas (7 días)
- Estadísticas de desempeño
- Métricas por motorista/farmacia

---

## 5. Gestión de Movimientos

### 5.1 Acceder

Menú lateral → "Movimientos"

### 5.2 Lista de Movimientos

**Columnas:**
- Número de movimiento
- Farmacia
- Motorista
- Estado
- Acciones (Ver, Editar, Eliminar)

**Filtros:**
- Por estado
- Por farmacia
- Por motorista
- Por fecha
- Por número

### 5.3 Crear Nuevo Movimiento

**Pasos:**
1. Clic en "+ Nuevo"
2. Complete formulario:
   - **Número** (mínimo 10 caracteres) *
   - **Farmacia** *
   - **Motorista** *
   - **Dirección** *
   - Número de segmentos
   - Costo por segmento
   - Direcciones adicionales
   - ☐ Tiene receta
   - Fecha de salida
   - Observaciones
3. Clic en "Guardar"

**Validaciones:**
- Número único
- Motorista activo
- Farmacia registrada

### 5.4 Estados de Movimiento

1. 🟡 **PENDIENTE** - Creado, esperando asignación
2. 🔵 **EN_TRÁNSITO** - Motorista en camino
3. 🟢 **ENTREGADO** - Completado
4. 🔴 **INCIDENTE** - Problema durante entrega

**Flujo típico:**
```
PENDIENTE → EN_TRÁNSITO → ENTREGADO
                ↓
            INCIDENTE → EN_TRÁNSITO
```

### 5.5 Cambiar Estado

1. Abrir detalles del movimiento
2. Clic en "Cambiar Estado"
3. Seleccionar nuevo estado
4. Confirmar

### 5.6 Registrar Incidencia

1. En detalles, clic "+ Registrar Incidencia"
2. Seleccionar tipo:
   - Dirección errónea
   - Cliente no encontrado
   - Reintento necesario
   - Cobro rechazado
   - Otro
3. Descripción detallada
4. Fecha y hora
5. Clic en "Registrar"

### 5.7 Ver Detalles

Clic en 👁 para ver:
- Información completa
- Historial de estados
- Incidencias registradas
- Datos de farmacia y motorista

### 5.8 Editar Movimiento

**Permisos:** Admin, Supervisor, Operadora

**Campos editables:**
- Dirección
- Segmentos y costos
- Observaciones
- Motorista (solo si PENDIENTE)

**No editables:**
- Número
- Farmacia
- Fechas automáticas

### 5.9 Eliminar Movimiento

**Permisos:** Solo Admin

**Restricciones:**
- Solo movimientos PENDIENTES
- Sin incidencias registradas

---

## 6. Gestión de Farmacias

**Permisos requeridos:** Admin, Supervisor

### 6.1 Acceder

Menú lateral → "Farmacias"

### 6.2 Crear Farmacia

1. Clic en "+ Nueva"
2. Complete:
   - **Nombre** *
   - **Dirección** *
   - **Región** *
   - **Ciudad** *
   - **Nombre de contacto** *
   - **Teléfono** *
   - **Email** *
3. Guardar

### 6.3 Editar Farmacia

1. Clic en ✏
2. Modificar campos
3. Guardar cambios

### 6.4 Ver Detalles

- Información completa
- Historial de movimientos
- Estadísticas

### 6.5 Eliminar

**Restricción:** No se puede eliminar si tiene movimientos activos

---

## 7. Gestión de Motoristas

**Permisos requeridos:** Admin, Supervisor

### 7.1 Crear Motorista

**Campos obligatorios:**
- Nombre completo
- RUT (formato: 12345678-9)
- Email
- Teléfono
- Dirección
- Región
- Ciudad

**Campos opcionales:**
- Licencia de conducir (archivo PDF/imagen)

### 7.2 Estados

- 🟢 **Activo:** Disponible para asignaciones
- 🔴 **Inactivo:** No disponible

### 7.3 Cambiar Estado

1. Abrir detalles del motorista
2. Clic en "Cambiar Estado"
3. Confirmar

### 7.4 Asignar Moto

1. En detalles del motorista
2. Sección "Moto Asignada"
3. Seleccionar moto disponible
4. Guardar

---

## 8. Gestión de Motos

**Permisos requeridos:** Admin, Supervisor

### 8.1 Crear Moto

**Campos obligatorios:**
- Marca
- Modelo
- Patente (única)
- Clase
- Color
- Cilindrada
- Año
- Kilometraje

**Campos opcionales:**
- Imagen de la moto

### 8.2 Asignar a Motorista

1. Abrir detalles de la moto
2. Clic en "Asignar Motorista"
3. Seleccionar motorista
4. Confirmar

### 8.3 Desasignar

1. En detalles de la moto
2. Clic en "Desasignar"
3. Confirmar

---

## 9. Gestión de Regiones y Ciudades

**Permisos requeridos:** Admin, Supervisor

### 9.1 Crear Región

1. Menú → "Regiones"
2. Clic en "+ Nueva Región"
3. Ingresar nombre
4. Guardar

### 9.2 Crear Ciudad

1. Seleccionar región
2. Clic en "+ Nueva Ciudad"
3. Ingresar nombre
4. Guardar

### 9.3 Editar/Eliminar

- Clic en ✏ para editar
- Clic en 🗑 para eliminar
- **Restricción:** No se puede eliminar si tiene farmacias o motoristas asociados

---

## 10. Gestión de Usuarios

**Permisos requeridos:** Solo Admin

### 10.1 Crear Usuario

1. Menú → "Usuarios"
2. Clic en "+ Nuevo"
3. Complete:
   - Nombre completo
   - Email
   - Contraseña temporal
   - Rol (Admin/Operadora/Supervisor/Gerente)
4. Guardar

### 10.2 Roles Disponibles

- **Admin:** Acceso completo
- **Operadora:** Solo movimientos
- **Supervisor:** Gestión operativa
- **Gerente:** Solo reportes

### 10.3 Editar Usuario

- Cambiar nombre
- Cambiar email
- Cambiar rol
- Restablecer contraseña

### 10.4 Desactivar Usuario

1. Abrir detalles
2. Clic en "Desactivar"
3. Confirmar

---

## 11. Reportes

**Permisos requeridos:** Admin, Supervisor, Gerente

### 11.1 Tipos de Reportes

**Reporte Diario**
- Movimientos del día
- Estados de entregas
- Incidencias
- Exportar a CSV/PDF

**Reporte por Farmacia**
- Filtrar por farmacia
- Rango de fechas
- Estadísticas de desempeño

**Reporte por Motorista**
- Entregas realizadas
- Tiempo promedio
- Incidencias

**Estadísticas Generales**
- Métricas de desempeño
- Tendencias
- Gráficos comparativos

### 11.2 Generar Reporte

1. Menú → "Reportes"
2. Seleccionar tipo
3. Configurar filtros:
   - Fecha inicio
   - Fecha fin
   - Farmacia (opcional)
   - Motorista (opcional)
4. Clic en "Generar"

### 11.3 Exportar

- **CSV:** Para análisis en Excel
- **PDF:** Para impresión/archivo

---

## 12. Preguntas Frecuentes

### ¿Qué hago si olvido mi contraseña?

Use la opción "¿Olvidaste tu contraseña?" en la pantalla de login.

### ¿Puedo cambiar mi contraseña?

Sí, en su perfil de usuario.

### ¿Por qué no veo ciertos módulos?

Depende de su rol. Consulte la sección de Roles y Permisos.

### ¿Cómo registro una incidencia?

Desde los detalles de un movimiento, use "+ Registrar Incidencia".

### ¿Puedo eliminar un movimiento?

Solo Admin puede eliminar, y solo si está en estado PENDIENTE.

### ¿Cómo asigno una moto a un motorista?

Desde el módulo de Motos o desde los detalles del Motorista.

### ¿Los reportes se actualizan en tiempo real?

Los reportes muestran datos hasta el momento de generarlos.

### ¿Qué navegadores son compatibles?

Chrome, Firefox, Safari, Edge (versiones recientes).

### ¿Puedo acceder desde móvil?

Sí, el sistema es responsive y funciona en dispositivos móviles.

### ¿Quién puede ver los logs de auditoría?

Solo Admin y Supervisor tienen acceso completo.

---

## 📞 Soporte Técnico

**Email:** soporte@logico.app  
**Teléfono:** +56 2 XXXX XXXX  
**Horario:** Lunes a Viernes, 9:00 - 18:00

---

**Última actualización:** Octubre 2025  
**Versión del manual:** 1.0.0
