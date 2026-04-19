# Guía para Probar los Endpoints de la API

## Requisitos Previos
Antes de empezar, asegúrate de que:
1. El contenedor de Docker esté corriendo → `docker-compose up -d`
2. El servidor Node.js esté corriendo → `node server.js` (en la carpeta `backend`)
3. En la terminal debes ver: `✅ PostgreSQL conectado correctamente` y `🚀 Servidor corriendo en http://localhost:3000`

---

## Endpoints Disponibles

### ✅ VERIFICAR QUE EL SERVIDOR FUNCIONA

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `http://localhost:3000/` | Bienvenida |
| GET | `http://localhost:3000/api/health` | Estado de la API |

---

### 👤 CLIENTES  — `/api/clientes`

#### GET — Obtener todos los clientes
- **URL:** `http://localhost:3000/api/clientes`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Crear un cliente
- **URL:** `http://localhost:3000/api/clientes`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "Carlos Martinez",
  "correo": "carlos@gmail.com",
  "telefono": "555-1234"
}
```

---

### 🙍 USUARIOS — `/api/usuarios`

#### GET — Obtener todos los usuarios
- **URL:** `http://localhost:3000/api/usuarios`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Crear un usuario
- **URL:** `http://localhost:3000/api/usuarios`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "Maria Gomez",
  "correo": "maria@empresa.com",
  "password": "miPasswordSeguro"
}
```

---

### 📢 CAMPAÑAS — `/api/campanas`

#### GET — Obtener todas las campañas
- **URL:** `http://localhost:3000/api/campanas`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Crear una campaña
- **URL:** `http://localhost:3000/api/campanas`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nombre": "Campaña Verano 2026",
  "descripcion": "Promoción de temporada de verano",
  "fecha_inicio": "2026-06-01",
  "fecha_fin": "2026-08-31",
  "estado": "activa",
  "id_cliente": 1
}
```
> ⚠️ El `id_cliente` debe ser un cliente que ya exista en la base de datos.

---

### 📣 ANUNCIOS — `/api/anuncios`

#### GET — Obtener todos los anuncios
- **URL:** `http://localhost:3000/api/anuncios`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Crear un anuncio
- **URL:** `http://localhost:3000/api/anuncios`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "titulo": "Gran Oferta de Verano",
  "contenido": "50% de descuento en todos nuestros productos",
  "tipo": "Banner",
  "id_campana": 1
}
```
> ⚠️ El `id_campana` debe ser una campaña que ya exista.

---

### 💳 PAGOS — `/api/pagos`

#### GET — Obtener todos los pagos
- **URL:** `http://localhost:3000/api/pagos`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Registrar un pago
- **URL:** `http://localhost:3000/api/pagos`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "monto": 500.50,
  "fecha": "2026-04-19",
  "metodo": "Tarjeta de Credito",
  "id_cliente": 1
}
```
> ⚠️ El `id_cliente` debe ser un cliente que ya exista.

---

### 📊 REPORTES — `/api/reportes`

#### GET — Obtener todos los reportes
- **URL:** `http://localhost:3000/api/reportes`
- **Método:** `GET`
- **Body:** Ninguno

#### GET — Reporte por campaña
- **URL:** `http://localhost:3000/api/reportes/campanas`
- **Método:** `GET`
- **Body:** Ninguno

#### POST — Crear un reporte
- **URL:** `http://localhost:3000/api/reportes`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "descripcion": "Reporte mensual de rendimiento de campaña",
  "fecha": "2026-04-19",
  "id_campana": 1
}
```
> ⚠️ El `id_campana` debe ser una campaña que ya exista.

---

## Orden Recomendado para Insertar Datos

Para evitar errores de llaves foráneas, sigue este orden:

```
1. Clientes       → POST /api/clientes
2. Usuarios       → POST /api/usuarios
3. Campañas       → POST /api/campanas  (necesita id_cliente)
4. Anuncios       → POST /api/anuncios  (necesita id_campana)
5. Pagos          → POST /api/pagos     (necesita id_cliente)
6. Reportes       → POST /api/reportes  (necesita id_campana)
```

---

## Respuestas Esperadas

| Código | Significado |
|--------|-------------|
| `200 OK` | Consulta GET exitosa |
| `201 Created` | Registro creado con éxito |
| `500 Internal Server Error` | Error en el servidor o base de datos (revisa la terminal de Node) |

---

## Cómo usar en Postman

1. Abre **Postman**.
2. Haz clic en **New → HTTP Request**.
3. Selecciona el método (`GET` o `POST`) en el desplegable de la izquierda.
4. Pega **solo la URL** en la barra de direcciones.
5. Para peticiones POST:
   - Ve a la pestaña **Body**.
   - Selecciona **raw** y luego elige **JSON** en el desplegable de la derecha.
   - Pega el JSON del body correspondiente.
6. Haz clic en **Send**.
