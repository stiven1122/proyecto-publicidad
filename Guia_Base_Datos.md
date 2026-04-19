# Guía para Agregar Datos a la Base de Datos

Esta guía explica las dos formas principales de agregar datos a tu base de datos de PostgreSQL para este proyecto:
1. Directamente usando sentencias **SQL**.
2. A través de la **API REST** (que acabamos de refactorizar).

---

## 1. Agregando Datos Directamente con SQL

Si estás usando un cliente de base de datos como **DBeaver**, **pgAdmin**, o ejecutando comandos en consola, puedes insertar datos en las tablas de la siguiente manera.

### Tabla: Clientes
```sql
INSERT INTO clientes (nombre, correo, telefono) 
VALUES ('Juan Perez', 'juan@empresa.com', '123456789');
```

### Tabla: Usuarios
```sql
INSERT INTO usuarios (nombre, correo, password) 
VALUES ('Ana Lopez', 'ana@empresa.com', 'secreta123');
```

### Tabla: Campañas
```sql
-- Asegúrate de que id_cliente existe en la tabla clientes
INSERT INTO campanas (nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente) 
VALUES ('Campaña Verano', 'Promoción de verano', '2026-06-01', '2026-08-31', 'activa', 1);
```

### Usando las funciones de Base de Datos (Si las creaste en PostgreSQL)
El código de tu backend parece sugerir que tienes *Stored Procedures* o *Funciones* personalizadas en PostgreSQL (ej: `crear_campana($1...)`). Si es así, puedes ejecutarlas directamente:
```sql
SELECT crear_cliente('Empresa S.A.', 'contacto@empresa.com', '987654321');
```

---

## 2. Agregando Datos a través de la API (Backend)

Ahora que las rutas están arregladas, puedes insertar datos enviando peticiones **POST** a tu servidor (por ejemplo, usando **Postman**, **Insomnia**, o `curl`).

> [!IMPORTANT]
> Recuerda tener el backend encendido y la base de datos de Docker corriendo (`docker-compose up -d`) antes de probar estas peticiones.

### Crear un Cliente
**Ruta:** `POST http://localhost:3000/api/clientes`
**Body (JSON):**
```json
{
  "nombre": "Carlos Martinez",
  "correo": "carlos@gmail.com",
  "telefono": "555-1234"
}
```

### Crear un Usuario
**Ruta:** `POST http://localhost:3000/api/usuarios`
**Body (JSON):**
```json
{
  "nombre": "Maria Gomez",
  "correo": "maria@hotmail.com",
  "password": "miPasswordSeguro"
}
```

### Crear una Campaña
**Ruta:** `POST http://localhost:3000/api/campanas`
**Body (JSON):**
```json
{
  "nombre": "Ofertas Invierno",
  "descripcion": "Descuentos de hasta 50%",
  "fecha_inicio": "2026-11-01",
  "fecha_fin": "2026-12-31",
  "estado": "activa",
  "id_cliente": 1
}
```

### Crear un Anuncio
**Ruta:** `POST http://localhost:3000/api/anuncios`
**Body (JSON):**
```json
{
  "titulo": "Gran Venta",
  "contenido": "No te lo pierdas...",
  "tipo": "Banner",
  "id_campana": 1
}
```

### Crear un Pago
**Ruta:** `POST http://localhost:3000/api/pagos`
**Body (JSON):**
```json
{
  "monto": 500.50,
  "fecha": "2026-04-18",
  "metodo": "Tarjeta de Credito",
  "id_cliente": 1
}
```

### Crear un Reporte
**Ruta:** `POST http://localhost:3000/api/reportes`
**Body (JSON):**
```json
{
  "descripcion": "Reporte mensual de rendimiento",
  "fecha": "2026-04-18",
  "id_campana": 1
}
```

> [!TIP]
> Si alguna petición falla, revisa la terminal de Node.js, ya que cualquier error de PostgreSQL (como llaves foráneas que no existen) se mostrará allí.
