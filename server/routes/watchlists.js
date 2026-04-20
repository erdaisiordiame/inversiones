import express from 'express'
import { ObjectId } from '../db.js'
import { WatchlistModel } from '../models/watchlist.js'

const router = express.Router()
const defaultUserId = new ObjectId('000000000000000000000001')

function toResponse(watchlist) {
  return {
    _id: watchlist._id,
    user_id: watchlist.user_id,
    name: watchlist.name,
    description: watchlist.description,
    is_default: watchlist.is_default,
    is_active: watchlist.is_active,
    symbols: watchlist.symbols || [],
    created_at: watchlist.created_at,
    updated_at: watchlist.updated_at,
  }
}

function normalizeSymbols(value) {
  if (Array.isArray(value)) {
    return value
      .map((symbol) => String(symbol || '').trim())
      .filter(Boolean)
      .map((symbol, index) => ({ symbol, instrument_type: 'Stock', sort_order: index + 1, is_active: true }))
  }

  return String(value || '')
    .split(',')
    .map((symbol) => symbol.trim())
    .filter(Boolean)
    .map((symbol, index) => ({ symbol, instrument_type: 'Stock', sort_order: index + 1, is_active: true }))
}

router.get('/', async (req, res) => {
  const items = await WatchlistModel.find().sort({ created_at: -1 }).lean()
  res.json(items.map(toResponse))
})

router.post('/', async (req, res) => {
  const body = req.body
  const watchlist = await WatchlistModel.create({
    user_id: body.user_id ? new ObjectId(body.user_id) : defaultUserId,
    name: body.name || 'Nueva watchlist',
    description: body.description || '',
    is_default: body.is_default || false,
    is_active: body.is_active ?? true,
    symbols: normalizeSymbols(body.symbols),
  })
  res.status(201).json(toResponse(watchlist))
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body
  const update = {
    name: body.name,
    description: body.description,
    is_default: body.is_default,
    is_active: body.is_active,
    symbols: body.symbols ? normalizeSymbols(body.symbols) : undefined,
  }
  const cleaned = Object.fromEntries(Object.entries(update).filter(([, value]) => value !== undefined))
  const watchlist = await WatchlistModel.findByIdAndUpdate(id, cleaned, { new: true })
  if (!watchlist) {
    return res.status(404).json({ message: 'Watchlist not found' })
  }
  res.json(toResponse(watchlist))
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const watchlist = await WatchlistModel.findByIdAndDelete(id)
  if (!watchlist) {
    return res.status(404).json({ message: 'Watchlist not found' })
  }
  res.json({ deleted: id })
})

export default router
