# فروشگاه لوکس — Full-Stack E-commerce

## Architecture
- `frontend/`: React + Vite customer/admin UI.
- `backend/src/`: Express API split into config, routes, controllers, services, repositories, middleware, validators and DB access.
- `prisma/schema.prisma`: PostgreSQL relational model.
- `prisma/seed.ts`: initial catalog/admin/customer seed data.

## Local setup
0. Optional: `docker compose up -d postgres` and update `DATABASE_URL` to use the compose credentials.
1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET` and PostgreSQL `DATABASE_URL`.
2. `npm install`
3. `npm run prisma:generate`
4. `npm run prisma:migrate -- --name init`
5. `npm run prisma:seed`
6. `npm run dev`

The dev server exposes both the API and the Vite frontend at `http://localhost:3000`.

## Production
Run `npm run build` then `npm start`.

Admin accounts are not publicly self-registerable by default. Use a controlled bootstrap/invitation process and keep `ADMIN_REGISTRATION_ENABLED=false` in production.


### راه‌اندازی ساده روی مک بدون Docker
اگر PostgreSQL را قبلاً روی مک نصب و دیتابیس `luxshop` را ساخته‌اید، برای اجرای این نسخه کافی است: `npm install` و سپس `npm start`. اسکریپت `start` خودش build و Prisma Client generation را انجام می‌دهد؛ نیازی به اجرای دوباره migration/seed نیست مگر اینکه schema دیتابیس را عمداً تغییر دهید.

### SMS و پرداخت
- پیامک اختیاری با Kavenegar از طریق `KAVENEGAR_API_KEY`، `KAVENEGAR_SENDER` و `STORE_NOTIFICATION_PHONE` فعال می‌شود.
- درگاه زرین‌پال با `ZARINPAL_MERCHANT_ID` و `ZARINPAL_SANDBOX` آماده شده است. برای پرداخت واقعی، دامنه callback باید در ترمینال درگاه ثبت شود؛ Sandbox برای تست مناسب است.
- کلیدها فقط در `.env` قرار می‌گیرند و نباید داخل frontend یا Git قرار بگیرند.
