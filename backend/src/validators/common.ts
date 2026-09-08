import { z } from 'zod';

// ─────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  usernameOrPhone: z
    .string()
    .trim()
    .min(3)
    .max(120),

  password: z
    .string()
    .min(8)
    .max(128),

  role: z
    .enum(['customer', 'admin'])
    .optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  phone: z
    .string()
    .trim()
    .min(7)
    .max(20),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('')),

  password: z
    .string()
    .min(8)
    .max(128),
});

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(220),

  category: z
    .string()
    .min(1),

  price: z
    .coerce
    .number()
    .int()
    .nonnegative(),

  originalPrice: z
    .coerce
    .number()
    .int()
    .nonnegative()
    .optional(),

  discountPercent: z
    .coerce
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  image: z
    .string()
    .trim()
    .min(1),

  gallery: z
    .array(
      z.string().trim().min(1)
    )
    .default([]),

  description: z
    .string()
    .max(10000),

  shortDescription: z
    .string()
    .max(1000),

  colors: z
    .array(
      z.object({
        name: z.string(),
        hex: z.string(),
        inStock: z.boolean(),
      })
    )
    .default([]),

  stock: z
    .coerce
    .number()
    .int()
    .min(0)
    .max(1_000_000),

  sku: z
    .string()
    .trim()
    .min(2)
    .max(100),

  isNew: z
    .boolean()
    .optional(),

  isFeatured: z
    .boolean()
    .optional(),

  specs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .default([]),

  features: z
    .array(z.string())
    .default([]),
});

export const stockSchema = z.object({
  stock: z
    .coerce
    .number()
    .int()
    .min(0)
    .max(1_000_000),
});

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  customerPhone: z
    .string()
    .trim()
    .min(7)
    .max(20),

  items: z
    .array(
      z.object({
        productId: z
          .string()
          .min(1),

        quantity: z
          .number()
          .int()
          .min(1)
          .max(100),

        selectedColor: z
          .string()
          .max(100)
          .optional(),
      })
    )
    .min(1)
    .max(50),

  couponCode: z
    .string()
    .trim()
    .max(50)
    .optional(),

  shippingMethod: z
    .enum(['express', 'courier', 'tipax']),

  address: z.object({
    fullName: z
      .string()
      .trim()
      .min(2)
      .max(100),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20),

    province: z
      .string()
      .trim()
      .min(2)
      .max(100),

    city: z
      .string()
      .trim()
      .min(2)
      .max(100),

    postalCode: z
      .string()
      .trim()
      .min(5)
      .max(20),

    street: z
      .string()
      .trim()
      .min(3)
      .max(500),

    notes: z
      .string()
      .max(1000)
      .optional(),
  }),

  paymentMethod: z
    .enum(['saman', 'mellat', 'zarinpal', 'cod']),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
});

// ─────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .max(20)
    .optional(),

  subject: z
    .string()
    .max(200)
    .optional(),

  message: z
    .string()
    .trim()
    .min(5)
    .max(5000),
});