import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    broker_account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BrokerAccount' },
    symbol: { type: String, required: true },
    side: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL'],
    },
    quantity: { type: mongoose.Schema.Types.Decimal128, required: true },
    order_type: {
      type: String,
      required: true,
      enum: ['market', 'limit', 'stop', 'stop_limit'],
    },
    limit_price: { type: mongoose.Schema.Types.Decimal128 },
    stop_price: { type: mongoose.Schema.Types.Decimal128 },
    filled_price: { type: mongoose.Schema.Types.Decimal128 },
    filled_quantity: { type: mongoose.Schema.Types.Decimal128 },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'filled', 'cancelled', 'rejected', 'partial'],
      default: 'pending',
    },
    asset_type: {
      type: String,
      required: true,
      enum: ['STOCK', 'OPTION', 'ETF', 'CRYPTO', 'FOREX'],
    },
    broker_order_id: { type: String },
    submitted_at: { type: Date },
    filled_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

OrderSchema.index({ user_id: 1, status: 1 })
OrderSchema.index({ symbol: 1, submitted_at: -1 })

export const OrderModel = mongoose.model('Order', OrderSchema, 'orders')
