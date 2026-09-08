import { prisma } from '../db/prisma';
import { orderSchema } from '../validators/common';

const orderNumber = () => `#ORD-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`;

export async function createOrder(input: unknown, userId?: string) {
  const data = orderSchema.parse(input);
  const sorted = [...data.items].sort((a, b) => a.productId.localeCompare(b.productId));
  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
  where: {
    id: { in: sorted.map(i => i.productId) },
    isActive: true,
  },
});
    const byId = new Map(products.map(p => [p.id, p]));
    if (products.length !== new Set(sorted.map(i => i.productId)).size) throw new Error('PRODUCT_NOT_FOUND');

    let subtotal = 0;
    const snapshots: Array<{ product: typeof products[number]; quantity: number; selectedColor?: string }> = [];
    for (const item of sorted) {
      const product = byId.get(item.productId)!;
      if (product.stock < item.quantity) throw new Error(`OUT_OF_STOCK:${product.title}:${product.stock}`);
      subtotal += product.price * item.quantity;
      snapshots.push({ product, quantity: item.quantity, selectedColor: item.selectedColor });
    }
    const discount = ['LUX10','لوکس'].includes((data.couponCode || '').toUpperCase()) ? Math.round(subtotal * 0.10) : 0;
    const shippingCosts: Record<string, number> = { express: 0, courier: 45000, tipax: 35000 };
    const shippingCost = shippingCosts[data.shippingMethod];
    const total = subtotal - discount + shippingCost;

    for (const item of snapshots) {
      const updated = await tx.product.updateMany({ where: { id: item.product.id, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
      if (updated.count !== 1) throw new Error(`OUT_OF_STOCK:${item.product.title}:0`);
    }

    const order = await tx.order.create({
      data: { orderNumber: orderNumber(), userId, customerName: data.customerName, customerPhone: data.customerPhone, totalAmount: total, discountAmount: discount, shippingMethod: data.shippingMethod, shippingCost, status: 'PROCESSING', address: data.address, paymentMethod: data.paymentMethod, items: { create: snapshots.map(({ product, quantity, selectedColor }) => ({ productId: product.id, productTitle: product.title, sku: product.sku, unitPrice: product.price, quantity, selectedColor })) } },
      include: { items: true },
    });
    return order;
  });
}
