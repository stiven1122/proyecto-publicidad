const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
  obtenerIntegraciones,
  crearIntegracion,
  actualizarIntegracion,
  eliminarIntegracion
} = require('../controllers/integracionControllers')

router.get('/', authMiddleware, obtenerIntegraciones)
router.post('/', authMiddleware, adminMiddleware, crearIntegracion)
router.put('/:id', authMiddleware, adminMiddleware, actualizarIntegracion)
router.delete('/:id', authMiddleware, adminMiddleware, eliminarIntegracion)

module.exports = router
