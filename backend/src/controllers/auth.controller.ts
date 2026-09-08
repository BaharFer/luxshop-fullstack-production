import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { env } from '../config/env';
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  hashToken,
} from '../utils/auth';
import { loginSchema, registerSchema } from '../validators/common';

const publicUser = (u: any) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  role: u.role === 'ADMIN' ? 'admin' : 'customer',
  avatar: u.avatar,
  createdAt: u.createdAt.toISOString(),
});

const setSession = async (res: Response, userId: string) => {
  const token = signSessionToken(userId);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  });

  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    maxAge: 7 * 864e5,
    path: '/',
  });
};

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const normalized = data.usernameOrPhone.trim().toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { phone: normalized },
        { email: normalized },
      ],
    },
    take: 2,
  });

  const user = users.find((u) => true);

  if (
    !user ||
    !(await verifyPassword(data.password, user.passwordHash))
  ) {
    return res.status(401).json({
      success: false,
      message: 'اطلاعات ورود نامعتبر است.',
    });
  }

  if (data.role === 'admin' && user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'این حساب دسترسی مدیریتی ندارد.',
    });
  }

  if (data.role === 'customer' && user.role !== 'CUSTOMER') {
    return res.status(403).json({
      success: false,
      message: 'برای ورود مدیر، گزینه Store Manager را انتخاب کنید.',
    });
  }

  await setSession(res, user.id);

  res.json({
    success: true,
    user: publicUser(user),
  });
}

export async function register(req: Request, res: Response) {
  
  const data = registerSchema.parse(req.body);

  const exists = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: data.phone },
        ...(data.email ? [{ email: data.email }] : []),
      ],
    },
  });

  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'این شماره یا ایمیل قبلاً ثبت شده است.',
    });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      passwordHash: await hashPassword(data.password),
      role: 'CUSTOMER',
    },
  });

  await setSession(res, user.id);

  res.status(201).json({
    success: true,
    user: publicUser(user),
  });
}

export async function me(req: any, res: Response) {
  res.json({
    success: true,
    user: req.user ? publicUser(req.user) : null,
    role:
      req.user?.role === 'ADMIN'
        ? 'admin'
        : req.user
          ? 'customer'
          : 'guest',
  });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[env.cookieName];

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    path: '/',
  });

  res.json({
    success: true,
  });
}

export async function registerAdmin(req: Request, res: Response) {
  const bootstrapSecret = req.headers['x-admin-bootstrap-secret'];

  if (
    !env.adminRegistrationEnabled ||
    !env.adminBootstrapSecret ||
    bootstrapSecret !== env.adminBootstrapSecret
  ) {
    return res.status(403).json({
      success: false,
      message: 'ثبت‌نام مدیر مجاز نیست.',
    });
  }
  
  const existingAdmin = await prisma.user.findFirst({
  where: {
    role: 'ADMIN',
  },
  select: {
    id: true,
  },
});

if (existingAdmin) {
  return res.status(403).json({
    success: false,
    message: 'ثبت‌نام مدیر قبلاً انجام شده است.',
  });
}
  
  const data = registerSchema.parse(req.body);

  const exists = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: data.phone },
        ...(data.email ? [{ email: data.email }] : []),
      ],
    },
  });

  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'این شماره یا ایمیل قبلاً ثبت شده است.',
    });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      passwordHash: await hashPassword(data.password),
      role: 'ADMIN',
    },
  });

  await setSession(res, user.id);

  res.status(201).json({
    success: true,
    user: publicUser(user),
  });
}
