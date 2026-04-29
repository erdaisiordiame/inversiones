import { portfolioService } from '../services/portfolioService.js'

export const portfolioController = {
  getAll: async (req, res) => {
    try {
      const portfolios = await portfolioService.getAll()
      res.status(200).json(portfolios)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener portafolios', error: error.message })
    }
  },

  getById: async (req, res) => {
    try {
      const portfolio = await portfolioService.getById(req.params.id)
      if (!portfolio) {
        return res.status(404).json({ message: 'Portafolio no encontrado' })
      }
      res.status(200).json(portfolio)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener portafolio', error: error.message })
    }
  },

  create: async (req, res) => {
    try {
      // Validar datos básicos
      if (!req.body.name) {
        return res.status(400).json({ message: 'El nombre del portafolio es obligatorio' })
      }
      const newPortfolio = await portfolioService.create(req.body)
      res.status(201).json(newPortfolio)
    } catch (error) {
      res.status(400).json({ message: 'Error al crear portafolio', error: error.message })
    }
  },

  update: async (req, res) => {
    try {
      const updatedPortfolio = await portfolioService.update(req.params.id, req.body)
      if (!updatedPortfolio) {
        return res.status(404).json({ message: 'Portafolio no encontrado para actualizar' })
      }
      res.status(200).json(updatedPortfolio)
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar portafolio', error: error.message })
    }
  },

  delete: async (req, res) => {
    try {
      const deletedPortfolio = await portfolioService.delete(req.params.id)
      if (!deletedPortfolio) {
        return res.status(404).json({ message: 'Portafolio no encontrado para eliminar' })
      }
      res.status(200).json({ message: 'Portafolio eliminado con éxito', id: req.params.id })
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar portafolio', error: error.message })
    }
  },

  addAsset: async (req, res) => {
    try {
      const { symbol, quantity, averagePrice } = req.body;
      if (!symbol || quantity === undefined || averagePrice === undefined) {
        return res.status(400).json({ message: 'symbol, quantity y averagePrice son requeridos' });
      }
      const updatedPortfolio = await portfolioService.addAsset(req.params.id, { symbol, quantity, averagePrice });
      res.status(200).json({ message: 'Activo agregado y valor recalculado', portfolio: updatedPortfolio });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
