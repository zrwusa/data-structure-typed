import { AVLTreeNode } from '../../../../src';

describe('AVLTreeNode familyPosition remaining branch coverage', () => {
  it('left child with its own child reports ROOT_LEFT', () => {
    const parent = new AVLTreeNode<number, number>(2);
    const child = new AVLTreeNode<number, number>(1);
    const grand = new AVLTreeNode<number, number>(0);

    parent.left = child;
    child.parent = parent;

    child.left = grand;
    grand.parent = child;

    expect(child.familyPosition).toBe('ROOT_LEFT');
  });
});
