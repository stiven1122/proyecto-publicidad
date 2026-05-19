const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  // Verificar si ya existe un admin
  const adminExistente = await prisma.usuario.findFirst({
    where: { rol: 'admin' }
  })

  if (adminExistente) {
    console.log('✅ Ya existe un usuario administrador:', adminExistente.email)
    await prisma.$disconnect()
    return
  }

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@admanager.com',
      password: hashedPassword,
      rol: 'admin',
      estado: 'activo',
      fechaRegistro: new Date()
    }
  })

  console.log('✅ Usuario administrador creado exitosamente')
  console.log('   Email: admin@admanager.com')
  console.log('   Contraseña: admin123')
  console.log('   Rol: admin')

  // Crear algunos productos de ejemplo si no existen
  const productosCount = await prisma.producto.count()
  if (productosCount === 0) {
    await prisma.producto.createMany({
      data: [
        { nombre: 'Folleto A4', descripcion: 'Folleto publicitario tamaño A4 full color', precio: 1500.00, categoria: 'Impresion' },
        { nombre: 'Calcomanías Vinilo', descripcion: 'Stickers personalizados resistentes al agua', precio: 800.00, categoria: 'Impresion' },
        { nombre: 'Pendón Publicitario', descripcion: 'Banner de gran formato para eventos', precio: 45000.00, categoria: 'Publicidad Exterior' },
        { nombre: 'Tarjetas de Presentación', descripcion: 'Tarjetas premium full color', precio: 500.00, categoria: 'Impresion' },
        { nombre: 'Publicidad en Redes', descripcion: 'Campaña publicitaria en redes sociales', precio: 200000.00, categoria: 'Digital' },
      ]
    })
    console.log('✅ Productos de ejemplo creados')
  }

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
