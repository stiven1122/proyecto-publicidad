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
  .then(() => console.log('PostgreSQL conectado correctamente'))
  .catch(err => console.error('Error de conexión:', err))

// ---------------------------
// 🔹 RUTA BASE
// ---------------------------
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


// ======================================================
// 🚀 RUTAS CON PROCEDIMIENTOS ALMACENADOS
// ======================================================

// 👤 USUARIOS
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_usuarios()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/usuarios', async (req, res) => {
  const { nombre, email } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_usuario($1, $2)',
      [nombre, email]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// 🧑‍💼 CLIENTES
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_clientes()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/clientes', async (req, res) => {
  const { nombre } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_cliente($1)',
      [nombre]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// 📢 CAMPAÑAS
app.get('/api/campanas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_campanas()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/campanas', async (req, res) => {
  const { nombre } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_campana($1)',
      [nombre]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// 📺 ANUNCIOS
app.get('/api/anuncios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_anuncios()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/anuncios', async (req, res) => {
  const { titulo } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_anuncio($1)',
      [titulo]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// 💳 PAGOS
app.get('/api/pagos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_pagos()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/pagos', async (req, res) => {
  const { monto } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_pago($1)',
      [monto]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// 📊 REPORTES
app.get('/api/reportes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_reportes()')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/reportes', async (req, res) => {
  const { descripcion } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM crear_reporte($1)',
      [descripcion]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// ======================================================

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})