import mongoose, { Schema, Document } from 'mongoose';

export interface IBrokerAccount extends Document {
  user_id: mongoose.Types.ObjectId;
  broker_name: string;
  account_number: string;
  account_type: 'cash' | 'margin' | 'ira' | 'paper';
  balance?: mongoose.Types.Decimal128;
  buying_power?: mongoose.Types.Decimal128;
  is_active?: boolean;
  is_paper?: boolean;
  credentials?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

const BrokerAccountSchema = new Schema<IBrokerAccount>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  broker_name: { type: String, required: true },
  account_number: { type: String, required: true },
  account_type: {
    type: String,
    required: true,
    enum: ['cash', 'margin', 'ira', 'paper']
  },
  balance: { type: Schema.Types.Decimal128 },
  buying_power: { type: Schema.Types.Decimal128 },
  is_active: { type: Boolean, default: true },
  is_paper: { type: Boolean, default: false },
  credentials: { type: Schema.Types.Mixed }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

BrokerAccountSchema.index({ user_id: 1 });

export const BrokerAccountModel = mongoose.model<IBrokerAccount>('BrokerAccount', BrokerAccountSchema, 'broker_accounts');