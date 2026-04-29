import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectMongo } from './db.js'
import ordersRouter from './routes/orders.js'
import strategiesRouter from './routes/strategies.js'
import watchlistsRouter from './routes/watchlists.js'
import portfoliosRouter from './routes/portfolios.js'
import candlesRouter from './routes/candles.js'
import alertsRouter from './routes/alerts.js'
import { alertService } from './services/alertService.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/orders', ordersRouter)
app.use('/api/strategies', strategiesRouter)
app.use('/api/watchlists', watchlistsRouter)
app.use('/api/portfolios', portfoliosRouter)
app.use('/api/candles', candlesRouter)
app.use('/api/alerts', alertsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'pwa-inversions-drfic-api' })
})

app.get('/', (req, res) => {
  res.send('PWA Inversiones Drfic backend is running')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Server error', error: err.message || String(err) })
})

const port = Number(process.env.PORT || 4000)
connectMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server: listening on http://localhost:${port}`)
      alertService.startAlertEngine()
    })
  })
  .catch((error) => {
    console.error('Server failed to start', error)
    process.exit(1)
  })
