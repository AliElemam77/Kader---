// Reads the Backend API base URL from client/.env or Vercel (VITE_API_URL)
// In production on Vercel, defaults to relative '/api' for zero-CORS seamless communication
const rawApiUrl: string =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const cleanUrl = rawApiUrl.replace(/\/+$/, '');

export const API_BASE_URL: string = cleanUrl.endsWith('/api')
  ? cleanUrl
  : `${cleanUrl}/api`;
