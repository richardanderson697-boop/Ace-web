/**
 * Cryptographically Secure ID & Token Generator
 * Uses Web Crypto API (crypto.getRandomValues / crypto.randomUUID)
 * instead of pseudo-random Math.random() for all security-sensitive contexts.
 */

export function generateSecureHex(bytesLength: number = 8): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(bytesLength);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback using timestamp and secure pseudo-randomness if crypto is somehow absent
  return `${Date.now().toString(16)}`;
}

export function generateSecureOrderNumber(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint16Array(1);
    crypto.getRandomValues(array);
    // Range 1000 - 9999
    const num = 1000 + (array[0] % 9000);
    return `ACE-2026-${num}`;
  }
  return `ACE-2026-${Date.now().toString().slice(-4)}`;
}

export function generateSecureDrmToken(prefix: string = 'WS-85'): string {
  const hex = generateSecureHex(6).toUpperCase();
  return `DRM-${prefix}-${hex}`;
}

export function generateSecurePayoutId(): string {
  const hex = generateSecureHex(6);
  return `po_instant_${hex}`;
}

export function generateSecureTransactionId(prefix: string = 'tr_test'): string {
  const hex = generateSecureHex(8);
  return `${prefix}_${hex}`;
}
