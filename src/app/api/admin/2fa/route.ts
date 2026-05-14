import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { getTotpSecret, setTotpSecret } from '@/lib/adminConfig';

function isAuthenticated(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET;
}

async function buildPayload(secret: string) {
  const totp = new OTPAuth.TOTP({
    issuer: 'WIIMY Admin',
    label: 'admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  const qrDataUrl = await QRCode.toDataURL(totp.toString());
  return { enabled: true, qrDataUrl, secret };
}

/** GET — return current 2FA status (+ QR if enabled) */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const secret = getTotpSecret();
  if (!secret) return NextResponse.json({ enabled: false });

  return NextResponse.json(await buildPayload(secret));
}

/** POST — generate a new secret and enable 2FA */
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const newSecret = new OTPAuth.Secret();
  setTotpSecret(newSecret.base32);

  return NextResponse.json(await buildPayload(newSecret.base32));
}

/** PATCH — verify a TOTP code (used from the setup UI to confirm it works) */
export async function PATCH(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { totpCode } = await req.json();
  const secret = getTotpSecret();
  if (!secret) return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });

  const totp = new OTPAuth.TOTP({
    issuer: 'WIIMY Admin',
    label: 'admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  const valid = totp.validate({ token: String(totpCode).trim(), window: 1 }) !== null;
  return NextResponse.json({ valid });
}

/** DELETE — disable 2FA */
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  setTotpSecret(null);
  return NextResponse.json({ ok: true });
}
