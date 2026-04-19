const usuariosModel = require('../models/usuariosModel')

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosModel.obtenerUsuarios()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const crearUsuario = async (req, res) => {
    const { nombre, correo, password } = req.body

    try {
        const nuevoUsuario = await usuariosModel.crearUsuario(nombre, correo, password)
        res.status(201).json(nuevoUsuario)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerUsuarios,
    crearUsuario
}