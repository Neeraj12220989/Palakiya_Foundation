import { validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slug.js';

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
};

// GET /api/articles
export const getArticles = asyncHandler(async (req, res) => {
  const { category, includeUnpublished } = req.query;
  const where = {};
  if (category) where.category = category;
  if (includeUnpublished !== 'true') where.published = true;

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(articles);
});

// GET /api/articles/:slug
export const getArticle = asyncHandler(async (req, res) => {
  const article = await prisma.article.findUnique({ where: { slug: req.params.slug } });
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
});

// POST /api/articles
export const createArticle = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const { title, excerpt, content, category, author, published, image, driveLink } = req.body;

  const slug = await uniqueSlug(prisma.article, title);
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category: category || 'Awareness',
      author: author || 'NGO Team',
      published: published !== undefined ? Boolean(published) : true,
      image: req.file ? `/uploads/${req.file.filename}` : image || null,
      driveLink: driveLink || null,
    },
  });
  res.status(201).json(article);
});

// PUT /api/articles/:id
export const updateArticle = asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const id = Number(req.params.id);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Article not found' });

  const { title, excerpt, content, category, author, published, image, driveLink } = req.body;

  const data = {
    excerpt,
    content,
    category,
    author,
    published: published !== undefined ? Boolean(published) : existing.published,
  };

  if (title && title !== existing.title) {
    data.title = title;
    data.slug = await uniqueSlug(prisma.article, title, id);
  }

  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (image !== undefined) data.image = image;

  // Allow clearing the field by sending empty string
  if (driveLink !== undefined) data.driveLink = driveLink || null;

  const article = await prisma.article.update({ where: { id }, data });
  res.json(article);
});

// DELETE /api/articles/:id
export const deleteArticle = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.article.delete({ where: { id } });
  res.json({ message: 'Article deleted' });
});

