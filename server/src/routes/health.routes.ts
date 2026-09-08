import { Router, Request, Response } from 'express';

import prisma from '../config/db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = `disconnected: ${err?.message || err}`;
  }

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    service: 'Kader ATS Backend API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
