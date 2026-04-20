import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskConfig extends Document {
  user_id: mongoose.Types.ObjectId;
  max_position_size_pct?: mongoose.Types.Decimal128;
  max_daily_loss_pct?: mongoose.Types.Decimal128;
  default_stop_loss_pct?: mongoose.Types.Decimal128;
  default_take_profit_pct?: mongoose.Types.Decimal128;
  max_concurrent_positions?: number;
  max_iv_percentile?: number;
  preferred_dte_min?: number;
  preferred_dte_max?: number;
  max_option_premium_pct?: mongoose.Types.Decimal128;
  created_at?: Date;
  updated_at?: Date;
}

const RiskConfigSchema = new Schema<IRiskConfig>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  max_position_size_pct: { type: Schema.Types.Decimal128 },
  max_daily_loss_pct: { type: Schema.Types.Decimal128 },
  default_stop_loss_pct: { type: Schema.Types.Decimal128 },
  default_take_profit_pct: { type: Schema.Types.Decimal128 },
  max_concurrent_positions: { type: Number },
  max_iv_percentile: { type: Number },
  preferred_dte_min: { type: Number },
  preferred_dte_max: { type: Number },
  max_option_premium_pct: { type: Schema.Types.Decimal128 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

RiskConfigSchema.index({ user_id: 1 }, { unique: true });

export const RiskConfigModel = mongoose.model<IRiskConfig>('RiskConfig', RiskConfigSchema, 'risk_configs');