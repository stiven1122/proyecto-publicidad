const clienteModel = require('../models/clienteModel')
const prisma = require('../lib/prisma')

const obtenerClientes = async (req, res) => {
  try {
    // Si no es admin, solo devolver su propio perfil
    if (req.usuario?.rol !== 'admin') {
      const cliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      return res.json({ 
        mensaje: 'Perfil del cliente obtenido', 
        total: cliente ? 1 : 0, 
        data: cliente ? [cliente] : [] 
      })
    }
    const clientes = await clienteModel.obtenerClientes()
    res.json({ 
      mensaje: 'Lista de clientes obtenida exitosamente', 
      total: clientes.length, 
      data: clientes 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener clientes: ${error.message}`,
      mensaje: 'No se pudo cargar la lista de clientes.'
    })
  }
}

const crearCliente = async (req, res) => {
  const { nombre, email, telefono, direccion } = req.body
  try {
    const nuevoCliente = await clienteModel.crearCliente(nombre, email, telefono, direccion)
    res.status(201).json({ 
      mensaje: `Cliente "${nuevoCliente.nombre}" registrado exitosamente`, 
      data: nuevoCliente 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al registrar cliente: ${error.message}`,
      mensaje: 'No se pudo registrar el cliente. Verifica que el correo no esté en uso.'
    })
  }
}

const obtenerCliente = async (req, res) => {
  const { id } = req.params
  try {
    // Si no es admin, solo puede ver su propio perfil
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      if (!miCliente || miCliente.id !== Number(id)) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver tu propio perfil de cliente.'
        })
      }
    }
    const cliente = await clienteModel.obtenerClientePorId(id)
    if (!cliente) return res.status(404).json({ 
      error: 'Cliente no encontrado',
      mensaje: `No existe un cliente con ID ${id}. Verifica el identificador.`
    })
    res.json({ 
      mensaje: 'Cliente encontrado exitosamente', 
      data: cliente 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener cliente: ${error.message}`,
      mensaje: 'No se pudo cargar la información del cliente.'
    })
  }
}

const obtenerMiPerfil = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
    if (!cliente) return res.status(404).json({ 
      error: 'Perfil no encontrado',
      mensaje: 'No se encontró un perfil de cliente asociado a tu cuenta.'
    })
    res.json({ 
      mensaje: 'Perfil obtenido exitosamente', 
      data: cliente 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener perfil: ${error.message}`,
      mensaje: 'No se pudo cargar tu perfil de cliente.'
    })
  }
}

const obtenerCampanasDeCliente = async (req, res) => {
  const { id } = req.params
  try {
    // Si no es admin, verificar que sea su propio ID
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      if (!miCliente || miCliente.id !== Number(id)) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver las campañas de tu propio perfil.'
        })
      }
    }
    const campanas = await clienteModel.obtenerCampanasPorCliente(id)
    res.json({ 
      mensaje: `Campañas del cliente obtenidas exitosamente`, 
      total: campanas.length, 
      data: campanas 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener campañas del cliente: ${error.message}`,
      mensaje: 'No se pudo cargar el historial de campañas del cliente.'
    })
  }
}

module.exports = {
  obtenerClientes,
  crearCliente,
  obtenerCliente,
  obtenerMiPerfil,
  obtenerCampanasDeCliente
}
