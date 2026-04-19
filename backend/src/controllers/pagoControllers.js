const pagoModel = require('../models/pagoModel')

// ===============================
// GET TODOS
// ===============================
const obtenerPagos = async (req, res) => {
    try {
        const pagos = await pagoModel.obtenerPagos()
        res.json(pagos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// GET POR ID
// ===============================
const obtenerPagoPorId = async (req, res) => {
    const { id } = req.params
    try {
        const pago = await pagoModel.obtenerPagoPorId(id)
        res.json(pago)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// POST
// ===============================
const crearPago = async (req, res) => {
    const { monto, fecha, metodo, id_cliente } = req.body

    try {
        await pagoModel.crearPago(monto, fecha, metodo, id_cliente)
        res.status(201).json({ mensaje: 'Pago registrado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// PUT
// ===============================
const actualizarPago = async (req, res) => {
    const { id } = req.params
    const { monto, fecha, metodo, id_cliente } = req.body

    try {
        await pagoModel.actualizarPago(id, monto, fecha, metodo, id_cliente)
        res.json({ mensaje: 'Pago actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// DELETE
// ===============================
const eliminarPago = async (req, res) => {
    const { id } = req.params

    try {
        await pagoModel.eliminarPago(id)
        res.json({ mensaje: 'Pago eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago
}