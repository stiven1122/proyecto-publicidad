const prisma = require('../lib/prisma')

const obtenerNotificaciones = async (usuarioId) => {
    return await prisma.notificacion.findMany({
        where: { usuarioId: Number(usuarioId) },
        orderBy: { fecha: 'desc' },
        include: { campana: { select: { id: true, nombre: true } } }
    })
}

const marcarLeida = async (id) => {
    return await prisma.notificacion.update({
        where: { id: Number(id) },
        data: { leida: true }
    })
}

module.exports = {
    obtenerNotificaciones,
    marcarLeida
}
