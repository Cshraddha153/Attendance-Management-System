import { Request, Response } from 'express';
import { Client } from '../models/Client';
import { Attendance } from '../models/Attendance';

async function findOwnedClient(clientId: string | string[], ownerId: string | undefined) {
  return Client.findOne({ _id: clientId, owner: ownerId });
}

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getAttendance(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const records = await Attendance.find({ client: client._id }).sort({ date: -1 });
  res.json({ attendance: records });
}

export async function markAttendance(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const { status } = req.body;
  if (status !== 'present' && status !== 'absent') {
    return res.status(400).json({ message: 'Status must be present or absent' });
  }

  const today = startOfTodayUTC();

  const existing = await Attendance.findOne({ client: client._id, date: today });
  if (existing) {
    return res
      .status(409)
      .json({ message: 'Attendance for today has already been marked for this client' });
  }

  const record = await Attendance.create({
    client: client._id,
    owner: req.userId,
    date: today,
    status,
  });

  res.status(201).json({ attendance: record });
}

export async function deleteAttendance(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const record = await Attendance.findOne({ _id: req.params.attendanceId, client: client._id });
  if (!record) {
    return res.status(404).json({ message: 'Attendance record not found' });
  }

  if (record.date.getTime() !== startOfTodayUTC().getTime()) {
    return res.status(403).json({ message: 'Past attendance records cannot be deleted' });
  }

  await record.deleteOne();
  res.status(204).send();
}
