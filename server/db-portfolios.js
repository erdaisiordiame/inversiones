import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || process.env.VITE_MONGO_URI || 'mongodb://localhost:27017/'
const MONGO_PORTFOLIOS_DB_NAME = process.env.MONGO_PORTFOLIOS_DB_NAME || 'pwa_portfolios_db'
const MONGO_URL = `${MONGO_URI}${MONGO_PORTFOLIOS_DB_NAME}`

// Crea una conexión secundaria aislada para cumplir con el requerimiento de bases de datos separadas
export const portfolioConnection = mongoose.createConnection(MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
})

portfolioConnection.on('connected', () => {
  console.log('Server: connected to Portfolios MongoDB', MONGO_URL)
})

portfolioConnection.on('error', (err) => {
  console.error('Server: Portfolios MongoDB connection error', err)
})
