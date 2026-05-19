const prisma = require('../lib/prisma')

const obtenerReportes = async () => {
    return await prisma.reporte.findMany({
        include: {
            campana: { select: { id: true, nombre: true } },
            usuario: { select: { id: true, nombre: true } }
        }
    })
}

const generarReporte = async (campanaId, generadoPor, tipoReporte, urlArchivo) => {
    const reporte = await prisma.reporte.create({
        data: {
            campanaId: Number(campanaId),
            generadoPor: Number(generadoPor),
            tipoReporte,
            urlArchivo
        }
    })
    return reporte
}

const reporteCampana = async () => {
    return await prisma.campana.findMany({
        include: {
            cliente: true,
            metricas: true,
            reportes: true
        }
    })
}

module.exports = {
    obtenerReportes,
    generarReporte,
    reporteCampana
}
