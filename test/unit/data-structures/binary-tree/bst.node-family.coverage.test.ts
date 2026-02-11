import { BSTNode } from '../../../../src';

describe('BSTNode familyPosition coverage', () => {
  it('covers ISOLATED/ROOT/LEFT/RIGHT/ROOT_LEFT/ROOT_RIGHT and MAL_NODE', () => {
    const isolated = new BSTNode<number, number>(1);
    expect(isolated.familyPosition).toBe('ISOLATED');

    const root = new BSTNode<number, number>(10);
    const left = new BSTNode<number, number>(5);
    const right = new BSTNode<number, number>(15);

    root.left = left;
    root.right = right;

    expect(root.familyPosition).toBe('ROOT');
    expect(left.familyPosition).toBe('LEFT');
    expect(right.familyPosition).toBe('RIGHT');

    left.left = new BSTNode<number, number>(2);
    right.right = new BSTNode<number, number>(20);

    expect(left.familyPosition).toBe('ROOT_LEFT');
    expect(right.familyPosition).toBe('ROOT_RIGHT');

    const mal = new BSTNode<number, number>(999);
    mal.parent = root;
    expect(mal.familyPosition).toBe('MAL_NODE');
  });
});
