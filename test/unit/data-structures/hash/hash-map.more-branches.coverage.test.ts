import { HashMap, LinkedHashMap } from '../../../../src';

describe('HashMap / LinkedHashMap additional branch coverage', () => {
  it('HashMap.setHashFn returns early when same fn is passed (covers _hashFn===fn branch)', () => {
    const m = new HashMap<any, any>();
    const fn = (m as any)._hashFn;
    expect(m.setHashFn(fn)).toBe(m);
  });

  it('HashMap._getNoObjKey covers symbol-key path and non-(string/number/symbol) path', () => {
    const m = new HashMap<any, any>();

    // symbol -> hits (..&&..&& keyType!=='symbol') final operand false arm
    const s = Symbol('k');
    m.set(s as any, 1);
    expect(m.get(s as any)).toBe(1);

    // boolean -> forces _hashFn(key) path
    m.set(true as any, 2);
    expect(m.get(true as any)).toBe(2);
  });

  it('LinkedHashMap.toEntryFn default throws when rawElement is not an entry (covers toEntryFn error)', () => {
    const m = new LinkedHashMap<number, number, any>();
    expect(() => (m as any).toEntryFn({ k: 1, v: 2 })).toThrow(/provide `options\.toEntryFn`/i);
  });

  it('LinkedHashMap set/get/delete branches for weak keys and missing nodes', () => {
    const m = new LinkedHashMap<object, number>();
    const obj = {};

    // insert weak key => new node
    m.set(obj, 1);
    expect(m.get(obj)).toBe(1);

    // update existing weak key => else-if(node) branch
    m.set(obj, 2);
    expect(m.get(obj)).toBe(2);

    // get missing weak key => node ? node.value : undefined false arm
    expect(m.get({} as any)).toBeUndefined();

    // delete missing weak key => if(!node) return false
    expect(m.delete({} as any)).toBe(false);
  });

  it('LinkedHashMap.deleteWhere covers weak-key delete path and noObj delete path and not-found return false', () => {
    const m = new LinkedHashMap<any, number>();
    const obj = {};
    m.set('a', 1);
    m.set(obj, 2);

    // deleteWhere hits predicate true for weak key => _objMap.delete branch
    expect(m.deleteWhere((k: any) => typeof k === 'object')).toBe(true);
    expect(m.has(obj)).toBe(false);

    // deleteWhere hits predicate true for noObj key => delete _noObjMap[hash]
    expect(m.deleteWhere((k: any) => k === 'a')).toBe(true);
    expect(m.has('a')).toBe(false);

    // not found
    expect(m.deleteWhere(() => false)).toBe(false);
  });
});
