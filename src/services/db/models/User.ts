import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  full_name?: string;
  role: 'owner' | 'trader' | 'viewer';
  timezone: string;
  is_active?: boolean;
  preferences?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  full_name: { type: String },
  role: {
    type: String,
    required: true,
    enum: ['owner', 'trader', 'viewer']
  },
  timezone: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  preferences: { type: Schema.Types.Mixed }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema, 'users');