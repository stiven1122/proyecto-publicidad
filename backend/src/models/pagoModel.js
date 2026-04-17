const pool = require('../config/db')

const obtenerPagos = async () => {
    const result = await pool.query('SELECT * FROM pagos')
    return result.rows
}

const crearPago = async (monto, fecha, metodo, id_cliente) => {
    await pool.query(
        'SELECT crear_pago($1, $2, $3, $4)',
        [monto, fecha, metodo, id_cliente]
    )
}

module.exports = {
    obtenerPagos,
    crearPago
}