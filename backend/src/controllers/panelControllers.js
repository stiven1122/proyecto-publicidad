const panelModel = require('../models/panelModel')
const prisma = require('../lib/prisma')

const obtenerEstadisticas = async (req, res) => {
  try {
    let data;
    if (req.usuario?.rol !== 'admin') {
      const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
      data = await panelModel.obtenerEstadisticas(miCliente?.id)
    } else {
      data = await panelModel.obtenerEstadisticas()
    }
    res.json({ 
      mensaje: 'Estadísticas del panel obtenidas exitosamente', 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener estadísticas: ${error.message}`,
      mensaje: 'No se pudieron cargar las estadísticas del panel.'
    })
  }
}

const obtenerGraficaProductos = async (req, res) => {
  try {
    const data = await panelModel.obtenerEstadisticasPorProducto()
    res.json({ 
      mensaje: 'Estadísticas por producto obtenidas exitosamente', 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener estadísticas por producto: ${error.message}`,
      mensaje: 'No se pudieron cargar las estadísticas por producto.'
    })
  }
}

const obtenerGraficaClientes = async (req, res) => {
  try {
    const data = await panelModel.obtenerEstadisticasPorCliente()
    res.json({ 
      mensaje: 'Estadísticas por cliente obtenidas exitosamente', 
      data 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener estadísticas por cliente: ${error.message}`,
      mensaje: 'No se pudieron cargar las estadísticas por cliente.'
    })
  }
}

module.exports = {
  obtenerEstadisticas,
  obtenerGraficaProductos,
  obtenerGraficaClientes
}
