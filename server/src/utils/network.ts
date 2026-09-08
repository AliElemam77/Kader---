import os from 'os';
import { env } from '../config/env';

/**
 * Detect the primary local network IPv4 address (e.g. 192.168.1.23)
 */
export function getNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

/**
 * Get effective client URL for emails and redirects.
 * In development, automatically substitutes localhost with the LAN IP
 * so links work across mobile devices and local network browsers.
 */
export function getEffectiveClientUrl(): string {
  if (env.NODE_ENV === 'production' && env.CLIENT_URL && !env.CLIENT_URL.includes('localhost')) {
    return env.CLIENT_URL.replace(/\/+$/, '');
  }

  // If already specified as an IP or custom domain in .env, use it
  if (env.CLIENT_URL && !env.CLIENT_URL.includes('localhost')) {
    return env.CLIENT_URL.replace(/\/+$/, '');
  }

  // Fallback: dynamically resolve to active local network IP on port 5173
  const ip = getNetworkIp();
  return `http://${ip}:5173`;
}
