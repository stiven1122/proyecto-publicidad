const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: '123456',
  database: 'publicidad_db'
})

module.exports = pool