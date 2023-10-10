import {BST, BSTNode} from '../../../../src';

describe('BST operations test', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST();
    expect(bst).toBeInstanceOf(BST);
    bst.add(11, 11);
    bst.add(3, 3);
    const idsAndValues = [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    bst.addMany(idsAndValues, idsAndValues);
    expect(bst.root).toBeInstanceOf(BSTNode);

    if (bst.root) expect(bst.root.key).toBe(11);

    expect(bst.size).toBe(16);

    expect(bst.has(6)).toBe(true);

    const node6 = bst.get(6);
    expect(node6 && bst.getHeight(6)).toBe(2);
    expect(node6 && bst.getDepth(6)).toBe(3);

    const nodeId10 = bst.get(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = bst.get(9, 'val');
    expect(nodeVal9?.key).toBe(9);

    const leftMost = bst.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = bst.get(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    const subTreeSum = node15 && bst.subTreeSum(15);
    expect(subTreeSum).toBe(70);

    const lesserSum = bst.lesserSum(10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = bst.get(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = bst.dfs('in', 'node');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    bst.perfectlyBalance();
    expect(bst.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced = bst.bfs('node');
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = bst.remove(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight(15)).toBe(1);

    const removed1 = bst.remove(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight()).toBe(4);

    const removed4 = bst.remove(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(4);

    const removed10 = bst.remove(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(4);

    const removed15 = bst.remove(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed5 = bst.remove(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed13 = bst.remove(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed3 = bst.remove(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed8 = bst.remove(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed6 = bst.remove(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(bst.remove(6).length).toBe(0);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed7 = bst.remove(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed9 = bst.remove(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed14 = bst.remove(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(2);

    expect(bst.isAVLBalanced()).toBe(false);

    const bfsIDs = bst.bfs();
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = bst.bfs('node');
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<BSTNode<{key: number; keyA: number}>>();
    expect(objBST).toBeInstanceOf(BST);
    objBST.add(11, {key: 11, keyA: 11});
    objBST.add(3, {key: 3, keyA: 3});
    const values = [
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
    ];

    objBST.addMany(
      values.map(item => item.key),
      values
    );

    expect(objBST.root).toBeInstanceOf(BSTNode);

    if (objBST.root) expect(objBST.root.key).toBe(11);

    expect(objBST.has(6)).toBe(true);

    const node6 = objBST.get(6);
    expect(node6 && objBST.getHeight(node6)).toBe(2);
    expect(node6 && objBST.getDepth(node6)).toBe(3);

    const nodeId10 = objBST.get(10, 'key');
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = objBST.get(9, 'key');
    expect(nodeVal9?.key).toBe(9);

    const leftMost = objBST.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = objBST.get(15);
    expect(node15?.val).toEqual({key: 15, keyA: 15});
    const minNodeBySpecificNode = node15 && objBST.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    const subTreeSum = node15 && objBST.subTreeSum(node15);
    expect(subTreeSum).toBe(70);

    const lesserSum = objBST.lesserSum(10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = objBST.get(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = objBST.dfs('in', 'node');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    objBST.perfectlyBalance();
    expect(objBST.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced = objBST.bfs('node');
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = objBST.remove(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(node15 && objBST.getHeight(node15)).toBe(2);

    const removed1 = objBST.remove(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(objBST.getHeight()).toBe(4);

    const removed4 = objBST.remove(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(4);

    const removed10 = objBST.remove(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(4);

    const removed15 = objBST.remove(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed5 = objBST.remove(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed13 = objBST.remove(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed3 = objBST.remove(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed8 = objBST.remove(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed6 = objBST.remove(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(objBST.remove(6).length).toBe(0);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed7 = objBST.remove(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed9 = objBST.remove(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed14 = objBST.remove(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(2);

    expect(objBST.isAVLBalanced()).toBe(false);

    const bfsIDs = objBST.bfs();
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = objBST.bfs('node');
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });
});
