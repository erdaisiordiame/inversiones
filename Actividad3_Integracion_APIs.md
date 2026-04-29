# T4-Actividad 3. Integración de APIs RESTful

**Asignatura:** Programación Web
**Licenciatura:** Ingeniería en Sistemas Computacionales
**Proyecto Integrador:** Plataforma Financiera Inversiones Drfic (PWA)

El presente documento detalla la implementación de los incisos A hasta H para la Actividad 3 del Tema 4, cubriendo el desarrollo completo de las APIs RESTful (GET, POST, PUT, DELETE) para los submódulos de **Portafolios**, **Velas (Mercado)** y **Alertas**.

---

## A) Listado de APIs Desarrolladas

A continuación se detalla la documentación de las APIs implementadas para los 3 submódulos. Todas las peticiones reciben en el header `Content-Type: application/json`.

### 1. Submódulo de Portafolios
Permite la gestión de carteras de inversión, calculando dinámicamente el valor total en base a los activos adquiridos.

*   **GET `/api/portfolios`**
    *   **Propósito:** Retornar todos los portafolios del sistema junto con su bóveda de activos.
    *   **Body Request:** N/A
    *   **Response (200 OK):** `[ { "_id": "...", "name": "Retiro", "totalValue": 1500, "assets": [...] } ]`
*   **POST `/api/portfolios`**
    *   **Propósito:** Crear un nuevo portafolio vacío.
    *   **Body Request:** `{ "name": "Ahorro", "description": "Largo plazo" }`
    *   **Response (201 Created):** Objeto del portafolio creado.
*   **PUT `/api/portfolios/:id`**
    *   **Propósito:** Actualizar la metadata de un portafolio.
    *   **Body Request:** `{ "name": "Nuevo Nombre" }`
    *   **Response (200 OK):** Objeto del portafolio actualizado.
*   **DELETE `/api/portfolios/:id`**
    *   **Propósito:** Eliminar un portafolio y todos sus activos.
    *   **Body Request:** N/A
    *   **Response (200 OK):** `{ "message": "Eliminado exitosamente" }`
*   **POST `/api/portfolios/:id/assets` (Especializada)**
    *   **Propósito:** Agrega un nuevo activo al portafolio y recalcula matemáticamente el `totalValue` de forma automática en el servidor.
    *   **Body Request:** `{ "symbol": "AAPL", "quantity": 10, "averagePrice": 150 }`
    *   **Response (200 OK):** Objeto del portafolio con el nuevo activo y total actualizado.

### 2. Submódulo de Velas (Historial de Mercado)
Gestiona la persistencia de datos históricos extraídos directamente desde los servidores de Finnhub.

*   **GET `/api/candles`**
    *   **Propósito:** Obtiene el historial de mercado guardado en la base de datos local.
*   **DELETE `/api/candles/:id`**
    *   **Propósito:** Elimina un registro de vela específico.
*   **POST `/api/candles/sync` (Especializada)**
    *   **Propósito:** Se conecta al proveedor Finnhub, obtiene el precio en tiempo real del activo y genera hacia atrás un historial de 10 días, inyectándolo directamente en la base de datos.
    *   **Body Request:** `{ "symbol": "MSFT" }`
    *   **Response (200 OK):** `{ "message": "Sincronizados 10 días de historial real para MSFT desde Finnhub", "data": [...] }`

### 3. Submódulo de Alertas
Motor que vigila las condiciones del mercado y evalúa activamente si los precios cruzan los límites establecidos.

*   **GET `/api/alerts`**
    *   **Propósito:** Retorna todas las alertas de precio configuradas.
*   **POST `/api/alerts`**
    *   **Propósito:** Crea una nueva alerta en estado `Activa`.
    *   **Body Request:** `{ "symbol": "TSLA", "targetPrice": 200, "condition": "above" }`
    *   **Response (201 Created):** Objeto de la alerta creada.
*   **DELETE `/api/alerts/:id`**
    *   **Propósito:** Elimina una regla de alerta.

---

## B) Configuración de la Aplicación RESTful

La aplicación backend fue construida con Node.js y Express. Se configuró explícitamente para soportar JSON y peticiones Cross-Origin (CORS) permitiendo que el Frontend en React pueda comunicarse sin ser bloqueado.

```javascript
// Fragmento de server.js
const app = express();
app.use(cors());
app.use(express.json()); // Habilita la lectura de req.body
```

---

## C) Clases Modelo (Mongoose Schemas)

Se crearon las colecciones estructuradas mediante Schemas de Mongoose.

**Modelo Portfolio (`server/models/Portfolio.js`):**
```javascript
import mongoose from 'mongoose'
import { portfolioConnection } from '../db-portfolios.js'

const PortfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  totalValue: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  assets: [{
    symbol: String,
    quantity: Number,
    averagePrice: Number
  }]
}, { timestamps: true })

const Portfolio = portfolioConnection.model('Portfolio', PortfolioSchema)
export default Portfolio
```

*(Se aplicó el mismo patrón para `Candle.js` y `Alert.js`, definiendo sus respectivos campos como `symbol`, `targetPrice`, `isActive`, etc.)*

---

## D) Conexiones a Múltiples Bases de Datos NoSQL

Cumpliendo con el requerimiento de que la información no debe estar en una sola base de datos, se crearon dos conexiones simultáneas a MongoDB Atlas dentro de la infraestructura:

1.  **Base de datos principal (`pwa_inversions_drfic_db`):** Manejada en `server/db.js` para los módulos legacy (Órdenes, Estrategias).
2.  **Base de datos secundaria dedicada (`pwa_portfolios_db`):** Manejada en `server/db-portfolios.js` exclusivamente para los nuevos submódulos.

**Archivo `server/db-portfolios.js`:**
```javascript
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.VITE_MONGO_URI;
const PORTFOLIOS_DB = process.env.MONGO_PORTFOLIOS_DB_NAME || 'pwa_portfolios_db';

// Se crea una conexión independiente con createConnection
export const portfolioConnection = mongoose.createConnection(`${MONGO_URI}${PORTFOLIOS_DB}`, {
  serverSelectionTimeoutMS: 30000
});

portfolioConnection.on('connected', () => {
  console.log(`Server: connected to Portfolios MongoDB ${MONGO_URI}${PORTFOLIOS_DB}`);
});
```

---

## E) Capa de Servicios

La lógica de negocio pesada fue abstraída a la capa de servicios para mantener limpios los controladores. Destaca el motor automatizado de Alertas (`alertService.js`), el cual incluye un **Cron Job en background** que evalúa el mercado constantemente sin intervención del usuario.

**Servicio de Alertas (`server/services/alertService.js`):**
```javascript
import Alert from '../models/Alert.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const alertService = {
  // Métodos CRUD básicos omitidos por brevedad...
  
  // Lógica del Motor Background
  startAlertEngine: () => {
    console.log("Iniciando Motor Automático de Alertas...");
    setInterval(async () => {
      try {
        const activeSymbols = await Alert.distinct('symbol', { isActive: true });
        for (const symbol of activeSymbols) {
          const formattedSymbol = symbol.toUpperCase();
          const url = `https://finnhub.io/api/v1/quote?symbol=${formattedSymbol}&token=${process.env.VITE_FINNHUB_API_KEY}`;
          const response = await axios.get(url);
          const currentPrice = Number(response.data.c);
          
          if (currentPrice > 0) {
            // Evaluamos la condición
            const activeAlerts = await Alert.find({ symbol: formattedSymbol, isActive: true });
            for (const alert of activeAlerts) {
              let isTriggered = false;
              if (alert.condition === 'above' && currentPrice >= alert.targetPrice) isTriggered = true;
              if (alert.condition === 'below' && currentPrice <= alert.targetPrice) isTriggered = true;

              if (isTriggered) {
                alert.isActive = false; // Desactivar alerta disparada
                await alert.save();
              }
            }
          }
        }
      } catch (error) {
        console.error("Error en motor:", error.message);
      }
    }, 15000); // 15 segundos
  }
}
```

---

## F) Controladores

Los controladores se encargan de recibir el `req` (Request), llamar al Servicio correspondiente, y enviar el `res` (Response) con el estatus HTTP adecuado.

**Controlador Portafolio (`server/controllers/portfolioController.js`):**
```javascript
import { portfolioService } from '../services/portfolioService.js';

export const portfolioController = {
  getAll: async (req, res) => {
    try {
      const data = await portfolioService.getAll();
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  create: async (req, res) => {
    try {
      const data = await portfolioService.create(req.body);
      res.status(201).json(data);
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  addAsset: async (req, res) => {
    try {
      const { symbol, quantity, averagePrice } = req.body;
      const portfolio = await portfolioService.addAsset(req.params.id, symbol, quantity, averagePrice);
      res.json(portfolio);
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  // delete y update omitidos por brevedad...
};
```

---

## G) Ruteos

Cada módulo cuenta con su propio archivo de enrutamiento basado en `express.Router()`, asegurando una arquitectura limpia y modular.

**Rutas de Alertas (`server/routes/alerts.js`):**
```javascript
import express from 'express';
import { alertController } from '../controllers/alertController.js';

const router = express.Router();

router.get('/', alertController.getAll);
router.post('/', alertController.create);
router.put('/:id', alertController.update);
router.delete('/:id', alertController.delete);
router.post('/check', alertController.checkAlerts); // Ruta funcional

export default router;
```

---

## H) Configuración del Index Principal (`server/server.js`)

Finalmente, se importaron todos los enrutadores en el núcleo de Express (`server.js`) y se definieron los prefijos unificados de las APIs. Adicionalmente, aquí se detona la ejecución del motor de Alertas que vigila en el background.

**Configuración App (`server/server.js`):**
```javascript
import express from 'express'
import cors from 'cors'
import { connectMongo } from './db.js'

// Importación de Ruteos
import portfoliosRouter from './routes/portfolios.js'
import candlesRouter from './routes/candles.js'
import alertsRouter from './routes/alerts.js'
import { alertService } from './services/alertService.js'

const app = express()
app.use(cors())
app.use(express.json())

// Registro de endpoints principales
app.use('/api/portfolios', portfoliosRouter)
app.use('/api/candles', candlesRouter)
app.use('/api/alerts', alertsRouter)

const port = Number(process.env.PORT || 4000)

connectMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server: listening on http://localhost:${port}`)
      
      // Arranque del motor automatizado en background
      alertService.startAlertEngine()
    })
  })
  .catch((error) => process.exit(1))
```

Con estas configuraciones, las tres APIs operan independientemente, persisten su información en una base de datos exclusiva para esta etapa del proyecto, y exponen servicios HTTP 100% funcionales listos para su integración con el cliente.
