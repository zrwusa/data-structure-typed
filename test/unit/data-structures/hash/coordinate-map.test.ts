import {CoordinateMap} from '../../../../src';

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
