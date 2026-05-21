import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT  = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

function isAdmin(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  try {
    const bufA = Buffer.from(token);
    const bufB = Buffer.from(secret);
    const maxLen = Math.max(bufA.length, bufB.length);
    const a = Buffer.concat([bufA, Buffer.alloc(maxLen - bufA.length)]);
    const b = Buffer.concat([bufB, Buffer.alloc(maxLen - bufB.length)]);
    return crypto.timingSafeEqual(a, b) && bufA.length === bufB.length;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req.cookies.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'El archivo supera el límite de 10 MB' }, { status: 413 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: 'Extensión de archivo no permitida' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format) throw new Error('invalid');
  } catch {
    return NextResponse.json({ error: 'El archivo no es una imagen válida' }, { status: 400 });
  }

  const sanitized = (file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)) || 'image';

  const filename = `${sanitized}-${Date.now()}.webp`;
  const uploadDir = path.resolve(process.cwd(), 'public', 'images', 'products');
  const dest = path.resolve(uploadDir, filename);

  if (!dest.startsWith(uploadDir + path.sep) && dest !== uploadDir) {
    return NextResponse.json({ error: 'Ruta de archivo inválida' }, { status: 400 });
  }

  await fs.mkdir(uploadDir, { recursive: true });
  await sharp(buffer).webp({ quality: 85 }).toFile(dest);

  return NextResponse.json({ url: `/images/products/${filename}` });
}
