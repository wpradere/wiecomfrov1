import fs from 'fs';
import path from 'path';

const CONFIG_PATH = process.env.CONFIG_DIR
  ? path.join(process.env.CONFIG_DIR, 'admin-config.json')
  : path.join(process.cwd(), 'admin-config.json');

interface AdminConfig {
  password?: string;
  totpSecret?: string;
}

function readConfig(): AdminConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeConfig(config: AdminConfig): void {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function getAdminPassword(): string {
  return readConfig().password ?? process.env.ADMIN_PASSWORD ?? 'wiimy2026';
}

export function setAdminPassword(newPassword: string): void {
  writeConfig({ ...readConfig(), password: newPassword });
}

export function getTotpSecret(): string | null {
  return readConfig().totpSecret ?? process.env.TOTP_SECRET ?? null;
}

export function setTotpSecret(secret: string | null): void {
  const config = readConfig();
  if (secret) {
    writeConfig({ ...config, totpSecret: secret });
  } else {
    const { totpSecret: _, ...rest } = config;
    writeConfig(rest);
  }
}

export function isTotpEnabled(): boolean {
  return getTotpSecret() !== null;
}
