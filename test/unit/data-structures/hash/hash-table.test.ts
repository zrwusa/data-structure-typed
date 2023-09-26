import {HashNode, HashTable} from '../../../../src';

describe('HashNode', () => {
  it('should create a HashNode with key and value', () => {
    const key = 'testKey';
    const value = 'testValue';
    const hashNode = new HashNode(key, value);

    expect(hashNode.key).toBe(key);
    expect(hashNode.val).toBe(value);
    expect(hashNode.next).toBe(null);
  });
});

describe('HashTable', () => {
  it('should initialize with default capacity', () => {
    const hashTable = new HashTable<string, string>();

    expect(hashTable.capacity).toBe(1000);
    expect(hashTable.size).toBe(0);
    expect(hashTable.buckets.length).toBe(1000);
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

    hashTable.put(key, value);
    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should handle collisions by chaining', () => {
    const hashTable = new HashTable<string, string>();
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';

    hashTable.put(key1, value1);
    hashTable.put(key2, value2);

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

    hashTable.put(key, initialValue);
    hashTable.put(key, updatedValue);

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBe(updatedValue);
  });

  it('should return undefined for non-existent key', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'nonExistentKey';

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBeUndefined();
  });

  it('should remove key-value pair correctly', () => {
    const hashTable = new HashTable<string, string>();
    const key = 'testKey';
    const value = 'testValue';

    hashTable.put(key, value);
    hashTable.remove(key);

    const retrievedValue = hashTable.get(key);

    expect(retrievedValue).toBeUndefined();
    expect(hashTable.size).toBe(0);
  });
});
