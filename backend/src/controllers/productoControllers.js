const productoModel = require('../models/productoModel')

const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoModel.obtenerProductos()
    res.json({ 
      mensaje: 'Lista de productos obtenida exitosamente', 
      total: productos.length, 
      data: productos 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener productos: ${error.message}`,
      mensaje: 'No se pudo cargar el catálogo de productos.'
    })
  }
}

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body
  try {
    const nuevo = await productoModel.crearProducto(nombre, descripcion, precio, categoria)
    res.status(201).json({ 
      mensaje: `Producto "${nuevo.nombre}" agregado exitosamente`, 
      data: nuevo 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al agregar producto: ${error.message}`,
      mensaje: 'No se pudo agregar el producto.'
    })
  }
}

const actualizarProducto = async (req, res) => {
  const { id } = req.params
  try {
    const actualizado = await productoModel.actualizarProducto(id, req.body)
    res.json({ 
      mensaje: `Producto "${actualizado.nombre}" actualizado exitosamente`, 
      data: actualizado 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al actualizar producto: ${error.message}`,
      mensaje: 'No se pudo actualizar el producto. Verifica que exista.'
    })
  }
}

const obtenerProducto = async (req, res) => {
  const { id } = req.params
  try {
    const producto = await productoModel.obtenerProductoPorId(id)
    if (!producto) return res.status(404).json({ 
      error: 'Producto no encontrado',
      mensaje: `No existe un producto con ID ${id}. Verifica el identificador.`
    })
    res.json({ 
      mensaje: 'Producto encontrado exitosamente', 
      data: producto 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al obtener producto: ${error.message}`,
      mensaje: 'No se pudo cargar la información del producto.'
    })
  }
}

const eliminarProducto = async (req, res) => {
  const { id } = req.params
  try {
    const eliminado = await productoModel.eliminarProducto(id)
    res.json({ 
      mensaje: `Producto "${eliminado.nombre}" eliminado exitosamente`, 
      data: eliminado 
    })
  } catch (error) {
    res.status(500).json({ 
      error: `Error al eliminar producto: ${error.message}`,
      mensaje: 'No se pudo eliminar el producto. Puede estar asociado a campañas.'
    })
  }
}

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  obtenerProducto,
  eliminarProducto
}
