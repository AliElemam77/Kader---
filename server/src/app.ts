import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Express {
  const app = express();

  // Global Middlewares
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root status endpoint
  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Kader ATS Backend API',
      database: 'Supabase PostgreSQL',
      endpoints: {
        health: '/api/health',
        jobs: '/api/jobs',
        auth: '/api/auth',
      },
    });
  });

  // API Routes (mounted at both /api and root for seamless Vercel/serverless compatibility)
  app.use('/api', routes);
  app.use('/', routes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Route not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
