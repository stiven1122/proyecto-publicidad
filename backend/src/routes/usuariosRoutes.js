const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosControllers')

router.get('/', usuariosController.obtenerUsuarios)
router.post('/', usuariosController.crearUsuario)

module.exports = router