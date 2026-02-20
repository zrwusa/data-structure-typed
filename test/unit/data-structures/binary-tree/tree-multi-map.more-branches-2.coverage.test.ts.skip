import { TreeMultiMap, TreeMultiMapNode } from '../../../../src';

describe('TreeMultiMap additional branch coverage (batch 2)', () => {
  it('set(node) takes isRealNode early-return path', () => {
    const t = new TreeMultiMap<number, string>([], { isMapMode: false });

    const n = new TreeMultiMapNode<number, string>(1, ['a']);
    expect(t.set(n as any)).toBe(true);
    expect(t.get(1)).toEqual(['a']);
  });

  it('set() returns false when key exists but incoming values are undefined (covers values===undefined else branch)', () => {
    const t = new TreeMultiMap<number, string>([], { isMapMode: false });
    t.set(1, 'a');

    // value undefined and values undefined => should not append
    expect(t.set(1, undefined as any)).toBe(false);
    expect(t.get(1)).toEqual(['a']);
  });

  it('mapMode set(): forces evaluation of _setToValues via _setByNode false (covers _setByNode() || _setToValues() rhs)', () => {
    const t = new TreeMultiMap<number, string>([], { isMapMode: true });
    t.set(1, 'a');

    // Patch getNode to be non-real so _setByNode uses `super.set(key, values)`.
    const origGetNode = (t as any).getNode;
    (t as any).getNode = () => (t as any)._NIL;

    // Patch super.set to return false so _setByNode becomes falsy and OR evaluates _setToValues.
    const rbProto = Object.getPrototypeOf(Object.getPrototypeOf(t));
    const origSuperSet = rbProto.set;
    rbProto.set = () => false;

    try {
      expect(t.set(1, 'b')).toBe(true);
      expect(t.get(1)).toEqual(['a', 'b']);
    } finally {
      rbProto.set = origSuperSet;
      (t as any).getNode = origGetNode;
    }
  });

  it('_createInstance/_createLike cover snapshotOptions fallback (?? {}) and createLike default iter=[]', () => {
    const t = new TreeMultiMap<number, string>();

    const orig = (t as any)._snapshotOptions;
    (t as any)._snapshotOptions = undefined;
    try {
      const inst = (t as any)._createInstance();
      expect(inst).toBeInstanceOf(TreeMultiMap);

      const like = (t as any)._createLike();
      expect(like).toBeInstanceOf(TreeMultiMap);
      expect(like.size).toBe(0);
    } finally {
      (t as any)._snapshotOptions = orig;
    }
  });
});
