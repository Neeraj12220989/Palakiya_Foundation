import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/content  -> { key: value, ... }
export const getContent = asyncHandler(async (req, res) => {
  const rows = await prisma.siteContent.findMany();
  const map = rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
  res.json(map);
});

// PUT /api/content  (admin) -> bulk upsert from body object
export const updateContent = asyncHandler(async (req, res) => {
  const entries = Object.entries(req.body || {});
  if (entries.length === 0) {
    return res.status(400).json({ message: 'No content provided' });
  }

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  const rows = await prisma.siteContent.findMany();
  const map = rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
  res.json(map);
});
