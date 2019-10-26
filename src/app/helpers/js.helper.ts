export function aOutsideBC(a: number, b: number, c: number): boolean {
  [b, c] = [Math.min(b, c), Math.max(b, c)];
  return a < b || a > c;
}

export function aBetweenBC(a: number, b: number, c: number): boolean {
  [b, c] = [Math.min(b, c), Math.max(b, c)];
  return a > b && a < c;
}
