const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
  obtenerClientes,
  crearCliente,
  obtenerCliente,
  obtenerMiPerfil,
  obtenerCampanasDeCliente
} = require('../controllers/clienteControllers')

router.get('/', authMiddleware, obtenerClientes)
router.get('/miperfil', authMiddleware, obtenerMiPerfil)
router.post('/', authMiddleware, adminMiddleware, crearCliente)
router.get('/:id', authMiddleware, obtenerCliente)
router.get('/:id/campanas', authMiddleware, obtenerCampanasDeCliente)

module.exports = router
