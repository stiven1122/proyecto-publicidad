const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// conexión PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// prueba de conexión
pool.connect()
  .then(() => console.log('✅ PostgreSQL conectado correctamente'))
  .catch(err => console.error('❌ Error de conexión:', err))

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({
      mensaje: 'Servidor funcionando correctamente',
      horaBD: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})