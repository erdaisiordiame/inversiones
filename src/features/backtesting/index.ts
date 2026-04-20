// Backtesting feature module
// Fase 3: integrated with MongoDB

import { BacktestModel, SymbolModel } from '../../services/db'

export async function runBacktest(symbol: string, strategy: string, periodStart: Date, periodEnd: Date) {
  try {
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { result: 'error', error: 'Symbol not found' }
    }

    // Mock backtest result
    const mockResult = {
      trades: Math.floor(Math.random() * 100),
      winRate: Math.random(),
      sharpeRatio: Math.random() * 2 - 1,
      returnPercent: (Math.random() - 0.5) * 100
    }

    // Save backtest to DB
    const backtest = new BacktestModel({
      symbolId: symbolDoc._id,
      strategy,
      periodStart,
      periodEnd,
      ...mockResult
    })

    await backtest.save()

    return { result: 'completed', data: mockResult, id: backtest._id }
  } catch (error) {
    console.error('Error running backtest:', error)
    return { result: 'error', error: (error as Error).message }
  }
}

export async function getBacktests(symbol: string) {
  try {
    const symbolDoc = await SymbolModel.findOne({ symbol })
    if (!symbolDoc) {
      return { backtests: [], error: 'Symbol not found' }
    }

    const backtests = await BacktestModel.find({ symbolId: symbolDoc._id })
      .sort({ createdAt: -1 })
      .lean()

    return { backtests }
  } catch (error) {
    console.error('Error fetching backtests:', error)
    return { backtests: [], error: (error as Error).message }
  }
}
