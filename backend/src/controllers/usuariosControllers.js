const usuariosModel = require('../models/usuariosModel')

// ===============================
// GET TODOS
// ===============================
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosModel.obtenerUsuarios()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// GET POR ID
// ===============================
const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params

    try {
        const usuario = await usuariosModel.obtenerUsuarioPorId(id)
        res.json(usuario)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// POST
// ===============================
const crearUsuario = async (req, res) => {
    const { nombre, correo, password, rol } = req.body

    try {
        const nuevoUsuario = await usuariosModel.crearUsuario(nombre, correo, password, rol)
        res.status(201).json(nuevoUsuario)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// PUT
// ===============================
const actualizarUsuario = async (req, res) => {
    const { id } = req.params
    const { nombre, correo, password, rol } = req.body

    try {
        await usuariosModel.actualizarUsuario(id, nombre, correo, password, rol)
        res.json({ mensaje: 'Usuario actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ===============================
// DELETE
// ===============================
const eliminarUsuario = async (req, res) => {
    const { id } = req.params

    try {
        await usuariosModel.eliminarUsuario(id)
        res.json({ mensaje: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}