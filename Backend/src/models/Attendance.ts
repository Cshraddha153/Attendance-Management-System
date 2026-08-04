import { Schema, model, Document, Types } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent';

export interface IAttendance extends Document {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  owner: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ client: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
