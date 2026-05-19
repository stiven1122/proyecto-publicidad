const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
  obtenerCampanas,
  crearCampana,
  actualizarCampana,
  obtenerCampana,
  eliminarCampana
} = require('../controllers/campanaControllers')

router.get('/', authMiddleware, obtenerCampanas)
router.post('/', authMiddleware, adminMiddleware, crearCampana)
router.get('/:id', authMiddleware, obtenerCampana)
router.put('/:id', authMiddleware, adminMiddleware, actualizarCampana)
router.delete('/:id', authMiddleware, adminMiddleware, eliminarCampana)

module.exports = router
