const pool = require('../config/db')

// GET todos
const obtenerAnuncios = async () => {
    const result = await pool.query('SELECT * FROM obtener_anuncios()')
    return result.rows
}

// GET por ID
const obtenerAnuncioPorId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM obtener_anuncio_por_id($1)',
        [id]
    )
    return result.rows[0]
}

// POST
const crearAnuncio = async (titulo, contenido, tipo, id_campana) => {
    const result = await pool.query(
        'SELECT * FROM crear_anuncio($1, $2, $3, $4)',
        [titulo, contenido, tipo, id_campana]
    )
    return result.rows[0]
}

// PUT
const actualizarAnuncio = async (id, titulo, contenido, tipo, id_campana) => {
    const result = await pool.query(
        'SELECT * FROM actualizar_anuncio($1, $2, $3, $4, $5)',
        [id, titulo, contenido, tipo, id_campana]
    )
    return result.rows[0]
}

// DELETE
const eliminarAnuncio = async (id) => {
    await pool.query('SELECT eliminar_anuncio($1)', [id])
}

module.exports = {
    obtenerAnuncios,
    obtenerAnuncioPorId,
    crearAnuncio,
    actualizarAnuncio,
    eliminarAnuncio
}