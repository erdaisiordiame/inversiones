import mongoose, { Schema, Document } from 'mongoose';

export interface ISignal extends Document {
  symbolId: mongoose.Types.ObjectId;
  timestamp: Date;
  interval: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  features?: object;
  reason?: string;
  origin: string;
  status: string;
}

const SignalSchema: Schema = new Schema({
  symbolId: { type: Schema.Types.ObjectId, ref: 'Symbol', required: true },
  timestamp: { type: Date, required: true },
  interval: { type: String, required: true },
  signal: { type: String, enum: ['BUY', 'SELL', 'HOLD'], required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  features: { type: Schema.Types.Mixed },
  reason: { type: String },
  origin: { type: String, required: true, default: 'heuristic' },
  status: { type: String, required: true, default: 'created' },
}, {
  timestamps: true,
});

// Índice para consultas por símbolo y tiempo
SignalSchema.index({ symbolId: 1, timestamp: -1 });

export const SignalModel = mongoose.model<ISignal>('Signal', SignalSchema);