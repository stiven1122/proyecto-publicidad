const pool = require('../config/db')

const obtenerClientes = async () => {
    const result = await pool.query('SELECT * FROM clientes')
    return result.rows
}

const crearCliente = async (nombre, correo, telefono) => {
    // Assuming there is a function crear_cliente, or we can use INSERT
    const result = await pool.query(
      'INSERT INTO clientes (nombre, correo, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, telefono]
    )
    return result.rows[0]
}

module.exports = {
    obtenerClientes,
    crearCliente
}