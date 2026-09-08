import { prisma } from '../db/prisma';

const productImages: Record<string,string> = {
  'wireless-headphone-premium-pro': '/assets/products/headphone-pro.webp',
  'smartwatch-x1': '/assets/products/smartwatch-x1.webp',
  'earphone-wireless-pro': '/assets/products/earbuds-pro.webp',
  'modern-minimalist-lamp': '/assets/products/minimal-lamp.webp',
  'genuine-leather-wallet': '/assets/products/leather-wallet.webp',
  'luxury-men-perfume': '/assets/products/perfume-lux.webp',
  'men-cologne-noir': '/assets/products/cologne-noir.webp',
  'men-cologne-blue': '/assets/products/cologne-noir.webp',
};
const categoryImages: Record<string,string> = {
  smartwatch: '/assets/products/smartwatch-x1.webp',
  headphones: '/assets/products/headphone-pro.webp',
  perfume: '/assets/products/perfume-lux.webp',
  accessories: '/assets/products/leather-wallet.webp',
};

export async function syncCatalogAssets() {
  for (const [slug, image] of Object.entries(productImages)) {
    await prisma.product.updateMany({ where: { slug }, data: { image, gallery: [image] } });
  }
  for (const [slug, image] of Object.entries(categoryImages)) {
    await prisma.category.updateMany({ where: { slug }, data: { image } });
  }
}
