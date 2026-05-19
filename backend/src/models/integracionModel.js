const prisma = require('../lib/prisma')

const obtenerIntegraciones = async () => {
    return await prisma.integracion.findMany()
}

const crearIntegracion = async (nombrePlataforma, apiKey, estado) => {
    return await prisma.integracion.create({
        data: { nombrePlataforma, apiKey, estado: estado || 'activa' }
    })
}

const actualizarIntegracion = async (id, data) => {
    return await prisma.integracion.update({
        where: { id: Number(id) },
        data
    })
}

const eliminarIntegracion = async (id) => {
    return await prisma.integracion.delete({ where: { id: Number(id) } })
}

module.exports = {
    obtenerIntegraciones,
    crearIntegracion,
    actualizarIntegracion,
    eliminarIntegracion
}
