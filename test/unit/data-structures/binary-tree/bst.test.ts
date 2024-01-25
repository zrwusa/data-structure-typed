import { BinaryTreeNode, BST, BSTNode } from '../../../../src';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;

describe('BST operations test', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number, number>();
    expect(bst).toBeInstanceOf(BST);
    bst.add([11, 11]);
    bst.add([3, 3]);
    const idsAndValues: [number, number][] = [
      [15, 15],
      [1, 1],
      [8, 8],
      [13, 13],
      [16, 16],
      [2, 2],
      [6, 6],
      [9, 9],
      [12, 12],
      [14, 14],
      [4, 4],
      [7, 7],
      [10, 10],
      [5, 5]
    ];
    bst.addMany(idsAndValues, undefined, false);
    expect(bst.root).toBeInstanceOf(BSTNode);

    if (bst.root) expect(bst.root.key).toBe(11);

    expect(bst.size).toBe(16);

    expect(bst.has(6)).toBe(true);

    const node6 = bst.getNode(6);
    expect(node6 && bst.getHeight(6)).toBe(2);
    expect(node6 && bst.getDepth(6)).toBe(3);

    const nodeId10 = bst.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = bst.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = bst.getLeftMost();
    expect(leftMost?.key).toBe(1);

    expect(bst.isBST()).toBe(true);

    const node15 = bst.getNode(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && bst.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    bst.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = bst.getNode(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = bst.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    bst.perfectlyBalance();
    expect(bst.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced: BSTNode<number>[] = [];
    bst.bfs(node => bfsNodesAfterBalanced.push(node));
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = bst.delete(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight(15)).toBe(1);

    const removed1 = bst.delete(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight()).toBe(4);

    const removed4 = bst.delete(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(4);

    const removed10 = bst.delete(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(4);

    const removed15 = bst.delete(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed5 = bst.delete(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed13 = bst.delete(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed3 = bst.delete(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed8 = bst.delete(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed6 = bst.delete(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(bst.delete(6).length).toBe(0);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed7 = bst.delete(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed9 = bst.delete(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed14 = bst.delete(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(2);

    expect(bst.isAVLBalanced()).toBe(false);

    const bfsIDs: number[] = [];
    bst.bfs(node => bfsIDs.push(node.key));
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes: BSTNode<number>[] = [];
    bst.bfs(node => bfsNodes.push(node));
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { name: string; age: number }>();
    expect(objBST).toBeInstanceOf(BST);
    objBST.add([11, { name: '11', age: 11 }]);
    objBST.add([3, { name: '3', age: 3 }]);

    objBST.addMany(
      [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5],
      [
        { name: 'Alice', age: 15 },
        { name: 'Bob', age: 1 },
        { name: 'Charlie', age: 8 },
        { name: 'David', age: 13 },
        { name: 'Emma', age: 16 },
        { name: 'Frank', age: 2 },
        { name: 'Grace', age: 6 },
        { name: 'Hannah', age: 9 },
        { name: 'Isaac', age: 12 },
        { name: 'Jack', age: 14 },
        { name: 'Katie', age: 4 },
        { name: 'Liam', age: 7 },
        { name: 'Mia', age: 10 },
        { name: 'Noah', age: 5 }
      ],
      false
    );

    expect(objBST.root).toBeInstanceOf(BSTNode);

    if (objBST.root) expect(objBST.root.key).toBe(11);

    expect(objBST.has(6)).toBe(true);

    const node6 = objBST.getNode(6);
    expect(node6 && objBST.getHeight(node6)).toBe(2);
    expect(node6 && objBST.getDepth(node6)).toBe(3);

    const nodeId10 = objBST.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = objBST.getNode(9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = objBST.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = objBST.getNode(15);
    expect(node15?.value).toEqual({ name: 'Alice', age: 15 });
    const minNodeBySpecificNode = node15 && objBST.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && objBST.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    objBST.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = objBST.getNode(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = objBST.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    objBST.perfectlyBalance();
    expect(objBST.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced: BSTNode<number, { name: string; age: number }>[] = [];
    objBST.bfs(node => bfsNodesAfterBalanced.push(node));
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = objBST.delete(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(node15 && objBST.getHeight(node15)).toBe(2);

    const removed1 = objBST.delete(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(objBST.getHeight()).toBe(4);

    const removed4 = objBST.delete(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(4);

    const removed10 = objBST.delete(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(4);

    const removed15 = objBST.delete(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed5 = objBST.delete(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed13 = objBST.delete(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed3 = objBST.delete(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed8 = objBST.delete(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed6 = objBST.delete(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(objBST.delete(6).length).toBe(0);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed7 = objBST.delete(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed9 = objBST.delete(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed14 = objBST.delete(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(2);

    expect(objBST.isAVLBalanced()).toBe(false);

    const bfsIDs: number[] = [];
    objBST.bfs(node => bfsIDs.push(node.key));
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes: BSTNode<number, { name: string; age: number }>[] = [];
    objBST.bfs(node => bfsNodes.push(node));
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });
});

describe('BST operations test recursively', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number>([], { iterationType: 'RECURSIVE' });
    expect(bst).toBeInstanceOf(BST);
    bst.add([11, 11]);
    bst.add([3, 3]);
    const idsAndValues = [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    bst.addMany(idsAndValues, undefined, false);
    expect(bst.root).toBeInstanceOf(BSTNode);

    if (bst.root) expect(bst.root.key).toBe(11);

    expect(bst.size).toBe(16);

    expect(bst.has(6)).toBe(true);

    const node6 = bst.getNode(6);
    expect(node6 && bst.getHeight(6)).toBe(2);
    expect(node6 && bst.getDepth(6)).toBe(3);

    const nodeId10 = bst.getNode(10);
    expect(bst.get(10)).toBe(undefined);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = bst.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(undefined);

    const leftMost = bst.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = bst.getNode(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && bst.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    bst.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = bst.getNode(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = bst.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    bst.perfectlyBalance();
    expect(bst.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced: BSTNode<number>[] = [];
    bst.bfs(node => bfsNodesAfterBalanced.push(node));
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = bst.delete(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight(15)).toBe(1);

    const removed1 = bst.delete(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight()).toBe(4);

    const removed4 = bst.delete(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(4);

    const removed10 = bst.delete(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(4);

    const removed15 = bst.delete(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed5 = bst.delete(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed13 = bst.delete(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed3 = bst.delete(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed8 = bst.delete(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed6 = bst.delete(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(bst.delete(6).length).toBe(0);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed7 = bst.delete(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed9 = bst.delete(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed14 = bst.delete(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(2);

    expect(bst.isAVLBalanced()).toBe(false);

    const bfsIDs: number[] = [];
    bst.bfs(node => bfsIDs.push(node.key));
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes: BSTNode<number>[] = [];
    bst.bfs(node => bfsNodes.push(node));
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { key: number; keyA: number }>();
    expect(objBST).toBeInstanceOf(BST);
    objBST.add([11, { key: 11, keyA: 11 }]);
    objBST.add([3, { key: 3, keyA: 3 }]);
    const entries: [number, { key: number; keyA: number }][] = [
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
    ];

    objBST.addMany(entries, undefined, false);

    expect(objBST.root).toBeInstanceOf(BSTNode);

    if (objBST.root) expect(objBST.root.key).toBe(11);

    expect(objBST.has(6)).toBe(true);

    const node6 = objBST.getNode(6);
    expect(objBST.get(6)).toEqual({ key: 6, keyA: 6 });
    expect(node6 && objBST.getHeight(node6)).toBe(2);
    expect(node6 && objBST.getDepth(node6)).toBe(3);

    const nodeId10 = objBST.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = objBST.getNode(9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = objBST.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = objBST.getNode(15);
    expect(node15?.value).toEqual({ key: 15, keyA: 15 });
    const minNodeBySpecificNode = node15 && objBST.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && objBST.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    objBST.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15).toBeInstanceOf(BSTNode);

    const node11 = objBST.getNode(11);
    expect(node11).toBeInstanceOf(BSTNode);

    const dfsInorderNodes = objBST.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);

    objBST.perfectlyBalance();
    expect(objBST.isPerfectlyBalanced()).toBe(true);

    const bfsNodesAfterBalanced: BSTNode<number, { key: number; keyA: number }>[] = [];
    objBST.bfs(node => bfsNodesAfterBalanced.push(node));
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = objBST.delete(11);
    expect(removed11).toBeInstanceOf(Array);
    expect(removed11[0]).toBeDefined();
    expect(removed11[0].deleted).toBeDefined();

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(node15 && objBST.getHeight(node15)).toBe(2);

    const removed1 = objBST.delete(1);
    expect(removed1).toBeInstanceOf(Array);
    expect(removed1[0]).toBeDefined();
    expect(removed1[0].deleted).toBeDefined();
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(objBST.isAVLBalanced()).toBe(true);

    expect(objBST.getHeight()).toBe(4);

    const removed4 = objBST.delete(4);
    expect(removed4).toBeInstanceOf(Array);
    expect(removed4[0]).toBeDefined();
    expect(removed4[0].deleted).toBeDefined();
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(4);

    const removed10 = objBST.delete(10);
    expect(removed10).toBeInstanceOf(Array);
    expect(removed10[0]).toBeDefined();
    expect(removed10[0].deleted).toBeDefined();
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(4);

    const removed15 = objBST.delete(15);
    expect(removed15).toBeInstanceOf(Array);
    expect(removed15[0]).toBeDefined();
    expect(removed15[0].deleted).toBeDefined();
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed5 = objBST.delete(5);
    expect(removed5).toBeInstanceOf(Array);
    expect(removed5[0]).toBeDefined();
    expect(removed5[0].deleted).toBeDefined();
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed13 = objBST.delete(13);
    expect(removed13).toBeInstanceOf(Array);
    expect(removed13[0]).toBeDefined();
    expect(removed13[0].deleted).toBeDefined();
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed3 = objBST.delete(3);
    expect(removed3).toBeInstanceOf(Array);
    expect(removed3[0]).toBeDefined();
    expect(removed3[0].deleted).toBeDefined();
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed8 = objBST.delete(8);
    expect(removed8).toBeInstanceOf(Array);
    expect(removed8[0]).toBeDefined();
    expect(removed8[0].deleted).toBeDefined();
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(objBST.isAVLBalanced()).toBe(true);
    expect(objBST.getHeight()).toBe(3);

    const removed6 = objBST.delete(6);
    expect(removed6).toBeInstanceOf(Array);
    expect(removed6[0]).toBeDefined();
    expect(removed6[0].deleted).toBeDefined();
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(objBST.delete(6).length).toBe(0);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed7 = objBST.delete(7);
    expect(removed7).toBeInstanceOf(Array);
    expect(removed7[0]).toBeDefined();
    expect(removed7[0].deleted).toBeDefined();
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed9 = objBST.delete(9);
    expect(removed9).toBeInstanceOf(Array);
    expect(removed9[0]).toBeDefined();
    expect(removed9[0].deleted).toBeDefined();
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(3);

    const removed14 = objBST.delete(14);
    expect(removed14).toBeInstanceOf(Array);
    expect(removed14[0]).toBeDefined();
    expect(removed14[0].deleted).toBeDefined();
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(objBST.isAVLBalanced()).toBe(false);
    expect(objBST.getHeight()).toBe(2);

    expect(objBST.isAVLBalanced()).toBe(false);

    const bfsIDs: number[] = [];
    objBST.bfs(node => bfsIDs.push(node.key));
    expect(bfsIDs[0]).toBe(2);
    expect(bfsIDs[1]).toBe(12);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes: BSTNode<number, { key: number; keyA: number }>[] = [];
    objBST.bfs(node => bfsNodes.push(node));
    expect(bfsNodes[0].key).toBe(2);
    expect(bfsNodes[1].key).toBe(12);
    expect(bfsNodes[2].key).toBe(16);
  });

  it('should delete', () => {
    const numBST = new BST<number>();
    numBST.addMany([2, 4, 5, 3, 1]);
    expect(numBST.size).toBe(5);
    numBST.delete(1);
    expect(numBST.size).toBe(4);

    numBST.delete(2);
    numBST.delete(3);
    numBST.delete(4);
    numBST.delete(5);
    expect(numBST.size).toBe(0);
    numBST.delete(5);
    expect(numBST.size).toBe(0);
  });

  it('should the clone method', () => {
    function checkTreeStructure(bst: BST<string, number>) {
      expect(bst.size).toBe(4);
      expect(bst.root?.key).toBe('2');
      expect(bst.root?.left?.key).toBe('1');
      expect(bst.root?.left?.left?.key).toBe(undefined);
      expect(bst.root?.left?.right?.key).toBe(undefined);
      expect(bst.root?.right?.key).toBe('4');
      expect(bst.root?.right?.left?.key).toBe(undefined);
      expect(bst.root?.right?.right?.key).toBe('5');
    }

    const bst = new BST<string, number>();
    bst.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(bst.size).toBe(5);
    expect(bst.root?.key).toBe('3');
    expect(bst.root?.left?.key).toBe('1');
    expect(bst.root?.left?.left?.key).toBe(undefined);
    expect(bst.root?.left?.right?.key).toBe('2');
    expect(bst.root?.right?.key).toBe('4');
    expect(bst.root?.right?.left?.key).toBe(undefined);
    expect(bst.root?.right?.right?.key).toBe('5');
    bst.delete('3');
    checkTreeStructure(bst);
    const cloned = bst.clone();
    checkTreeStructure(cloned);
    bst.delete('2');
    bst.delete('1');
    bst.delete('4');
    bst.delete('5');
    expect(bst.size).toBe(0);

    cloned.delete('1');
    expect(bst.size).toBe(0);
    expect(cloned.size).toBe(3);
    cloned.delete('2');
    cloned.delete('3');
    cloned.delete('4');
    cloned.delete('5');
    expect(cloned.size).toBe(0);
  });
});

describe('BST isBST', function () {
  test('isBST', () => {
    const bst = new BST<number, number>();
    bst.addMany([1, 2, 3, 9, 8, 5, 6, 7, 4]);
    expect(bst.isBST()).toBe(true);
  });

  test('isBST when variant is Max', () => {
    const bst = new BST<number, number>([1, 2, 3, 9, 8, 5, 6, 7, 4], { comparator: (a, b) => b - a });
    bst.addMany([1, 2, 3, 9, 8, 5, 6, 7, 4]);
    expect(bst.isBST()).toBe(true);
  });
});

describe('BST Performance test', function () {
  const bst = new BST<number, number>();
  const inputSize = 10000; // Adjust input sizes as needed

  beforeEach(() => {
    bst.clear();
  });

  it(`Observe the time consumption of BST.dfs be good`, function () {
    const startDFS = performance.now();
    const dfs = bst.dfs(node => node);
    isDebug && console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('Should the time consumption of lesserOrGreaterTraverse fitting O(n log n)', function () {
    const nodes: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      nodes.push(i);
    }
    const start = performance.now();
    bst.addMany(nodes);
    isDebug && console.log('---add', performance.now() - start);
    const startL = performance.now();
    bst.lesserOrGreaterTraverse(
      node => {
        node.key - 1;
      },
      -1,
      inputSize / 2
    );
    isDebug && console.log('---lesserOrGreaterTraverse', performance.now() - startL);
  });

  it('Should the time consumption of listLevels fitting well', function () {
    const nodes: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      nodes.push(i);
    }
    const start = performance.now();
    bst.addMany(nodes);
    isDebug && console.log('---add', performance.now() - start);
    const startL = performance.now();
    const arr: number[][] = bst.listLevels(node => node.key);
    isDebug && console.log('---listLevels', arr);
    isDebug && console.log('---listLevels', performance.now() - startL);
  });

  it('should the lastKey of a BST to be the largest key', function () {
    const bst = new BST();
    bst.addMany([9, 8, 7, 3, 1, 2, 5, 4, 6], undefined, false);
    // TODO
    // expect(bst.lastKey()).toBe(9);
  });

  it('should dfs as sub tree traversal, null should be ignored', () => {
    const bst = new BST();
    bst.addMany([4, 2, 6, 1, 3, 5, 7]);
    expect(bst.dfs(node => node.key, 'PRE', bst.getNode(6), 'ITERATIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node.key, 'PRE', bst.getNode(6), 'RECURSIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node?.key ?? undefined, 'PRE', bst.getNode(6), 'ITERATIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node?.key ?? undefined, 'PRE', bst.getNode(6), 'RECURSIVE')).toEqual([6, 5, 7]);
  });
});

describe('BST iterative methods test', () => {
  let bst: BST<number, string>;
  beforeEach(() => {
    bst = new BST();
    bst.add([1, 'a']);
    bst.add([2, 'b']);
    bst.add([3, 'c']);
  });

  test('The node obtained by get Node should match the node type', () => {
    const node3 = bst.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
  });

  test('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    bst.forEach((value, key) => {
      mockCallback(value, key);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['a', 1]);
    expect(mockCallback.mock.calls[1]).toEqual(['b', 2]);
    expect(mockCallback.mock.calls[2]).toEqual(['c', 3]);
  });

  test('filter should return a new tree with filtered elements', () => {
    const filteredTree = bst.filter((value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  test('map should return a new tree with modified elements', () => {
    const mappedTree = bst.map((value, key) => (key * 2).toString());
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      [1, '2'],
      [2, '4'],
      [3, '6']
    ]);
  });

  test('reduce should accumulate values', () => {
    const sum = bst.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  test('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of bst) {
      entries.push(entry);
    }

    expect(entries.length).toBe(3);
    expect(entries).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
  });

  test('should clone work well', () => {
    const cloned = bst.clone();
    expect(cloned.root?.left).toBe(undefined);
    expect(cloned.root?.right?.value).toBe('b');
  });

  test('should keys', () => {
    const keys = bst.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  test('should values', () => {
    const values = bst.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });
});
