import { RequestHandler } from 'express';
import { prisma } from '../db/prisma';
import { env } from '../config/env';
import { hashToken, verifySessionToken } from '../utils/auth';

export const optionalAuth: RequestHandler = async (req: any, _res, next) => {
  try {
    const token = req.cookies?.[env.cookieName] ?? req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return next();
    const payload = verifySessionToken(token);
    const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
    if (!session || session.expiresAt < new Date() || session.user.id !== payload.sub) return next();
    req.user = session.user;
    next();
  } catch { next(); }
};

export const requireAuth: RequestHandler = (req: any, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'احراز هویت الزامی است.' });
  next();
};

export const requireAdmin: RequestHandler = (req: any, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'احراز هویت الزامی است.' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'دسترسی مدیر مجاز نیست.' });
  next();
};
