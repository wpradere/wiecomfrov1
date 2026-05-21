import crypto from 'crypto';

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    const maxLen = Math.max(bufA.length, bufB.length);
    const paddedA = Buffer.concat([bufA, Buffer.alloc(maxLen - bufA.length)]);
    const paddedB = Buffer.concat([bufB, Buffer.alloc(maxLen - bufB.length)]);
    return crypto.timingSafeEqual(paddedA, paddedB) && bufA.length === bufB.length;
  } catch {
    return false;
  }
}

export function isValidAdminToken(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  return safeCompare(token, secret);
}

export function isValidPassword(input: string, stored: string): boolean {
  return safeCompare(input, stored);
}
