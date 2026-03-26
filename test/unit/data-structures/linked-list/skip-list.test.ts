import { SkipList } from '../../../../src';

describe('classic use', () => {
  it('@example In-memory sorted key-value store', () => {
    const store = new SkipList<number, string>();

    store.add(3, 'three');
    store.add(1, 'one');
    store.add(5, 'five');
    store.add(2, 'two');

    expect(store.get(3)).toBe('three');
    expect(store.get(1)).toBe('one');
    expect(store.get(5)).toBe('five');

    // Update existing key
    store.add(3, 'THREE');
    expect(store.get(3)).toBe('THREE');
  });

  it('@example Fast lookup with deletion', () => {
    const cache = new SkipList<string, number>();

    cache.add('alpha', 1);
    cache.add('beta', 2);
    cache.add('gamma', 3);
    cache.add('delta', 4);

    expect(cache.get('beta')).toBe(2);

    // Remove an entry
    expect(cache.delete('beta')).toBe(true);
    expect(cache.get('beta')).toBeUndefined();

    // Non-existent key
    expect(cache.delete('omega')).toBe(false);
    expect(cache.get('omega')).toBeUndefined();
  });

  it('@example Building a sorted index', () => {
    const index = new SkipList<number, string>();

    // Insert scores with player names
    const entries: [number, string][] = [
      [88, 'Alice'],
      [72, 'Bob'],
      [95, 'Charlie'],
      [81, 'Diana'],
      [90, 'Eve']
    ];

    for (const [score, name] of entries) {
      index.add(score, name);
    }

    // O(log n) lookups
    expect(index.get(95)).toBe('Charlie');
    expect(index.get(81)).toBe('Diana');
    expect(index.get(60)).toBeUndefined();
  });
});

describe('SkipList', () => {
  let skipList: SkipList<number, string>;

  beforeEach(() => {
    skipList = new SkipList<number, string>();
  });

  it('should insert and retrieve elements correctly', () => {
    skipList.add(1, 'One');
    skipList.add(2, 'Two');
    skipList.add(3, 'Three');

    expect(skipList.get(1)).toBe('One');
    expect(skipList.get(2)).toBe('Two');
    expect(skipList.get(3)).toBe('Three');
  });

  it('should return undefined for non-existent keys', () => {
    skipList.add(1, 'One');
    skipList.add(2, 'Two');

    expect(skipList.get(3)).toBeUndefined();
    expect(skipList.get(0)).toBeUndefined();
  });

  it('should delete elements correctly', () => {
    skipList.add(1, 'One');
    skipList.add(2, 'Two');
    skipList.add(3, 'Three');

    skipList.delete(2);

    expect(skipList.get(2)).toBeUndefined();
  });

  it('should handle random data correctly', () => {
    const randomData: Array<[number, string]> = [
      [5, 'Five'],
      [1, 'One'],
      [3, 'Three'],
      [2, 'Two'],
      [4, 'Four']
    ];

    for (const [key, value] of randomData) {
      skipList.add(key, value);
    }

    expect(skipList.get(3)).toBe('Three');
    expect(skipList.get(5)).toBe('Five');
    expect(skipList.get(4)).toBe('Four');
  });
});

describe('SkipList Test2', () => {
  let skipList: SkipList<number, string>;

  beforeEach(() => {
    skipList = new SkipList();
    skipList.add(1, 'One');
    skipList.add(2, 'Two');
    skipList.add(3, 'Three');
    skipList.add(4, 'Four');
  });

  it('first() should return the first element', () => {
    expect(skipList.first).toBe('One');
  });

  it('last() should return the last element', () => {
    expect(skipList.last).toBe('Four');
  });

  it('higher(key) should return the first element greater than the given key', () => {
    expect(skipList.higher(2)).toBe('Three');
    expect(skipList.higher(3)).toBe('Four');
    expect(skipList.higher(4)).toBeUndefined();
  });

  it('lower(key) should return the last element less than the given key', () => {
    expect(skipList.lower(2)).toBe('One');
    expect(skipList.lower(1)).toBe(undefined);
  });
});

describe('bug fixes', () => {
  it('should update value when adding with existing key', () => {
    const sl = new SkipList<number, string>();
    sl.add(1, 'a');
    sl.add(2, 'b');
    sl.add(3, 'c');

    // Update existing key
    sl.add(2, 'B');
    expect(sl.get(2)).toBe('B');

    // Other keys unchanged
    expect(sl.get(1)).toBe('a');
    expect(sl.get(3)).toBe('c');
  });

  it('should not create duplicate nodes on key update', () => {
    const sl = new SkipList<number, string>();
    sl.add(1, 'a');
    sl.add(2, 'b');
    sl.add(3, 'c');

    // Update key 2 multiple times
    sl.add(2, 'x');
    sl.add(2, 'y');
    sl.add(2, 'z');

    expect(sl.get(2)).toBe('z');

    // Delete should remove the single node
    sl.delete(2);
    expect(sl.get(2)).toBeUndefined();

    // Other keys still intact
    expect(sl.get(1)).toBe('a');
    expect(sl.get(3)).toBe('c');
  });
});
