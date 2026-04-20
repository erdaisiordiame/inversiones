import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketData extends Document {
  symbolId: mongoose.Types.ObjectId;
  interval: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source: string;
  raw?: object;
}

const MarketDataSchema: Schema = new Schema({
  symbolId: { type: Schema.Types.ObjectId, ref: 'Symbol', required: true },
  interval: { type: String, required: true },
  timestamp: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  source: { type: String, required: true },
  raw: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

// Índice compuesto para consultas eficientes
MarketDataSchema.index({ symbolId: 1, interval: 1, timestamp: 1 });

export const MarketDataModel = mongoose.model<IMarketData>('MarketData', MarketDataSchema);