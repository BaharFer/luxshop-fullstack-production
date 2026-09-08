import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { createOrder } from '../services/order.service';
import { sendSms, notifyStore } from '../services/sms.service';

const shippingNames:any={express:'پست پیشتاز (رایگان)',courier:'پیک اختصاصی فروشگاه لوکس',tipax:'تیپاکس فوری'};
const paymentNames:any={saman:'درگاه پرداخت آنلاین سامان',mellat:'درگاه پرداخت آنلاین ملت',zarinpal:'زرین‌پال',cod:'پرداخت در محل هنگام تحویل'};
const serializeOrder = (o:any) => ({
  id:o.id, orderNumber:o.orderNumber, customerName:o.customerName, customerPhone:o.customerPhone,
  date:o.createdAt.toISOString(), totalAmount:o.totalAmount, discountAmount:o.discountAmount,
  shippingMethod:shippingNames[o.shippingMethod]||o.shippingMethod, shippingCost:o.shippingCost,
  status:String(o.status).toLowerCase(), address:o.address, paymentMethod:o.paymentMethod.startsWith('zarinpal:')?'زرین‌پال':paymentNames[o.paymentMethod]||o.paymentMethod,
  items:o.items.map((i:any)=>({ quantity:i.quantity, selectedColor:i.selectedColor || '', product:{ id:i.product.id, title:i.productTitle, slug:i.product.slug, category:i.product.category.slug, price:i.unitPrice, originalPrice:i.product.originalPrice, discountPercent:i.product.discountPercent, rating:i.product.rating, reviewsCount:i.product.reviewsCount, image:i.product.image, gallery:i.product.gallery, description:i.product.description, shortDescription:i.product.shortDescription, colors:i.product.colors, stock:i.product.stock, sku:i.sku, isNew:i.product.isNew, isFeatured:i.product.isFeatured, specs:i.product.specs, features:i.product.features } }))
});

export async function place(req: any, res: Response) { try { const order = await createOrder(req.body, req.user?.id); const full=await prisma.order.findUnique({where:{id:order.id},include:{items:{include:{product:{include:{category:true}}}}}}); if (full) { void sendSms(full.customerPhone, `فروشگاه لوکس: سفارش ${full.orderNumber} با مبلغ ${full.totalAmount.toLocaleString('fa-IR')} تومان ثبت شد.`); void notifyStore(`سفارش جدید ${full.orderNumber} برای ${full.customerName}`); } res.status(201).json({ success:true, order:serializeOrder(full) }); } catch (e:any) { if (e.message?.startsWith('OUT_OF_STOCK:')) { const [,title,available]=e.message.split(':'); return res.status(409).json({success:false,code:'OUT_OF_STOCK',message:`موجودی «${title}» کافی نیست. موجودی فعلی: ${available}.`,availableStock:Number(available)}); } if(e.message==='PRODUCT_NOT_FOUND')return res.status(404).json({success:false,message:'یکی از محصولات یافت نشد.'}); throw e; } }
export async function mine(req:any,res:Response){const orders=await prisma.order.findMany({where:{userId:req.user.id},include:{items:{include:{product:{include:{category:true}}}}},orderBy:{createdAt:'desc'}});res.json({success:true,orders:orders.map(serializeOrder)});}
export async function all(req:any,res:Response){if(req.user?.role==='ADMIN'){const orders=await prisma.order.findMany({include:{items:{include:{product:{include:{category:true}}}}},orderBy:{createdAt:'desc'}});return res.json({success:true,orders:orders.map(serializeOrder)});} if(req.user)return mine(req,res); return res.status(401).json({success:false,message:'ورود الزامی است.'});}
export async function track(req: Request, res: Response) {
  const raw = decodeURIComponent(req.params.query)
    .trim()
    .replace(/^#/, '');

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: `#${raw}` },
        { id: raw },
      ],
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'سفارشی با این مشخصات یافت نشد.',
    });
  }

  const serialized = serializeOrder(order);

  // اطلاعات خصوصی برای رهگیری عمومی نمایش داده نمی‌شوند.
  const publicOrder = {
    id: serialized.id,
    orderNumber: serialized.orderNumber,
    date: serialized.date,
    totalAmount: serialized.totalAmount,
    discountAmount: serialized.discountAmount,
    shippingMethod: serialized.shippingMethod,
    shippingCost: serialized.shippingCost,
    status: serialized.status,
    paymentMethod: serialized.paymentMethod,
    items: serialized.items,
  };

  return res.json({
    success: true,
    order: publicOrder,
  });
}
