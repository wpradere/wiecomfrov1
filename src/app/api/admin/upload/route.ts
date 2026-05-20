import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'El archivo supera el límite de 10 MB' }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalName = file.name.replace(/\.[^.]+$/, '').replace(/\s+/g, '-');
  const filename = `${originalName}-${Date.now()}.webp`;
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
  const dest = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await sharp(buffer).webp({ quality: 85 }).toFile(dest);

  return NextResponse.json({ url: `/images/products/${filename}` });
}
