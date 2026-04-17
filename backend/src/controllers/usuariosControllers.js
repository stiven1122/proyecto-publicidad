const clienteModel = require('../models/clienteModel')

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.obtenerClientes()
        res.json(clientes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const crearCliente = async (req, res) => {
    const { nombre, correo, telefono } = req.body

    try {
        await clienteModel.crearCliente(nombre, correo, telefono)
        res.status(201).json({ mensaje: 'Cliente creado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerClientes,
    crearCliente
}