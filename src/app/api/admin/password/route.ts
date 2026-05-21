import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, setAdminPassword } from '@/lib/adminConfig';
import { isValidAdminToken, isValidPassword } from '@/lib/authHelper';

export async function POST(req: NextRequest) {
  if (!isValidAdminToken(req.cookies.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
  }

  if (!isValidPassword(currentPassword, getAdminPassword())) {
    return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 });
  }

  setAdminPassword(newPassword);
  return NextResponse.json({ ok: true });
}
