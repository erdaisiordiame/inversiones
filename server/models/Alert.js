import mongoose from 'mongoose'
import { portfolioConnection } from '../db-portfolios.js'

const AlertSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  condition: { type: String, enum: ['above', 'below'], required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Alert = portfolioConnection.model('Alert', AlertSchema)
export default Alert
