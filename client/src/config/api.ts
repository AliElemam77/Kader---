// Reads the Backend API base URL from client/.env or Vercel (VITE_API_URL)
// Automatically normalizes trailing slashes and ensures /api suffix
const rawApiUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleanUrl = rawApiUrl.replace(/\/+$/, '');

export const API_BASE_URL: string = cleanUrl.endsWith('/api')
  ? cleanUrl
  : `${cleanUrl}/api`;
