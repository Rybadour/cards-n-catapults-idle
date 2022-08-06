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

// TODO: https://www.youtube.com/watch?v=mglS3_gG-n8
export function getExpValueMultiple(base: number, growth: number, growthCount: number, numIterations: number) {
  return getExponentialValue(base, growth, growthCount) *
    (Math.pow(growth, numIterations) - 1) / (growth - 1);
}

export function getMultipleFromExpValue(base: number, growth: number, growthCount: number, currentValue: number) {
  const inner = ((currentValue) * (growth - 1) / (base * Math.pow(growth, growthCount))) + 1;
  const multiple = Math.log(inner) / Math.log(growth);
  return Math.round(multiple * 10000) / 10000;
}

export function using<T>(thing: T | undefined, closure: (thing: T) => void) {
  if (thing) {
    closure(thing);
  }
}