const prisma = require('../lib/prisma')

const obtenerClientes = async () => {
    return await prisma.cliente.findMany()
}

const crearCliente = async (nombre, email, telefono, direccion) => {
    // Verificar email único antes de insertar
    const existente = await prisma.cliente.findUnique({ where: { email } })
    if (existente) throw new Error('El correo del cliente ya esta registrado')
    
    const cliente = await prisma.cliente.create({
        data: { nombre, email, telefono, direccion }
    })
    return cliente
}

const obtenerClientePorId = async (id) => {
    return await prisma.cliente.findUnique({ where: { id: Number(id) } })
}

const obtenerCampanasPorCliente = async (clienteId) => {
    return await prisma.campana.findMany({
        where: { clienteId: Number(clienteId) },
        include: { cliente: true, producto: true, usuario: { select: { id: true, nombre: true } } }
    })
}

module.exports = {
    obtenerClientes,
    crearCliente,
    obtenerClientePorId,
    obtenerCampanasPorCliente
}
