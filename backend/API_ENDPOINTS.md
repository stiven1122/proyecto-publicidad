# API Endpoints - AdManager Pro Backend

## Formato de Respuesta

Todos los endpoints devuelven respuestas con retroalimentación clara:

### Éxito (200-201)
```json
{
  "mensaje": "Descripción de lo que ocurrió",
  "total": 10,        // Solo en listas
  "data": { ... }     // o [ ... ] para listas
}
```

### Error (401-403-404-500)
```json
{
  "error": "Tipo técnico del error",
  "mensaje": "Explicación amigable para el usuario"
}
```

---

## Autenticación

### POST /api/auth/register
**Auth:** No requiere  
**Body:**
```json
{
  "nombre": "Juan Perez",
  "email": "juan@email.com",
  "password": "123456",
  "rol": "usuario"
}
```
**Respuesta éxito:**
```json
{
  "mensaje": "Usuario \"Juan Perez\" registrado exitosamente",
  "usuario": { "id": 1, "nombre": "Juan Perez", ... },
  "token": "jwt_token_aqui"
}
```
**Respuesta error:**
```json
{
  "error": "Error al registrar usuario: El correo electronico ya esta registrado",
  "mensaje": "No se pudo completar el registro. Verifica que el correo no esté en uso."
}
```

### POST /api/auth/login
**Auth:** No requiere  
**Body:**
```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```
**Respuesta éxito:**
```json
{
  "mensaje": "Bienvenido, Juan Perez. Autenticación exitosa.",
  "usuario": { "id": 1, "nombre": "Juan Perez", "email": "...", "rol": "usuario" },
  "token": "jwt_token_aqui"
}
```
**Respuesta error:**
```json
{
  "error": "Credenciales incorrectas",
  "mensaje": "El correo o la contraseña no son válidos. Por favor, verifica tus datos."
}
```

---

## Usuarios

### GET /api/usuarios
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de usuarios obtenida exitosamente",
  "total": 5,
  "data": [ { "id": 1, "nombre": "..." } ]
}
```

---

## Clientes

### GET /api/clientes
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de clientes obtenida exitosamente",
  "total": 10,
  "data": [ ... ]
}
```

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
**Respuesta éxito:**
```json
{
  "mensaje": "Cliente \"Empresa ABC\" registrado exitosamente",
  "data": { "id": 1, "nombre": "Empresa ABC", ... }
}
```
**Respuesta error:**
```json
{
  "error": "Error al registrar cliente: El correo del cliente ya esta registrado",
  "mensaje": "No se pudo registrar el cliente. Verifica que el correo no esté en uso."
}
```

### GET /api/clientes/:id
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Cliente encontrado exitosamente",
  "data": { "id": 1, "nombre": "..." }
}
```
**Respuesta error (404):**
```json
{
  "error": "Cliente no encontrado",
  "mensaje": "No existe un cliente con ID 99. Verifica el identificador."
}
```

### GET /api/clientes/:id/campanas
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Campañas del cliente obtenidas exitosamente",
  "total": 3,
  "data": [ ... ]
}
```

---

## Campañas

### GET /api/campanas
**Auth:** Header `Authorization: Bearer <token>`  
**Query (opcional):** `?estado=activa`

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de campañas filtradas por estado \"activa\"",
  "total": 5,
  "data": [ ... ]
}
```

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
**Respuesta éxito:**
```json
{
  "mensaje": "Campaña \"Campaña Navidad\" creada exitosamente",
  "data": { "id": 1, "nombre": "Campaña Navidad", ... }
}
```
**Respuesta error:**
```json
{
  "error": "Error al crear campaña: ...",
  "mensaje": "No se pudo crear la campaña. Verifica que el cliente y el producto existan."
}
```

### GET /api/campanas/:id
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta error (404):**
```json
{
  "error": "Campaña no encontrada",
  "mensaje": "No existe una campaña con ID 99. Verifica el identificador."
}
```

### PUT /api/campanas/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)  
**Body:**
```json
{
  "nombre": "Campaña Navidad Actualizada",
  "estado": "pausada"
}
```
**Respuesta éxito:**
```json
{
  "mensaje": "Campaña \"Campaña Navidad Actualizada\" actualizada exitosamente",
  "data": { ... }
}
```

---

## Productos

### GET /api/productos
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de productos obtenida exitosamente",
  "total": 8,
  "data": [ ... ]
}
```

### POST /api/productos
**Auth:** Header `Authorization: Bearer <token>` (Cualquier usuario autenticado)  
**Body:**
```json
{
  "nombre": "Volantes Publicitarios",
  "descripcion": "Volantes tamaño carta full color",
  "precio": 800.00,
  "categoria": "Impresion"
}
```
**Respuesta éxito:**
```json
{
  "mensaje": "Producto \"Volantes Publicitarios\" agregado exitosamente",
  "data": { "id": 1, "nombre": "Volantes Publicitarios", ... }
}
```

### GET /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta error (404):**
```json
{
  "error": "Producto no encontrado",
  "mensaje": "No existe un producto con ID 99. Verifica el identificador."
}
```

### PUT /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Producto \"Volantes Premium\" actualizado exitosamente",
  "data": { ... }
}
```

### DELETE /api/productos/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Producto \"Volantes\" eliminado exitosamente",
  "data": { ... }
}
```
**Respuesta error:**
```json
{
  "error": "Error al eliminar producto: ...",
  "mensaje": "No se pudo eliminar el producto. Puede estar asociado a campañas."
}
```

---

## Métricas

### GET /api/metricas
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de métricas obtenida exitosamente",
  "total": 15,
  "data": [ ... ]
}
```

### GET /api/metricas/:campanaId
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Métricas de la campaña 5 obtenidas exitosamente",
  "total": 1,
  "data": [ { "impresiones": 1500, "clics": 300, ... } ]
}
```

---

## Reportes

### GET /api/reportes
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de reportes obtenida exitosamente",
  "total": 4,
  "data": [ ... ]
}
```

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
**Respuesta éxito:**
```json
{
  "mensaje": "Reporte de tipo \"financiero\" generado exitosamente",
  "data": { "id": 1, "campanaId": 1, "tipoReporte": "financiero", ... }
}
```

### GET /api/reportes/campana/resumen
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Resumen de campañas obtenido exitosamente",
  "total": 6,
  "data": [ ... ]
}
```

---

## Integraciones

### GET /api/integraciones
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Lista de integraciones obtenida exitosamente",
  "total": 3,
  "data": [ ... ]
}
```

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
**Respuesta éxito:**
```json
{
  "mensaje": "Integración con \"Facebook Ads\" creada exitosamente",
  "data": { "id": 1, "nombrePlataforma": "Facebook Ads", ... }
}
```

### PUT /api/integraciones/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Integración \"Facebook Ads\" actualizada exitosamente",
  "data": { ... }
}
```

### DELETE /api/integraciones/:id
**Auth:** Header `Authorization: Bearer <token>` (Solo admin)

**Respuesta éxito:**
```json
{
  "mensaje": "Integración \"Facebook Ads\" eliminada exitosamente",
  "data": { ... }
}
```

---

## Notificaciones

### GET /api/notificaciones
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Notificaciones obtenidas. Tienes 3 sin leer.",
  "total": 8,
  "noLeidas": 3,
  "data": [ ... ]
}
```

### PUT /api/notificaciones/:id/leida
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Notificación marcada como leída exitosamente",
  "data": { "id": 1, "leida": true, ... }
}
```

---

## Panel (KPIs / Estadísticas)

### GET /api/panel/estadisticas
**Auth:** Header `Authorization: Bearer <token>`

**Respuesta éxito:**
```json
{
  "mensaje": "Estadísticas del panel obtenidas exitosamente",
  "data": {
    "totales": { "campanas": 10, "clientes": 5, "usuarios": 3, "productos": 8 },
    "campanas": { "activas": 6, "finalizadas": 4 },
    "metricas": { "impresiones": 5000, "clics": 1200, "conversiones": 300, "costoTotal": 15000 }
  }
}
```

---

## Errores Comunes

### 401 - No autenticado
```json
{
  "error": "Token no proporcionado",
  "mensaje": "No se encontró un token de autenticación. Inicia sesión para acceder a este recurso."
}
```

### 401 - Token expirado
```json
{
  "error": "Token invalido o expirado",
  "mensaje": "Tu sesión ha expirado o el token no es válido. Por favor, inicia sesión nuevamente."
}
```

### 403 - Sin permisos
```json
{
  "error": "Acceso denegado",
  "mensaje": "Esta acción requiere privilegios de administrador. Contacta a un administrador si necesitas acceso."
}
```

### 404 - Ruta no existe
```json
{
  "error": "Ruta no encontrada",
  "mensaje": "La ruta GET /api/xyz no existe en esta API. Verifica la documentación."
}
```

### 500 - Error del servidor
```json
{
  "error": "Error interno del servidor",
  "mensaje": "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde."
}
```
