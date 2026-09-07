import { createApp } from './app';
import { env } from './config/env';
import { verifyMailer } from './config/mailer';
import prisma from './config/db';
import os from 'os';

function getNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const app = createApp();

const server = app.listen(env.PORT, '0.0.0.0', async () => {
  const networkIp = getNetworkIp();
  console.log(`\n🚀 ATS Server running at:`);
  console.log(`   ➜  Local:   http://localhost:${env.PORT}`);
  console.log(`   ➜  Network: http://${networkIp}:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Health Check: http://${networkIp}:${env.PORT}/api/health\n`);

  // Verify mailer connection
  await verifyMailer();
});

// Graceful shutdown
async function handleShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Database disconnected. Process terminated.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
