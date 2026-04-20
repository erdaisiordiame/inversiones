import mongoose from 'mongoose'

const StrategySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String },
    preset_code: { type: String },
    is_preset: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    enabled_cores: { type: mongoose.Schema.Types.Mixed },
    indicator_config: { type: mongoose.Schema.Types.Mixed },
    structure_config: { type: mongoose.Schema.Types.Mixed },
    institutional_config: { type: mongoose.Schema.Types.Mixed },
    news_config: { type: mongoose.Schema.Types.Mixed },
    fundamentals_config: { type: mongoose.Schema.Types.Mixed },
    ai_advisor_config: { type: mongoose.Schema.Types.Mixed },
    option_strategies: [{ type: mongoose.Schema.Types.Mixed }],
    recommended_timeframes: [{ type: String }],
    min_confidence_threshold: { type: mongoose.Schema.Types.Decimal128, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

StrategySchema.index({ user_id: 1 })
StrategySchema.index({ preset_code: 1 }, { unique: true, sparse: true })

export const StrategyModel = mongoose.model('Strategy', StrategySchema, 'strategies')
