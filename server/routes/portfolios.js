import express from 'express'
import { portfolioController } from '../controllers/portfolioController.js'

const router = express.Router()

// Implementación de las rutas para cumplir con el inciso G de la guía
router.get('/', portfolioController.getAll)
router.get('/:id', portfolioController.getById)
router.post('/', portfolioController.create)
router.post('/:id/assets', portfolioController.addAsset) // <-- RUTA DE USO REAL
router.put('/:id', portfolioController.update)
router.delete('/:id', portfolioController.delete)

export default router
