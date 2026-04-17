const pool = require('../config/db')

const obtenerClientes = async () => {
    const result = await pool.query('SELECT * FROM clientes')
    return result.rows
}

const crearCliente = async (nombre, correo, telefono) => {
    await pool.query('SELECT crear_cliente($1, $2, $3)', [nombre, correo, telefono])
}

module.exports = {
    obtenerClientes,
    crearCliente
}