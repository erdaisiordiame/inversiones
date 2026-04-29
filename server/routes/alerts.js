import express from 'express'
import { alertController } from '../controllers/alertController.js'

const router = express.Router()

router.get('/', alertController.getAll)
router.get('/:id', alertController.getById)
router.post('/', alertController.create)
router.post('/check', alertController.checkAlerts) // <-- RUTA DE USO REAL
router.put('/:id', alertController.update)
router.delete('/:id', alertController.delete)

export default router
