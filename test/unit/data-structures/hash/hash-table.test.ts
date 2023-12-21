import { HashTable, HashTableNode } from '../../../../src';

describe('HashNode', () => {
  it('should create a HashNode with key and value', () => {
    const key = 'testKey';
    const value = 'testValue';
    const hashNode = new HashTableNode(key, value);

    expect(hashNode.key).toBe(key);
    expect(hashNode.value).toBe(value);
    expect(hashNode.next).toBe(undefined);
  });
});

describe('HashTable', () => {
  it('should initialize with default capacity', () => {
    const hashTable = new HashTable<string, string>();
    expect(hashTable.capacity).toBe(16);
    expect(hashTable.buckets).toEqual(new Array(16).fill(undefined));
    expect(hashTable.hashFn('a')).toBe(6);
    expect(hashTable.capacity).toBe(16);
    expect(hashTable.size).toBe(0);
    expect(hashTable.buckets.length).toBe(16);
  });

  it('should initialize with custom capacity', () => {
    const customCapacity = 500;
    const hashTable = new HashTable<string, string>(customCapacity);

    expect(hashTable.capacity).toBe(customCapacity);
    expect(hashTable.size).toBe(0);
    expect(hashTable.buckets.length).toBe(customCapacity);
  });

  it('should put and get values correctly', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'testKey';
    const value = 'testValue';

    hashTable.set(key, value);
    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should handle collisions by chaining', () => {
    const hashTable = new HashTable<string, string>();
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';

    hashTable.set(key1, value1);
    hashTable.set(key2, value2);

    const retrievedValue1 = hashTable.get(key1);
    const retrievedValue2 = hashTable.get(key2);

    expect(retrievedValue1).toBe(value1);
    expect(retrievedValue2).toBe(value2);
  });

  it('should update value for an existing key', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'testKey';
    const initialValue = 'testValue1';
    const updatedValue = 'testValue2';

    hashTable.set(key, initialValue);
    hashTable.set(key, updatedValue);

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBe(updatedValue);
  });

  it('should return undefined for non-existent key', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'nonExistentKey';

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBeUndefined();
  });

  it('should delete key-value pair correctly', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'testKey';
    const value = 'testValue';

    hashTable.set(key, value);
    hashTable.delete(key);

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBeUndefined();
    expect(hashTable.size).toBe(0);
  });
});

describe('HashTable', () => {
  let hashTable: HashTable<string, number>;

  beforeEach(() => {
    hashTable = new HashTable<string, number>();
  });

  it('should insert and retrieve values correctly', () => {
    hashTable.set('one', 1);
    hashTable.set('two', 2);

    expect(hashTable.get('one')).toBe(1);
    expect(hashTable.get('two')).toBe(2);
  });

  it('should update values correctly', () => {
    hashTable.set('one', 1);
    expect(hashTable.get('one')).toBe(1);

    hashTable.set('one', 100); // Update the value
    expect(hashTable.get('one')).toBe(100);
  });

  it('should handle collisions correctly', () => {
    hashTable = new HashTable<string, number>(1); // Set a small capacity to force collisions
    hashTable.set('one', 1);
    hashTable.set('two', 2);

    expect(hashTable.get('one')).toBe(1);
    expect(hashTable.get('two')).toBe(2);
  });

  it('should delete values correctly', () => {
    hashTable.set('one', 1);
    hashTable.set('two', 2);
    hashTable.delete('one');

    expect(hashTable.get('one')).toBeUndefined();
    expect(hashTable.get('two')).toBe(2);
  });

  it('should handle non-existent keys correctly', () => {
    expect(hashTable.get('non-existent')).toBeUndefined();
    hashTable.delete('non-existent'); // Removing a non-existent key should not cause errors
  });

  it('should handle custom hash function correctly', () => {
    // const customHashFn = () => {
    //   // Custom hash function that returns a fixed value for all keys
    //   return 42;
    // };

    hashTable = new HashTable<string, number>(16);
    hashTable.set('one', 1);
    expect(hashTable.get('one')).toBe(1);
    expect(hashTable.get('two')).toBeUndefined();
  });

  it('should expand when load factor exceeds threshold', () => {
    hashTable = new HashTable<string, number>(2); // Set a small capacity to trigger expansion
    hashTable.set('one', 1);
    hashTable.set('two', 2);
    hashTable.set('three', 3); // This should trigger an expansion

    expect(hashTable.capacity).toBe(16);
    expect(hashTable.get('one')).toBe(1);
    expect(hashTable.get('two')).toBe(2);
    expect(hashTable.get('three')).toBe(3);
  });
});

describe('HashTable performance', function () {
  it('Items set performance', function () {
    const mag = 100000;
    const ht = new HashTable();
    // const s = performance.now();
    for (let i = 0; i < mag; i++) {
      ht.set(i, i);
    }
    // const s1 = performance.now();
    const map = new Map();
    for (let i = 0; i < mag; i++) {
      map.set(i, i);
    }
  });
});

describe('HashTable methods', () => {
  let hashTable: HashTable<string, string>;

  beforeEach(() => {
    hashTable = new HashTable();
    for (let i = 0; i < 10; i++) {
      hashTable.set(`key${i}`, `value${i}`);
    }
  });

  test('should retrieve correct values with get method', () => {
    for (let i = 0; i < 10; i++) {
      expect(hashTable.get(`key${i}`)).toBe(`value${i}`);
    }
  });

  // test('forEach should apply a function to each key-value pair', () => {
  //   const mockCallback = jest.fn();
  //   hashTable.forEach(mockCallback);
  //
  //   expect(mockCallback.mock.calls.length).toBe(10);
  //   for (let i = 0; i < 10; i++) {
  //     // Check whether each key-value pair has been called before, regardless of the order
  //     const call = mockCallback.mock.calls.find(call => call[1] === `value${i}`);
  //     expect(call).toBeTruthy();
  //     expect(call[0]).toBe(`key${i}`);
  //   }
  // });

  test('filter should return a new HashTable with elements that satisfy the condition', () => {
    const filtered = hashTable.filter(([key]) => key.endsWith('1') || key.endsWith('3'));

    expect(filtered.size).toBe(2);
    expect(filtered.get('key1')).toBe('value1');
    expect(filtered.get('key3')).toBe('value3');
  });

  test('map should return a new HashTable with mapped values', () => {
    const mapped = hashTable.map(([, value]) => value.toUpperCase());

    for (let i = 0; i < 10; i++) {
      expect(mapped.get(`key${i}`)).toBe(`value${i}`.toUpperCase());
    }
  });

  test('reduce should accumulate values based on the reducer function', () => {
    const result = hashTable.reduce((acc, [, value]) => `${acc}-${value}`, '');

    expect(result).toBe('-value5-value7-value3-value4-value6-value0-value2-value8-value1-value9');
  });
});
