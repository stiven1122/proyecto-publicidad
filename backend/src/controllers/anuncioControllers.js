const pool = require('../config/db')

const obtenerAnuncios = async () => {
    const result = await pool.query('SELECT * FROM anuncios')
    return result.rows
}

const crearAnuncio = async (titulo, contenido, tipo, id_campana) => {
    await pool.query(
        'SELECT crear_anuncio($1, $2, $3, $4)',
        [titulo, contenido, tipo, id_campana]
    )
}

module.exports = {
    obtenerAnuncios,
    crearAnuncio
}