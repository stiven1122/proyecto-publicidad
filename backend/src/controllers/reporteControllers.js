const reporteModel = require('../models/reporteModel')

// ===============================
// GET TODOS
// ===============================
const obtenerReportes = async (req, res) => {
    try {
        const reportes = await reporteModel.obtenerReportes()
        res.json(reportes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// GET POR ID
// ===============================
const obtenerReportePorId = async (req, res) => {
    const { id } = req.params

    try {
        const reporte = await reporteModel.obtenerReportePorId(id)
        res.json(reporte)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// POST
// ===============================
const crearReporte = async (req, res) => {
    const { descripcion, fecha, id_campana } = req.body

    try {
        await reporteModel.crearReporte(descripcion, fecha, id_campana)
        res.status(201).json({ mensaje: 'Reporte creado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// PUT (ACTUALIZAR)
// ===============================
const actualizarReporte = async (req, res) => {
    const { id } = req.params
    const { descripcion, fecha, id_campana } = req.body

    try {
        await reporteModel.actualizarReporte(id, descripcion, fecha, id_campana)
        res.json({ mensaje: 'Reporte actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// DELETE
// ===============================
const eliminarReporte = async (req, res) => {
    const { id } = req.params

    try {
        await reporteModel.eliminarReporte(id)
        res.json({ mensaje: 'Reporte eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// REPORTE ESPECIAL (JOIN CAMPAÑAS)
// ===============================
const obtenerReporteCampana = async (req, res) => {
    try {
        const reporte = await reporteModel.reporteCampana()
        res.json(reporte)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    obtenerReporteCampana
}