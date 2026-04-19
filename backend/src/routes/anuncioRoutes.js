const express = require('express')
const router = express.Router()
const anuncioController = require('../controllers/anuncioControllers')

router.get('/', anuncioController.obtenerAnuncios)
router.get('/:id', anuncioController.obtenerAnuncioPorId)
router.post('/', anuncioController.crearAnuncio)
router.put('/:id', anuncioController.actualizarAnuncio)
router.delete('/:id', anuncioController.eliminarAnuncio)

module.exports = router