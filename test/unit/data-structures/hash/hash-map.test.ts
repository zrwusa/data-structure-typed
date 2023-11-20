import { HashMap } from '../../../../src';
import { getRandomInt, getRandomIntArray } from '../../../utils';

describe('HashMap', () => {
  let hashMap: HashMap<string, number>;

  beforeEach(() => {
    hashMap = new HashMap<string, number>();
  });

  it('should initialize correctly', () => {
    expect(hashMap.size).toBe(0);
    // expect(hashMap.table.length).toBe(16);
    // expect(hashMap.loadFactor).toBe(0.75);
    // expect(hashMap.capacityMultiplier).toBe(2);
    // expect(hashMap.initialCapacity).toBe(16);
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
    hashMap.set('key1', 1);
    hashMap.set('key2', 2);

    expect(hashMap.get('key1')).toBe(1);
    expect(hashMap.get('key2')).toBe(2);
  });

  it('should delete values', () => {
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    hashMap.delete('one');
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

    // const entries = Array.from(hashMap.entries());
    // expect(entries).toContainEqual(['one', 1]);
    // expect(entries).toContainEqual(['two', 2]);
    // expect(entries).toContainEqual(['three', 3]);
  });

  it('should resize the table when load factor is exceeded', () => {
    // Set a small initial capacity for testing resizing
    hashMap = new HashMap<string, number>();

    hashMap.set('one', 1);
    hashMap.set('two', 2);
    hashMap.set('three', 3);
    hashMap.set('four', 4); // This should trigger a resize

    // expect(hashMap.table.length).toBe(8);
    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    expect(hashMap.get('three')).toBe(3);
    expect(hashMap.get('four')).toBe(4);
  });

  it('should allow using a custom hash function', () => {
    hashMap = new HashMap<string, number>();

    hashMap.set('one', 1);
    hashMap.set('two', 2);

    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
    // Since the custom hash function always returns 0, these keys will collide.
    // Make sure they are stored separately.
    // expect(hashMap.table[0].length).toBe(2);
  });
});

describe('HashMap', () => {
  let hashMap: HashMap;

  beforeEach(() => {
    hashMap = new HashMap();
  });

  it('should create an empty map', () => {
    expect(hashMap.size).toBe(0);
  });

  it('should add a key-value pair', () => {
    hashMap.set('key1', 'value1');
    expect(hashMap.get('key1')).toBe('value1');
  });

  it('should handle object keys correctly', () => {
    const keyObj = { id: 1 };
    hashMap.set(keyObj, 'objectValue');
    expect(hashMap.get(keyObj)).toBe('objectValue');
  });

  it('should handle number keys correctly', () => {
    hashMap.set(999, { a: '999Value' });
    expect(hashMap.get(999)).toEqual({ a: '999Value' });
  });

  it('should update the value for an existing key', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key1', 'newValue');
    expect(hashMap.get('key1')).toBe('newValue');
  });

  it('should return undefined for a non-existent key', () => {
    expect(hashMap.get('nonExistentKey')).toBeUndefined();
  });

  it('should remove a key-value pair', () => {
    hashMap.set('key1', 'value1');
    hashMap.delete('key1');
    expect(hashMap.get('key1')).toBeUndefined();
  });

  it('should clear the map', () => {
    hashMap.set('key1', 'value1');
    expect(hashMap.size).toBe(1);

    hashMap.clear();
    expect(hashMap.size).toBe(0);
  });

  it('should iterate over values', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    const values = [];
    for (const value of hashMap) {
      values.push(value);
    }
    expect(values).toEqual([
      ['key1', 'value1'],
      ['key2', 'value2']
    ]);
  });

  // test('should delete element at specific index', () => {
  //   hashMap.set('key1', 'value1');
  //   hashMap.set('key2', 'value2');
  //   hashMap.deleteAt(0);
  //   expect(hashMap.get('key1')).toBeUndefined();
  //   expect(hashMap.size).toBe(1);
  // });
  function compareHashMaps(hashMap: HashMap<unknown, unknown>, stdMap: Map<unknown, unknown>) {
    expect(hashMap.size).toEqual(stdMap.size);
    let index = 0;
    stdMap.forEach((value, key) => {
      if (index === 0) {
        expect(hashMap.first).toEqual([key, value]);
        expect(hashMap.begin().next().value).toEqual([key, value]);
      } else if (index === hashMap.size - 1) {
        expect(hashMap.last).toEqual([key, value]);
        expect(hashMap.reverseBegin().next().value).toEqual([key, value]);
      } else if (index <= 1000) {
        expect(hashMap.getAt(index)).toEqual([key, value]);
      }
      expect(hashMap.get(key)).toEqual(value);
      index++;
    });
  }

  const stdMap: Map<unknown, unknown> = new Map();
  const arr: number[] = getRandomIntArray(1000, 1, 10000);

  it('delete test', () => {
    for (const item of arr) {
      stdMap.set(item, item);
      hashMap.set(item, item);
    }
    for (const item of arr) {
      if (Math.random() > 0.6) {
        expect(hashMap.delete(item)).toEqual(stdMap.delete(item));
      }
    }
    compareHashMaps(hashMap, stdMap);

    for (let i = 0; i < 1000; ++i) {
      const random = getRandomInt(0, 100);
      expect(hashMap.delete(random)).toEqual(stdMap.delete(random));
    }
    compareHashMaps(hashMap, stdMap);
  });

  test('should iterate correctly with reverse iterators', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    const iterator = hashMap.reverseBegin();
    expect(iterator.next().value).toEqual(['key2', 'value2']);
  });

  test('should return the last element', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    expect(hashMap.last).toEqual(['key2', 'value2']);
  });

  test('should return undefined for empty map', () => {
    expect(hashMap.last).toBeUndefined();
  });

  test('should get element at specific index', () => {
    hashMap.set('key1', 'value1');
    hashMap.set('key2', 'value2');
    expect(hashMap.getAt(1)).toEqual(['key2', 'value2']);
  });
});

describe('HashMap for coordinate object keys', () => {
  const hashMap: HashMap<[number, number], number> = new HashMap();
  const codObjs: [number, number][] = [];

  test('set elements in hash map', () => {
    for (let i = 0; i < 1000; i++) {
      const codObj: [number, number] = [getRandomInt(-10000, 10000), i];
      codObjs.push(codObj);
      hashMap.set(codObj, i);
    }
  });

  test('get elements in hash map', () => {
    for (let i = 0; i < 1000; i++) {
      const codObj = codObjs[i];
      if (codObj) {
        expect(hashMap.get(codObj)).toBe(i);
      }
    }
  });

  test('delete elements in hash map', () => {
    for (let i = 0; i < 1000; i++) {
      if (i === 500) expect(hashMap.size).toBe(500)
      const codObj = codObjs[i];
      if (codObj) hashMap.delete(codObj);
    }
    expect(hashMap.size).toBe(0);
  });

});
