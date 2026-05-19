const reporteModel = require('../models/reporteModel')
const prisma = require('../lib/prisma')

const obtenerReportes = async (req, res) => {
  try {
    let reportes;
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      const campanaIds = await prisma.campana.findMany({ 
        where: { clienteId: miCliente?.id }, 
        select: { id: true } 
      })
      reportes = await prisma.reporte.findMany({
        where: { campanaId: { in: campanaIds.map(c => c.id) } },
        include: {
          campana: { select: { id: true, nombre: true } },
          usuario: { select: { id: true, nombre: true } }
        }
      })
    } else {
      reportes = await reporteModel.obtenerReportes()
    }
    res.json({ 
      mensaje: 'Lista de reportes obtenida exitosamente', 
      total: reportes.length, 
      data: reportes 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener reportes: ${error.message}`,
      mensaje: 'No se pudieron cargar los reportes.'
    })
  }
}

const generarReporte = async (req, res) => {
  const { campanaId, tipoReporte, urlArchivo } = req.body
  const generadoPor = req.usuario?.id || req.body.generadoPor
  try {
    // Verificar que la campaña pertenezca al cliente si no es admin
    if (req.usuario?.rol !== 'admin') {
      const campana = await prisma.campana.findUnique({ where: { id: Number(campanaId) }, include: { cliente: true } })
      if (!campana || campana.cliente?.email !== req.usuario.email) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          mensaje: 'Solo puedes generar reportes de tus propias campañas.'
        })
      }
    }
    const reporte = await reporteModel.generarReporte(campanaId, generadoPor, tipoReporte, urlArchivo)
    res.status(201).json({ 
      mensaje: `Reporte de tipo "${tipoReporte}" generado exitosamente`, 
      data: reporte 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al generar reporte: ${error.message}`,
      mensaje: 'No se pudo generar el reporte. Verifica que la campaña exista.'
    })
  }
}

const reporteCampana = async (req, res) => {
  try {
    let data;
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      data = await prisma.campana.findMany({
        where: { clienteId: miCliente?.id },
        include: {
          cliente: true,
          metricas: true,
          reportes: true
        }
      })
    } else {
      data = await reporteModel.reporteCampana()
    }
    res.json({ 
      mensaje: 'Resumen de campañas obtenido exitosamente', 
      total: data.length, 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener resumen de campañas: ${error.message}`,
      mensaje: 'No se pudo cargar el resumen de campañas.'
    })
  }
}

module.exports = {
  obtenerReportes,
  generarReporte,
  reporteCampana
}
