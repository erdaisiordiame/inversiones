import mongoose from 'mongoose'

const WatchlistSymbolSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    instrument_type: {
      type: String,
      required: true,
      enum: ['Stock', 'ETF', 'Index', 'Option'],
    },
    sector: { type: String },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number },
  },
  { _id: false }
)

const WatchlistSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    is_default: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    symbols: { type: [WatchlistSymbolSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

WatchlistSchema.index({ user_id: 1 })
WatchlistSchema.index({ 'symbols.symbol': 1 })

export const WatchlistModel = mongoose.model('Watchlist', WatchlistSchema, 'watchlists')
