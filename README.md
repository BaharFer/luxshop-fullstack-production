# LuxShop — Full-Stack E-Commerce Platform

A production-ready Persian e-commerce platform built with **React, TypeScript, Vite, Express, Prisma, and PostgreSQL**.

LuxShop provides a complete shopping experience for customers together with a secure store-management dashboard for administrators. The application uses a real backend and relational database rather than relying on frontend-only or mock data.

## 🚀 Live Demo

**https://store.baharferdosi.ir/**

---

## ✨ Features

### Customer Experience

* Persian RTL user interface
* Responsive design for mobile, tablet, and desktop
* Product catalog with categories
* Product details and related products
* Search interface
* Shopping cart
* Wishlist / favorites
* Customer registration and login
* Order checkout
* Order tracking
* FAQ and contact sections
* Terms and conditions
* Responsive authentication UI

### Store Management

Authenticated store managers can access the management dashboard and perform protected administrative operations including:

* Create products
* Edit products
* Delete products
* Manage product inventory
* View customer orders
* Update order status
* Manage store catalog data

All important management operations are processed through the backend and database.

### Authentication & Authorization

* Customer authentication
* Store-manager authentication
* Role-based access control
* Protected administrative routes
* Protected administrative API endpoints
* Server-side authorization checks
* Secure session-based authentication

The frontend does not rely on simply hiding the admin interface. Administrative permissions are also enforced by the backend.

### Inventory & Order Processing

LuxShop keeps product inventory on the server/database and protects stock operations against concurrent purchases.

The backend validates inventory availability before completing an order, helping prevent negative stock and overselling.

### Performance

The application has been optimized for modern Core Web Vitals and responsive rendering.

Recent Lighthouse testing achieved:

* **Desktop Performance: 100**
* **Mobile Performance: up to 98**
* **CLS: 0**
* **LCP: ~1.9s**

Performance improvements include:

* Code splitting
* Lazy loading of secondary views
* Optimized hero image loading
* Stable image containers to prevent layout shifts
* Responsive product layouts
* Reduced initial rendering work
* Same-origin API communication in production

---

## 🏗️ Architecture

```text
luxshop-fullstack/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── types.ts
│   │   └── ...
│   └── vite.config.ts
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       ├── db/
│       ├── app.ts
│       └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── assets/
│
├── .env.example
├── package.json
└── README.md
```

### Application Flow

```text
React / Vite Frontend
        │
        │ HTTP API
        ▼
Express Backend
        │
        │ Prisma ORM
        ▼
PostgreSQL Database
```

In production, the frontend and API are served through the same application domain:

```text
https://store.baharferdosi.ir/
        │
        ├── Frontend
        │
        └── /api/*
             │
             ▼
        Express + PostgreSQL
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Motion
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Zod validation

### Infrastructure

* Render
* GitHub
* npm

### Optional Integrations

The project also includes configuration support for external services such as:

* Zarinpal payment gateway
* Kavenegar SMS notifications
* Google Gemini API

These services require their corresponding environment variables and credentials to be configured before use.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd luxshop-fullstack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000

DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/luxshop?schema=public

CORS_ORIGIN=http://localhost:5173

ADMIN_REGISTRATION_ENABLED=true

PUBLIC_URL=http://localhost:3000
```

Additional variables may be required for payment, SMS, or AI integrations.

---

## 🗄️ Database Setup

LuxShop uses **PostgreSQL + Prisma**.

After PostgreSQL is running and the database exists:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate deploy
```

For local development when creating new migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npx prisma db seed
```

The seed process creates the initial catalog data used by the application.

---

## ▶️ Development

Start the frontend and backend according to the project's development setup.

The Vite development server normally runs on:

```text
http://localhost:5173
```

The Express API normally runs on:

```text
http://localhost:3000
```

During local development, the frontend communicates with:

```text
http://localhost:3000/api
```

---

## 🏭 Production Build

Create a production build with:

```bash
npm run build
```

The build process:

1. Generates the Prisma client
2. Builds the Vite frontend
3. Bundles the Express server

Start the production server with:

```bash
NODE_ENV=production node dist/server.mjs
```

The project's production start script can also be used:

```bash
npm start
```

---

## 🔐 Environment Variables

Important environment variables include:

| Variable                     | Description                           |
| ---------------------------- | ------------------------------------- |
| `PORT`                       | Express server port                   |
| `DATABASE_URL`               | PostgreSQL connection string          |
| `CORS_ORIGIN`                | Allowed frontend origins              |
| `ADMIN_REGISTRATION_ENABLED` | Enables/disables manager registration |
| `PUBLIC_URL`                 | Public application URL                |
| `ZARINPAL_*`                 | Payment gateway configuration         |
| `KAVENEGAR_*`                | SMS notification configuration        |
| `GEMINI_API_KEY`             | Optional Google Gemini integration    |

Never commit your real `.env` file or API credentials to GitHub.

---

## 🔒 Security

The application includes server-side protections for important operations, including:

* Authentication
* Role-based authorization
* Protected admin routes
* Input validation
* Server-side product and inventory validation
* Protected order operations
* Database-backed inventory
* Environment-based secrets
* CORS configuration
* Secure production deployment configuration

Frontend validation is treated as a usability feature, not as the security boundary.

---

## 🛒 Product & Inventory Model

Product information is stored in PostgreSQL and accessed through Prisma.

Frontend local storage is used only for client-side preferences such as:

* Shopping cart state
* Wishlist state

Core business data such as:

* Products
* Users
* Orders
* Inventory
* Order status

is managed by the backend and database.

---

## 📱 Responsive Design

The interface is designed for:

* Mobile phones
* Tablets
* Laptops
* Desktop screens
* Large desktop displays

Special attention was given to:

* Navigation
* Hero section
* Product grids
* Product cards
* Authentication
* Search
* Modals
* Checkout
* Store management
* Typography
* RTL layout
* Image sizing

---

## 🎨 Assets & Typography

The project includes the site's product imagery and Persian typography assets.

The application uses **Vazirmatn** for its Persian interface and serves the required font assets from the project itself for consistent production rendering.

Product images are organized under:

```text
/assets/products/
```

---

## ☁️ Deployment

The current production deployment is hosted on **Render**.

A typical deployment pipeline is:

```text
GitHub
   │
   ▼
Render
   │
   ├── Build
   │    ├── npm install
   │    ├── npm run build
   │    └── prisma migrate deploy
   │
   └── Start
        └── NODE_ENV=production node dist/server.mjs
```

The production application is available at:

**https://store.baharferdosi.ir/**

---

## 🧪 Testing

Before deployment, the project should be verified across:

### Authentication

* Customer registration
* Customer login
* Store-manager login
* Logout
* Role assignment

### Store

* Product loading
* Product details
* Product creation
* Product editing
* Product deletion
* Inventory updates
* Order creation
* Order status updates

### Inventory

* Stock validation
* Out-of-stock handling
* Concurrent purchase protection

### UI

* Mobile
* Tablet
* Desktop
* RTL rendering
* Authentication flows
* Wishlist
* Cart and checkout

---

## 📊 Performance Baseline

Latest Lighthouse testing demonstrated a strong production performance baseline:

| Metric              |    Result |
| ------------------- | --------: |
| Desktop Performance |   **100** |
| Mobile Performance  |    **98** |
| CLS                 |     **0** |
| LCP                 | **~1.9s** |
| FCP                 | **~1.7s** |

Actual Lighthouse scores can vary slightly depending on the browser, device emulation, network conditions, and test environment.

---

## 📄 License

This project is developed as a personal full-stack e-commerce project.

All product images, branding assets, and third-party resources remain subject to their respective licenses and ownership terms.

---

## 👩‍💻 Author

**Bahar Ferdowsi**

### Live Project

**https://store.baharferdosi.ir/**
