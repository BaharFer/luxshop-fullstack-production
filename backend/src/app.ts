import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { env } from './config/env';
import { router } from './routes';
import { optionalAuth } from './middleware/auth';
import { securityMiddleware, requireSameOrigin } from './middleware/security';

export async function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  securityMiddleware.forEach((middleware) => app.use(middleware));

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(requireSameOrigin);
  app.use(optionalAuth);

  app.use('/api', router);

  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), 'uploads'))
  );

  if (env.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), 'frontend'),
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const dist = path.resolve(process.cwd(), 'frontend/dist');

    // Hashed assets (CSS/JS/images): aggressive long-term caching.
    app.use(
      express.static(dist, {
        maxAge: '1y',
        immutable: true,
        index: false,
      })
    );

    // HTML: never cache, so every deployment gets the latest asset references.
    app.get('*', (_req, res) => {
      res.setHeader(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.use(
    (err: any, _req: any, res: any, _next: any) => {
      console.error(err);

      if (err.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'داده‌های ارسالی معتبر نیستند.',
          details: err.issues,
        });
      }

      res.status(500).json({
        success: false,
        message: 'خطای داخلی سرور.',
      });
    }
  );

  return app;
}
