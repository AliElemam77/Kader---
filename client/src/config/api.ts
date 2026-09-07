// Reads the Backend API base URL from client/.env (VITE_API_URL)
// Defaults to http://localhost:5000/api if not specified
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
