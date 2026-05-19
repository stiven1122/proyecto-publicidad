const prisma = require('../lib/prisma')

const calcularPresupuestoRestante = async (campanaId) => {
    const campana = await prisma.campana.findUnique({
        where: { id: Number(campanaId) },
        select: { presupuesto: true }
    })
    const asignados = await prisma.campanaProducto.aggregate({
        where: { campanaId: Number(campanaId) },
        _sum: { precioUnitario: true }
    })
    const totalPresupuesto = Number(campana?.presupuesto || 0)
    const totalGastado = Number(asignados._sum.precioUnitario || 0)
    return {
        total: totalPresupuesto,
        gastado: totalGastado,
        restante: totalPresupuesto - totalGastado
    }
}

const listarProductosPorCampana = async (campanaId) => {
    return await prisma.campanaProducto.findMany({
        where: { campanaId: Number(campanaId) },
        include: { producto: { select: { id: true, nombre: true, precio: true, categoria: true } } },
        orderBy: { fechaAsignacion: 'desc' }
    })
}

const asignarProducto = async (campanaId, productoId, cantidad) => {
    const producto = await prisma.producto.findUnique({ where: { id: Number(productoId) } })
    if (!producto) throw new Error('Producto no encontrado')

    const presupuesto = await calcularPresupuestoRestante(campanaId)
    const precioTotal = Number(producto.precio) * Number(cantidad || 1)

    if (presupuesto.restante < precioTotal) {
        throw new Error(`Presupuesto insuficiente. Restante: $${presupuesto.restante.toLocaleString()}, necesitas: $${precioTotal.toLocaleString()}`)
    }

    return await prisma.campanaProducto.create({
        data: {
            campanaId: Number(campanaId),
            productoId: Number(productoId),
            cantidad: Number(cantidad || 1),
            precioUnitario: precioTotal
        },
        include: { producto: true }
    })
}

const eliminarProductoDeCampana = async (id) => {
    return await prisma.campanaProducto.delete({
        where: { id: Number(id) },
        include: { producto: true }
    })
}

module.exports = {
    calcularPresupuestoRestante,
    listarProductosPorCampana,
    asignarProducto,
    eliminarProductoDeCampana
}
