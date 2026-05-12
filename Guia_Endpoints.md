# Guia para Probar los Endpoints de la API

## Requisitos previos

Antes de empezar, asegurate de que:

1. El contenedor de Docker este corriendo:
   ```bash
   docker-compose up -d
   ```
2. El servidor Node.js este corriendo desde la carpeta `backend`:
   ```bash
   node server.js
   ```
3. En la terminal deberias ver:
   ```text
   PostgreSQL conectado correctamente
   Servidor corriendo en http://localhost:3000
   ```

La URL base de la API es:

```text
http://localhost:3000
```

---

## Resumen de endpoints

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/` | Mensaje de bienvenida |
| GET | `/api/health` | Verifica el estado de la API |
| GET | `/api/clientes` | Obtiene todos los clientes |
| POST | `/api/clientes` | Crea un cliente |
| GET | `/api/usuarios` | Obtiene todos los usuarios |
| POST | `/api/usuarios` | Crea un usuario |
| GET | `/api/campanas` | Obtiene todas las campanas |
| POST | `/api/campanas` | Crea una campana |
| GET | `/api/anuncios` | Obtiene todos los anuncios |
| POST | `/api/anuncios` | Crea un anuncio |
| GET | `/api/pagos` | Obtiene todos los pagos |
| POST | `/api/pagos` | Registra un pago |
| GET | `/api/reportes` | Obtiene todos los reportes |
| POST | `/api/reportes` | Crea un reporte |
| GET | `/api/reportes/campanas` | Obtiene el reporte por campana |

---

## Verificar que el servidor funciona

### GET - Bienvenida

- **URL:** `http://localhost:3000/`
- **Metodo:** `GET`
- **Body:** Ninguno

### GET - Estado de la API

- **URL:** `http://localhost:3000/api/health`
- **Metodo:** `GET`
- **Body:** Ninguno

---

## Clientes - `/api/clientes`

### GET - Obtener todos los clientes

- **URL:** `http://localhost:3000/api/clientes`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Crear un cliente

- **URL:** `http://localhost:3000/api/clientes`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nombre": "Carlos Martinez",
  "correo": "carlos@gmail.com",
  "telefono": "555-1234"
}
```

---

## Usuarios - `/api/usuarios`

### GET - Obtener todos los usuarios

- **URL:** `http://localhost:3000/api/usuarios`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Crear un usuario

- **URL:** `http://localhost:3000/api/usuarios`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nombre": "Maria Gomez",
  "correo": "maria@empresa.com",
  "password": "miPasswordSeguro"
}
```

---

## Campanas - `/api/campanas`

### GET - Obtener todas las campanas

- **URL:** `http://localhost:3000/api/campanas`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Crear una campana

- **URL:** `http://localhost:3000/api/campanas`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nombre": "Campana Verano 2026",
  "descripcion": "Promocion de temporada de verano",
  "fecha_inicio": "2026-06-01",
  "fecha_fin": "2026-08-31",
  "estado": "activa",
  "id_cliente": 1
}
```

Nota: `id_cliente` debe ser un cliente que ya exista en la base de datos.

---

## Anuncios - `/api/anuncios`

### GET - Obtener todos los anuncios

- **URL:** `http://localhost:3000/api/anuncios`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Crear un anuncio

- **URL:** `http://localhost:3000/api/anuncios`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "titulo": "Gran Oferta de Verano",
  "contenido": "50% de descuento en todos nuestros productos",
  "tipo": "Banner",
  "id_campana": 1
}
```

Nota: `id_campana` debe ser una campana que ya exista en la base de datos.

---

## Pagos - `/api/pagos`

### GET - Obtener todos los pagos

- **URL:** `http://localhost:3000/api/pagos`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Registrar un pago

- **URL:** `http://localhost:3000/api/pagos`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "monto": 500.50,
  "fecha": "2026-04-19",
  "metodo": "Tarjeta de Credito",
  "id_cliente": 1
}
```

Nota: `id_cliente` debe ser un cliente que ya exista en la base de datos.

---

## Reportes - `/api/reportes`

### GET - Obtener todos los reportes

- **URL:** `http://localhost:3000/api/reportes`
- **Metodo:** `GET`
- **Body:** Ninguno

### POST - Crear un reporte

- **URL:** `http://localhost:3000/api/reportes`
- **Metodo:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "descripcion": "Reporte mensual de rendimiento de campana",
  "fecha": "2026-04-19",
  "id_campana": 1
}
```

Nota: `id_campana` debe ser una campana que ya exista en la base de datos.

### GET - Reporte por campana

- **URL:** `http://localhost:3000/api/reportes/campanas`
- **Metodo:** `GET`
- **Body:** Ninguno

---

## Orden recomendado para insertar datos

Para evitar errores de llaves foraneas, crea los registros en este orden:

```text
1. Clientes  -> POST /api/clientes
2. Usuarios  -> POST /api/usuarios
3. Campanas  -> POST /api/campanas  (necesita id_cliente)
4. Anuncios  -> POST /api/anuncios  (necesita id_campana)
5. Pagos     -> POST /api/pagos     (necesita id_cliente)
6. Reportes  -> POST /api/reportes  (necesita id_campana)
```

---

## Respuestas esperadas

| Codigo | Significado |
|--------|-------------|
| `200 OK` | Consulta GET exitosa |
| `201 Created` | Registro creado con exito |
| `500 Internal Server Error` | Error en el servidor o base de datos |

---

## Como usar en Postman

1. Abre Postman.
2. Haz clic en **New -> HTTP Request**.
3. Selecciona el metodo (`GET` o `POST`).
4. Pega la URL completa en la barra de direcciones.
5. Para peticiones `POST`, ve a **Body**, selecciona **raw** y luego **JSON**.
6. Pega el JSON correspondiente y haz clic en **Send**.
