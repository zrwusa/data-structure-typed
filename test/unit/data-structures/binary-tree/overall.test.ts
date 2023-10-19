import {AVLTree, BST, BSTNode} from '../../../../src';

describe('Overall BinaryTree Test', () => {
  it('should perform various operations on BinaryTree', () => {
    const bst = new BST();
    bst.add(11);
    bst.add(3);
    bst.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
    bst.size === 16; // true
    expect(bst.size).toBe(16); // true
    bst.has(6); // true
    expect(bst.has(6)).toBe(true); // true
    bst.getHeight(6) === 2; // true
    bst.getHeight() === 5; // true
    bst.getDepth(6) === 3; // true
    expect(bst.getHeight(6)).toBe(2); // true
    expect(bst.getHeight()).toBe(5); // true
    expect(bst.getDepth(6)).toBe(3); // true
    const leftMost = bst.getLeftMost();
    leftMost?.key === 1; // true
    expect(leftMost?.key).toBe(1);
    bst.remove(6);
    bst.get(6); // null
    expect(bst.get(6)).toBeNull();
    bst.isAVLBalanced(); // true or false
    expect(bst.isAVLBalanced()).toBe(true);
    const bfsIDs = bst.bfs();
    bfsIDs[0] === 11; // true
    expect(bfsIDs[0]).toBe(11);

    const objBST = new BST<BSTNode<{key: number; keyA: number}>>();
    objBST.add(11, {key: 11, keyA: 11});
    objBST.add(3, {key: 3, keyA: 3});

    objBST.addMany(
      [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5],
      [
        {key: 15, keyA: 15},
        {key: 1, keyA: 1},
        {key: 8, keyA: 8},
        {key: 13, keyA: 13},
        {key: 16, keyA: 16},
        {key: 2, keyA: 2},
        {key: 6, keyA: 6},
        {key: 9, keyA: 9},
        {key: 12, keyA: 12},
        {key: 14, keyA: 14},
        {key: 4, keyA: 4},
        {key: 7, keyA: 7},
        {key: 10, keyA: 10},
        {key: 5, keyA: 5}
      ]
    );

    objBST.remove(11);

    const avlTree = new AVLTree();
    avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
    avlTree.remove(10);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
  });
});
