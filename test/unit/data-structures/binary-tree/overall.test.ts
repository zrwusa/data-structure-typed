import { AVLTree, BST, RedBlackTree, TreeMultiMap } from '../../../../src';

describe('Overall BinaryTree Test', () => {
  it('should perform various operations on BinaryTree', () => {
    const bst = new BST<number>();
    bst.set(11);
    bst.set(3);
    bst.setMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5], undefined, false);
    expect(bst.size).toBe(16); // true
    bst.has(6); // true
    expect(bst.has(6)).toBe(true); // true
    expect(bst.getHeight(6)).toBe(2); // true
    expect(bst.getHeight()).toBe(5); // true
    expect(bst.getDepth(6)).toBe(3); // true
    const leftMost = bst.getLeftMost();
    expect(leftMost).toBe(1);
    bst.delete(6);
    bst.getNode(6); // undefined
    expect(bst.getNode(6)).toBe(undefined);
    bst.isAVLBalanced(); // true or false
    expect(bst.isAVLBalanced()).toBe(true);
    const bfsIDs: number[] = [];
    bst.bfs(node => bfsIDs.push(node.key));
    expect(bfsIDs[0]).toBe(11);

    const objBST = new BST<number, { key: number; keyA: number }>();
    objBST.set([11, { key: 11, keyA: 11 }]);
    objBST.set([3, { key: 3, keyA: 3 }]);

    objBST.setMany([
      [15, { key: 15, keyA: 15 }],
      [1, { key: 1, keyA: 1 }],
      [8, { key: 8, keyA: 8 }],
      [13, { key: 13, keyA: 13 }],
      [16, { key: 16, keyA: 16 }],
      [2, { key: 2, keyA: 2 }],
      [6, { key: 6, keyA: 6 }],
      [9, { key: 9, keyA: 9 }],
      [12, { key: 12, keyA: 12 }],
      [14, { key: 14, keyA: 14 }],
      [4, { key: 4, keyA: 4 }],
      [7, { key: 7, keyA: 7 }],
      [10, { key: 10, keyA: 10 }],
      [5, { key: 5, keyA: 5 }]
    ]);

    objBST.delete(11);

    const avlTree = new AVLTree();
    avlTree.setMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
    avlTree.delete(10);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
  });

  it('Should clone a BST works fine', () => {
    const bst = new BST<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE',
      comparator: (a, b) => b - a
    });
    expect(bst.size).toBe(5);
    expect(bst.root?.key).toBe(6);
    expect(bst.root?.left?.key).toBe(9);
    expect(bst.root?.left?.right?.key).toBe(7);
    expect(bst.root?.right?.key).toBe(3);
    expect(bst.root?.right?.right?.key).toBe(1);
    expect(bst.getNode(9)?.right?.key).toBe(7);
    expect(bst.getHeight()).toBe(2);
    expect(bst.has(9)).toBe(true);
    expect(bst.has(7)).toBe(true);
    expect(bst.delete(7)[0].deleted?.key).toBe(7);
    expect(bst.has(7)).toBe(false);
    expect(bst.size).toBe(4);
    expect(bst.root?.key).toBe(6);
    expect(bst.root?.left?.key).toBe(9);
    expect(bst.root?.right?.key).toBe(3);
    expect(bst.root?.right?.right?.key).toBe(1);
    expect(bst.getNode(6)?.left?.key).toBe(9);
    expect(bst.getHeight()).toBe(2);
    expect(bst.has(9)).toBe(true);
    expect(bst.has(7)).toBe(false);
    expect(bst.bfs()).toEqual([6, 9, 3, 1]);

    const clonedBST = bst.clone();

    expect(clonedBST.size).toBe(4);
    expect(clonedBST.root?.key).toBe(6);
    expect(clonedBST.root?.left?.key).toBe(9);
    expect(clonedBST.root?.right?.key).toBe(3);
    expect(clonedBST.root?.right?.right?.key).toBe(1);
    expect(clonedBST.getNode(6)?.left?.key).toBe(9);
    expect(clonedBST.getHeight()).toBe(2);
    expect(clonedBST.has(9)).toBe(true);
    expect(clonedBST.has(7)).toBe(false);
    expect(clonedBST.bfs()).toEqual([6, 9, 3, 1]);
  });

  it('Should clone a AVLTree works fine', () => {
    const avl = new AVLTree<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE',
      comparator: (a, b) => b - a
    });
    expect(avl.size).toBe(5);
    avl.set(2);
    avl.set(5);
    avl.set(4);
    expect(avl.root?.key).toBe(3);
    expect(avl.root?.left?.key).toBe(7);
    expect(avl.root?.left?.left?.key).toBe(9);
    expect(avl.root?.right?.key).toBe(1);
    expect(avl.root?.right?.left?.key).toBe(2);
    expect(avl.getNode(7)?.left?.key).toBe(9);
    expect(avl.getHeight()).toBe(3);
    expect(avl.has(9)).toBe(true);
    expect(avl.has(7)).toBe(true);
    expect(avl.delete(7)[0].deleted?.key).toBe(7);
    expect(avl.has(7)).toBe(false);
    expect(avl.size).toBe(7);
    expect(avl.root?.key).toBe(3);
    expect(avl.root?.left?.key).toBe(5);
    expect(avl.root?.right?.key).toBe(1);
    expect(avl.root?.right?.left?.key).toBe(2);
    expect(avl.getNode(6)?.left?.key).toBe(undefined);
    expect(avl.getHeight()).toBe(3);
    expect(avl.has(9)).toBe(true);
    expect(avl.has(7)).toBe(false);
    expect(avl.bfs()).toEqual([3, 5, 1, 9, 4, 2, 6]);
    const clonedAVL = avl.clone();
    expect(clonedAVL.size).toBe(7);
    expect(clonedAVL.root?.key).toBe(3);
    expect(clonedAVL.root?.left?.key).toBe(5);
    expect(clonedAVL.root?.right?.key).toBe(1);
    expect(clonedAVL.root?.right?.left?.key).toBe(2);
    expect(clonedAVL.getNode(6)?.left?.key).toBe(undefined);
    expect(clonedAVL.getHeight()).toBe(3);
    expect(clonedAVL.has(9)).toBe(true);
    expect(clonedAVL.has(7)).toBe(false);
    expect(clonedAVL.bfs()).toEqual([3, 5, 1, 9, 4, 2, 6]);
  });

  // TreeMultiMap uses composition, not inheritance - tests use public API only
  it('Should clone a TreeMultiMap works fine', () => {
    const tmm = new TreeMultiMap<number, string>();
    tmm.set(3, 'a');
    tmm.set(6, 'b');
    tmm.set(7, 'c');
    tmm.set(1, 'd');
    tmm.set(9, 'e');
    expect(tmm.size).toBe(5);
    tmm.set(2, 'f');
    tmm.set(2, 'g'); // duplicate key, adds to bucket
    tmm.set(2, 'h'); // duplicate key, adds to bucket
    tmm.set(5, 'i');
    tmm.set(4, 'j');
    expect(tmm.size).toBe(8); // 8 unique keys
    expect(tmm.count(2)).toBe(3); // 3 values for key 2
    expect(tmm.has(9)).toBe(true);
    expect(tmm.has(7)).toBe(true);
    expect(tmm.delete(7)).toBe(true);
    expect(tmm.has(7)).toBe(false);
    expect(tmm.size).toBe(7);
    expect(tmm.has(9)).toBe(true);
    expect(tmm.has(7)).toBe(false);
    
    const clonedTMM = tmm.clone();
    expect(clonedTMM.size).toBe(7);
    expect(clonedTMM.has(9)).toBe(true);
    expect(clonedTMM.has(7)).toBe(false);
    expect(clonedTMM.count(2)).toBe(3);
    expect(clonedTMM.get(2)).toEqual(['f', 'g', 'h']);
  });

  it('Should clone a RedBlackTree works fine', () => {
    const rbTree = new RedBlackTree<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE'
    });
    expect(rbTree.size).toBe(5);
    rbTree.set(2);
    rbTree.set(2);
    rbTree.set(2);
    rbTree.set(5);
    rbTree.set(4);
    expect(rbTree.root?.key).toBe(3);
    expect(rbTree.root?.left?.key).toBe(1);
    expect(rbTree.root?.left?.left?.key).toBe(NaN);
    expect(rbTree.root?.right?.key).toBe(7);
    expect(rbTree.root?.right?.left?.key).toBe(5);
    expect(rbTree.getNode(7)?.left?.key).toBe(5);
    expect(rbTree.getHeight()).toBe(3);
    expect(rbTree.has(9)).toBe(true);
    expect(rbTree.has(7)).toBe(true);
    expect(rbTree.delete(7)?.[0]?.deleted?.key).toBe(7);
    expect(rbTree.has(7)).toBe(false);
    expect(rbTree.size).toBe(7);
    expect(rbTree.root?.key).toBe(3);
    expect(rbTree.root?.left?.key).toBe(1);
    expect(rbTree.root?.right?.key).toBe(9);
    expect(rbTree.root?.right?.left?.key).toBe(5);
    expect(rbTree.getNode(6)?.left?.key).toBe(NaN);
    expect(rbTree.getHeight()).toBe(3);
    expect(rbTree.has(9)).toBe(true);
    expect(rbTree.has(7)).toBe(false);
    // expect(rbTree.bfs()).toEqual([3, 1, 5, 2, 4, 9, 6]);
    expect(rbTree.bfs()).toEqual([3, 1, 9, 2, 5, 4, 6]);
    const clonedRbTree = rbTree.clone();
    expect(clonedRbTree.size).toBe(7);
    expect(clonedRbTree.root?.key).toBe(3);
    expect(clonedRbTree.root?.left?.key).toBe(1);
    expect(clonedRbTree.root?.right?.key).toBe(5);
    expect(clonedRbTree.root?.right?.left?.key).toBe(4);
    expect(clonedRbTree.getNode(6)?.left?.key).toBe(NaN);
    expect(clonedRbTree.getHeight()).toBe(3);
    expect(clonedRbTree.has(9)).toBe(true);
    expect(clonedRbTree.has(7)).toBe(false);
    expect(clonedRbTree.bfs()).toEqual([3, 1, 5, 2, 4, 9, 6]);
  });
});
