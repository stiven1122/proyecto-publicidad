const notificacionModel = require('../models/notificacionModel')

const obtenerNotificaciones = async (req, res) => {
  const usuarioId = req.usuario?.id || req.query.usuarioId
  try {
    const data = await notificacionModel.obtenerNotificaciones(usuarioId)
    const noLeidas = data.filter(n => !n.leida).length
    res.json({ 
      mensaje: `Notificaciones obtenidas. Tienes ${noLeidas} sin leer.`, 
      total: data.length,
      noLeidas,
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener notificaciones: ${error.message}`,
      mensaje: 'No se pudieron cargar las notificaciones.'
    })
  }
}

const marcarLeida = async (req, res) => {
  const { id } = req.params
  try {
    const data = await notificacionModel.marcarLeida(id)
    res.json({ 
      mensaje: 'Notificación marcada como leída exitosamente', 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al marcar notificación: ${error.message}`,
      mensaje: 'No se pudo marcar la notificación como leída.'
    })
  }
}

module.exports = {
  obtenerNotificaciones,
  marcarLeida
}
