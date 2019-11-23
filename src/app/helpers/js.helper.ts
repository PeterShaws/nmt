export function isOutsideLimits(n: number, limits: [number, number]): boolean {
  const [lower, upper] = [Math.min(...limits), Math.max(...limits)];
  return n < lower || n > upper;
}

export function isInsideLimits(n: number, limits: [number, number]): boolean {
  const [lower, upper] = [Math.min(...limits), Math.max(...limits)];
  return n >= lower && n <= upper;
}

export function hex2dec(hex: string): number {
  return parseInt(hex, 16);
}

export function dec2hex(dec: number): string {
  return dec.toString(16).toUpperCase();
}
