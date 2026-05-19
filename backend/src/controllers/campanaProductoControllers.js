const campanaProductoModel = require('../models/campanaProductoModel')

const listarProductosPorCampana = async (req, res) => {
    const { campanaId } = req.params
    try {
        const productos = await campanaProductoModel.listarProductosPorCampana(campanaId)
        const presupuesto = await campanaProductoModel.calcularPresupuestoRestante(campanaId)
        res.json({
            mensaje: 'Productos de la campaña obtenidos exitosamente',
            data: productos,
            presupuesto
        })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudieron cargar los productos de la campaña.' })
    }
}

const asignarProducto = async (req, res) => {
    const { campanaId } = req.params
    const { productoId, cantidad } = req.body
    try {
        const asignado = await campanaProductoModel.asignarProducto(campanaId, productoId, cantidad)
        const presupuesto = await campanaProductoModel.calcularPresupuestoRestante(campanaId)
        res.status(201).json({
            mensaje: `Producto "${asignado.producto.nombre}" asignado a la campaña exitosamente`,
            data: asignado,
            presupuesto
        })
    } catch (error) {
        res.status(400).json({ error: `Error: ${error.message}`, mensaje: error.message })
    }
}

const eliminarProductoDeCampana = async (req, res) => {
    const { id } = req.params
    try {
        const eliminado = await campanaProductoModel.eliminarProductoDeCampana(id)
        const presupuesto = await campanaProductoModel.calcularPresupuestoRestante(eliminado.campanaId)
        res.json({
            mensaje: `Producto "${eliminado.producto.nombre}" eliminado de la campaña exitosamente`,
            data: eliminado,
            presupuesto
        })
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}`, mensaje: 'No se pudo eliminar el producto de la campaña.' })
    }
}

module.exports = {
    listarProductosPorCampana,
    asignarProducto,
    eliminarProductoDeCampana
}
