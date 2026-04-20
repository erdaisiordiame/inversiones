import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  broker_account_id?: mongoose.Types.ObjectId;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: mongoose.Types.Decimal128;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  limit_price?: mongoose.Types.Decimal128;
  stop_price?: mongoose.Types.Decimal128;
  filled_price?: mongoose.Types.Decimal128;
  filled_quantity?: mongoose.Types.Decimal128;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected' | 'partial';
  asset_type: 'STOCK' | 'OPTION' | 'ETF' | 'CRYPTO' | 'FOREX';
  broker_order_id?: string;
  submitted_at?: Date;
  filled_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  broker_account_id: { type: Schema.Types.ObjectId, ref: 'BrokerAccount' },
  symbol: { type: String, required: true },
  side: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL']
  },
  quantity: { type: Schema.Types.Decimal128, required: true },
  order_type: {
    type: String,
    required: true,
    enum: ['market', 'limit', 'stop', 'stop_limit']
  },
  limit_price: { type: Schema.Types.Decimal128 },
  stop_price: { type: Schema.Types.Decimal128 },
  filled_price: { type: Schema.Types.Decimal128 },
  filled_quantity: { type: Schema.Types.Decimal128 },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'filled', 'cancelled', 'rejected', 'partial']
  },
  asset_type: {
    type: String,
    required: true,
    enum: ['STOCK', 'OPTION', 'ETF', 'CRYPTO', 'FOREX']
  },
  broker_order_id: { type: String },
  submitted_at: { type: Date },
  filled_at: { type: Date }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

OrderSchema.index({ user_id: 1, status: 1 });
OrderSchema.index({ symbol: 1, submitted_at: -1 });

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema, 'orders');