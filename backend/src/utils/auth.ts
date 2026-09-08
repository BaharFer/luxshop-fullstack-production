import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const signSessionToken = (userId: string) => jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '7d' });
export const verifySessionToken = (token: string) => jwt.verify(token, env.jwtSecret) as { sub: string };
export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
