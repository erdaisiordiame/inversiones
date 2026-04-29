import Alert from '../models/Alert.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const alertService = {
  getAll: async () => await Alert.find().sort({ createdAt: -1 }),
  getById: async (id) => await Alert.findById(id),
  create: async (data) => await new Alert(data).save(),
  update: async (id, data) => await Alert.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id) => await Alert.findByIdAndDelete(id),
  
  checkAlerts: async (symbol, currentPrice) => {
    const activeAlerts = await Alert.find({ symbol: symbol, isActive: true });
    let triggered = [];

    for (const alert of activeAlerts) {
      let isTriggered = false;
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) isTriggered = true;
      if (alert.condition === 'below' && currentPrice <= alert.targetPrice) isTriggered = true;

      if (isTriggered) {
        alert.isActive = false;
        await alert.save();
        triggered.push({
          alertId: alert._id,
          message: `El precio de ${symbol} cruzó ${alert.condition === 'above' ? 'hacia arriba' : 'hacia abajo'} de $${alert.targetPrice} (Precio actual: $${currentPrice})`
        });
      }
    }
    return triggered;
  },

  startAlertEngine: () => {
    console.log("Iniciando Motor Automático de Alertas...");
    // Revisar cada 15 segundos
    setInterval(async () => {
      try {
        // Encontrar todos los símbolos únicos con alertas activas
        const activeSymbols = await Alert.distinct('symbol', { isActive: true });
        
        for (const symbol of activeSymbols) {
          const formattedSymbol = symbol.toUpperCase();
          const apiKey = process.env.VITE_FINNHUB_API_KEY;
          const url = `https://finnhub.io/api/v1/quote?symbol=${formattedSymbol}&token=${apiKey}`;
          
          const response = await axios.get(url);
          const currentPrice = Number(response.data.c);
          
          if (currentPrice && currentPrice > 0) {
            const triggered = await alertService.checkAlerts(formattedSymbol, currentPrice);
            if (triggered.length > 0) {
              console.log(`[ALERT ENGINE] ¡Se dispararon ${triggered.length} alertas para ${formattedSymbol} a $${currentPrice}!`);
            }
          }
        }
      } catch (error) {
        console.error("[ALERT ENGINE] Error verificando alertas:", error.message);
      }
    }, 15000); // 15,000 ms = 15 segundos
  }
}
