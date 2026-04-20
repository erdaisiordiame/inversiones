import express from 'express'
import { Decimal128, ObjectId } from '../db.js'
import { OrderModel } from '../models/order.js'

const router = express.Router()
const defaultUserId = new ObjectId('000000000000000000000001')

function toResponse(order) {
  return {
    _id: order._id,
    user_id: order.user_id,
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity?.toString() || '0',
    order_type: order.order_type,
    status: order.status,
    asset_type: order.asset_type,
    limit_price: order.limit_price?.toString() || '',
    stop_price: order.stop_price?.toString() || '',
    filled_price: order.filled_price?.toString() || '',
    filled_quantity: order.filled_quantity?.toString() || '',
    broker_order_id: order.broker_order_id,
    submitted_at: order.submitted_at,
    filled_at: order.filled_at,
    created_at: order.created_at,
    updated_at: order.updated_at,
  }
}

function decimalFrom(value) {
  const text = value == null ? '0' : String(value)
  return Decimal128.fromString(text || '0')
}

router.get('/', async (req, res) => {
  const orders = await OrderModel.find().sort({ created_at: -1 }).lean()
  res.json(orders.map(toResponse))
})

router.post('/', async (req, res) => {
  const body = req.body
  const order = await OrderModel.create({
    user_id: body.user_id ? new ObjectId(body.user_id) : defaultUserId,
    symbol: body.symbol || 'UNKNOWN',
    side: body.side || 'BUY',
    quantity: decimalFrom(body.quantity || '1'),
    order_type: body.order_type || 'market',
    asset_type: body.asset_type || 'STOCK',
    status: body.status || 'pending',
    limit_price: body.limit_price ? decimalFrom(body.limit_price) : undefined,
    stop_price: body.stop_price ? decimalFrom(body.stop_price) : undefined,
  })
  res.status(201).json(toResponse(order))
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body
  const update = {
    symbol: body.symbol,
    side: body.side,
    order_type: body.order_type,
    asset_type: body.asset_type,
    status: body.status,
    quantity: body.quantity ? decimalFrom(body.quantity) : undefined,
    limit_price: body.limit_price ? decimalFrom(body.limit_price) : undefined,
    stop_price: body.stop_price ? decimalFrom(body.stop_price) : undefined,
  }

  const cleaned = Object.fromEntries(Object.entries(update).filter(([, value]) => value !== undefined))
  const order = await OrderModel.findByIdAndUpdate(id, cleaned, { new: true })
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  res.json(toResponse(order))
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const order = await OrderModel.findByIdAndDelete(id)
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  res.json({ deleted: id })
})

export default router
