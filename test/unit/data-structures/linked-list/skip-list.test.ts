import {SkipList} from '../../../../src';

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

  it('should remove elements correctly', () => {
    skipList.add(1, 'One');
    skipList.add(2, 'Two');
    skipList.add(3, 'Three');

    skipList.remove(2);

    expect(skipList.get(2)).toBeUndefined(); // 修改这里的断言
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
