/**
 * Returns the correct API base URL depending on execution context:
 * - Server-side (Server Components, API routes): uses the internal Docker
 *   hostname so traffic never leaves the Docker network.
 * - Client-side (browser): uses a relative path so the browser calls the
 *   same origin, and Next.js rewrites forward the request internally.
 */
export const API_URL =
  typeof window === 'undefined'
    ? `${process.env.INTERNAL_API_URL ?? 'http://localhost:8080'}/api/v1`
    : '/api/v1';
