import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename || filename.includes('..') || path.basename(filename) !== filename) {
    return new NextResponse(null, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'public', 'images', 'products');
  const ext = path.extname(filename).toLowerCase();

  try {
    const file = await fs.readFile(path.join(dir, filename));
    return new NextResponse(file, {
      headers: {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
