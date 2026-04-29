import { alertService } from '../services/alertService.js'

export const alertController = {
  getAll: async (req, res) => {
    try { res.status(200).json(await alertService.getAll()) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },
  getById: async (req, res) => {
    try { res.status(200).json(await alertService.getById(req.params.id)) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },
  create: async (req, res) => {
    try { res.status(201).json(await alertService.create(req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  },
  update: async (req, res) => {
    try { res.status(200).json(await alertService.update(req.params.id, req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  },
  delete: async (req, res) => {
    try { res.status(200).json(await alertService.delete(req.params.id)) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },

  checkAlerts: async (req, res) => {
    try {
      const { symbol } = req.body;
      if (!symbol) {
        return res.status(400).json({ error: 'symbol es requerido (ej. BTCUSDT)' });
      }
      
      // Llamada real a la API de Finnhub
      const formattedSymbol = symbol.toUpperCase();
      const apiKey = process.env.VITE_FINNHUB_API_KEY;
      const axios = (await import('axios')).default;
      
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${formattedSymbol}&token=${apiKey}`);
      const currentPrice = Number(response.data.c); // 'c' es current price en finnhub
      
      if (!currentPrice) {
        throw new Error('Símbolo no encontrado en Finnhub');
      }

      const triggered = await alertService.checkAlerts(formattedSymbol, currentPrice);
      res.status(200).json({
        message: `El precio real de ${formattedSymbol} en Finnhub es $${currentPrice}`,
        triggered_count: triggered.length,
        notifications: triggered
      });
    } catch (e) {
      res.status(500).json({ error: 'Error verificando el precio en Finnhub o BD: ' + e.message });
    }
  }
}
