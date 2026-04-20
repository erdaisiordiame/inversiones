import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlistSymbol {
  symbol: string;
  instrument_type: 'Stock' | 'ETF' | 'Index' | 'Option';
  sector?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface IWatchlist extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  symbols: IWatchlistSymbol[];
  created_at?: Date;
  updated_at?: Date;
}

const WatchlistSymbolSchema = new Schema<IWatchlistSymbol>({
  symbol: { type: String, required: true },
  instrument_type: {
    type: String,
    required: true,
    enum: ['Stock', 'ETF', 'Index', 'Option']
  },
  sector: { type: String },
  is_active: { type: Boolean, default: true },
  sort_order: { type: Number }
}, { _id: false });

const WatchlistSchema = new Schema<IWatchlist>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  is_default: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  symbols: [WatchlistSymbolSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

WatchlistSchema.index({ user_id: 1 });
WatchlistSchema.index({ 'symbols.symbol': 1 });

export const WatchlistModel = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema, 'watchlists');