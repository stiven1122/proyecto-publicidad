const clienteModel = require('../models/clienteModel')

// ===============================
// GET TODOS
// ===============================
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.obtenerClientes()
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ===============================
// GET POR ID
// ===============================
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params

  try {
    const cliente = await clienteModel.obtenerClientePorId(id)
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ===============================
// POST
// ===============================
const crearCliente = async (req, res) => {
  const { nombre, correo, telefono } = req.body

  try {
    const nuevoCliente = await clienteModel.crearCliente(nombre, correo, telefono)
    res.status(201).json(nuevoCliente)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ===============================
// PUT
// ===============================
const actualizarCliente = async (req, res) => {
  const { id } = req.params
  const { nombre, correo, telefono } = req.body

  try {
    const clienteActualizado = await clienteModel.actualizarCliente(
      id,
      nombre,
      correo,
      telefono
    )
    res.json(clienteActualizado)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ===============================
// DELETE
// ===============================
const eliminarCliente = async (req, res) => {
  const { id } = req.params

  try {
    await clienteModel.eliminarCliente(id)
    res.json({ mensaje: 'Cliente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
}