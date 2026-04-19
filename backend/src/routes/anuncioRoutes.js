const express = require('express')
const router = express.Router()
const anuncioController = require('../controllers/anuncioControllers')

router.get('/', anuncioController.obtenerAnuncios)
router.post('/', anuncioController.crearAnuncio)

module.exports = router