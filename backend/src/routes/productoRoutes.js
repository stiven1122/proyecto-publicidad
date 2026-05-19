const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  obtenerProducto,
  eliminarProducto
} = require('../controllers/productoControllers')

router.get('/', authMiddleware, obtenerProductos)
router.post('/', authMiddleware, crearProducto)
router.get('/:id', authMiddleware, obtenerProducto)
router.put('/:id', authMiddleware, adminMiddleware, actualizarProducto)
router.delete('/:id', authMiddleware, adminMiddleware, eliminarProducto)

module.exports = router
