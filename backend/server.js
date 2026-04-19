require('dotenv').config()
const app = require('./src/app')
const pool = require('./src/config/db')

const PORT = process.env.PORT || 3000

// prueba de conexión
pool.connect()
  .then(() => {
    console.log('✅ PostgreSQL conectado correctamente')
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  })
  .catch(err => console.error('❌ Error de conexión:', err))