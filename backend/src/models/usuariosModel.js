const pool = require('../config/db')

// GET todos
const obtenerUsuarios = async () => {
    const result = await pool.query('SELECT * FROM obtener_usuarios()')
    return result.rows
}

// GET por ID
const obtenerUsuarioPorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_usuario_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// POST
const crearUsuario = async (nombre, correo, password, rol) => {
    const result = await pool.query(
        'SELECT * FROM crear_usuario($1, $2, $3, $4)',
        [nombre, correo, password, rol]
    )
    return result.rows[0]
}

// PUT
const actualizarUsuario = async (id, nombre, correo, password, rol) => {
    await pool.query(
        'SELECT * FROM actualizar_usuario($1, $2, $3, $4, $5)',
        [id, nombre, correo, password, rol]
    )
}

// DELETE
const eliminarUsuario = async (id) => {
    await pool.query('SELECT eliminar_usuario($1)', [id])
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}