export enum DFSOperation {
  VISIT = 0,
  PROCESS = 1
}
export class Range<K> {
  constructor(
    public low: K,
    public high: K,
    public includeLow: boolean = true,
    public includeHigh: boolean = true
  ) {}

  // Determine whether a key is within the range
  isInRange(key: K, comparator: (a: K, b: K) => number): boolean {
    const lowCheck = this.includeLow ? comparator(key, this.low) >= 0 : comparator(key, this.low) > 0;
    const highCheck = this.includeHigh ? comparator(key, this.high) <= 0 : comparator(key, this.high) < 0;
    return lowCheck && highCheck;
  }
}
