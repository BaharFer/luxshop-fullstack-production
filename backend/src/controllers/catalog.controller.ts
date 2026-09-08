import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { listProducts, toProduct } from '../repositories/catalog.repository';
export async function products(req: Request, res: Response) { res.json({ success: true, products: await listProducts({ category: req.query.category as string, search: req.query.search as string, sort: req.query.sort as string }) }); }
export async function product(req: Request, res: Response) { const p = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } }); if (!p) return res.status(404).json({ success: false, message: 'محصول یافت نشد.' }); res.json({ success: true, product: toProduct(p) }); }
export async function categories(_req: Request, res: Response) { const cats = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } }); res.json({ success: true, categories: cats.map(c => ({ id: c.id, name: c.name, slug: c.slug, image: c.image, itemCount: c._count.products })) }); }
