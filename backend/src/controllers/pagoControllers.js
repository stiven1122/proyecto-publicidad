const pagoModel = require('../models/pagoModel')

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await pagoModel.obtenerPagos()
        res.json(pagos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const crearPago = async (req, res) => {
    const { monto, fecha, metodo, id_cliente } = req.body

    try {
        await pagoModel.crearPago(monto, fecha, metodo, id_cliente)
        res.status(201).json({ mensaje: 'Pago registrado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerPagos,
    crearPago
}