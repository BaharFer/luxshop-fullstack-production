import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const uploadDir = path.resolve(process.cwd(), 'uploads/products');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, uniqueName);
  },
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const uploadProductImage = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('فقط تصاویر JPG، PNG و WEBP مجاز هستند.'));
    }

    cb(null, true);
  },
}).single('image');

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'هیچ تصویری ارسال نشده است.',
    });
  }

  const imageUrl = `/uploads/products/${req.file.filename}`;

  return res.status(201).json({
    success: true,
    imageUrl,
  });
}
