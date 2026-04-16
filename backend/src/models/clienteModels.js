const pool = require('../../config/db')

const getAllClientes = () => {
  return pool.query('SELECT * FROM clientes')
}

module.exports = { getAllClientes }