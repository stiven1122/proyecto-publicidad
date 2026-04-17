const reporteModel = require('../models/reporteModel')

const obtenerReportes = async (req, res) => {
    try {
        const reportes = await reporteModel.obtenerReportes()
        res.json(reportes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const crearReporte = async (req, res) => {
    const { descripcion, fecha, id_campana } = req.body

    try {
        await reporteModel.crearReporte(descripcion, fecha, id_campana)
        res.status(201).json({ mensaje: 'Reporte creado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

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
    crearReporte,
    obtenerReporteCampana
}