const prisma = require('../lib/prisma')

const obtenerCampanas = async (estado, clienteId) => {
    const where = { ...(estado ? { estado } : {}), ...(clienteId ? { clienteId } : {}) }
    return await prisma.campana.findMany({
        where,
        include: {
            cliente: true,
            producto: true,
            usuario: { select: { id: true, nombre: true, email: true } },
            metricas: true
        }
    })
}

const crearCampana = async (data) => {
    const { nombre, descripcion, objetivos, estado, fechaInicio, fechaFin, clienteId, productoId, creadoPor, plataformas, presupuesto } = data
    if (!clienteId || isNaN(Number(clienteId))) {
        throw new Error('clienteId es requerido y debe ser un número válido')
    }
    // Verificar que el cliente exista
    const clienteExistente = await prisma.cliente.findUnique({ where: { id: Number(clienteId) } })
    if (!clienteExistente) {
        throw new Error(`El cliente con ID ${clienteId} no existe en el sistema`)
    }
    // Usar Prisma create directamente para evitar problemas de tipos con $queryRaw
    const campana = await prisma.campana.create({
        data: {
            nombre,
            descripcion,
            objetivos,
            estado: estado || 'activa',
            fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
            fechaFin: fechaFin ? new Date(fechaFin) : null,
            clienteId: Number(clienteId),
            productoId: productoId ? Number(productoId) : null,
            creadoPor: Number(creadoPor),
            plataformas: plataformas || [],
            presupuesto: presupuesto ? Number(presupuesto) : null
        }
    })
    return campana
}

const actualizarCampana = async (id, data) => {
    return await prisma.campana.update({
        where: { id: Number(id) },
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            objetivos: data.objetivos,
            estado: data.estado,
            fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
            fechaFin: data.fechaFin ? new Date(data.fechaFin) : undefined,
            clienteId: data.clienteId ? Number(data.clienteId) : undefined,
            productoId: data.productoId ? Number(data.productoId) : null,
            plataformas: data.plataformas,
            presupuesto: data.presupuesto ? Number(data.presupuesto) : null
        }
    })
}

const obtenerCampanaPorId = async (id) => {
    return await prisma.campana.findUnique({
        where: { id: Number(id) },
        include: { cliente: true, producto: true, usuario: { select: { id: true, nombre: true } }, metricas: true, reportes: true }
    })
}

module.exports = {
    obtenerCampanas,
    crearCampana,
    actualizarCampana,
    obtenerCampanaPorId
}
