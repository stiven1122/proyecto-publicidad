const pool = require('../config/db')

const obtenerUsuarios = async () => {
    const result = await pool.query('SELECT * FROM usuarios')
    return result.rows
}

const crearUsuario = async (nombre, correo, password) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, password]
    )
    return result.rows[0]
}

module.exports = {
    obtenerUsuarios,
    crearUsuario
}