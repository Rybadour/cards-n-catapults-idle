export function formatNumber(n: number, minimumFractionDigits: number, maximumFractionDigits: number): string {
  if (isNaN(n)) return '';

  return n.toLocaleString(undefined, {minimumFractionDigits, maximumFractionDigits});
}

export function enumFromKey<T> (enm: { [s: string]: T}, value: string): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? value as unknown as T
    : undefined;
}

export function getRandomFromArray<T>(array: T[]) {
  const r = Math.random() * array.length;
  return array[Math.floor(r)];
}

export function getExponentialValue(base: number, growth: number, growthCount: number) {
  return base * Math.pow(growth, growthCount);
}

export function using<T>(thing: T | undefined, closure: (thing: T) => void) {
  if (thing) {
    closure(thing);
  }
}