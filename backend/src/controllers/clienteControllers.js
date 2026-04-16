const pool = require('../config/db')

const obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearCliente = async (req, res) => {
  const { nombre, correo, telefono } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, correo, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, telefono]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  obtenerClientes,
  crearCliente
}