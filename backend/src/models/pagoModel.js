const pool = require('../config/db')

// GET
const obtenerPagos = async () => {
    const result = await pool.query('SELECT * FROM obtener_pagos()')
    return result.rows
}

// GET por ID
const obtenerPagoPorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_pago_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// POST
const crearPago = async (monto, fecha, metodo, id_cliente) => {
    const result = await pool.query(
        'SELECT * FROM crear_pago($1, $2, $3, $4)',
        [monto, fecha, metodo, id_cliente]
    )
    return result.rows[0]
}

// PUT
const actualizarPago = async (id, monto, fecha, metodo, id_cliente) => {
    const result = await pool.query(
        'SELECT * FROM actualizar_pago($1, $2, $3, $4, $5)',
        [id, monto, fecha, metodo, id_cliente]
    )
    return result.rows[0]
}

// DELETE
const eliminarPago = async (id) => {
    await pool.query('SELECT eliminar_pago($1)', [id])
}

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago
}