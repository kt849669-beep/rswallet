// Session-only authenticator demonstration. No real account or server authentication.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function createDemoSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  let bits = 0;
  let value = 0;
  let result = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  return result;
}

function decodeSecret(secret: string): Uint8Array<ArrayBuffer> {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of secret.toUpperCase().replace(/=+$/, '')) {
    const digit = alphabet.indexOf(char);
    if (digit < 0) throw new Error('Invalid setup key');
    value = (value << 5) | digit;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

export function demoAuthenticatorUri(secret: string): string {
  return `otpauth://totp/RsWallet%20Demo:Preview?secret=${secret}&issuer=RsWallet%20Demo&algorithm=SHA1&digits=6&period=30`;
}

export async function generateTotp(secret: string, timestamp = Date.now(), digits = 6): Promise<string> {
  const counter = Math.floor(timestamp / 30_000);
  const message = new Uint8Array(8);
  const view = new DataView(message.buffer);
  view.setUint32(0, Math.floor(counter / 0x100000000));
  view.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey('raw', decodeSecret(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, message));
  const offset = digest[digest.length - 1] & 15;
  const binary = ((digest[offset] & 127) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];
  return String(binary % (10 ** digits)).padStart(digits, '0');
}

export async function verifyDemoCode(secret: string, code: string, timestamp = Date.now()): Promise<boolean> {
  if (!/^\d{6}$/.test(code)) return false;
  const accepted = await Promise.all([-1, 0, 1].map(offset => generateTotp(secret, timestamp + offset * 30_000)));
  return accepted.includes(code);
}
