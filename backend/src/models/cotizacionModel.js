const prisma = require('../lib/prisma')

// === Cotizaciones de Campaña ===
const listarCotizacionesCampana = async (clienteId) => {
    const where = clienteId ? { clienteId } : {}
    return await prisma.cotizacionCampana.findMany({
        where,
        include: { cliente: { select: { id: true, nombre: true, email: true } } },
        orderBy: { fechaSolicitud: 'desc' }
    })
}

const crearCotizacionCampana = async (data) => {
    return await prisma.cotizacionCampana.create({
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            clienteId: Number(data.clienteId),
            estado: 'pendiente'
        }
    })
}

const cotizarCampana = async (id, data) => {
    return await prisma.cotizacionCampana.update({
        where: { id: Number(id) },
        data: {
            estado: 'cotizada',
            presupuesto: data.presupuesto ? Number(data.presupuesto) : null,
            fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
            fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
            respuesta: data.respuesta || null,
            objetivos: data.objetivos || null,
            plataformas: data.plataformas || [],
            fechaRespuesta: new Date()
        }
    })
}

const actualizarEstadoCotizacionCampana = async (id, estado) => {
    return await prisma.cotizacionCampana.update({
        where: { id: Number(id) },
        data: {
            estado,
            fechaRespuesta: new Date()
        }
    })
}

// === Cotizaciones de Producto ===
const listarCotizacionesProducto = async (clienteId) => {
    const where = clienteId ? { clienteId } : {}
    return await prisma.cotizacionProducto.findMany({
        where,
        include: {
            cliente: { select: { id: true, nombre: true, email: true } },
            producto: { select: { id: true, nombre: true, precio: true, categoria: true } }
        },
        orderBy: { fechaSolicitud: 'desc' }
    })
}

const crearCotizacionProducto = async (data) => {
    return await prisma.cotizacionProducto.create({
        data: {
            productoId: Number(data.productoId),
            clienteId: Number(data.clienteId),
            descripcion: data.descripcion || null,
            inversion: data.inversion ? Number(data.inversion) : null,
            estado: 'pendiente'
        }
    })
}

const actualizarEstadoCotizacionProducto = async (id, estado) => {
    return await prisma.cotizacionProducto.update({
        where: { id: Number(id) },
        data: {
            estado,
            fechaRespuesta: new Date()
        }
    })
}

module.exports = {
    listarCotizacionesCampana,
    crearCotizacionCampana,
    cotizarCampana,
    actualizarEstadoCotizacionCampana,
    listarCotizacionesProducto,
    crearCotizacionProducto,
    actualizarEstadoCotizacionProducto
}
