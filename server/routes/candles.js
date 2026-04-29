import express from 'express'
import { candleController } from '../controllers/candleController.js'

const router = express.Router()

router.get('/', candleController.getAll)
router.get('/:id', candleController.getById)
router.post('/', candleController.create)
router.post('/sync', candleController.syncData) // <-- RUTA DE USO REAL BINANCE
router.put('/:id', candleController.update)
router.delete('/:id', candleController.delete)

export default router
