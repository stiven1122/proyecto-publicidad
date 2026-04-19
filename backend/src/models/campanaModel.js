const pool = require('../config/db')

const obtenerCampanas = async () => {
    const result = await pool.query('SELECT * FROM campanas')
    return result.rows
}

const crearCampana = async (nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente) => {
    // Assuming there is a function crear_campana
    await pool.query(
        'SELECT crear_campana($1, $2, $3, $4, $5, $6)',
        [nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente]
    )
}

module.exports = {
    obtenerCampanas,
    crearCampana
}