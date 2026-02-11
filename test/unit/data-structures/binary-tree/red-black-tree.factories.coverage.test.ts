import { RedBlackTree } from '../../../../src';

describe('RedBlackTree internal factory coverage', () => {
  it('_createLike default iterable branch returns empty like-kind', () => {
    const t = new RedBlackTree<number, number>();
    t.set(1, 1);

    const like = (t as any)._createLike();
    expect(like).toBeInstanceOf(RedBlackTree);
    expect(like.size).toBe(0);
  });

  it('_createInstance and _setRoot keep header.parent in sync', () => {
    const t = new RedBlackTree<number, number>();

    const inst = (t as any)._createInstance();
    const NIL = (inst as any).NIL;

    // new instance should have header.parent pointing at NIL
    expect((inst as any)._header.parent).toBe(NIL);

    // For coverage: explicitly set root to undefined and ensure header.parent remains NIL.
    (inst as any)._setRoot(undefined);
    expect((inst as any)._header.parent).toBe(NIL);
  });
});
