import {
  Router,
  type Request,
  type Response,
} from 'express';

import { authRateLimit } from '../middleware/security';
import {
  requireAuth,
  requireAdmin,
} from '../middleware/auth';

import {
  uploadProductImage,
  uploadImage,
} from '../controllers/upload.controller';

import { asyncHandler } from '../utils/async-handler';

import * as auth from '../controllers/auth.controller';
import * as catalog from '../controllers/catalog.controller';
import * as order from '../controllers/order.controller';
import * as admin from '../controllers/admin.controller';

import { prisma } from '../db/prisma';
import { env } from '../config/env';
import { contactSchema } from '../validators/common';
import { notifyStore } from '../services/sms.service';

import {
  requestZarinpalPayment,
  verifyZarinpalPayment,
} from '../services/payment.service';

export const router = Router();

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

router.post(
  '/auth/login',
  authRateLimit,
  asyncHandler(auth.login),
);

router.post(
  '/auth/register',
  authRateLimit,
  asyncHandler(auth.register),
);

router.post(
  '/auth/admin/register',
  authRateLimit,
  asyncHandler(auth.registerAdmin),
);

router.post(
  '/auth/logout',
  asyncHandler(auth.logout),
);

router.get(
  '/auth/me',
  asyncHandler(auth.me),
);

/* -------------------------------------------------------------------------- */
/* Catalog                                                                    */
/* -------------------------------------------------------------------------- */

router.get(
  '/products',
  asyncHandler(catalog.products),
);

router.get(
  '/products/:id',
  asyncHandler(catalog.product),
);

router.get(
  '/categories',
  asyncHandler(catalog.categories),
);

/* -------------------------------------------------------------------------- */
/* Orders                                                                     */
/* -------------------------------------------------------------------------- */

router.post(
  '/orders',
  asyncHandler(order.place),
);

router.get(
  '/orders',
  asyncHandler(order.all),
);

router.get(
  '/orders/track/:query',
  asyncHandler(order.track),
);

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */

router.get(
  '/user/profile',
  requireAuth,
  (req: any, res: Response) =>
    res.json({
      success: true,
      user: {
        ...req.user,
        role:
          req.user.role === 'ADMIN'
            ? 'admin'
            : 'customer',
      },
      permissions: {
        canManageStore:
          req.user.role === 'ADMIN',
      },
    }),
);

router.put(
  '/user/profile',
  requireAuth,
  asyncHandler(
    async (req: Request, res: Response) => {
      const user = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name: req.body.name,
          email: req.body.email || null,
        },
      });

      res.json({
        success: true,
        user: {
          ...user,
          role:
            user.role === 'ADMIN'
              ? 'admin'
              : 'customer',
        },
      });
    },
  ),
);

router.get(
  '/user/orders',
  requireAuth,
  asyncHandler(order.mine),
);

/* -------------------------------------------------------------------------- */
/* Admin                                                                      */
/* -------------------------------------------------------------------------- */

router.get(
  '/admin/dashboard',
  requireAdmin,
  asyncHandler(admin.dashboard),
);

router.get(
  '/admin/test-access',
  requireAdmin,
  (req: any, res: Response) =>
    res.json({
      success: true,
      message: 'Admin access granted',
      userRole: req.user.role,
    }),
);

router.get(
  '/admin/orders',
  requireAdmin,
  asyncHandler(admin.orders),
);

router.put(
  '/admin/orders/:id/status',
  requireAdmin,
  asyncHandler(admin.updateOrder),
);

router.get(
  '/admin/products',
  requireAdmin,
  asyncHandler(admin.products),
);

router.post(
  '/admin/products/upload-image',
  requireAdmin,
  uploadProductImage,
  asyncHandler(uploadImage),
);

router.post(
  '/admin/products',
  requireAdmin,
  asyncHandler(admin.createProduct),
);

router.put(
  '/admin/products/:id',
  requireAdmin,
  asyncHandler(admin.updateProduct),
);

router.put(
  '/admin/products/:id/stock',
  requireAdmin,
  asyncHandler(admin.updateStock),
);

router.delete(
  '/admin/products/:id',
  requireAdmin,
  asyncHandler(admin.deleteProduct),
);

router.get(
  '/admin/users',
  requireAdmin,
  asyncHandler(admin.users),
);

router.get(
  '/admin/messages',
  requireAdmin,
  asyncHandler(admin.messages),
);

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Contact form
 * Form → API → Database → Store SMS
 */
router.post(
  '/contact',
  asyncHandler(
    async (req: Request, res: Response) => {
      const d = contactSchema.parse(req.body);

      console.log(
        '📩 CONTACT RECEIVED:',
        {
          name: d.name,
          phone: d.phone || 'empty',
          subject: d.subject || 'empty',
        },
      );

      await prisma.contactMessage.create({
        data: {
          name: d.name,
          email: d.email || null,
          phone: d.phone || null,
          subject: d.subject || null,
          message: d.message,
        },
      });

      console.log(
        '💾 CONTACT SAVED TO DATABASE',
      );

      console.log(
        '📤 SENDING STORE SMS...',
        {
          smsEnabled:
            env.smsOrderNotifications,
          recipientConfigured:
            Boolean(
              env.storeNotificationPhone,
            ),
        },
      );

      void notifyStore(
        `پیام جدید از ${d.name}: ${(d.subject || 'بدون موضوع').slice(0, 60)}`,
      )
        .then((result) => {
          console.log(
            '📨 STORE SMS RESULT:',
            result,
          );
        })
        .catch((error) => {
          console.error(
            '❌ Store notification failed:',
            error,
          );
        });

      res.status(201).json({
        success: true,
        message: 'پیام شما دریافت شد.',
      });
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* ZarinPal                                                                   */
/* -------------------------------------------------------------------------- */

router.post(
  '/payments/zarinpal/request',
  asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const {
          orderNumber,
          phone,
        } = req.body || {};

        if (!orderNumber || !phone) {
          return res.status(400).json({
            success: false,
            message:
              'شماره سفارش و شماره تماس الزامی است.',
          });
        }

        const result =
          await requestZarinpalPayment(
            String(orderNumber),
            String(phone),
          );

        return res.json({
          success: true,
          ...result,
        });
      } catch (e: any) {
        if (
          e.message ===
          'ZARINPAL_NOT_CONFIGURED'
        ) {
          return res.status(503).json({
            success: false,
            message:
              'درگاه زرین‌پال هنوز پیکربندی نشده است.',
          });
        }

        if (
          e.message === 'ORDER_NOT_FOUND'
        ) {
          return res.status(404).json({
            success: false,
            message: 'سفارش پیدا نشد.',
          });
        }

        return res.status(502).json({
          success: false,
          message:
            e.message ||
            'خطا در ایجاد پرداخت.',
        });
      }
    },
  ),
);

router.get(
  '/payments/zarinpal/callback',
  asyncHandler(
    async (req: Request, res: Response) => {
      const orderNumber = String(
        req.query.order || '',
      );

      const authority = String(
        req.query.Authority || '',
      );

      const status = String(
        req.query.Status || '',
      );

      try {
        if (
          status !== 'OK' ||
          !orderNumber ||
          !authority
        ) {
          throw new Error(
            'PAYMENT_CANCELLED',
          );
        }

        const result =
          await verifyZarinpalPayment(
            orderNumber,
            authority,
          );

        return res.redirect(
          `${env.publicAppUrl}/?payment=success&order=${encodeURIComponent(
            result.order.orderNumber,
          )}&ref=${encodeURIComponent(
            String(result.refId),
          )}`,
        );
      } catch {
        return res.redirect(
          `${env.publicAppUrl}/?payment=failed&order=${encodeURIComponent(
            orderNumber,
          )}`,
        );
      }
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* Health                                                                     */
/* -------------------------------------------------------------------------- */

router.get(
  '/health',
  (_req: Request, res: Response) =>
    res.json({
      status: 'ok',
      database: 'postgresql',
    }),
);