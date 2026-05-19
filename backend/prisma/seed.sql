-- ============================================================
-- PROCEDIMIENTOS ALMACENADOS (corregidos para compatibilidad con Prisma TEXT)
-- ============================================================

-- Limpiar triggers primero para poder recrear funciones
DROP TRIGGER IF EXISTS tg_crear_metricas_iniciales ON campanas;
DROP TRIGGER IF EXISTS tg_notificacion_nueva_campana ON campanas;
DROP TRIGGER IF EXISTS tg_notificacion_reporte_generado ON reportes;

-- 1. sp_registrar_usuario
DROP FUNCTION IF EXISTS sp_registrar_usuario(TEXT, TEXT, TEXT, TEXT, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION sp_registrar_usuario(
    p_nombre TEXT,
    p_email TEXT,
    p_password TEXT,
    p_rol TEXT DEFAULT 'usuario',
    p_estado TEXT DEFAULT 'activo'
)
RETURNS TABLE(id INT, nombre TEXT, email TEXT, rol TEXT, estado TEXT, fecha_registro TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios WHERE usuarios.email = p_email) THEN
        RAISE EXCEPTION 'El correo electronico ya esta registrado';
    END IF;

    RETURN QUERY
    INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro)
    VALUES (p_nombre, p_email, p_password, p_rol, p_estado, NOW())
    RETURNING usuarios.id, usuarios.nombre, usuarios.email, usuarios.rol, usuarios.estado, usuarios.fecha_registro;
END;
$$;

-- 2. sp_crear_campana
DROP FUNCTION IF EXISTS sp_crear_campana(TEXT, TEXT, TEXT, TIMESTAMP, TIMESTAMP, INT, INT, INT, TEXT, TEXT[]) CASCADE;
CREATE OR REPLACE FUNCTION sp_crear_campana(
    p_nombre TEXT,
    p_descripcion TEXT,
    p_objetivos TEXT,
    p_fecha_inicio TIMESTAMP,
    p_fecha_fin TIMESTAMP,
    p_cliente_id INT,
    p_producto_id INT,
    p_creado_por INT,
    p_estado TEXT DEFAULT 'activa',
    p_plataformas TEXT[] DEFAULT '{}'
)
RETURNS TABLE(id INT, nombre TEXT, estado TEXT, fecha_registro TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO campanas (nombre, descripcion, objetivos, estado, fecha_inicio, fecha_fin, cliente_id, producto_id, creado_por, plataformas, fecha_registro)
    VALUES (p_nombre, p_descripcion, p_objetivos, p_estado, p_fecha_inicio, p_fecha_fin, p_cliente_id, p_producto_id, p_creado_por, p_plataformas, NOW())
    RETURNING campanas.id, campanas.nombre, campanas.estado, campanas.fecha_registro;
END;
$$;

-- 3. sp_registrar_cliente
DROP FUNCTION IF EXISTS sp_registrar_cliente(TEXT, TEXT, TEXT, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION sp_registrar_cliente(
    p_nombre TEXT,
    p_email TEXT,
    p_telefono TEXT DEFAULT NULL,
    p_direccion TEXT DEFAULT NULL
)
RETURNS TABLE(id INT, nombre TEXT, email TEXT, fecha_registro TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM clientes WHERE clientes.email = p_email) THEN
        RAISE EXCEPTION 'El correo del cliente ya esta registrado';
    END IF;

    RETURN QUERY
    INSERT INTO clientes (nombre, email, telefono, direccion, fecha_registro)
    VALUES (p_nombre, p_email, p_telefono, p_direccion, NOW())
    RETURNING clientes.id, clientes.nombre, clientes.email, clientes.fecha_registro;
END;
$$;

-- 4. sp_generar_reporte
DROP FUNCTION IF EXISTS sp_generar_reporte(INT, INT, TEXT, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION sp_generar_reporte(
    p_campana_id INT,
    p_generado_por INT,
    p_tipo_reporte TEXT,
    p_url_archivo TEXT DEFAULT NULL
)
RETURNS TABLE(id INT, campana_id INT, tipo_reporte TEXT, fecha_generacion TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO reportes (campana_id, generado_por, tipo_reporte, url_archivo, fecha_generacion)
    VALUES (p_campana_id, p_generado_por, p_tipo_reporte, p_url_archivo, NOW())
    RETURNING reportes.id, reportes.campana_id, reportes.tipo_reporte, reportes.fecha_generacion;
END;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- 1. Trigger: Crear Metricas Iniciales
CREATE OR REPLACE FUNCTION trg_crear_metricas_iniciales()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO metricas (campana_id, impresiones, clics, conversiones, costo, fecha_registro)
    VALUES (NEW.id, 0, 0, 0, 0, NOW());
    RETURN NEW;
END;
$$;

CREATE TRIGGER tg_crear_metricas_iniciales
    AFTER INSERT ON campanas
    FOR EACH ROW
    EXECUTE FUNCTION trg_crear_metricas_iniciales();

-- 2. Trigger: Notificacion de Nueva Campana
CREATE OR REPLACE FUNCTION trg_notificacion_nueva_campana()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO notificaciones (usuario_id, mensaje, leida, fecha, campana_id)
    VALUES (NEW.creado_por, 'La campana "' || NEW.nombre || '" ha sido creada correctamente.', FALSE, NOW(), NEW.id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER tg_notificacion_nueva_campana
    AFTER INSERT ON campanas
    FOR EACH ROW
    EXECUTE FUNCTION trg_notificacion_nueva_campana();

-- 3. Trigger: Notificacion de Reporte Generado
CREATE OR REPLACE FUNCTION trg_notificacion_reporte_generado()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO notificaciones (usuario_id, mensaje, leida, fecha, campana_id)
    VALUES (NEW.generado_por, 'El reporte de tipo "' || NEW.tipo_reporte || '" esta disponible para su consulta.', FALSE, NOW(), NEW.campana_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER tg_notificacion_reporte_generado
    AFTER INSERT ON reportes
    FOR EACH ROW
    EXECUTE FUNCTION trg_notificacion_reporte_generado();
