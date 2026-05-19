const pool = require('../config/db')

// GET
const obtenerReportes = async () => {
    const result = await pool.query('SELECT * FROM obtener_reportes()')
    return result.rows
}

// GET por ID
const obtenerReportePorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_reporte_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// POST
const crearReporte = async (descripcion, fecha, id_campana) => {
    const result = await pool.query(
        'SELECT * FROM crear_reporte($1, $2, $3)',
        [descripcion, fecha, id_campana]
    )
    return result.rows[0]
}

// PUT
const actualizarReporte = async (id, descripcion, fecha, id_campana) => {
    const result = await pool.query(
        'SELECT * FROM actualizar_reporte($1, $2, $3, $4)',
        [id, descripcion, fecha, id_campana]
    )
    return result.rows[0]
}

// DELETE
const eliminarReporte = async (id) => {
    await pool.query('SELECT eliminar_reporte($1)', [id])
}

// REPORTE ESPECIAL
const reporteCampana = async () => {
    const result = await pool.query('SELECT * FROM obtener_reporte_campana()')
    return result.rows
}

module.exports = {
    obtenerReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    reporteCampana
}