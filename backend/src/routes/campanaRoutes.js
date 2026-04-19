const express = require('express')
const router = express.Router()
const campanaController = require('../controllers/campanaControllers')

router.get('/', campanaController.obtenerCampanas)
router.get('/:id', campanaController.obtenerCampanaPorId)
router.post('/', campanaController.crearCampana)
router.put('/:id', campanaController.actualizarCampana)
router.delete('/:id', campanaController.eliminarCampana)

module.exports = router