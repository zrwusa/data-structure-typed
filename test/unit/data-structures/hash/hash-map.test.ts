import {HashMap} from '../../../../src';

describe('HashMap', () => {
  let hashMap: HashMap<string, number>;

  beforeEach(() => {
    hashMap = new HashMap<string, number>();
  });

  it('should initialize correctly', () => {
    expect(hashMap.size).toBe(0);
    expect(hashMap.table.length).toBe(16);
    expect(hashMap.loadFactor).toBe(0.75);
    expect(hashMap.capacityMultiplier).toBe(2);
    expect(hashMap.initialCapacity).toBe(16);
    expect(hashMap.isEmpty()).toBe(true);
  });

  it('should put and get values', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('three')).toBe(3);
  });

  it('should handle key collisions', () => {
    // Force a collision by setting two different keys to the same bucket
    hashMap.hashFn = () => 0; // Override hash function to return the same index
    hashMap.set('key1', 1);
    hashMap.set('key2', 2);

    expect(hashMap.get('key1')).toBe(1);
    expect(hashMap.get('key2')).toBe(2);
  });

  it('should remove values', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    hashMap.remove('one');
    expect(hashMap.get('one')).toBeUndefined();
    expect(hashMap.size).toBe(1);
  });

  it('should clear the HashMap', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    hashMap.clear();
    expect(hashMap.size).toBe(0);
    expect(hashMap.isEmpty()).toBe(true);
  });

  it('should iterate over entries', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);

    const entries = Array.from(hashMap.entries());
    expect(entries).toEqual(
      expect.arrayContaining([
        ['one', 1],
        ['two', 2],
        ['three', 3]
      ])
    );
  });

  it('should resize the table when load factor is exceeded', () => {
    // Set a small initial capacity for testing resizing
    hashMap = new HashMap<string, number>(4, 0.5);

    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);
    hashMap.set('four', 4); // This should trigger a resize

    expect(hashMap.table.length).toBe(8);
    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('three')).toBe(3);
    expect(hashMap.get('four')).toBe(4);
  });

  it('should allow using a custom hash function', () => {
    const customHashFn = () => {
      // A simple custom hash function that always returns 0
      return 0;
    };
    hashMap = new HashMap<string, number>(16, 0.75, customHashFn);

    hashMap.set('one', 1);
    hashMap.set('two', 2);

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    // Since the custom hash function always returns 0, these keys will collide.
    // Make sure they are stored separately.
    expect(hashMap.table[0].length).toBe(2);
  });
});
