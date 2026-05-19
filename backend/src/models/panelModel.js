const prisma = require('../lib/prisma')

const obtenerEstadisticas = async (clienteId) => {
    const where = clienteId ? { clienteId } : {}
    
    const totalCampanas = await prisma.campana.count({ where })
    const campanasActivas = await prisma.campana.count({ where: { ...where, estado: 'activa' } })
    const campanasFinalizadas = await prisma.campana.count({ where: { ...where, estado: 'finalizada' } })
    const campanasPausadas = await prisma.campana.count({ where: { ...where, estado: 'pausada' } })

    // Inversión = suma de presupuesto de campañas
    const presupuestoAgg = await prisma.campana.aggregate({
        where,
        _sum: { presupuesto: true }
    })

    // Gastado total en productos asignados
    let campanaIds = []
    if (clienteId) {
        campanaIds = (await prisma.campana.findMany({ where, select: { id: true } })).map(c => c.id)
    }
    const gastadoAgg = await prisma.campanaProducto.aggregate({
        where: campanaIds.length > 0 ? { campanaId: { in: campanaIds } } : {},
        _sum: { precioUnitario: true }
    })

    const totalPresupuesto = Number(presupuestoAgg._sum.presupuesto || 0)
    const totalGastado = Number(gastadoAgg._sum.precioUnitario || 0)

    const totalClientes = clienteId ? 1 : await prisma.cliente.count()
    const totalUsuarios = clienteId ? 1 : await prisma.usuario.count()
    const totalProductos = await prisma.producto.count()

    return {
        totales: { campanas: totalCampanas, clientes: totalClientes, usuarios: totalUsuarios, productos: totalProductos },
        campanas: { activas: campanasActivas, finalizadas: campanasFinalizadas, pausadas: campanasPausadas },
        inversion: totalPresupuesto,
        presupuesto: {
            total: totalPresupuesto,
            gastado: totalGastado,
            restante: totalPresupuesto - totalGastado
        }
    }
}

const obtenerEstadisticasPorProducto = async () => {
    const productos = await prisma.producto.findMany({
        include: {
            campanasAsignadas: {
                include: {
                    campana: { select: { id: true, presupuesto: true } }
                }
            }
        }
    })

    return productos.map(p => {
        const campanasUnicas = new Set(p.campanasAsignadas.map(ca => ca.campanaId))
        const totalGastado = p.campanasAsignadas.reduce((sum, ca) => sum + (Number(ca.precioUnitario) || 0), 0)
        return {
            nombre: p.nombre,
            campanas: campanasUnicas.size,
            inversion: totalGastado
        }
    }).filter(p => p.campanas > 0)
}

const obtenerEstadisticasPorCliente = async () => {
    const clientes = await prisma.cliente.findMany({
        include: {
            campanas: {
                select: { presupuesto: true }
            }
        }
    })

    return clientes.map(c => {
        const totalCampanas = c.campanas.length
        const totalPresupuesto = c.campanas.reduce((sum, camp) => sum + (Number(camp.presupuesto) || 0), 0)
        return {
            nombre: c.nombre,
            campanas: totalCampanas,
            inversion: totalPresupuesto
        }
    }).filter(c => c.campanas > 0)
}

module.exports = { obtenerEstadisticas, obtenerEstadisticasPorProducto, obtenerEstadisticasPorCliente }
