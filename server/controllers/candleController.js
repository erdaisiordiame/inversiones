import { candleService } from '../services/candleService.js'

export const candleController = {
  getAll: async (req, res) => {
    try { res.status(200).json(await candleService.getAll()) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },
  getById: async (req, res) => {
    try { res.status(200).json(await candleService.getById(req.params.id)) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },
  create: async (req, res) => {
    try { res.status(201).json(await candleService.create(req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  },
  update: async (req, res) => {
    try { res.status(200).json(await candleService.update(req.params.id, req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  },
  delete: async (req, res) => {
    try { res.status(200).json(await candleService.delete(req.params.id)) }
    catch (e) { res.status(500).json({ error: e.message }) }
  },

  syncData: async (req, res) => {
    try {
      const { symbol } = req.body;
      if (!symbol) {
        return res.status(400).json({ error: 'symbol es requerido (ej. BTCUSDT)' });
      }
      const generated = await candleService.syncRealMarketData(symbol);
      res.status(201).json({
        message: `Sincronizados ${generated.length} días de historial real para ${symbol} desde Finnhub`,
        data: generated
      });
    } catch (e) {
      res.status(500).json({ error: 'Error al conectar con Finnhub o DB: ' + e.message });
    }
  }
}
