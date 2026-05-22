# Guía de Instalación - AdManager Pro

Este documento explica paso a paso cómo configurar y ejecutar el proyecto en una computadora nueva después de clonar el repositorio.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu computadora:

| Software | Versión recomendada | Descarga |
|----------|---------------------|----------|
| **Node.js** | 18.x o superior | https://nodejs.org |
| **PostgreSQL** | 14.x o superior | https://www.postgresql.org/download/ |
| **Git** | Cualquier versión reciente | https://git-scm.com/downloads |
| **Editor de código** | VS Code recomendado | https://code.visualstudio.com/ |

> **Nota:** Durante la instalación de PostgreSQL, anota el **usuario**, **contraseña** y **puerto** que configures. Los necesitarás más adelante.

---

## 1. Clonar el Repositorio

Abre una terminal (PowerShell, CMD o Git Bash) y ejecuta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-publicidad
```

> Reemplaza `<URL_DEL_REPOSITORIO>` con el enlace de tu repositorio de Git.


### 2.2 Crear el archivo de entorno del backend

Desde la carpeta raíz del proyecto (`proyecto-publicidad/`), entra al backend:

```bash
cd backend
```

Crea un archivo llamado **`.env`** y pega esto (modifica con tus datos de PostgreSQL):




---

## 3. Configurar y Encender el Backend

> **Ubicación:** Debes estar dentro de la carpeta `backend/`

### 3.1 Instalar dependencias

```bash
npm install
```

### 3.2 Generar el cliente de Prisma

```bash
npx prisma generate
```

### 3.3 Crear las tablas en la base de datos

Hay dos formas de hacerlo:

#### Opción A: `prisma migrate dev` (recomendada para producción)
Crea archivos de migración versionados. Es interactivo, así que solo funciona en una terminal interactiva:

```bash
npx prisma migrate dev --name init
```

#### Opción B: `prisma db push` (para desarrollo rápido)
Sincroniza el esquema directamente sin crear archivos de migración. Úsalo si la Opción A falla por ser "non-interactive":

```bash
npx prisma db push
```

> Ambas opciones crean las tablas automáticamente según el archivo `schema.prisma`.

### 3.4 Insertar datos de prueba (opcional pero recomendado)

```bash
npx prisma db seed
```

> Este comando inserta un usuario administrador y datos de ejemplo para probar.

### 3.5 Encender el servidor backend

```bash
node server.js
```

Deberías ver en la terminal:

```
==============================================
Servidor corriendo en http://localhost:3000
==============================================
```

> **Deja esta terminal abierta.** El backend debe estar corriendo siempre mientras uses la aplicación.

---

## 4. Configurar y Encender el Frontend

> **Ubicación:** Debes estar dentro de la carpeta `frontend/vite-project/`

Abre una **nueva terminal** (sin cerrar la del backend) y ejecuta:

### 4.1 Ir a la carpeta exacta del frontend

Desde la raíz del proyecto (`proyecto-publicidad/`):

```bash
cd frontend/vite-project
```

> **Importante:** No solo `cd frontend`. Debe ser `cd frontend/vite-project`.

### 4.2 Instalar dependencias

```bash
npm install
```

### 4.3 Iniciar el servidor de desarrollo

```bash
npm run dev
```

Verás algo como:

```
VITE v8.0.11  ready in 921 ms

➜  Local:   http://localhost:5173/
```

### 4.4 Abrir en el navegador

Ve a: **http://localhost:5173/**

> **Recuerda:** Para que todo funcione debes tener **DOS terminales abiertas**:
> - Terminal 1: Backend corriendo (`node server.js` desde `backend/`)
> - Terminal 2: Frontend corriendo (`npm run dev` desde `frontend/vite-project/`)

---

## Resumen Visual de Carpetas y Comandos

```
proyecto-publicidad/
│
├── backend/                  ← CD AQUÍ para el backend
│   ├── .env                  ← Crear este archivo
│   ├── server.js             ← node server.js
│   └── prisma/
│       └── schema.prisma     ← npx prisma db push
│
└── frontend/
    └── vite-project/         ← CD AQUÍ para el frontend
        ├── src/
        └── package.json      ← npm run dev
```

---

## 5. Credenciales de Acceso (Demo)

Después de ejecutar los seeds, puedes iniciar sesión con:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| **Administrador** | `admin@admanager.com` | `password` |
| **Cliente** | Depende del seed | `password` |

---

## Comandos Útiles

| Acción | Carpeta | Comando |
|--------|---------|---------|
| Encender backend | `backend/` | `node server.js` |
| Encender frontend | `frontend/vite-project/` | `npm run dev` |
| Ver base de datos visual | `backend/` | `npx prisma studio` |
| Crear migración nueva | `backend/` | `npx prisma migrate dev --name nombre_cambio` |
| Ver errores de código | `frontend/vite-project/` | `npm run lint` |

---

## Solución de Problemas Comunes

### Error: "Cannot find module '@prisma/client'"
**Solución:** Ve a `backend/` y ejecuta `npx prisma generate`.

### Error: "Database does not exist"
**Solución:** Abre pgAdmin o psql y ejecuta `CREATE DATABASE publicidad_db;`

### Error: "Port 3000 is already in use"
**Solución:** Cierra otras terminales con Node, o cambia el `PORT` en el archivo `backend/.env`.

### Error: "Failed to fetch" en el navegador
**Solución:** Asegúrate de que el backend esté corriendo en `localhost:3000` antes de abrir el frontend.

### Error: "prisma migrate dev is an interactive command"
**Solución:** Usa `npx prisma db push` en lugar de `npx prisma migrate dev`.

### La página se ve en blanco o sin estilos
**Solución:** Presiona `Ctrl + F5` para recargar sin caché del navegador.

---

## Contacto

Si tienes algún problema, revisa:
1. La **terminal del backend** para errores del servidor
2. La **consola del navegador** (F12 → Console) para errores del frontend

---

**Proyecto:** AdManager Pro  
**Universidad:** Universidad Autónoma del Cauca  
**Año:** 2026
