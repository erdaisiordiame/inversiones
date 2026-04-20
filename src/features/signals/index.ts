// Signals feature module
// Fase 3: integrated with MongoDB

import { SignalModel, SymbolModel } from '../../services/db'

export async function generateSignal(symbol: string, interval: string = '1d') {
  try {
    // Find symbol
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { signal: 'HOLD', confidence: 0, error: 'Symbol not found' }
    }

    // Simple heuristic: random for demo
    const signals = ['BUY', 'SELL', 'HOLD'] as const
    const signal = signals[Math.floor(Math.random() * signals.length)]
    const confidence = Math.random()

    // Save signal to DB
    const newSignal = new SignalModel({
      symbolId: symbolDoc._id,
      timestamp: new Date(),
      interval,
      signal,
      confidence,
      origin: 'heuristic',
      status: 'created'
    })

    await newSignal.save()

    return { signal, confidence, id: newSignal._id }
  } catch (error) {
    console.error('Error generating signal:', error)
    return { signal: 'HOLD', confidence: 0, error: (error as Error).message }
  }
}

export async function getSignals(symbol: string, limit: number = 10) {
  try {
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { signals: [], error: 'Symbol not found' }
    }

    const signals = await SignalModel.find({ symbolId: symbolDoc._id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    return { signals: signals.reverse() }
  } catch (error) {
    console.error('Error fetching signals:', error)
    return { signals: [], error: (error as Error).message }
  }
}
