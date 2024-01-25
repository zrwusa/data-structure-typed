import { AVLTree, BST, RedBlackTree, TreeMultiMap } from '../../../../src';

describe('Overall BinaryTree Test', () => {
  it('should perform various operations on BinaryTree', () => {
    const bst = new BST<number>();
    bst.add(11);
    bst.add(3);
    bst.addMany([15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5], undefined, false);
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
    bst.delete(6);
    bst.getNode(6); // undefined
    expect(bst.getNode(6)).toBe(undefined);
    bst.isAVLBalanced(); // true or false
    expect(bst.isAVLBalanced()).toBe(true);
    const bfsIDs: number[] = [];
    bst.bfs(node => bfsIDs.push(node.key));
    bfsIDs[0] === 11; // true
    expect(bfsIDs[0]).toBe(11);

    const objBST = new BST<number, { key: number; keyA: number }>();
    objBST.add([11, { key: 11, keyA: 11 }]);
    objBST.add([3, { key: 3, keyA: 3 }]);

    objBST.addMany([
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
    avlTree.addMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
    avlTree.delete(10);
    avlTree.isAVLBalanced(); // true
    expect(avlTree.isAVLBalanced()).toBe(true); // true
  });

  it('Should clone a BST works fine', () => {
    const bst = new BST<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE',
      comparator: (a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      }
    });
    expect(bst.size).toBe(5);
    expect(bst.root?.key).toBe(6);
    expect(bst.root?.left?.key).toBe(9);
    expect(bst.root?.left?.right?.key).toBe(7);
    expect(bst.root?.right?.key).toBe(3);
    expect(bst.root?.right?.right?.key).toBe(1);
    expect(bst.getNodeByKey(9)?.right?.key).toBe(7);
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
    expect(bst.getNodeByKey(6)?.left?.key).toBe(9);
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
    expect(clonedBST.getNodeByKey(6)?.left?.key).toBe(9);
    expect(clonedBST.getHeight()).toBe(2);
    expect(clonedBST.has(9)).toBe(true);
    expect(clonedBST.has(7)).toBe(false);
    expect(clonedBST.bfs()).toEqual([6, 9, 3, 1]);
  });

  it('Should clone a AVLTree works fine', () => {
    const avl = new AVLTree<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE',
      comparator: (a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      }
    });
    expect(avl.size).toBe(5);
    avl.add(2);
    avl.add(5);
    avl.add(4);
    expect(avl.root?.key).toBe(3);
    expect(avl.root?.left?.key).toBe(7);
    expect(avl.root?.left?.left?.key).toBe(9);
    expect(avl.root?.right?.key).toBe(1);
    expect(avl.root?.right?.left?.key).toBe(2);
    expect(avl.getNodeByKey(7)?.left?.key).toBe(9);
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
    expect(avl.getNodeByKey(6)?.left?.key).toBe(undefined);
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
    expect(clonedAVL.getNodeByKey(6)?.left?.key).toBe(undefined);
    expect(clonedAVL.getHeight()).toBe(3);
    expect(clonedAVL.has(9)).toBe(true);
    expect(clonedAVL.has(7)).toBe(false);
    expect(clonedAVL.bfs()).toEqual([3, 5, 1, 9, 4, 2, 6]);
  });

  it('Should clone a TreeMultiMap works fine', () => {
    const tmm = new TreeMultiMap<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE'
    });
    expect(tmm.size).toBe(5);
    tmm.add(2);
    tmm.add(2);
    tmm.add(2);
    tmm.add(5);
    tmm.add(4);
    expect(tmm.count).toBe(10);
    expect(tmm.root?.key).toBe(3);
    expect(tmm.root?.left?.key).toBe(1);
    expect(tmm.root?.left?.left?.key).toBe(NaN);
    expect(tmm.root?.right?.key).toBe(7);
    expect(tmm.root?.right?.left?.key).toBe(5);
    expect(tmm.getNodeByKey(7)?.left?.key).toBe(5);
    expect(tmm.getHeight()).toBe(3);
    expect(tmm.has(9)).toBe(true);
    expect(tmm.has(7)).toBe(true);
    expect(tmm.delete(7)[0].deleted?.key).toBe(7);
    expect(tmm.has(7)).toBe(false);
    expect(tmm.size).toBe(7);
    expect(tmm.count).toBe(9);
    expect(tmm.root?.key).toBe(3);
    expect(tmm.root?.left?.key).toBe(1);
    expect(tmm.root?.right?.key).toBe(9);
    expect(tmm.root?.right?.left?.key).toBe(5);
    expect(tmm.getNodeByKey(6)?.left?.key).toBe(NaN);
    expect(tmm.getHeight()).toBe(3);
    expect(tmm.has(9)).toBe(true);
    expect(tmm.has(7)).toBe(false);
    expect(tmm.bfs()).toEqual([3, 1, 9, 2, 5, 4, 6]);
    // expect(tmm.bfs()).toEqual([6, 1, 9, 3, 2, 5, 4]);
    const clonedTMM = tmm.clone();
    expect(clonedTMM.size).toBe(7);
    expect(clonedTMM.count).toBe(9);
    expect(clonedTMM.root?.key).toBe(3);
    expect(clonedTMM.root?.left?.key).toBe(1);
    expect(clonedTMM.root?.right?.key).toBe(5);
    expect(clonedTMM.root?.right?.left?.key).toBe(4);
    expect(clonedTMM.getNodeByKey(6)?.left?.key).toBe(NaN);
    expect(clonedTMM.getHeight()).toBe(3);
    expect(clonedTMM.has(9)).toBe(true);
    expect(clonedTMM.has(7)).toBe(false);
    expect(clonedTMM.bfs()).toEqual([3, 1, 5, 2, 4, 9, 6]);
  });

  it('Should clone a RedBlackTree works fine', () => {
    const rbTree = new RedBlackTree<number>([3, 6, 7, 1, 9], {
      iterationType: 'RECURSIVE'
    });
    expect(rbTree.size).toBe(5);
    rbTree.add(2);
    rbTree.add(2);
    rbTree.add(2);
    rbTree.add(5);
    rbTree.add(4);
    expect(rbTree.root?.key).toBe(3);
    expect(rbTree.root?.left?.key).toBe(1);
    expect(rbTree.root?.left?.left?.key).toBe(NaN);
    expect(rbTree.root?.right?.key).toBe(7);
    expect(rbTree.root?.right?.left?.key).toBe(5);
    expect(rbTree.getNodeByKey(7)?.left?.key).toBe(5);
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
    expect(rbTree.getNodeByKey(6)?.left?.key).toBe(NaN);
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
    expect(clonedRbTree.getNodeByKey(6)?.left?.key).toBe(NaN);
    expect(clonedRbTree.getHeight()).toBe(3);
    expect(clonedRbTree.has(9)).toBe(true);
    expect(clonedRbTree.has(7)).toBe(false);
    expect(clonedRbTree.bfs()).toEqual([3, 1, 5, 2, 4, 9, 6]);
  });
});
