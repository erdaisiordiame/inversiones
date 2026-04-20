import mongoose, { Schema, Document } from 'mongoose';

export interface IPosition extends Document {
  user_id: mongoose.Types.ObjectId;
  broker_account_id?: mongoose.Types.ObjectId;
  order_id?: mongoose.Types.ObjectId;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: mongoose.Types.Decimal128;
  entry_price: mongoose.Types.Decimal128;
  current_price?: mongoose.Types.Decimal128;
  stop_loss?: mongoose.Types.Decimal128;
  take_profit?: mongoose.Types.Decimal128;
  unrealized_pnl?: mongoose.Types.Decimal128;
  unrealized_pnl_pct?: mongoose.Types.Decimal128;
  asset_type: 'STOCK' | 'OPTION' | 'ETF' | 'CRYPTO' | 'FOREX';
  is_open?: boolean;
  opened_at?: Date;
  closed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const PositionSchema = new Schema<IPosition>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  broker_account_id: { type: Schema.Types.ObjectId, ref: 'BrokerAccount' },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  symbol: { type: String, required: true },
  side: {
    type: String,
    required: true,
    enum: ['LONG', 'SHORT']
  },
  quantity: { type: Schema.Types.Decimal128, required: true },
  entry_price: { type: Schema.Types.Decimal128, required: true },
  current_price: { type: Schema.Types.Decimal128 },
  stop_loss: { type: Schema.Types.Decimal128 },
  take_profit: { type: Schema.Types.Decimal128 },
  unrealized_pnl: { type: Schema.Types.Decimal128 },
  unrealized_pnl_pct: { type: Schema.Types.Decimal128 },
  asset_type: {
    type: String,
    required: true,
    enum: ['STOCK', 'OPTION', 'ETF', 'CRYPTO', 'FOREX']
  },
  is_open: { type: Boolean, default: true },
  opened_at: { type: Date },
  closed_at: { type: Date }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

PositionSchema.index({ user_id: 1, is_open: 1 });
PositionSchema.index({ symbol: 1, opened_at: -1 });

export const PositionModel = mongoose.model<IPosition>('Position', PositionSchema, 'positions');