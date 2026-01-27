// Get BASE_URL from environment variables or use fallback
const BASE_URL = import.meta.env.VITE_API_URL ||
  import.meta.env.EXPO_PUBLIC_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://api.izhaarlove.com'
    : 'http://localhost:5000');

export { BASE_URL };