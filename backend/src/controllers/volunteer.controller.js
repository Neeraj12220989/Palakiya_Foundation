import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';

const orgName = () => process.env.ORG_NAME || 'Palakiya Foundation';

const approvalEmail = (name) => ({
  subject: 'Application Approved â€“ Welcome!',
  text: `Hello ${name},

We are pleased to inform you that your volunteer application has been approved.

Welcome to our organization! We appreciate your interest in contributing to our mission.

Our team will contact you soon with further details.

Best regards,
${orgName()}`,
});

const rejectionEmail = (name) => ({
  subject: 'Application Update',
  text: `Hello ${name},

Thank you for your interest in joining our organization.

We regret to inform you that your application was not selected at this time.

We encourage you to apply again in the future.

Best regards,
${orgName()}`,
});

// POST /api/volunteers/apply  (public)
export const applyVolunteer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, phone, message, interest } = req.body;
  const volunteer = await prisma.volunteer.create({
    data: { name, email, phone, message, interest: interest || null },
  });

  res.status(201).json({
    message: 'Your request has been submitted for approval',
    id: volunteer.id,
  });
});

// GET /api/volunteers  (admin)
export const getVolunteers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;

  const volunteers = await prisma.volunteer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(volunteers);
});

const updateStatus = async (id, status, buildEmail) => {
  const existing = await prisma.volunteer.findUnique({ where: { id } });
  if (!existing) return { notFound: true };

  const volunteer = await prisma.volunteer.update({
    where: { id },
    data: { status },
  });

  const { subject, text } = buildEmail(volunteer.name);
  const result = await sendEmail({ to: volunteer.email, subject, text });

  return { volunteer, emailSent: result.sent, emailError: result.error };
};

// PUT /api/volunteers/:id/approve  (admin)
export const approveVolunteer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = await updateStatus(id, 'approved', approvalEmail);
  if (result.notFound) return res.status(404).json({ message: 'Volunteer not found' });

  res.json({
    volunteer: result.volunteer,
    emailSent: result.emailSent,
    message: result.emailSent
      ? 'Volunteer approved and email sent'
      : 'Volunteer approved, but the notification email could not be sent',
  });
});

// PUT /api/volunteers/:id/reject  (admin)
export const rejectVolunteer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = await updateStatus(id, 'rejected', rejectionEmail);
  if (result.notFound) return res.status(404).json({ message: 'Volunteer not found' });

  res.json({
    volunteer: result.volunteer,
    emailSent: result.emailSent,
    message: result.emailSent
      ? 'Volunteer rejected and email sent'
      : 'Volunteer rejected, but the notification email could not be sent',
  });
});

// DELETE /api/volunteers/:id  (admin)
export const deleteVolunteer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.volunteer.delete({ where: { id } });
  res.json({ message: 'Volunteer deleted' });
});

