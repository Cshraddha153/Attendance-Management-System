import { Schema, model, Document, Types } from 'mongoose';

export type PaymentStatus = 'paid' | 'pending';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  owner: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  date: Date;
  note?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'pending'], required: true },
    date: { type: Date, required: true, default: Date.now },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
