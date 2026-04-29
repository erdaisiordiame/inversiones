import mongoose from 'mongoose'
import { portfolioConnection } from '../db-portfolios.js'

const CandleSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  interval: { type: String, required: true }, // e.g., '1h', '1d'
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number },
  timestamp: { type: Date, required: true }
}, { timestamps: true })

const Candle = portfolioConnection.model('Candle', CandleSchema)
export default Candle
