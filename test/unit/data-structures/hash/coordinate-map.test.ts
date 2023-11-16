import { CoordinateMap } from '../../../../src';

describe('CoordinateMap', () => {
  it('should set and get values correctly', () => {
    const coordinateMap = new CoordinateMap<string>();
    const key = [1, 2, 3];
    const value = 'TestValue';

    coordinateMap.set(key, value);
    const retrievedValue = coordinateMap.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should return true when key exists', () => {
    const coordinateMap = new CoordinateMap<string>();
    const key = [1, 2, 3];
    const value = 'TestValue';

    coordinateMap.set(key, value);

    expect(coordinateMap.has(key)).toBe(true);
  });

  it('should return false when key does not exist', () => {
    const coordinateMap = new CoordinateMap<string>();
    const key = [1, 2, 3];

    expect(coordinateMap.has(key)).toBe(false);
  });

  it('should delete key-value pair correctly', () => {
    const coordinateMap = new CoordinateMap<string>();
    const key = [1, 2, 3];
    const value = 'TestValue';

    coordinateMap.set(key, value);
    coordinateMap.delete(key);

    expect(coordinateMap.has(key)).toBe(false);
  });

  it('should allow changing the joint character', () => {
    const coordinateMap = new CoordinateMap<string>();
    const key = [1, 2, 3];
    const value = 'TestValue';

    coordinateMap.set(key, value);
    const newKey = [1, 2, 3];
    const retrievedValue = coordinateMap.get(newKey);

    expect(retrievedValue).toBe(value);
  });
});

describe('CoordinateMap', () => {
  class MyCoordinateMap<V = any> extends CoordinateMap<V> {
    constructor(joint?: string) {
      super(joint);
      this._joint = joint += '-';
    }
  }

  const cMap = new MyCoordinateMap<number>('*');

  beforeEach(() => {
    cMap.set([0, 0], 0);
    cMap.set([0, 1], 1);
    cMap.set([1, 1], 11);
  });
  it('should joint to be *-', () => {
    expect(cMap.joint).toBe('*-');
  });
});
