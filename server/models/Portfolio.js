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
