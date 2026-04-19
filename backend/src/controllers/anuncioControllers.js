const anuncioModel = require('../models/anuncioModel')

// ===============================
// GET TODOS
// ===============================
const obtenerAnuncios = async (req, res) => {
    try {
        const anuncios = await anuncioModel.obtenerAnuncios()
        res.json(anuncios)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// GET POR ID
// ===============================
const obtenerAnuncioPorId = async (req, res) => {
    const { id } = req.params
    try {
        const anuncio = await anuncioModel.obtenerAnuncioPorId(id)
        res.json(anuncio)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// POST
// ===============================
const crearAnuncio = async (req, res) => {
    const { titulo, contenido, tipo, id_campana } = req.body
    try {
        await anuncioModel.crearAnuncio(titulo, contenido, tipo, id_campana)
        res.status(201).json({ mensaje: 'Anuncio creado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// PUT
// ===============================
const actualizarAnuncio = async (req, res) => {
    const { id } = req.params
    const { titulo, contenido, tipo, id_campana } = req.body

    try {
        await anuncioModel.actualizarAnuncio(id, titulo, contenido, tipo, id_campana)
        res.json({ mensaje: 'Anuncio actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// DELETE
// ===============================
const eliminarAnuncio = async (req, res) => {
    const { id } = req.params

    try {
        await anuncioModel.eliminarAnuncio(id)
        res.json({ mensaje: 'Anuncio eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerAnuncios,
    obtenerAnuncioPorId,
    crearAnuncio,
    actualizarAnuncio,
    eliminarAnuncio
}