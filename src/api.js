/** مسارات الـ API عبر Vite proxy (`/api` → الخادم على 5000) لتجنّب مشاكل CORS بين المنافذ. */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/api${p}`;
}
