const prisma = require('../lib/prisma')

const obtenerMetricasPorCampana = async (campanaId) => {
    return await prisma.metrica.findMany({
        where: { campanaId: Number(campanaId) }
    })
}

const obtenerTodasMetricas = async () => {
    return await prisma.metrica.findMany({
        include: { campana: { select: { id: true, nombre: true } } }
    })
}

module.exports = {
    obtenerMetricasPorCampana,
    obtenerTodasMetricas
}
