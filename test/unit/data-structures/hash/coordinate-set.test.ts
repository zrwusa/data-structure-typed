import {CoordinateSet} from '../../../../src';

describe('CoordinateSet', () => {
  it('should add and check values correctly', () => {
    const coordinateSet = new CoordinateSet();
    const value = [1, 2, 3];

    coordinateSet.add(value);
    const hasValue = coordinateSet.has(value);

    expect(hasValue).toBe(true);
  });

  it('should return false when value does not exist', () => {
    const coordinateSet = new CoordinateSet();
    const value = [1, 2, 3];

    expect(coordinateSet.has(value)).toBe(false);
  });

  it('should delete value correctly', () => {
    const coordinateSet = new CoordinateSet();
    const value = [1, 2, 3];

    coordinateSet.add(value);
    coordinateSet.delete(value);

    expect(coordinateSet.has(value)).toBe(false);
  });

  it('should allow changing the joint character', () => {
    const coordinateSet = new CoordinateSet();
    const value = [1, 2, 3];

    coordinateSet.add(value);
    const newValue = [1, 2, 3];
    const hasValue = coordinateSet.has(newValue);

    expect(hasValue).toBe(true);
  });
});

describe('MyCoordinateSet', () => {
  class MyCoordinateSet extends CoordinateSet {
    constructor(joint?: string) {
      super(joint);
      this._setJoint(joint += '-')
    }
  }

  const mySet = new MyCoordinateSet('*');

  beforeEach(() => {
    mySet.add([0, 0]);
    mySet.add([0, 1]);
    mySet.add([1, 1]);
  })
  it('should joint to be *-', () => {
    expect(mySet.joint).toBe('*-');
  });

  it('should has, delete', () => {
    mySet.delete([0, 1]);
    expect(mySet.has([0, 1])).toBe(false);
  });
});
