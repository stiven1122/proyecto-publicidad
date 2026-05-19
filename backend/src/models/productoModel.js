const prisma = require('../lib/prisma')

const obtenerProductos = async () => {
    return await prisma.producto.findMany()
}

const crearProducto = async (nombre, descripcion, precio, categoria) => {
    return await prisma.producto.create({
        data: { nombre, descripcion, precio, categoria }
    })
}

const actualizarProducto = async (id, data) => {
    return await prisma.producto.update({
        where: { id: Number(id) },
        data
    })
}

const obtenerProductoPorId = async (id) => {
    return await prisma.producto.findUnique({ where: { id: Number(id) } })
}

const eliminarProducto = async (id) => {
    return await prisma.producto.delete({ where: { id: Number(id) } })
}

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    obtenerProductoPorId,
    eliminarProducto
}
