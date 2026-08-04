import { Request, Response } from 'express';
import { Client } from '../models/Client';
import { Attendance } from '../models/Attendance';
import { Payment } from '../models/Payment';

export async function getClients(req: Request, res: Response) {
  const { search } = req.query;
  const filter: Record<string, unknown> = { owner: req.userId };

  if (typeof search === 'string' && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  const clients = await Client.find(filter).sort({ name: 1 });
  res.json({ clients });
}

export async function createClient(req: Request, res: Response) {
  const { name, contact, notes, pricingType, rate } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Client name is required' });
  }

  const client = await Client.create({
    owner: req.userId,
    name,
    contact,
    notes,
    pricingType,
    rate,
  });

  res.status(201).json({ client });
}

export async function getClientById(req: Request, res: Response) {
  const client = await Client.findOne({ _id: req.params.id, owner: req.userId });
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  res.json({ client });
}

export async function updateClient(req: Request, res: Response) {
  const client = await Client.findOne({ _id: req.params.id, owner: req.userId });
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const { name, contact, notes, pricingType, rate } = req.body;
  if (name !== undefined) client.name = name;
  if (contact !== undefined) client.contact = contact;
  if (notes !== undefined) client.notes = notes;
  if (pricingType !== undefined) client.pricingType = pricingType;
  if (rate !== undefined) client.rate = rate;

  await client.save();
  res.json({ client });
}

export async function deleteClient(req: Request, res: Response) {
  const client = await Client.findOne({ _id: req.params.id, owner: req.userId });
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  await Promise.all([
    Attendance.deleteMany({ client: client._id }),
    Payment.deleteMany({ client: client._id }),
    client.deleteOne(),
  ]);

  res.status(204).send();
}
