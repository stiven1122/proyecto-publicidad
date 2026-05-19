const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'clave_secreta_publicidad_2026'

const generarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' })
}

const verificarToken = (token) => {
  return jwt.verify(token, SECRET)
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Token no proporcionado',
      mensaje: 'No se encontró un token de autenticación. Inicia sesión para acceder a este recurso.'
    })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ 
      error: 'Token mal formado',
      mensaje: 'El header de autorización debe tener el formato: Bearer <token>'
    })
  }

  try {
    const decoded = verificarToken(token)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token invalido o expirado',
      mensaje: 'Tu sesión ha expirado o el token no es válido. Por favor, inicia sesión nuevamente.'
    })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado',
      mensaje: 'Esta acción requiere privilegios de administrador. Contacta a un administrador si necesitas acceso.'
    })
  }
  next()
}

module.exports = { generarToken, verificarToken, authMiddleware, adminMiddleware }
