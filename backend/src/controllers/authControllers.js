const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { generarToken } = require('../middlewares/auth')

const registrar = async (req, res) => {
  const { nombre, email, password, rol } = req.body
  try {
    // Verificar que el email no esté en uso
    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) {
      return res.status(400).json({
        error: 'Correo en uso',
        mensaje: 'El correo electrónico ya está registrado. Usa otro o inicia sesión.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: rol || 'usuario',
        estado: 'activo'
      }
    })

    // Si es usuario normal (cliente), crear cliente automáticamente vinculado
    if ((rol || 'usuario') !== 'admin') {
      try {
        await prisma.cliente.create({
          data: {
            nombre,
            email,
            telefono: null,
            direccion: null
          }
        })
      } catch (clientError) {
        console.error('Error creando cliente asociado:', clientError.message)
      }
    }

    const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol })
    res.status(201).json({
      mensaje: `Usuario "${usuario.nombre}" registrado exitosamente`,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token
    })
  } catch (error) {
    res.status(500).json({
      error: `Error al registrar usuario: ${error.message}`,
      mensaje: 'No se pudo completar el registro. Intenta de nuevo más tarde.'
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas',
        mensaje: 'El correo o la contraseña no son válidos. Por favor, verifica tus datos.'
      })
    }
    const valid = await bcrypt.compare(password, usuario.password)
    if (!valid) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas',
        mensaje: 'El correo o la contraseña no son válidos. Por favor, verifica tus datos.'
      })
    }
    const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol })
    res.json({ 
      mensaje: `Bienvenido, ${usuario.nombre}. Autenticación exitosa.`, 
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }, 
      token 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error en el login: ${error.message}`,
      mensaje: 'No se pudo iniciar sesión. Intenta de nuevo más tarde.'
    })
  }
}

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, estado: true, fechaRegistro: true }
    })
    res.json({ 
      mensaje: 'Lista de usuarios obtenida exitosamente', 
      total: usuarios.length, 
      data: usuarios 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener usuarios: ${error.message}`,
      mensaje: 'No se pudo cargar la lista de usuarios.'
    })
  }
}

module.exports = { registrar, login, obtenerUsuarios }
