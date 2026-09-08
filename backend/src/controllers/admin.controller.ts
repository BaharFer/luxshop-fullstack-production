import { Request, Response } from 'express';

import { prisma } from '../db/prisma';
import {
  orderStatusSchema,
  productSchema,
  stockSchema,
} from '../validators/common';

const toProduct = (product: any) => ({
  ...product,
  category: product.category.slug,
});

const shippingNames: Record<string, string> = {
  express: 'پست پیشتاز (رایگان)',
  courier: 'پیک اختصاصی فروشگاه لوکس',
  tipax: 'تیپاکس فوری',
};

const paymentNames: Record<string, string> = {
  saman: 'درگاه پرداخت آنلاین سامان',
  mellat: 'درگاه پرداخت آنلاین ملت',
  zarinpal: 'زرین‌پال',
  cod: 'پرداخت در محل هنگام تحویل',
};

export async function dashboard(_req: Request, res: Response) {
  const [
    sales,
    orders,
    pending,
    low,
    users,
    products,
    messages,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: 'CANCELLED',
        },
      },
    }),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: 'PROCESSING',
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lte: 3,
        },
      },
    }),

    prisma.user.count(),

    prisma.product.count(),

    prisma.contactMessage.count(),
  ]);

  res.json({
    success: true,
    stats: {
      totalSales: sales._sum.totalAmount ?? 0,
      totalOrdersCount: orders,
      pendingOrdersCount: pending,
      lowStockCount: low,
      usersCount: users,
      productsCount: products,
      messagesCount: messages,
    },
  });
}

export async function orders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
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
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    success: true,
    orders: orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      date: order.createdAt.toISOString(),
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,

      shippingMethod:
        shippingNames[order.shippingMethod] || order.shippingMethod,

      shippingCost: order.shippingCost,

      status: String(order.status).toLowerCase(),

      address: order.address,

      paymentMethod: order.paymentMethod.startsWith('zarinpal:')
        ? 'زرین‌پال'
        : paymentNames[order.paymentMethod] || order.paymentMethod,

      items: order.items.map((item: any) => ({
        quantity: item.quantity,
        selectedColor: item.selectedColor || '',

        product: {
          id: item.product.id,
          title: item.productTitle,
          slug: item.product.slug,
          category: item.product.category.slug,
          price: item.unitPrice,
          originalPrice: item.product.originalPrice,
          discountPercent: item.product.discountPercent,
          rating: item.product.rating,
          reviewsCount: item.product.reviewsCount,
          image: item.product.image,
          gallery: item.product.gallery,
          description: item.product.description,
          shortDescription: item.product.shortDescription,
          colors: item.product.colors,
          stock: item.product.stock,
          sku: item.sku,
          isNew: item.product.isNew,
          isFeatured: item.product.isFeatured,
          specs: item.product.specs,
          features: item.product.features,
        },
      })),
    })),
  });
}

export async function updateOrder(
  req: Request<{ id: string }>,
  res: Response
) {
  const { status } = orderStatusSchema.parse(req.body);

  const order = await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        items: true,
      },
    });

    if (!currentOrder) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const newStatus = status.toUpperCase() as any;

    // فقط هنگام اولین لغو سفارش، موجودی محصولات برگردانده می‌شود.
    if (
      newStatus === 'CANCELLED' &&
      currentOrder.status !== 'CANCELLED'
    ) {
      for (const item of currentOrder.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return tx.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: newStatus,
      },
      include: {
        items: true,
      },
    });
  });

  res.json({
    success: true,
    order,
  });
}

export async function products(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    success: true,
    products: products.map(toProduct),
  });
}

async function categoryId(slug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    throw new Error('CATEGORY_NOT_FOUND');
  }

  return category.id;
}

export async function createProduct(req: Request, res: Response) {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        categoryId: await categoryId(data.category),
        price: data.price,
        originalPrice: data.originalPrice,
        discountPercent: data.discountPercent,
        image: data.image,
        gallery: data.gallery,
        description: data.description,
        shortDescription: data.shortDescription,
        colors: data.colors,
        stock: data.stock,
        sku: data.sku,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        specs: data.specs,
        features: data.features,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      product: toProduct(product),
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'slug یا SKU تکراری است.',
      });
    }

    if (error.message === 'CATEGORY_NOT_FOUND') {
      return res.status(400).json({
        success: false,
        message: 'دسته‌بندی معتبر نیست.',
      });
    }

    throw error;
  }
}

export async function updateProduct(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const data = productSchema.partial().parse(req.body);

    const updateData: any = {
      ...data,
    };

    if (data.category) {
      updateData.categoryId = await categoryId(data.category);
      delete updateData.category;
    }

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      product: toProduct(product),
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'slug یا SKU تکراری است.',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'محصول موردنظر یافت نشد.',
      });
    }

    if (error.message === 'CATEGORY_NOT_FOUND') {
      return res.status(400).json({
        success: false,
        message: 'دسته‌بندی معتبر نیست.',
      });
    }

    throw error;
  }
}

export async function updateStock(
  req: Request<{ id: string }>,
  res: Response
) {
  const { stock } = stockSchema.parse(req.body);

  const product = await prisma.product.update({
    where: {
      id: req.params.id,
    },
    data: {
      stock,
    },
    include: {
      category: true,
    },
  });

  res.json({
    success: true,
    product: toProduct(product),
  });
}

export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response
) {
  await prisma.product.update({
    where: {
      id: req.params.id,
    },
    data: {
      isActive: false,
    },
  });

  res.json({
    success: true,
  });
}

export async function users(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    success: true,
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role === 'ADMIN' ? 'admin' : 'customer',
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
    })),
  });
}

export async function messages(_req: Request, res: Response) {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    success: true,
    messages,
  });
}