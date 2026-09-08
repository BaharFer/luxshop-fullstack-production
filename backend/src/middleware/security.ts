import { RequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const securityMiddleware = [
  helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }),
  cors({ origin: (origin, callback) => { if (!origin || env.corsOrigins.includes(origin)) return callback(null, true); callback(new Error('CORS origin not allowed')); }, credentials: true }),
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }),
] as RequestHandler[];

export const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });

export const requireSameOrigin: RequestHandler = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const origin = req.get('origin');
  const hostOrigin = `${req.protocol}://${req.get('host')}`;
  if (origin && origin !== hostOrigin && !env.corsOrigins.includes(origin)) return res.status(403).json({ success: false, message: 'Origin نامعتبر است.' });
  next();
};
