const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const {
  obtenerNotificaciones,
  marcarLeida
} = require('../controllers/notificacionControllers')

router.get('/', authMiddleware, obtenerNotificaciones)
router.put('/:id/leida', authMiddleware, marcarLeida)

module.exports = router
