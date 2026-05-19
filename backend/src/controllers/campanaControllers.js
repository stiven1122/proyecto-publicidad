const campanaModel = require('../models/campanaModel')
const prisma = require('../lib/prisma')

const obtenerCampanas = async (req, res) => {
  const { estado } = req.query
  try {
    let campanas;
    // Si es cliente, filtrar solo sus campañas
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      campanas = await campanaModel.obtenerCampanas(estado, miCliente?.id)
    } else {
      campanas = await campanaModel.obtenerCampanas(estado)
    }
    res.json({ 
      mensaje: estado ? `Lista de campañas filtradas por estado "${estado}"` : 'Lista de campañas obtenida exitosamente', 
      total: campanas.length, 
      data: campanas 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener campañas: ${error.message}`,
      mensaje: 'No se pudo cargar la lista de campañas.'
    })
  }
}

const crearCampana = async (req, res) => {
  try {
    let data = { ...req.body, creadoPor: req.usuario?.id || req.body.creadoPor }
    
    // Si es cliente, asignar automáticamente su clienteId
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      if (miCliente) {
        data.clienteId = miCliente.id
      } else {
        return res.status(400).json({
          error: 'Cliente no encontrado',
          mensaje: 'Tu usuario no está registrado como cliente en el sistema. Contacta al administrador.'
        })
      }
    }
    
    // Validar que admin envíe clienteId
    if (req.usuario?.rol === 'admin' && (!data.clienteId || isNaN(Number(data.clienteId)))) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Debes seleccionar un cliente para la campaña.'
      })
    }
    
    const nueva = await campanaModel.crearCampana(data)
    res.status(201).json({ 
      mensaje: `Campaña "${nueva.nombre}" creada exitosamente`, 
      data: nueva 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al crear campaña: ${error.message}`,
      mensaje: 'No se pudo crear la campaña. Verifica que el cliente y el producto existan.'
    })
  }
}

const actualizarCampana = async (req, res) => {
  const { id } = req.params
  try {
    // Verificar que la campaña pertenezca al cliente si no es admin
    if (req.usuario?.rol !== 'admin') {
      const campana = await prisma.campana.findUnique({ where: { id: Number(id) }, include: { cliente: true } })
      if (!campana || campana.cliente?.email !== req.usuario.email) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          mensaje: 'Solo puedes editar tus propias campañas.'
        })
      }
    }
    
    const actualizada = await campanaModel.actualizarCampana(id, req.body)
    res.json({ 
      mensaje: `Campaña "${actualizada.nombre}" actualizada exitosamente`, 
      data: actualizada 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al actualizar campaña: ${error.message}`,
      mensaje: 'No se pudo actualizar la campaña. Verifica que exista.'
    })
  }
}

const obtenerCampana = async (req, res) => {
  const { id } = req.params
  try {
    const campana = await campanaModel.obtenerCampanaPorId(id)
    if (!campana) return res.status(404).json({ 
      error: 'Campaña no encontrada',
      mensaje: `No existe una campaña con ID ${id}. Verifica el identificador.`
    })
    
    // Verificar que la campaña pertenezca al cliente si no es admin
    if (req.usuario?.rol !== 'admin' && campana.cliente?.email !== req.usuario.email) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'Solo puedes ver tus propias campañas.'
      })
    }
    
    res.json({ 
      mensaje: 'Campaña encontrada exitosamente', 
      data: campana 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener campaña: ${error.message}`,
      mensaje: 'No se pudo cargar la información de la campaña.'
    })
  }
}

const eliminarCampana = async (req, res) => {
  const { id } = req.params
  try {
    const campana = await campanaModel.obtenerCampanaPorId(id)
    if (!campana) return res.status(404).json({ 
      error: 'Campaña no encontrada',
      mensaje: `No existe una campaña con ID ${id}.`
    })
    
    await prisma.campana.delete({ where: { id: Number(id) } })
    res.json({ 
      mensaje: `Campaña "${campana.nombre}" eliminada exitosamente`, 
      data: campana 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al eliminar campaña: ${error.message}`,
      mensaje: 'No se pudo eliminar la campaña.'
    })
  }
}

module.exports = {
  obtenerCampanas,
  crearCampana,
  actualizarCampana,
  obtenerCampana,
  eliminarCampana
}
