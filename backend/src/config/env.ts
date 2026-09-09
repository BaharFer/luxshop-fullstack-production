

const required = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: Number(process.env.PORT ?? 3000),

  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET'),

  cookieName: process.env.AUTH_COOKIE_NAME ?? 'luxshop_session',

  cookieSecure:
  process.env.AUTH_COOKIE_SECURE === 'true' ||
  process.env.NODE_ENV === 'production',

  corsOrigins: Array.from(
    new Set([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      ...(process.env.CORS_ORIGIN ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    ]),
  ),

  adminRegistrationEnabled:
    process.env.ADMIN_REGISTRATION_ENABLED !== 'false',

  adminBootstrapSecret:
    process.env.ADMIN_BOOTSTRAP_SECRET,

  // SMS.ir
  smsIrApiKey:
    process.env.SMS_IR_API_KEY ?? '',

  smsIrLineNumber:
    process.env.SMS_IR_LINE_NUMBER ?? '',

  smsOrderNotifications:
    process.env.SMS_ORDER_NOTIFICATIONS !== 'false',

  storeNotificationPhone:
    process.env.STORE_NOTIFICATION_PHONE ?? '',

  // ZarinPal
  zarinpalMerchantId:
    process.env.ZARINPAL_MERCHANT_ID ?? '',

  zarinpalSandbox:
    process.env.ZARINPAL_SANDBOX === 'true',

  publicAppUrl:
    process.env.PUBLIC_APP_URL ?? 'http://localhost:3000',
};