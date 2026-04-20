import mongoose, { Schema, Document } from 'mongoose';

export interface ISignalPerformance extends Document {
  signal_id: mongoose.Types.ObjectId;
  symbol: string;
  action: string;
  confidence?: mongoose.Types.Decimal128;
  entry_price?: mongoose.Types.Decimal128;
  exit_price?: mongoose.Types.Decimal128;
  pnl?: mongoose.Types.Decimal128;
  pnl_pct?: mongoose.Types.Decimal128;
  result: 'win' | 'loss' | 'open' | 'unknown';
  trade_id?: mongoose.Types.ObjectId;
  recorded_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const SignalPerformanceSchema = new Schema<ISignalPerformance>({
  signal_id: { type: Schema.Types.ObjectId, ref: 'SignalEvent', required: true },
  symbol: { type: String, required: true },
  action: { type: String, required: true },
  confidence: { type: Schema.Types.Decimal128 },
  entry_price: { type: Schema.Types.Decimal128 },
  exit_price: { type: Schema.Types.Decimal128 },
  pnl: { type: Schema.Types.Decimal128 },
  pnl_pct: { type: Schema.Types.Decimal128 },
  result: {
    type: String,
    required: true,
    enum: ['win', 'loss', 'open', 'unknown']
  },
  trade_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  recorded_at: { type: Date }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

SignalPerformanceSchema.index({ signal_id: 1 });
SignalPerformanceSchema.index({ symbol: 1, result: 1 });

export const SignalPerformanceModel = mongoose.model<ISignalPerformance>('SignalPerformance', SignalPerformanceSchema, 'signal_performance');