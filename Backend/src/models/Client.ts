import { Schema, model, Document, Types } from 'mongoose';

export type PricingType = 'hourly' | 'session' | 'monthly';

export interface IClient extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  name: string;
  contact?: string;
  notes?: string;
  pricingType: PricingType;
  rate: number;
  createdAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    notes: { type: String, trim: true },
    pricingType: { type: String, enum: ['hourly', 'session', 'monthly'], default: 'session' },
    rate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

clientSchema.index({ owner: 1, name: 1 });

export const Client = model<IClient>('Client', clientSchema);
