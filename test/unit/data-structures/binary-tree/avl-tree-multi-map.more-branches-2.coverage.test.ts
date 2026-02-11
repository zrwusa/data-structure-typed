import { AVLTreeMultiMap, AVLTreeMultiMapNode } from '../../../../src';

describe('AVLTreeMultiMap additional branch coverage (batch 2)', () => {
  it('AVLTreeMultiMapNode constructor default value=[] and familyPosition ROOT_LEFT arm', () => {
    const parent = new AVLTreeMultiMapNode<number, string>(1, ['p']);
    const left = new AVLTreeMultiMapNode<number, string>(0); // default value arg

    parent.left = left;
    // give left a child so (left.left||left.right) is truthy
    left.left = new AVLTreeMultiMapNode<number, string>(-1, ['c']);

    expect(Array.isArray(left.value)).toBe(true);
    expect(left.value).toEqual([]);
    expect(left.familyPosition).toBe('ROOT_LEFT');
  });

  it('set() returns false when existing bucket present but incoming values are undefined (covers values===undefined else branch)', () => {
    const t = new AVLTreeMultiMap<number, string>();
    t.set(1, 'a');

    // value undefined + values undefined => no-op
    expect(t.set(1, undefined as any)).toBe(false);
    expect(t.get(1)).toEqual(['a']);
  });

  it('mapMode set(): forces evaluation of _setToValues via _setByNode false (covers _setByNode() || _setToValues() right operand)', () => {
    const t = new AVLTreeMultiMap<number, string>();
    t.set(1, 'a');

    const origGet = (t as any).get;
    const origGetNode = (t as any).getNode;

    // Monkeypatch get() so get(node) returns undefined, but get(key) returns the real array.
    (t as any).get = function (arg: any) {
      if (arg && typeof arg === 'object' && 'key' in arg) return undefined;
      return origGet.call(this, arg);
    };

    // Force getNode() to return a non-real node so `_setByNode` takes the `else` path:
    // `return super.set(key, values)` (patched below to return false).
    (t as any).getNode = () => (t as any)._NIL;

    // Monkeypatch AVLTree.set (the super.set used inside _setByNode) to be a no-op that returns false,
    // so `_setByNode()` becomes falsy and OR evaluates `_setToValues()`.
    const avlProto = Object.getPrototypeOf(Object.getPrototypeOf(t));
    const origSuperSet = avlProto.set;
    avlProto.set = () => false;

    try {
      expect(t.set(1, 'b')).toBe(true);
      expect(origGet.call(t, 1)).toEqual(['a', 'b']);
    } finally {
      avlProto.set = origSuperSet;
      (t as any).get = origGet;
      (t as any).getNode = origGetNode;
    }
  });

  it('_createInstance uses snapshotOptions fallback when _snapshotOptions is missing (covers ?? {} right operand)', () => {
    const t = new AVLTreeMultiMap<number, string>();

    const orig = (t as any)._snapshotOptions;
    (t as any)._snapshotOptions = undefined;
    try {
      const inst = (t as any)._createInstance();
      expect(inst).toBeInstanceOf(AVLTreeMultiMap);
    } finally {
      (t as any)._snapshotOptions = orig;
    }
  });

  it('_createLike default iter=[] and snapshotOptions fallback when _snapshotOptions is missing', () => {
    const t = new AVLTreeMultiMap<number, string>();

    const orig = (t as any)._snapshotOptions;
    (t as any)._snapshotOptions = undefined;
    try {
      const like = (t as any)._createLike();
      expect(like).toBeInstanceOf(AVLTreeMultiMap);
      expect(like.size).toBe(0);
    } finally {
      (t as any)._snapshotOptions = orig;
    }
  });
});
