const metricaModel = require('../models/metricaModel')
const prisma = require('../lib/prisma')

const obtenerMetricas = async (req, res) => {
  try {
    let metricas;
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      const campanaIds = await prisma.campana.findMany({ 
        where: { clienteId: miCliente?.id }, 
        select: { id: true } 
      })
      metricas = await prisma.metrica.findMany({
        where: { campanaId: { in: campanaIds.map(c => c.id) } },
        include: { campana: { select: { id: true, nombre: true } } }
      })
    } else {
      metricas = await metricaModel.obtenerTodasMetricas()
    }
    res.json({ 
      mensaje: 'Lista de métricas obtenida exitosamente', 
      total: metricas.length, 
      data: metricas 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener métricas: ${error.message}`,
      mensaje: 'No se pudieron cargar las métricas del sistema.'
    })
  }
}

const obtenerMetricasPorCampana = async (req, res) => {
  const { campanaId } = req.params
  try {
    // Verificar que la campaña pertenezca al cliente si no es admin
    if (req.usuario?.rol !== 'admin') {
      const campana = await prisma.campana.findUnique({ where: { id: Number(campanaId) }, include: { cliente: true } })
      if (!campana || campana.cliente?.email !== req.usuario.email) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver las métricas de tus propias campañas.'
        })
      }
    }
    const metricas = await metricaModel.obtenerMetricasPorCampana(campanaId)
    res.json({ 
      mensaje: `Métricas de la campaña ${campanaId} obtenidas exitosamente`, 
      total: metricas.length, 
      data: metricas 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener métricas de la campaña: ${error.message}`,
      mensaje: 'No se pudieron cargar las métricas de esta campaña.'
    })
  }
}

module.exports = {
  obtenerMetricas,
  obtenerMetricasPorCampana
}
