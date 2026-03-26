import { AVLTree, AVLTreeNode } from '../../../../src';

describe('AVLTree remaining branch coverage (batch 2)', () => {
  it('AVLTreeNode.familyPosition covers parent-missing branch and (left||right)? ternary arms', () => {
    const isolated = new AVLTreeNode<number, number>(1, 1);
    expect(isolated.familyPosition).toBe('ISOLATED');

    const root = new AVLTreeNode<number, number>(2, 2);
    root.left = new AVLTreeNode<number, number>(1, 1);
    expect(root.familyPosition).toBe('ROOT');
  });

  it('perfectlyBalance returns false on empty tree', () => {
    const t = new AVLTree<number, number>([], { isMapMode: false });
    expect(t.perfectlyBalance()).toBe(false);
  });

  it('_createLike default-arg iter=[] path', () => {
    const t = new AVLTree<number, number>([], { isMapMode: false });
    const like = (t as any)._createLike();
    expect(like.size).toBe(0);
  });

  it('_swapProperties assigns values when isMapMode=false (covers if(!this._isMapMode) branches)', () => {
    const t = new AVLTree<number, string>([], { isMapMode: false });
    t.set(1, 'a');
    t.set(2, 'b');

    const n1 = t.getNode(1)!;
    const n2 = t.getNode(2)!;

    (t as any)._swapProperties(n1, n2);

    // Node identities remain; their key/value payloads swap.
    expect(n1.key).toBe(2);
    expect(n1.value).toBe('b');
    expect(n2.key).toBe(1);
    expect(n2.value).toBe('a');
  });

  it('_balanceLL executes parentOfA.left===A branch (line ~624)', () => {
    const t = new AVLTree<number, number>([], { isMapMode: false });

    const P = new AVLTreeNode<number, number>(10, 10);
    const A = new AVLTreeNode<number, number>(5, 5);
    const B = new AVLTreeNode<number, number>(2, 2);
    const Br = new AVLTreeNode<number, number>(3, 3);

    // Build P.left = A, A.left = B, B.right = Br
    P.left = A;
    A.parent = P;
    A.left = B;
    B.parent = A;
    B.right = Br;
    Br.parent = B;

    (t as any)._setRoot(P);

    (t as any)._balanceLL(A);

    // After LL rotation, P.left should now be B
    expect(P.left?.key).toBe(2);
    expect((t as any).root.key).toBe(10);
  });

  it('_balanceLR hits C.left branch and inner parent assignment (lines ~657-658)', () => {
    const t = new AVLTree<number, number>([], { isMapMode: false });

    const P = new AVLTreeNode<number, number>(10, 10);
    const A = new AVLTreeNode<number, number>(5, 5);
    const B = new AVLTreeNode<number, number>(2, 2);
    const C = new AVLTreeNode<number, number>(3, 3);
    const CL = new AVLTreeNode<number, number>(2.5 as any, 25);
    const CR = new AVLTreeNode<number, number>(4 as any, 40);

    // P.left = A, A.left = B, B.right = C, and C has both children
    P.left = A;
    A.parent = P;
    A.left = B;
    B.parent = A;
    B.right = C;
    C.parent = B;
    C.left = CL;
    CL.parent = C;
    C.right = CR;
    CR.parent = C;

    (t as any)._setRoot(P);

    (t as any)._balanceLR(A);

    // inner branch should have set CL.parent = B
    expect(CL.parent).toBe(B);
    // and CR.parent = A
    expect(CR.parent).toBe(A);
    // P.left should now be C
    expect(P.left?.key).toBe(3);
  });
});
