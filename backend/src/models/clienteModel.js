const pool = require('../config/db')

// ===============================
// GET TODOS
// ===============================
const obtenerClientes = async () => {
    const result = await pool.query('SELECT * FROM obtener_clientes()')
    return result.rows
}

// ===============================
// GET POR ID
// ===============================
const obtenerClientePorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_cliente_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// ===============================
// POST
// ===============================
const crearCliente = async (nombre, correo, telefono) => {
    const result = await pool.query(
        'SELECT * FROM crear_cliente($1, $2, $3)',
        [nombre, correo, telefono]
    )
    return result.rows[0]
}

// ===============================
// PUT
// ===============================
const actualizarCliente = async (id, nombre, correo, telefono) => {
    const result = await pool.query(
        'SELECT * FROM actualizar_cliente($1, $2, $3, $4)',
        [id, nombre, correo, telefono]
    )
    return result.rows[0]
}

// ===============================
// DELETE
// ===============================
const eliminarCliente = async (id) => {
    await pool.query('SELECT eliminar_cliente($1)', [id])
}

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
}