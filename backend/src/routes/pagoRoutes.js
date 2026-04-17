const express = require('express')
const router = express.Router()
const pagoController = require('../controllers/pagoController')

router.get('/pagos', pagoController.obtenerPagos)
router.post('/pagos', pagoController.crearPago)

module.exports = router