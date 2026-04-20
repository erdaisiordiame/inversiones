// Market data service module
// Fase 3: integrated with MongoDB

import { MarketDataModel, SymbolModel } from '../db'

export async function fetchMarketData(symbol: string, interval: string = '1d', limit: number = 100) {
  try {
    // Find symbol first
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { data: [], error: 'Symbol not found' }
    }

    // Fetch market data
    const data = await MarketDataModel.find({ symbolId: symbolDoc._id, interval })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    return { data: data.reverse() } // Return in chronological order
  } catch (error) {
    console.error('Error fetching market data:', error)
    return { data: [], error: (error as Error).message }
  }
}

export async function saveMarketData(symbol: string, interval: string, marketData: any[]) {
  try {
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { success: false, error: 'Symbol not found' }
    }

    const docs = marketData.map(data => ({
      symbolId: symbolDoc._id,
      interval,
      timestamp: new Date(data.timestamp),
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      volume: data.volume,
      source: data.source || 'unknown',
      raw: data
    }))

    await MarketDataModel.insertMany(docs)
    return { success: true, inserted: docs.length }
  } catch (error) {
    console.error('Error saving market data:', error)
    return { success: false, error: (error as Error).message }
  }
}
