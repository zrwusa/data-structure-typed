import { BST, BSTNode, Range } from '../../../../src';

describe('BST additional coverage', () => {
  it('BSTNode.familyPosition covers MAL_NODE branch', () => {
    const root = new BSTNode<number, number>(10);
    const mal = new BSTNode<number, number>(5);
    mal.parent = root;
    // parent does not point to mal via left/right
    expect(mal.familyPosition).toBe('MAL_NODE');
  });

  it('getNode returns undefined for null/undefined, and handles runtime Range input', () => {
    const bst = new BST<number, number>();
    bst.set(2, 2);

    expect(bst.getNode(undefined as any)).toBeUndefined();
    expect(bst.getNode(null as any)).toBeUndefined();

    const r = new Range<number>(2, 2, true, true);
    expect(bst.getNode(r)?.key).toBe(2);
  });

  it('getNodes returns [] for null/undefined and ignores entry with null key', () => {
    const bst = new BST<number, number>([2, 1, 3]);

    expect(bst.getNodes(undefined as any)).toEqual([]);
    expect(bst.getNodes(null as any)).toEqual([]);

    // entry with null key => targetKey undefined => []
    expect(bst.getNodes([null as any, 123] as any)).toEqual([]);
  });

  it('getNodes returns [] when startNode is not a real node', () => {
    const bst = new BST<number, number>([2, 1, 3]);

    // ensureNode(null) => undefined => []
    expect(bst.getNodes(2, false, null as any)).toEqual([]);
  });
});
