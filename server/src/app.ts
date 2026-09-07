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

  // API Routes
  app.use('/api', routes);

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
