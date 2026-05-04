export function generateSparkData(symbol: string): number[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = ((seed << 5) - seed + symbol.charCodeAt(i)) | 0;
  const points: number[] = [];
  let val = 50 + (Math.abs(seed) % 50);
  for (let i = 0; i < 7; i++) {
    seed = (seed * 16807 + 0) % 2147483647;
    val += ((seed % 21) - 10);
    points.push(Math.max(10, val));
  }
  return points;
}
