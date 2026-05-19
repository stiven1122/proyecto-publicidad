# API Endpoints - Publicidad Backend

## Autenticacion

### POST /api/auth/register
**Body:**
```json
{
  "nombre": "Juan Perez",
  "email": "juan@email.com",
  "password": "123456",
  "rol": "usuario"
}
```
**Auth:** No requiere

### POST /api/auth/login
**Body:**
```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```
**Auth:** No requiere. Devuelve token JWT.

---

## Usuarios

### GET /api/usuarios
**Auth:** Header `Authorization: Bearer <token>`

---

## Clientes

### GET /api/clientes
**Auth:** Header `Authorization: Bearer <token>`

### POST /api/clientes
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "nombre": "Empresa ABC",
  "email": "contacto@abc.com",
  "telefono": "3123456789",
  "direccion": "Calle 123 #45-67"
}
```

### GET /api/clientes/:id
**Auth:** Header `Authorization: Bearer <token>`

### GET /api/clientes/:id/campanas
**Auth:** Header `Authorization: Bearer <token>`

---

## Campanas

### GET /api/campanas
**Auth:** Header `Authorization: Bearer <token>`
**Query (opcional):** `?estado=activa`

### POST /api/campanas
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "nombre": "Campaña Navidad",
  "descripcion": "Promocion de fin de año",
  "objetivos": "Aumentar ventas 20%",
  "estado": "activa",
  "fechaInicio": "2026-12-01",
  "fechaFin": "2026-12-31",
  "clienteId": 1,
  "productoId": 1,
  "creadoPor": 1,
  "plataformas": ["Facebook", "Instagram"]
}
```

### GET /api/campanas/:id
**Auth:** Header `Authorization: Bearer <token>`

### PUT /api/campanas/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "nombre": "Campaña Navidad Actualizada",
  "estado": "pausada"
}
```

---

## Productos

### GET /api/productos
**Auth:** Header `Authorization: Bearer <token>`

### POST /api/productos
**Auth:** Header `Authorization: Bearer <token>` (Cualquier usuario autenticado)
**Body:**
```json
{
  "nombre": "Folleto A4",
  "descripcion": "Folleto publicitario tamaño A4",
  "precio": 1500.00,
  "categoria": "Impresion"
}
```

### GET /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>`

### PUT /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "nombre": "Folleto A4 Premium",
  "precio": 2000.00
}
```

### DELETE /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

---

## Metricas

### GET /api/metricas
**Auth:** Header `Authorization: Bearer <token>`

### GET /api/metricas/:campanaId
**Auth:** Header `Authorization: Bearer <token>`

---

## Reportes

### GET /api/reportes
**Auth:** Header `Authorization: Bearer <token>`

### POST /api/reportes/generar
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "campanaId": 1,
  "tipoReporte": "financiero",
  "urlArchivo": "/reportes/campana_1.pdf"
}
```

### GET /api/reportes/campana/resumen
**Auth:** Header `Authorization: Bearer <token>`

---

## Integraciones

### GET /api/integraciones
**Auth:** Header `Authorization: Bearer <token>`

### POST /api/integraciones
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)
**Body:**
```json
{
  "nombrePlataforma": "Facebook Ads",
  "apiKey": "abc123",
  "estado": "activa"
}
```

### PUT /api/integraciones/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

### DELETE /api/integraciones/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

---

## Notificaciones

### GET /api/notificaciones
**Auth:** Header `Authorization: Bearer <token>`

### PUT /api/notificaciones/:id/leida
**Auth:** Header `Authorization: Bearer <token>`

---

## Panel (KPIs / Estadisticas)

### GET /api/panel/estadisticas
**Auth:** Header `Authorization: Bearer <token>`

---

## Notas importantes

1. **Autenticacion:** Todos los endpoints (excepto `/api/auth/register` y `/api/auth/login`) requieren el header `Authorization: Bearer <token_jwt>`.
2. **Roles:** Los endpoints marcados como "Solo admin" requieren que el usuario tenga `rol: "admin"`.
3. **Triggers automaticos:** Al crear una campaña, se generan automaticamente metricas en cero y una notificacion.
4. **Triggers automaticos:** Al generar un reporte, se crea automaticamente una notificacion.
5. **Procedimientos almacenados:** La logica de registro de usuario, cliente, campana y reporte esta en la base de datos (PostgreSQL).
