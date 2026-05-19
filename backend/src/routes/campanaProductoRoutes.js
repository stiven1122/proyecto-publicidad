const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
    listarProductosPorCampana,
    asignarProducto,
    eliminarProductoDeCampana
} = require('../controllers/campanaProductoControllers')

router.get('/:campanaId/productos', authMiddleware, listarProductosPorCampana)
router.post('/:campanaId/productos', authMiddleware, adminMiddleware, asignarProducto)
router.delete('/productos/:id', authMiddleware, adminMiddleware, eliminarProductoDeCampana)

module.exports = router
