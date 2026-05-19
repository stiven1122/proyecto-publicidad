const campanaModel = require('../models/campanaModel')

// ===============================
// GET TODOS
// ===============================
const obtenerCampanas = async (req, res) => {
    try {
        const campanas = await campanaModel.obtenerCampanas()
        res.json(campanas)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// GET POR ID
// ===============================
const obtenerCampanaPorId = async (req, res) => {
    const { id } = req.params
    try {
        const campana = await campanaModel.obtenerCampanaPorId(id)
        res.json(campana)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// POST
// ===============================
const crearCampana = async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente } = req.body

    try {
        await campanaModel.crearCampana(
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado,
            id_cliente
        )
        res.status(201).json({ mensaje: 'Campaña creada correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// PUT
// ===============================
const actualizarCampana = async (req, res) => {
    const { id } = req.params
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado, id_cliente } = req.body

    try {
        await campanaModel.actualizarCampana(
            id,
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado,
            id_cliente
        )
        res.json({ mensaje: 'Campaña actualizada correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// DELETE
// ===============================
const eliminarCampana = async (req, res) => {
    const { id } = req.params

    try {
        await campanaModel.eliminarCampana(id)
        res.json({ mensaje: 'Campaña eliminada correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerCampanas,
    obtenerCampanaPorId,
    crearCampana,
    actualizarCampana,
    eliminarCampana
}