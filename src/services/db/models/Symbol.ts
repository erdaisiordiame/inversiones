import mongoose, { Schema, Document } from 'mongoose';

export interface ISymbol extends Document {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  market: string;
  createdAt: Date;
  updatedAt: Date;
}

const SymbolSchema: Schema = new Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  exchange: { type: String, required: true },
  currency: { type: String, required: true, default: 'USD' },
  market: { type: String, required: true, default: 'USA' },
}, {
  timestamps: true,
});

export const SymbolModel = mongoose.model<ISymbol>('Symbol', SymbolSchema);