const express = require('express')
const router = express.Router()
const campanaController = require('../controllers/campanaControllers')

router.get('/', campanaController.obtenerCampanas)
router.post('/', campanaController.crearCampana)

module.exports = router