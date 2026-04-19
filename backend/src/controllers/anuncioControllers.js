const anuncioModel = require('../models/anuncioModel')

const obtenerAnuncios = async (req, res) => {
    try {
        const anuncios = await anuncioModel.obtenerAnuncios()
        res.json(anuncios)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const crearAnuncio = async (req, res) => {
    const { titulo, contenido, tipo, id_campana } = req.body
    try {
        await anuncioModel.crearAnuncio(titulo, contenido, tipo, id_campana)
        res.status(201).json({ mensaje: 'Anuncio creado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerAnuncios,
    crearAnuncio
}