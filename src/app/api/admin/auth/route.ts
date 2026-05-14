import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import { getAdminPassword, getTotpSecret } from '@/lib/adminConfig';

export async function POST(req: NextRequest) {
  const { password, totpCode } = await req.json();

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const secret = getTotpSecret();

  if (secret) {
    // 2FA enabled — code not yet provided
    if (!totpCode) {
      return NextResponse.json({ totpRequired: true });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'WIIMY Admin',
      label: 'admin',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const delta = totp.validate({ token: String(totpCode).trim(), window: 1 });
    if (delta === null) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 401 });
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return res;
}
