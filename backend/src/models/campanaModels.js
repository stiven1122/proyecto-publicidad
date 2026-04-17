const campanaModel = require('../models/campanaModel')

const obtenerCampanas = async (req, res) => {
    try {
        const campanas = await campanaModel.obtenerCampanas()
        res.json(campanas)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

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

module.exports = {
    obtenerCampanas,
    crearCampana
}