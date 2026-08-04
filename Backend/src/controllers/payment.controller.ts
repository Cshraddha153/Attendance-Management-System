import { Request, Response } from 'express';
import { Client, IClient } from '../models/Client';
import { Payment } from '../models/Payment';
import { Attendance } from '../models/Attendance';

async function findOwnedClient(clientId: string | string[], ownerId: string | undefined) {
  return Client.findOne({ _id: clientId, owner: ownerId });
}

function computeExpectedTotal(client: IClient, presentDates: Date[]): number {
  if (client.pricingType === 'monthly') {
    const distinctMonths = new Set(
      presentDates.map((d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`)
    );
    return client.rate * distinctMonths.size;
  }
  return client.rate * presentDates.length;
}

async function getExpectedTotal(client: IClient): Promise<number> {
  const presentRecords = await Attendance.find({ client: client._id, status: 'present' });
  return computeExpectedTotal(client, presentRecords.map((r) => r.date));
}

export async function getPayments(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const [payments, expectedTotal] = await Promise.all([
    Payment.find({ client: client._id }).sort({ date: -1 }),
    getExpectedTotal(client),
  ]);

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    payments,
    totalPaid,
    expectedTotal,
    remainingBalance: expectedTotal - totalPaid,
  });
}

export async function createPayment(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const { status, note } = req.body;
  if (status !== 'paid' && status !== 'pending') {
    return res.status(400).json({ message: 'Status must be paid or pending' });
  }

  const amount = await getExpectedTotal(client);

  const payment = await Payment.create({
    client: client._id,
    owner: req.userId,
    amount,
    status,
    note,
  });

  res.status(201).json({ payment });
}

export async function deletePayment(req: Request, res: Response) {
  const client = await findOwnedClient(req.params.clientId, req.userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  await Payment.deleteOne({ _id: req.params.paymentId, client: client._id });
  res.status(204).send();
}
