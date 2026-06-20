import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/contacts  (public)
export const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, phone, subject, message } = req.body;
  const contact = await prisma.contact.create({
    data: { name, email, phone, subject, message },
  });
  res.status(201).json({
    message: 'Thank you for reaching out! We will get back to you soon.',
    id: contact.id,
  });
});

// GET /api/contacts  (admin)
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(contacts);
});

// PATCH /api/contacts/:id/read  (admin)
export const markRead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const contact = await prisma.contact.update({
    where: { id },
    data: { read: true },
  });
  res.json(contact);
});

// DELETE /api/contacts/:id  (admin)
export const deleteContact = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.contact.delete({ where: { id } });
  res.json({ message: 'Contact deleted' });
});
