import mongoose, { Schema, Document } from 'mongoose';

export interface ISignalEvent extends Document {
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M' | '1Y';
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: mongoose.Types.Decimal128;
  score?: mongoose.Types.Decimal128;
  score_max?: mongoose.Types.Decimal128;
  strategy_id?: mongoose.Types.ObjectId;
  selected_cores?: any[];
  indicators?: Record<string, any>;
  cores?: Record<string, any>;
  ai_confirmation?: Record<string, any>;
  suggested_params?: Record<string, any>;
  price_at_signal?: mongoose.Types.Decimal128;
  reason?: string;
  status: 'active' | 'executed' | 'dismissed' | 'expired';
  expires_at?: Date;
  occurred_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

const SignalEventSchema = new Schema<ISignalEvent>({
  symbol: { type: String, required: true },
  timeframe: {
    type: String,
    required: true,
    enum: ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M', '1Y']
  },
  action: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL', 'HOLD']
  },
  confidence: { type: Schema.Types.Decimal128, required: true },
  score: { type: Schema.Types.Decimal128 },
  score_max: { type: Schema.Types.Decimal128 },
  strategy_id: { type: Schema.Types.ObjectId, ref: 'Strategy' },
  selected_cores: [{ type: Schema.Types.Mixed }],
  indicators: { type: Schema.Types.Mixed },
  cores: { type: Schema.Types.Mixed },
  ai_confirmation: { type: Schema.Types.Mixed },
  suggested_params: { type: Schema.Types.Mixed },
  price_at_signal: { type: Schema.Types.Decimal128 },
  reason: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['active', 'executed', 'dismissed', 'expired']
  },
  expires_at: { type: Date },
  occurred_at: { type: Date, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

SignalEventSchema.index({ symbol: 1, occurred_at: -1 });
SignalEventSchema.index({ strategy_id: 1, status: 1 });
SignalEventSchema.index({ status: 1, expires_at: 1 });

export const SignalEventModel = mongoose.model<ISignalEvent>('SignalEvent', SignalEventSchema, 'signal_events');