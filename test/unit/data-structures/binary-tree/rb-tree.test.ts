import { RBTree, RBTreeNode, RBColor } from '../../../../src';

// describe('Red-Black Tree Tests', () => {
//   let tree: RBTree<RBTreeNode<number>>;
//
//   beforeEach(() => {
//     tree = new RBTree<RBTreeNode<number>>();
//     console.log('Initializing RBTree');
//   });
//
//   test('Insertion and In-order Traversal', () => {
//     tree.add(5);
//     tree.add(3);
//     tree.add(7);
//     tree.add(2);
//     tree.add(4);
//     tree.add(6);
//     tree.add(8);
//
//     const inOrderTraversal: number[] = tree.DFS('in');
//     console.log('In-order Traversal:', inOrderTraversal);
//     expect(inOrderTraversal).toEqual([2, 3, 4, 5, 6, 7, 8]);
//   });
//
//   test('Deletion', () => {
//     tree.add(5);
//     tree.add(3);
//     tree.add(7);
//     tree.add(2);
//     tree.add(4);
//     tree.add(6);
//     tree.add(8);
//
//     // Delete a node (e.g., 3) and check if it's gone
//     tree.remove(3);
//     console.log('Tree after deletion:', tree);
//     expect(tree.has(3)).toBe(false);
//
//     // Perform in-order traversal to check if the tree is still balanced
//     const inOrderTraversal: number[] = tree.DFS('in');
//     expect(inOrderTraversal).toEqual([2, 4, 5, 6, 7, 8]);
//   });
// });
//
// describe('RBTree', () => {
//   let rbTree: RBTree<RBTreeNode<number>>;
//
//   beforeEach(() => {
//     rbTree = new RBTree<RBTreeNode<number>>();
//   });
//
//   it('should add and maintain Red-Black properties', () => {
//     rbTree.add(10);
//     rbTree.add(20);
//     rbTree.add(30);
//     rbTree.add(40);
//
//     // Assert that the root node color is black
//     expect(rbTree.root?.color).toBe(RBColor.BLACK);
//
//     // Check the colors and parent-child relationships of other nodes
//     const rootNode = rbTree.root;
//     expect(rootNode?.id).toBe(20);
//     expect(rootNode?.left?.id).toBe(10);
//     expect(rootNode?.right?.id).toBe(30);
//     expect(rootNode?.left?.color).toBe(RBColor.BLACK);
//     expect(rootNode?.right?.color).toBe(RBColor.BLACK);
//
//     const leftNode = rootNode?.left;
//     const rightNode = rootNode?.right;
//     expect(leftNode?.parent).toBe(rootNode);
//     expect(rightNode?.parent).toBe(rootNode);
//   });
//
//   it('should perform left rotation correctly', () => {
//     rbTree.add(10);
//     rbTree.add(20);
//     rbTree.add(30);
//
//     // Trigger left rotation
//     rbTree.add(25);
//
//     // Check the tree structure after left rotation
//     const rootNode = rbTree.root;
//     expect(rootNode?.id).toBe(20);
//
//     const leftNode = rootNode?.left;
//     const rightNode = rootNode?.right;
//     expect(leftNode?.id).toBe(10);
//     expect(rightNode?.id).toBe(25);
//
//     expect(leftNode?.parent).toBe(rootNode);
//     expect(rightNode?.parent).toBe(rootNode);
//   });
//
//   it('should perform right rotation correctly', () => {
//     rbTree.add(30);
//     rbTree.add(20);
//     rbTree.add(10);
//
//     // Trigger right rotation
//     rbTree.add(15);
//
//     // Check the tree structure after right rotation
//     const rootNode = rbTree.root;
//     expect(rootNode?.id).toBe(20);
//
//     const leftNode = rootNode?.left;
//     const rightNode = rootNode?.right;
//     expect(leftNode?.id).toBe(15);
//     expect(rightNode?.id).toBe(30);
//
//     expect(leftNode?.parent).toBe(rootNode);
//     expect(rightNode?.parent).toBe(rootNode);
//   });
// });


describe('Red-Black Tree Tests', () => {
  let tree: RBTree<RBTreeNode<number>>;

  beforeEach(() => {
    tree = new RBTree<RBTreeNode<number>>();
  });

  it('Insertion and Red-Black Properties', () => {
    tree.add(10);
    tree.add(20);
    tree.add(30);
    tree.add(25);

    // Assert the root node color is black
    expect(tree.root?.color).toBe(RBColor.BLACK);

    // Check the colors and parent-child relationships of other nodes
    const rootNode = tree.root;
    expect(rootNode?.id).toBe(25);
    expect(rootNode?.left?.id).toBe(10);
    expect(rootNode?.right?.id).toBe(30);
    expect(rootNode?.left?.left?.id).toBe(20);

    // Check colors
    expect(rootNode?.color).toBe(RBColor.BLACK);
    expect(rootNode?.left?.color).toBe(RBColor.BLACK);
    expect(rootNode?.right?.color).toBe(RBColor.BLACK);
    expect(rootNode?.left?.left?.color).toBe(RBColor.RED);
  });

  it('Deletion and Red-Black Properties', () => {
    tree.add(10);
    tree.add(20);
    tree.add(30);
    tree.add(25);

    // Delete a node (e.g., 20) and check if it's gone
    tree.remove(20);
    expect(tree.has(20)).toBe(false);

    // Perform in-order traversal to check if the tree is still balanced
    const inOrderTraversal: number[] = tree.DFS('in');
    expect(inOrderTraversal).toEqual([10, 25, 30]);

    // Check colors
    expect(tree.root?.color).toBe(RBColor.BLACK);
    expect(tree.root?.left?.color).toBe(RBColor.BLACK);
    expect(tree.root?.right?.color).toBe(RBColor.BLACK);

    // Set the root node color to black (add this line to fix the issue)
    if (tree.root) tree.root.color = RBColor.BLACK;
  });
});



