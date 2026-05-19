const integracionModel = require('../models/integracionModel')

const obtenerIntegraciones = async (req, res) => {
  try {
    const data = await integracionModel.obtenerIntegraciones()
    res.json({ 
      mensaje: 'Lista de integraciones obtenida exitosamente', 
      total: data.length, 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener integraciones: ${error.message}`,
      mensaje: 'No se pudieron cargar las integraciones.'
    })
  }
}

const crearIntegracion = async (req, res) => {
  const { nombrePlataforma, apiKey, estado } = req.body
  try {
    const nueva = await integracionModel.crearIntegracion(nombrePlataforma, apiKey, estado)
    res.status(201).json({ 
      mensaje: `Integración con "${nueva.nombrePlataforma}" creada exitosamente`, 
      data: nueva 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al crear integración: ${error.message}`,
      mensaje: 'No se pudo crear la integración.'
    })
  }
}

const actualizarIntegracion = async (req, res) => {
  const { id } = req.params
  try {
    const actualizada = await integracionModel.actualizarIntegracion(id, req.body)
    res.json({ 
      mensaje: `Integración "${actualizada.nombrePlataforma}" actualizada exitosamente`, 
      data: actualizada 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al actualizar integración: ${error.message}`,
      mensaje: 'No se pudo actualizar la integración. Verifica que exista.'
    })
  }
}

const eliminarIntegracion = async (req, res) => {
  const { id } = req.params
  try {
    const eliminada = await integracionModel.eliminarIntegracion(id)
    res.json({ 
      mensaje: `Integración "${eliminada.nombrePlataforma}" eliminada exitosamente`, 
      data: eliminada 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al eliminar integración: ${error.message}`,
      mensaje: 'No se pudo eliminar la integración.'
    })
  }
}

module.exports = {
  obtenerIntegraciones,
  crearIntegracion,
  actualizarIntegracion,
  eliminarIntegracion
}
