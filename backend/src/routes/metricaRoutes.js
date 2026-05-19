const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const {
  obtenerMetricas,
  obtenerMetricasPorCampana
} = require('../controllers/metricaControllers')

router.get('/', authMiddleware, obtenerMetricas)
router.get('/:campanaId', authMiddleware, obtenerMetricasPorCampana)

module.exports = router
