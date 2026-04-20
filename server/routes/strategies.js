import express from 'express'
import { Decimal128, ObjectId } from '../db.js'
import { StrategyModel } from '../models/strategy.js'

const router = express.Router()
const defaultUserId = new ObjectId('000000000000000000000001')

function toResponse(strategy) {
  return {
    _id: strategy._id,
    user_id: strategy.user_id,
    name: strategy.name,
    description: strategy.description,
    is_preset: strategy.is_preset,
    is_active: strategy.is_active,
    recommended_timeframes: strategy.recommended_timeframes || [],
    min_confidence_threshold: strategy.min_confidence_threshold?.toString() || '0',
    created_at: strategy.created_at,
    updated_at: strategy.updated_at,
  }
}

function decimalFrom(value) {
  const text = value == null ? '0' : String(value)
  return Decimal128.fromString(text || '0')
}

router.get('/', async (req, res) => {
  const records = await StrategyModel.find().sort({ created_at: -1 }).lean()
  res.json(records.map(toResponse))
})

router.post('/', async (req, res) => {
  const body = req.body
  const strategy = await StrategyModel.create({
    user_id: body.user_id ? new ObjectId(body.user_id) : defaultUserId,
    name: body.name || 'Nueva estrategia',
    description: body.description || '',
    is_preset: body.is_preset || false,
    is_active: body.is_active ?? true,
    recommended_timeframes: Array.isArray(body.recommended_timeframes)
      ? body.recommended_timeframes.filter(Boolean)
      : String(body.recommended_timeframes || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
    min_confidence_threshold: decimalFrom(body.min_confidence_threshold || '0.5'),
  })
  res.status(201).json(toResponse(strategy))
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body
  const update = {
    name: body.name,
    description: body.description,
    is_active: body.is_active,
    is_preset: body.is_preset,
    recommended_timeframes: body.recommended_timeframes
      ? Array.isArray(body.recommended_timeframes)
        ? body.recommended_timeframes.filter(Boolean)
        : String(body.recommended_timeframes)
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
      : undefined,
    min_confidence_threshold: body.min_confidence_threshold
      ? decimalFrom(body.min_confidence_threshold)
      : undefined,
  }
  const cleaned = Object.fromEntries(Object.entries(update).filter(([, value]) => value !== undefined))
  const strategy = await StrategyModel.findByIdAndUpdate(id, cleaned, { new: true })
  if (!strategy) {
    return res.status(404).json({ message: 'Strategy not found' })
  }
  res.json(toResponse(strategy))
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const strategy = await StrategyModel.findByIdAndDelete(id)
  if (!strategy) {
    return res.status(404).json({ message: 'Strategy not found' })
  }
  res.json({ deleted: id })
})

export default router
