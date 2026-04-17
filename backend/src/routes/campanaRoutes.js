const express = require('express')
const router = express.Router()
const campanaController = require('../controllers/campanaController')

router.get('/campanas', campanaController.obtenerCampanas)
router.post('/campanas', campanaController.crearCampana)

module.exports = router