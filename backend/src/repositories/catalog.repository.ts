import { prisma } from '../db/prisma';

export const toProduct = (p: any) => ({ ...p, category: p.category.slug });
export async function listProducts(params: { category?: string; search?: string; sort?: string }) {
  const where: any = { isActive: true };
  if (params.category) where.category = { slug: params.category };
  if (params.search) where.OR = [{ title: { contains: params.search, mode: 'insensitive' } }, { shortDescription: { contains: params.search, mode: 'insensitive' } }, { sku: { contains: params.search, mode: 'insensitive' } }];
  const orderBy: any = params.sort === 'price-asc' ? { price: 'asc' } : params.sort === 'price-desc' ? { price: 'desc' } : params.sort === 'rating' ? { rating: 'desc' } : { createdAt: 'desc' };
  return (await prisma.product.findMany({ where, include: { category: true }, orderBy })).map(toProduct);
}
export const findProduct = (id: string) => prisma.product.findUnique({ where: { id }, include: { category: true } });
export const findCategory = (slug: string) => prisma.category.findUnique({ where: { slug } });
