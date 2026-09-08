import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../frontend/src/data';
import { hashPassword } from '../backend/src/utils/auth';
const prisma = new PrismaClient();

async function main() {
  const categoryMap = new Map<string,string>();
  for (const c of INITIAL_CATEGORIES) {
    const cat = await prisma.category.upsert({ where:{slug:c.slug}, update:{name:c.name,image:c.image}, create:{name:c.name,slug:c.slug,image:c.image} });
    categoryMap.set(c.slug,cat.id);
  }
  for (const p of INITIAL_PRODUCTS) {
    await prisma.product.upsert({ where:{sku:p.sku}, update:{title:p.title,slug:p.slug,categoryId:categoryMap.get(p.category)!,price:p.price,originalPrice:p.originalPrice,discountPercent:p.discountPercent,rating:p.rating,reviewsCount:p.reviewsCount,image:p.image,gallery:p.gallery,description:p.description,shortDescription:p.shortDescription,colors:p.colors,stock:p.stock,isNew:p.isNew,isFeatured:p.isFeatured,specs:p.specs,features:p.features,isActive:true}, create:{title:p.title,slug:p.slug,categoryId:categoryMap.get(p.category)!,price:p.price,originalPrice:p.originalPrice,discountPercent:p.discountPercent,rating:p.rating,reviewsCount:p.reviewsCount,image:p.image,gallery:p.gallery,description:p.description,shortDescription:p.shortDescription,colors:p.colors,stock:p.stock,isNew:p.isNew,isFeatured:p.isFeatured,specs:p.specs,features:p.features,sku:p.sku,isActive:true} });
  }
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@luxshop.ir';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe_123!';
  await prisma.user.upsert({ where:{phone:'09123456789'}, update:{email:adminEmail,role:'ADMIN'}, create:{name:'مدیر فروشگاه',phone:'09123456789',email:adminEmail,passwordHash:await hashPassword(adminPassword),role:'ADMIN'} });
  const customer = await prisma.user.upsert({ where:{phone:'09351234567'}, update:{email:'maryam@example.com'}, create:{name:'مریم احمدی',phone:'09351234567',email:'maryam@example.com',passwordHash:await hashPassword(process.env.SEED_CUSTOMER_PASSWORD ?? 'ChangeMe_123!'),role:'CUSTOMER'} });
  console.log(`Seeded ${INITIAL_PRODUCTS.length} products and ${INITIAL_CATEGORIES.length} categories. Admin: ${adminEmail}. Customer: ${customer.phone}`);
}
main().finally(()=>prisma.$disconnect());
