const pool = require('../config/db')

const obtenerReportes = async () => {
    const result = await pool.query('SELECT * FROM reportes')
    return result.rows
}

const crearReporte = async (descripcion, fecha, id_campana) => {
    await pool.query(
        'SELECT crear_reporte($1, $2, $3)',
        [descripcion, fecha, id_campana]
    )
}

const reporteCampana = async () => {
    const result = await pool.query('SELECT * FROM obtener_reporte_campana()')
    return result.rows
}

module.exports = {
    obtenerReportes,
    crearReporte,
    reporteCampana
}