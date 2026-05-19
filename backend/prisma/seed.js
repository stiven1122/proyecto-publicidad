const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

async function main() {
  await client.connect()
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
  await client.query(sql)
  console.log('✅ Procedimientos almacenados y triggers ejecutados correctamente')
  await client.end()
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed SQL:', e)
    process.exit(1)
  })
