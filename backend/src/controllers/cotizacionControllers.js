const cotizacionModel = require('../models/cotizacionModel')
const prisma = require('../lib/prisma')
const campanaModel = require('../models/campanaModel')

// === Cotizaciones de Campaña ===
const listarCotizacionesCampana = async (req, res) => {
    try {
        let cotizaciones
        if (req.usuario?.rol !== 'admin') {
            const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
            cotizaciones = await cotizacionModel.listarCotizacionesCampana(miCliente?.id)
        } else {
            cotizaciones = await cotizacionModel.listarCotizacionesCampana()
        }
        res.json({ mensaje: 'Cotizaciones de campaña obtenidas', data: cotizaciones })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudieron cargar las cotizaciones.' })
    }
}

const crearCotizacionCampana = async (req, res) => {
    try {
        let data = { ...req.body }
        if (req.usuario?.rol !== 'admin') {
            const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
            if (miCliente) data.clienteId = miCliente.id
        }
        const nueva = await cotizacionModel.crearCotizacionCampana(data)
        res.status(201).json({ mensaje: 'Cotización de campaña enviada exitosamente', data: nueva })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudo enviar la cotización.' })
    }
}

const actualizarEstadoCotizacionCampana = async (req, res) => {
    const { id } = req.params
    const { estado } = req.body // aprobada | rechazada
    try {
        if (!['aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido', mensaje: 'El estado debe ser "aprobada" o "rechazada"' })
        }
        const actualizada = await cotizacionModel.actualizarEstadoCotizacionCampana(id, estado)

        // Si es aprobada, crear la campaña automáticamente
        if (estado === 'aprobada') {
            const cotizacion = await prisma.cotizacionCampana.findUnique({ where: { id: Number(id) }, include: { cliente: true } })
            if (cotizacion) {
                await campanaModel.crearCampana({
                    nombre: cotizacion.nombre,
                    descripcion: cotizacion.descripcion,
                    estado: 'activa',
                    clienteId: cotizacion.clienteId,
                    creadoPor: req.usuario?.id || 1,
                    plataformas: []
                })
            }
        }

        res.json({ mensaje: `Cotización ${estado} exitosamente`, data: actualizada })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudo actualizar la cotización.' })
    }
}

// === Cotizaciones de Producto ===
const listarCotizacionesProducto = async (req, res) => {
    try {
        let cotizaciones
        if (req.usuario?.rol !== 'admin') {
            const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
            cotizaciones = await cotizacionModel.listarCotizacionesProducto(miCliente?.id)
        } else {
            cotizaciones = await cotizacionModel.listarCotizacionesProducto()
        }
        res.json({ mensaje: 'Cotizaciones de producto obtenidas', data: cotizaciones })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudieron cargar las cotizaciones.' })
    }
}

const crearCotizacionProducto = async (req, res) => {
    try {
        let data = { ...req.body }
        if (req.usuario?.rol !== 'admin') {
            const miCliente = await prisma.cliente.findUnique({ where: { email: req.usuario.email } })
            if (miCliente) data.clienteId = miCliente.id
        }
        const nueva = await cotizacionModel.crearCotizacionProducto(data)
        res.status(201).json({ mensaje: 'Cotización de producto enviada exitosamente', data: nueva })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudo enviar la cotización.' })
    }
}

const actualizarEstadoCotizacionProducto = async (req, res) => {
    const { id } = req.params
    const { estado } = req.body
    try {
        if (!['aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido', mensaje: 'El estado debe ser "aprobada" o "rechazada"' })
        }
        const actualizada = await cotizacionModel.actualizarEstadoCotizacionProducto(id, estado)
        res.json({ mensaje: `Cotización de producto ${estado} exitosamente`, data: actualizada })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudo actualizar la cotización.' })
    }
}

module.exports = {
    listarCotizacionesCampana,
    crearCotizacionCampana,
    actualizarEstadoCotizacionCampana,
    listarCotizacionesProducto,
    crearCotizacionProducto,
    actualizarEstadoCotizacionProducto
}
