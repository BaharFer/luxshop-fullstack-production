import { env } from '../config/env';
import { prisma } from '../db/prisma';

const apiBase = env.zarinpalSandbox ? 'https://sandbox.zarinpal.com/pg/v4' : 'https://api.zarinpal.com/pg/v4';
const gatewayBase = env.zarinpalSandbox ? 'https://sandbox.zarinpal.com/pg/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/';

export async function requestZarinpalPayment(orderNumber: string, phone: string) {
  if (!env.zarinpalMerchantId) throw new Error('ZARINPAL_NOT_CONFIGURED');
  const order = await prisma.order.findFirst({ where: { orderNumber, customerPhone: phone } });
  if (!order) throw new Error('ORDER_NOT_FOUND');
  const response = await fetch(`${apiBase}/payment/request.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ merchant_id: env.zarinpalMerchantId, amount: order.totalAmount * 10, description: `خرید ${order.orderNumber} از فروشگاه لوکس`, callback_url: `${env.publicAppUrl}/api/payments/zarinpal/callback`, metadata: { mobile: order.customerPhone } }),
  });
  const data: any = await response.json().catch(() => ({}));
  if (!response.ok || data?.data?.code !== 100 || !data?.data?.authority) throw new Error(data?.errors?.message || 'خطا در ایجاد پرداخت زرین‌پال.');
  await prisma.order.update({ where: { id: order.id }, data: { paymentMethod: `zarinpal:${data.data.authority}` } });
  return { authority: data.data.authority, paymentUrl: `${gatewayBase}${data.data.authority}` };
}

export async function verifyZarinpalPayment(orderNumber: string, authority: string) {
  if (!env.zarinpalMerchantId) throw new Error('ZARINPAL_NOT_CONFIGURED');
  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) throw new Error('ORDER_NOT_FOUND');
  const response = await fetch(`${apiBase}/payment/verify.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ merchant_id: env.zarinpalMerchantId, authority, amount: order.totalAmount * 10 }),
  });
  const data: any = await response.json().catch(() => ({}));
  if (!response.ok || ![100, 101].includes(data?.data?.code)) throw new Error(data?.errors?.message || 'پرداخت تایید نشد.');
  await prisma.order.update({ where: { id: order.id }, data: { paymentMethod: `zarinpal:paid:${data.data.ref_id}` } });
  return { order, refId: data.data.ref_id };
}
