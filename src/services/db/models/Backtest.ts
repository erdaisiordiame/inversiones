import mongoose, { Schema, Document } from 'mongoose';

export interface IBacktest extends Document {
  symbolId: mongoose.Types.ObjectId;
  strategy: string;
  periodStart: Date;
  periodEnd: Date;
  trades: number;
  winRate: number;
  sharpeRatio: number;
  returnPercent: number;
  details?: object;
}

const BacktestSchema: Schema = new Schema({
  symbolId: { type: Schema.Types.ObjectId, ref: 'Symbol', required: true },
  strategy: { type: String, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  trades: { type: Number, required: true, default: 0 },
  winRate: { type: Number, required: true, min: 0, max: 1 },
  sharpeRatio: { type: Number, required: true },
  returnPercent: { type: Number, required: true },
  details: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

// Índice por símbolo y estrategia
BacktestSchema.index({ symbolId: 1, strategy: 1 });

export const BacktestModel = mongoose.model<IBacktest>('Backtest', BacktestSchema);