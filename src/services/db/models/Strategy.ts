import mongoose, { Schema, Document } from 'mongoose';

export interface IStrategy extends Document {
  user_id?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  preset_code?: string;
  is_preset?: boolean;
  is_active?: boolean;
  enabled_cores?: Record<string, any>;
  indicator_config?: Record<string, any>;
  structure_config?: Record<string, any>;
  institutional_config?: Record<string, any>;
  news_config?: Record<string, any>;
  fundamentals_config?: Record<string, any>;
  ai_advisor_config?: Record<string, any>;
  option_strategies?: any[];
  recommended_timeframes?: string[];
  min_confidence_threshold: mongoose.Types.Decimal128;
  created_at?: Date;
  updated_at?: Date;
}

const StrategySchema = new Schema<IStrategy>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String },
  preset_code: { type: String },
  is_preset: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  enabled_cores: { type: Schema.Types.Mixed },
  indicator_config: { type: Schema.Types.Mixed },
  structure_config: { type: Schema.Types.Mixed },
  institutional_config: { type: Schema.Types.Mixed },
  news_config: { type: Schema.Types.Mixed },
  fundamentals_config: { type: Schema.Types.Mixed },
  ai_advisor_config: { type: Schema.Types.Mixed },
  option_strategies: [{ type: Schema.Types.Mixed }],
  recommended_timeframes: [{ type: String }],
  min_confidence_threshold: { type: Schema.Types.Decimal128, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

StrategySchema.index({ user_id: 1 });
StrategySchema.index({ preset_code: 1 }, { unique: true, sparse: true });

export const StrategyModel = mongoose.model<IStrategy>('Strategy', StrategySchema, 'strategies');