const pool = require('../config/db')

// GET todos
const obtenerCampanas = async () => {
    const result = await pool.query('SELECT * FROM obtener_campanas()')
    return result.rows
}

// GET por ID
const obtenerCampanaPorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_campana_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// POST
const crearCampana = async (nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente) => {
    const result = await pool.query(
        'SELECT * FROM crear_campana($1, $2, $3, $4, $5, $6)',
        [nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente]
    )
    return result.rows[0]
}

// PUT
const actualizarCampana = async (id, nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente) => {
    const result = await pool.query(
        'SELECT * FROM actualizar_campana($1, $2, $3, $4, $5, $6, $7)',
        [id, nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente]
    )
    return result.rows[0]
}

// DELETE
const eliminarCampana = async (id) => {
    await pool.query('SELECT eliminar_campana($1)', [id])
}

module.exports = {
    obtenerCampanas,
    obtenerCampanaPorId,
    crearCampana,
    actualizarCampana,
    eliminarCampana
}