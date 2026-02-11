import { BST, BSTNode, IBinaryTree, Range } from '../../../../src';
import { isDebugTest, isTestStackOverflow, SYSTEM_MAX_CALL_STACK } from '../../../config';

const isDebug = isDebugTest;

function expectSingleDeleteResult<K, V>(removed: any, expectedKey: K) {
  // Most tree delete APIs here return an array of { deleted, ... }.
  expect(removed).toBeInstanceOf(Array);
  expect(removed[0]).toBeDefined();
  expect(removed[0].deleted).toBeDefined();
  if (removed[0].deleted) expect(removed[0].deleted.key).toBe(expectedKey);
}

describe('BST operations test', () => {
  it('should add undefined and null', () => {
    const bst = new BST<number, string>();
    const isAddUndefined = bst.set(undefined);
    expect(isAddUndefined).toBe(false);
    expect(bst.get(undefined)).toBe(undefined);
    const isAddNull = bst.set(null);
    expect(isAddNull).toBe(false);
    expect(bst.get(null)).toBe(undefined);
    const isAdd0 = bst.set(0, '0');
    expect(isAdd0).toBe(true);
    expect(bst.get(0)).toBe('0');
  });

  it('should addMany undefined and null', () => {
    const bst = new BST<number, string>();
    const addManyWithUndefined = bst.setMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(bst.get(undefined)).toBe(undefined);
    const addManyWithNull = bst.setMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, false, true, true]);
    const addManyEntriesWithNull = bst.setMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, false, true, true]);
    expect(bst.get(null)).toBe(undefined);
    const node0 = bst.set(0, '0');
    expect(node0).toBe(true);
    expect(bst.get(0)).toBe('0');
  });

  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number, number>();
    expect(bst).toBeInstanceOf(BST);
    bst.set([11, 11]);
    bst.set([3, 3]);
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
    bst.setMany(idsAndValues, [], false);
    expect(bst.root).toBeInstanceOf(BSTNode);

    if (bst.root) expect(bst.root.key).toBe(11);

    expect(bst.size).toBe(16);

    expect(bst.has(6)).toBe(true);

    const node6 = bst.getNode(6);
    expect(node6 && bst.getHeight(6)).toBe(2);
    expect(node6 && bst.getDepth(6)).toBe(3);

    const nodeId10 = bst.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = bst.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = bst.getLeftMost();
    expect(leftMost).toBe(1);

    expect(bst.isBST()).toBe(true);

    const node15 = bst.getNode(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    const nodes = bst.getNodes(node => node.key === 15);
    expect(nodes.map(node => node.key)).toEqual([15]);

    let subTreeSum = 0;
    if (node15) bst.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
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
    expectSingleDeleteResult(removed11, 11);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight(15)).toBe(1);

    const removed1 = bst.delete(1);
    expectSingleDeleteResult(removed1, 1);

    expect(bst.isAVLBalanced()).toBe(true);

    expect(bst.getHeight()).toBe(4);

    const removed4 = bst.delete(4);
    expectSingleDeleteResult(removed4, 4);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(4);

    const removed10 = bst.delete(10);
    expectSingleDeleteResult(removed10, 10);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(4);

    const removed15 = bst.delete(15);
    expectSingleDeleteResult(removed15, 15);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed5 = bst.delete(5);
    expectSingleDeleteResult(removed5, 5);

    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed13 = bst.delete(13);
    expectSingleDeleteResult(removed13, 13);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed3 = bst.delete(3);
    expectSingleDeleteResult(removed3, 3);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed8 = bst.delete(8);
    expectSingleDeleteResult(removed8, 8);
    expect(bst.isAVLBalanced()).toBe(true);
    expect(bst.getHeight()).toBe(3);

    const removed6 = bst.delete(6);
    expectSingleDeleteResult(removed6, 6);
    expect(bst.delete(6).length).toBe(0);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed7 = bst.delete(7);
    expectSingleDeleteResult(removed7, 7);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed9 = bst.delete(9);
    expectSingleDeleteResult(removed9, 9);
    expect(bst.isAVLBalanced()).toBe(false);
    expect(bst.getHeight()).toBe(3);

    const removed14 = bst.delete(14);
    expectSingleDeleteResult(removed14, 14);
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
    bst.clear();
    expect(bst.perfectlyBalance()).toBe(false);
    expect(bst.isAVLBalanced()).toBe(true);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { name: string; age: number }>();
    expect(objBST).toBeInstanceOf(BST);
    objBST.set([11, { name: '11', age: 11 }]);
    objBST.set([3, { name: '3', age: 3 }]);

    objBST.setMany(
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
    expect(leftMost).toBe(1);

    const node15 = objBST.getNode(15);
    expect(objBST.get(node15)).toEqual({
      name: 'Alice',
      age: 15
    });
    const minNodeBySpecificNode = node15 && objBST.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) objBST.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
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
    expect(node15 && objBST.getHeight(node15)).toBe(1);

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

  // it('should keyValueNodeEntryRawToNodeAndValue', () => {
  //   const bst = new BST<number>();
  //   const node0 = bst.keyValueNodeEntryRawToNodeAndValue(0);
  //   expect(node0).toEqual([
  //     {
  //       _left: undefined,
  //       _right: undefined,
  //       key: 0,
  //       parent: undefined,
  //       value: undefined
  //     },
  //     undefined
  //   ]);
  //
  //   const nodeUndefined = bst.keyValueNodeEntryRawToNodeAndValue(undefined);
  //   expect(nodeUndefined).toEqual([undefined, undefined]);
  //
  //   const nodeNull = bst.keyValueNodeEntryRawToNodeAndValue(null);
  //   expect(nodeNull).toEqual([undefined, undefined]);
  // });

  it('should replace value', () => {
    const tree = new BST<number, string>([4, 5, [1, '1'], 2, 3], { isMapMode: false });
    expect(tree.get(1)).toBe('1');
    expect(tree.getNode(1)?.value).toBe('1');
    tree.set(1, 'a');
    expect(tree.get(1)).toBe('a');
    tree.set([1, 'b']);
    expect(tree.getNode(1)?.value).toBe('b');
    expect(tree.get(1)).toBe('b');
    const treeMap = new BST<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    treeMap.set(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.set([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    expect(treeMap.get(1)).toBe('b');
  });

  it('should search in range', () => {
    const bst = new BST<number>([10, 5, 15, 3, 7, 12, 18]);
    expect(bst.rangeSearch([4, 12])).toEqual([5, 7, 10, 12]);
    expect(bst.rangeSearch([12, 12])).toEqual([12]);
  });
});

describe('BST operations test recursively', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number>([], {
      iterationType: 'RECURSIVE'
    });
    expect(bst).toBeInstanceOf(BST);
    bst.set([11, 11]);
    bst.set([3, 3]);
    const idsAndValues = [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    bst.setMany(idsAndValues, undefined, false);
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

    const nodeVal9 = bst.getNode(node => node.value === 9);
    expect(bst.get(nodeVal9?.key)).toBe(undefined);

    const leftMost = bst.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = bst.getNode(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) bst.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
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
    objBST.set([11, { key: 11, keyA: 11 }]);
    objBST.set([3, { key: 3, keyA: 3 }]);
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

    objBST.setMany(entries, undefined, false);

    expect(objBST.root).toBeInstanceOf(BSTNode);

    if (objBST.root) expect(objBST.root.key).toBe(11);

    expect(objBST.has(6)).toBe(true);

    const node6 = objBST.getNode(6);
    expect(objBST.get(6)).toEqual({
      key: 6,
      keyA: 6
    });
    expect(node6 && objBST.getHeight(node6)).toBe(2);
    expect(node6 && objBST.getDepth(node6)).toBe(3);

    const nodeId10 = objBST.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = objBST.getNode(9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = objBST.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = objBST.getNode(15);
    expect(objBST.get(node15)).toEqual({
      key: 15,
      keyA: 15
    });
    const minNodeBySpecificNode = node15 && objBST.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) objBST.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
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

    expect(node15 && objBST.getHeight(node15)).toBe(1);

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
    numBST.setMany([2, 4, 5, 3, 1]);
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

  it('should listLevels', () => {
    const bst = new BST<number>();
    bst.setMany([2, 4, 5, 3, 1]);
    expect(bst.size).toBe(5);
    bst.delete(1);
    bst.delete(5);
    const levelKeys = bst.listLevels();
    expect(levelKeys).toEqual([[3], [2, 4]]);
  });

  it('should lesserOrGreaterTraverse', () => {
    const bst = new BST<number>();
    const levelKeys = bst.lesserOrGreaterTraverse();
    expect(levelKeys).toEqual([]);
    bst.setMany([2, 4, 5, 3, 1]);
    expect(bst.size).toBe(5);
    bst.delete(1);
    bst.delete(5);
    const levelKeys1 = bst.lesserOrGreaterTraverse();
    expect(levelKeys1).toEqual([2]);
  });

  it('should the clone method', () => {
    function checkTreeStructure(bst: IBinaryTree<string, number>) {
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
    bst.setMany([
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

  if (isTestStackOverflow) {
    it('should getLeftMost', () => {
      const bst = new BST<number>([]);
      for (let i = 1; i <= SYSTEM_MAX_CALL_STACK; i++) bst.set(i);

      expect(() => {
        const leftMost = bst.getLeftMost(node => node, bst.root, 'RECURSIVE');
        expect(leftMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
      }).toThrow('Maximum call stack size exceeded');

      const leftMost = bst.getLeftMost(node => node, bst.root, 'ITERATIVE');
      expect(leftMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
    });

    it('should getRightMost', () => {
      const bst = new BST<number>();
      for (let i = 1; i <= SYSTEM_MAX_CALL_STACK; i++) bst.set(i);

      expect(() => {
        const rightMost = bst.getRightMost(node => node, bst.root, 'RECURSIVE');
        expect(rightMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
      }).toThrow('Maximum call stack size exceeded');
      const rightMost = bst.getRightMost(node => node, bst.root, 'ITERATIVE');
      expect(rightMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
    });
  }
});

describe('BST isBST', function () {
  it('isBST', () => {
    const bst = new BST<number, number>();
    bst.setMany([1, 2, 3, 9, 8, 5, 6, 7, 4]);
    expect(bst.isBST()).toBe(true);
  });

  it('isBST when variant is Max', () => {
    const bst = new BST<number, number>([1, 2, 3, 9, 8, 5, 6, 7, 4], {
      comparator: (a, b) => b - a
    });
    bst.setMany([1, 2, 3, 9, 8, 5, 6, 7, 4]);
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
    if (isDebug) console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('Should the time consumption of lesserOrGreaterTraverse fitting O(n log n)', function () {
    const nodes: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      nodes.push(i);
    }
    const start = performance.now();
    bst.setMany(nodes);
    if (isDebug) console.log('---add', performance.now() - start);
    const startL = performance.now();
    bst.lesserOrGreaterTraverse(
      node => {
        node.key -= 1;
      },
      -1,
      inputSize / 2
    );
    if (isDebug) console.log('---lesserOrGreaterTraverse', performance.now() - startL);
  });

  it('Should the time consumption of listLevels fitting well', function () {
    const nodes: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      nodes.push(i);
    }
    const start = performance.now();
    bst.setMany(nodes);
    if (isDebug) console.log('---add', performance.now() - start);
    const startL = performance.now();
    const arr: number[][] = bst.listLevels(node => node.key);
    if (isDebug) console.log('---listLevels', arr);
    if (isDebug) console.log('---listLevels', performance.now() - startL);
  });

  it('should the lastKey of a BST to be the largest key', function () {
    const bst = new BST();
    bst.setMany([9, 8, 7, 3, 1, 2, 5, 4, 6], undefined, false);
    // TODO
    // expect(bst.lastKey()).toBe(9);
  });

  it('should dfs as sub tree traversal, null should be ignored', () => {
    const bst = new BST();
    bst.setMany([4, 2, 6, 1, 3, 5, 7]);
    expect(bst.dfs(node => node.key, 'PRE', false, bst.getNode(6), 'ITERATIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node.key, 'PRE', false, bst.getNode(6), 'RECURSIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node?.key ?? undefined, 'PRE', false, bst.getNode(6), 'ITERATIVE')).toEqual([6, 5, 7]);
    expect(bst.dfs(node => node?.key ?? undefined, 'PRE', false, bst.getNode(6), 'RECURSIVE')).toEqual([6, 5, 7]);
  });
});

describe('BST iterative methods test', () => {
  let bst: BST<number, string>;
  beforeEach(() => {
    bst = new BST();
    bst.setMany(
      [
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ],
      [],
      false
    );
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = bst.getNode(3);
    // expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    bst.forEach((value, key) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
    expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
    expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
  });

  it('filter should return a new tree with filtered elements', () => {
    const filteredTree = bst.filter((_value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('map should return a new tree with modified elements', () => {
    const mappedTree = bst.map((value, key) => [(key * 2).toString(), value]);
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      ['2', 'a'],
      ['4', 'b'],
      ['6', 'c']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = bst.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
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

  it('should clone work well', () => {
    const cloned = bst.clone();
    expect(cloned.root?.left).toBe(undefined);
    expect(cloned.root?.right?.value).toBe(undefined);
  });

  it('should keys', () => {
    const keys = bst.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = bst.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });

  it('should leaves', () => {
    const leaves = bst.leaves();
    expect(leaves).toEqual([3]);
  });

  it('should collapsed, unbalanced, balanced bst leaves', () => {
    const collapsedToLinkedList = new BST();
    collapsedToLinkedList.setMany(
      [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      false
    );

    expect(collapsedToLinkedList.leaves()).toEqual([9]);

    const unbalanced = new BST();
    unbalanced.setMany(
      [
        [2, 'b'],
        [1, 'a'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      false
    );

    expect(unbalanced.leaves()).toEqual([1, 9]);

    const balanced = new BST();
    balanced.setMany(
      [
        [2, 'b'],
        [1, 'a'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      true
    );

    expect(balanced.leaves()).toEqual([1, 6, 4, 9]);
    expect(balanced.leaves(node => balanced.get(node))).toEqual(['a', 'f', 'd', 'i']);
  });
});

describe('BST operations not map mode test', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number, number>([], { isMapMode: false });
    expect(bst).toBeInstanceOf(BST);
    bst.set([11, 11]);
    bst.set([3, 3]);
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
    bst.setMany(idsAndValues, undefined, false);
    expect(bst.root).toBeInstanceOf(BSTNode);

    if (bst.root) expect(bst.root.key).toBe(11);

    expect(bst.size).toBe(16);

    expect(bst.has(6)).toBe(true);

    const node6 = bst.getNode(6);
    expect(node6 && bst.getHeight(6)).toBe(2);
    expect(node6 && bst.getDepth(6)).toBe(3);

    const nodeId10 = bst.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = bst.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = bst.getLeftMost();
    expect(leftMost).toBe(1);

    expect(bst.isBST()).toBe(true);

    const node15 = bst.getNode(15);
    const minNodeBySpecificNode = node15 && bst.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    const nodes = bst.getNodes(node => node.key === 15);
    expect(nodes.map(node => node.key)).toEqual([15]);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { name: string; age: number }>([], { isMapMode: false });
    expect(objBST).toBeInstanceOf(BST);
    objBST.set([11, { name: '11', age: 11 }]);
    objBST.set([3, { name: '3', age: 3 }]);

    objBST.setMany(
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
    expect(leftMost).toBe(1);

    const node15 = objBST.getNode(15);
    expect(objBST.get(node15)).toEqual({
      name: 'Alice',
      age: 15
    });
  });

  // it('should keyValueNodeEntryRawToNodeAndValue', () => {
  //   const bst = new BST<number>([], { isMapMode: false });
  //   const node0 = bst.keyValueNodeEntryRawToNodeAndValue(0);
  //   expect(node0).toEqual([
  //     {
  //       _left: undefined,
  //       _right: undefined,
  //       key: 0,
  //       parent: undefined,
  //       value: undefined
  //     },
  //     undefined
  //   ]);
  //
  //   const nodeUndefined = bst.keyValueNodeEntryRawToNodeAndValue(undefined);
  //   expect(nodeUndefined).toEqual([undefined, undefined]);
  //
  //   const nodeNull = bst.keyValueNodeEntryRawToNodeAndValue(null);
  //   expect(nodeNull).toEqual([undefined, undefined]);
  // });
});

describe('BST operations not map mode test recursively', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number>([], {
      iterationType: 'RECURSIVE',
      isMapMode: false
    });
    expect(bst).toBeInstanceOf(BST);
    bst.set([11, 11]);
    bst.set([3, 3]);
    const idsAndValues = [15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    bst.setMany(idsAndValues, undefined, false);
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

    const nodeVal9 = bst.getNode(node => node.key === 9);
    expect(bst.get(nodeVal9?.key)).toBe(undefined);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { key: number; keyA: number }>([], { isMapMode: false });
    expect(objBST).toBeInstanceOf(BST);
    objBST.set([11, { key: 11, keyA: 11 }]);
    objBST.set([3, { key: 3, keyA: 3 }]);
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

    objBST.setMany(entries, undefined, false);

    expect(objBST.root).toBeInstanceOf(BSTNode);

    if (objBST.root) expect(objBST.root.key).toBe(11);

    expect(objBST.has(6)).toBe(true);

    const node6 = objBST.getNode(6);
    expect(objBST.get(6)).toEqual({
      key: 6,
      keyA: 6
    });
    expect(node6 && objBST.getHeight(node6)).toBe(2);
    expect(node6 && objBST.getDepth(node6)).toBe(3);

    const nodeId10 = objBST.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = objBST.getNode(9);
    expect(nodeVal9?.key).toBe(9);

    const leftMost = objBST.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = objBST.getNode(15);
    expect(objBST.get(node15)).toEqual({
      key: 15,
      keyA: 15
    });
  });
});

describe('BST iterative methods not map mode test', () => {
  let bst: BST<number, string>;
  beforeEach(() => {
    bst = new BST();
    bst.setMany(
      [
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ],
      [],
      false
    );
  });

  it('should clone work well', () => {
    const cloned = bst.clone();
    expect(cloned.root?.left).toBe(undefined);
    expect(cloned.get(cloned.root?.right)).toBe('b');
  });

  it('should collapsed, unbalanced, balanced bst leaves', () => {
    const collapsedToLinkedList = new BST();
    collapsedToLinkedList.setMany(
      [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      false
    );

    expect(collapsedToLinkedList.leaves()).toEqual([9]);

    const unbalanced = new BST();
    unbalanced.setMany(
      [
        [2, 'b'],
        [1, 'a'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      false
    );

    expect(unbalanced.leaves()).toEqual([1, 9]);

    const balanced = new BST();
    balanced.setMany(
      [
        [2, 'b'],
        [1, 'a'],
        [3, 'c'],
        [4, 'd'],
        [5, 'e'],
        [6, 'f'],
        [7, 'g'],
        [8, 'h'],
        [9, 'i']
      ],
      [],
      true
    );

    expect(balanced.leaves()).toEqual([1, 6, 4, 9]);
    expect(balanced.leaves(node => balanced.get(node?.key))).toEqual(['a', 'f', 'd', 'i']);
  });
});

describe('BST constructor and comparator edge cases', () => {
  it('should support comparator', () => {
    const bst = new BST<number>([], {
      comparator: (a, b) => b - a
    });
    bst.set(1);
    bst.set(2);
    expect([...bst.keys()]).toEqual([2, 1]);
  });

  it('should throw if compare object key without comparator', () => {
    const bst = new BST<any>();
    expect(() => bst.comparator({ a: 1 }, { a: 2 })).toThrow();
  });
});

describe('BST addMany edge cases', () => {
  it('should addMany with values iterable', () => {
    const bst = new BST<number, string>();
    const keys = [1, 2, 3];
    const values = ['a', 'b', 'c'];
    const result = bst.setMany(keys, values);
    expect(result).toEqual([true, true, true]);
    expect([...bst]).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('should addMany with isBalanceAdd=false', () => {
    const bst = new BST<number>();
    const result = bst.setMany([3, 1, 2], undefined, false);
    expect(result).toEqual([true, true, true]);
    expect([...bst.keys()]).toEqual([1, 2, 3]);
  });

  it('should addMany with raw/entry/node', () => {
    const bst = new BST<number, string>([], { isMapMode: false });
    const node = new BSTNode(5, 'x');
    const result = bst.setMany([1, [2, 'b'], node]);
    expect(result).toEqual([true, true, true]);
    expect(bst.get(5)).toBe('x');
  });
});

describe('BST perfectlyBalance and isAVLBalanced edge cases', () => {
  it('should perfectlyBalance with <1 node and both iterationType', () => {
    const bst = new BST<number>();
    expect(bst.perfectlyBalance('RECURSIVE')).toBe(false);
    expect(bst.perfectlyBalance('ITERATIVE')).toBe(false);
    bst.setMany([1, 2, 3]);
    expect(bst.perfectlyBalance('RECURSIVE')).toBe(true);
    bst.clear();
    bst.setMany([1, 2, 3]);
    expect(bst.perfectlyBalance('ITERATIVE')).toBe(true);
  });

  it('should isAVLBalanced with both iterationType', () => {
    const bst = new BST<number>();
    expect(bst.isAVLBalanced('RECURSIVE')).toBe(true);
    expect(bst.isAVLBalanced('ITERATIVE')).toBe(true);
    bst.setMany([1, 2, 3, 4, 5]);
    expect(typeof bst.isAVLBalanced('RECURSIVE')).toBe('boolean');
    expect(typeof bst.isAVLBalanced('ITERATIVE')).toBe('boolean');
  });
});

describe('BST _keyValueNodeOrEntryToNodeAndValue edge', () => {
  it('should return [undefined, undefined] for null', () => {
    const bst = new BST<number>();
    // @ts-ignore
    const result = bst['_keyValueNodeOrEntryToNodeAndValue'](null);
    expect(result).toEqual([undefined, undefined]);
  });
});

describe('BST ceiling and higher', () => {
  let bst: BST<number, string>;

  beforeEach(() => {
    // Create a BST with keys: [10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 18, 25]
    bst = new BST<number, string>([10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 18, 25]);
  });

  describe('ceiling', () => {
    it('should return the key with exact key match', () => {
      // Test for key that exists in tree
      const key = bst.ceiling(10);
      expect(key).toBeDefined();
      expect(key).toBe(10);
    });

    it('should return the smallest key >= key when exact match not found', () => {
      // Test for key 9 (doesn't exist, should return 10)
      const key = bst.ceiling(9);
      expect(key).toBeDefined();
      expect(key).toBe(10);
    });

    it('should return key with key >= search key from multiple candidates', () => {
      // Test for key 6 (exists, should return 6)
      const key = bst.ceiling(6);
      expect(key).toBeDefined();
      expect(key).toBe(6);

      // Test for key 7 (exists, should return 7)
      const key2 = bst.ceiling(7);
      expect(key2).toBeDefined();
      expect(key2).toBe(7);
    });

    it('should return smallest key >= search key for non-existent key in middle range', () => {
      // Test for key 14 (doesn't exist, should return 15)
      const key = bst.ceiling(14);
      expect(key).toBeDefined();
      expect(key).toBe(15);

      // Test for key 11.5 (doesn't exist, should return 12)
      const key2 = bst.ceiling(11.5);
      expect(key2).toBeDefined();
      expect(key2).toBe(12);
    });

    it('should return smallest key when search key is less than minimum', () => {
      // Test for key 0 (should return 1, the minimum)
      const key = bst.ceiling(0);
      expect(key).toBeDefined();
      expect(key).toBe(1);

      // Test for key -100 (should return 1, the minimum)
      const key2 = bst.ceiling(-100);
      expect(key2).toBeDefined();
      expect(key2).toBe(1);
    });

    it('should return undefined when search key is greater than maximum', () => {
      // Test for key 100 (no key >= 100, should return undefined)
      const key = bst.ceiling(100);
      expect(key).toBeUndefined();

      // Test for key 26 (no key >= 26, should return undefined)
      const key2 = bst.ceiling(26);
      expect(key2).toBeUndefined();
    });

    it('should return correct key for edge cases', () => {
      // Test for key 25 (maximum, should return 25)
      const key = bst.ceiling(25);
      expect(key).toBeDefined();
      expect(key).toBe(25);

      // Test for key 1 (minimum, should return 1)
      const key2 = bst.ceiling(1);
      expect(key2).toBeDefined();
      expect(key2).toBe(1);
    });
  });

  describe('higher', () => {
    it('should return the smallest key > search key', () => {
      // Test for key 10 (exists, should return next key > 10, which is 11)
      const key = bst.higher(10);
      expect(key).toBeDefined();
      expect(key).toBe(11);
    });

    it('should return the smallest key > search key for non-existent key', () => {
      // Test for key 9 (doesn't exist, should return 10, the smallest key > 9)
      const key = bst.higher(9);
      expect(key).toBeDefined();
      expect(key).toBe(10);

      // Test for key 14 (doesn't exist, should return 15)
      const key2 = bst.higher(14);
      expect(key2).toBeDefined();
      expect(key2).toBe(15);
    });

    it('should skip equal keys and return the next larger key', () => {
      // Test for key 5 (exists, should return 6, the smallest key > 5)
      const key = bst.higher(5);
      expect(key).toBeDefined();
      expect(key).toBe(6);

      // Test for key 20 (exists, should return 25)
      const key2 = bst.higher(20);
      expect(key2).toBeDefined();
      expect(key2).toBe(25);
    });

    it('should return smallest key > search key for non-existent key in middle range', () => {
      // Test for key 11.5 (doesn't exist, should return 12)
      const key = bst.higher(11.5);
      expect(key).toBeDefined();
      expect(key).toBe(12);

      // Test for key 19 (doesn't exist, should return 20)
      const key2 = bst.higher(19);
      expect(key2).toBeDefined();
      expect(key2).toBe(20);
    });

    it('should return smallest key when search key is less than minimum', () => {
      // Test for key 0 (should return 1, the minimum)
      const key = bst.higher(0);
      expect(key).toBeDefined();
      expect(key).toBe(1);

      // Test for key -100 (should return 1, the minimum)
      const key2 = bst.higher(-100);
      expect(key2).toBeDefined();
      expect(key2).toBe(1);
    });

    it('should return undefined when search key is >= maximum', () => {
      // Test for key 100 (no key > 100, should return undefined)
      const key = bst.higher(100);
      expect(key).toBeUndefined();

      // Test for key 25 (maximum, no key > 25, should return undefined)
      const key2 = bst.higher(25);
      expect(key2).toBeUndefined();

      // Test for key 26 (no key > 26, should return undefined)
      const key3 = bst.higher(26);
      expect(key3).toBeUndefined();
    });

    it('should return correct key for edge cases', () => {
      // Test for key 1 (minimum, should return next key 3)
      const key = bst.higher(1);
      expect(key).toBeDefined();
      expect(key).toBe(3);

      // Test for key 24 (doesn't exist, should return 25)
      const key2 = bst.higher(24);
      expect(key2).toBeDefined();
      expect(key2).toBe(25);
    });
  });

  describe('ceiling vs higher comparison', () => {
    it('should demonstrate difference between ceiling and higher', () => {
      const searchKey = 12;

      // ceiling(12) should return 12 (key >= 12)
      const lower = bst.ceiling(searchKey);
      expect(lower).toBe(12);

      // higher(12) should return 13 (key > 12)
      const upper = bst.higher(searchKey);
      expect(upper).toBe(13);
    });

    it('should return same result for non-existent key in both methods', () => {
      const searchKey = 11.5;

      // Both should return 12 (smallest key >= 11.5 for ceiling, smallest key > 11.5 for higher)
      const lower = bst.ceiling(searchKey);
      const upper = bst.higher(searchKey);
      expect(lower).toBe(12);
      expect(upper).toBe(12);
    });
  });

  describe('BST Bound Methods Comprehensive Tests', () => {
    let bst: BST<number, string>;

    // Helper: Generate random number array
    const generateRandomArray = (size: number, min: number, max: number) => {
      return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    };

    beforeEach(() => {
      // Construct a standard test tree
      // Structure:
      //          10
      //        /    \
      //       5      15
      //      / \    /  \
      //     2   8  12   20
      //        / \
      //       6   9
      bst = new BST<number, string>();
      const keys = [10, 5, 15, 2, 8, 12, 20, 6, 9];
      keys.forEach(k => bst.set(k, `val-${k}`));
    });

    describe('ceiling (First key >= key)', () => {
      test('should return strict match if key exists', () => {
        // Case: Key exists
        expect(bst.ceiling(10)).toBe(10);
        expect(bst.ceiling(6)).toBe(6);
        expect(bst.ceiling(20)).toBe(20);
      });

      test('should return next larger key if key does not exist', () => {
        // Case: Key doesn't exist, but falls within range
        expect(bst.ceiling(7)).toBe(8); // 7 -> 8
        expect(bst.ceiling(11)).toBe(12); // 11 -> 12
        expect(bst.ceiling(3)).toBe(5); // 3 -> 5
      });

      test('should return smallest key if key is smaller than min', () => {
        // Case: Key is smaller than the minimum value in the tree
        expect(bst.ceiling(0)).toBe(2);
        expect(bst.ceiling(-100)).toBe(2);
      });

      test('should return undefined if key is larger than max', () => {
        // Case: Key is larger than the maximum value in the tree
        expect(bst.ceiling(21)).toBeUndefined();
        expect(bst.ceiling(100)).toBeUndefined();
      });

      test('should work with IterationType.RECURSIVE explicitly', () => {
        expect(bst.ceiling(7)).toBe(8);
        expect(bst.ceiling(10)).toBe(10);
        expect(bst.ceiling(21)).toBeUndefined();
      });

      test('should work with IterationType.ITERATIVE explicitly', () => {
        expect(bst.ceiling(7)).toBe(8);
        expect(bst.ceiling(10)).toBe(10);
        expect(bst.ceiling(21)).toBeUndefined();
      });
    });

    describe('higher (First key > key)', () => {
      test('should return next larger key even if key exists', () => {
        // Case: Key exists, but we want strictly greater
        expect(bst.higher(10)).toBe(12); // > 10 is 12
        expect(bst.higher(6)).toBe(8); // > 6 is 8
        expect(bst.higher(20)).toBeUndefined(); // > 20 is undefined
      });

      test('should return next larger key if key does not exist', () => {
        // Case: Key doesn't exist
        expect(bst.higher(7)).toBe(8);
        expect(bst.higher(11)).toBe(12);
      });

      test('should return undefined if key is larger than or equal to max', () => {
        expect(bst.higher(20)).toBeUndefined();
        expect(bst.higher(21)).toBeUndefined();
      });

      test('should work with IterationType.RECURSIVE explicitly', () => {
        expect(bst.higher(10)).toBe(12);
        expect(bst.higher(20)).toBeUndefined();
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty tree', () => {
        const emptyTree = new BST<number, string>();
        expect(emptyTree.ceiling(10)).toBeUndefined();
        expect(emptyTree.higher(10)).toBeUndefined();
      });

      test('should handle single node tree', () => {
        const singleNodeTree = new BST<number, string>();
        singleNodeTree.set(10);

        // ceiling
        expect(singleNodeTree.ceiling(5)).toBe(10);
        expect(singleNodeTree.ceiling(10)).toBe(10);
        expect(singleNodeTree.ceiling(15)).toBeUndefined();

        // higher
        expect(singleNodeTree.higher(5)).toBe(10);
        expect(singleNodeTree.higher(10)).toBeUndefined();
      });
    });

    describe('Consistency & Fuzz Testing', () => {
      test('Recursive and Iterative implementations should match on random data', () => {
        const fuzzTree = new BST<number, number>();
        // Generate 500 random numbers between 0-1000
        const randomKeys = generateRandomArray(500, 0, 1000);

        // Insert unique keys
        [...new Set(randomKeys)].forEach(k => fuzzTree.set(k));

        // Sort for verification (Ground Truth)
        const sortedKeys = Array.from(fuzzTree.keys()).sort((a, b) => a - b);

        // Test with 200 random queries (including existing and non-existing keys)
        const testQueries = generateRandomArray(200, 0, 1000);

        testQueries.forEach(queryKey => {
          // 1. Verify ceiling
          const recLower = fuzzTree.ceiling(queryKey);
          const iterLower = fuzzTree.ceiling(queryKey);

          // Verify consistency between recursive and iterative
          expect(recLower).toBe(iterLower);

          // Verify logic correctness (compare with Array.find)
          const expectedLower = sortedKeys.find(k => k >= queryKey);
          expect(recLower).toBe(expectedLower);

          // 2. Verify higher
          const recUpper = fuzzTree.higher(queryKey);
          const iterUpper = fuzzTree.higher(queryKey);

          // Verify consistency
          expect(recUpper).toBe(iterUpper);

          // Verify logic correctness
          const expectedUpper = sortedKeys.find(k => k > queryKey);
          expect(recUpper).toBe(expectedUpper);
        });
      });
    });
  });

  describe('empty tree', () => {
    beforeEach(() => {
      bst = new BST<number, string>();
    });

    it('ceiling should return undefined on empty tree', () => {
      const key = bst.ceiling(10);
      expect(key).toBeUndefined();
    });

    it('higher should return undefined on empty tree', () => {
      const key = bst.higher(10);
      expect(key).toBeUndefined();
    });
  });

  describe('single node tree', () => {
    beforeEach(() => {
      bst = new BST<number, string>();
      bst.set(10, 'ten');
    });

    it('ceiling should return the key if key matches', () => {
      const key = bst.ceiling(10);
      expect(key).toBeDefined();
      expect(key).toBe(10);
    });

    it('ceiling should return the key if search key is less', () => {
      const key = bst.ceiling(5);
      expect(key).toBeDefined();
      expect(key).toBe(10);
    });

    it('ceiling should return undefined if search key is greater', () => {
      const key = bst.ceiling(15);
      expect(key).toBeUndefined();
    });

    it('higher should return undefined if key matches', () => {
      const key = bst.higher(10);
      expect(key).toBeUndefined();
    });

    it('higher should return the key if search key is less', () => {
      const key = bst.higher(5);
      expect(key).toBeDefined();
      expect(key).toBe(10);
    });

    it('higher should return undefined if search key is greater', () => {
      const key = bst.higher(15);
      expect(key).toBeUndefined();
    });
  });

  describe('practical LeetCode use case: Range search', () => {
    it('should find all keys in range [12, 20]', () => {
      // Use ceiling to find start of range and higher to find end
      const start = bst.ceiling(12);

      expect(start).toBe(12);

      // Let's verify we found the correct bounds
      expect(start).toBeGreaterThanOrEqual(12);

      // Check overlap
      const rangeStart = bst.ceiling(12);
      const rangeEndInclusive = bst.ceiling(20); // Should be 20

      expect(rangeStart).toBe(12);
      expect(rangeEndInclusive).toBe(20);
    });

    it('should help identify interval overlaps', () => {
      // Check if interval [14, 19] overlaps with any existing interval
      // Use higher to find the first key > 19
      const nextKey = bst.higher(19);
      // Use ceiling to find the first key >= 14
      const firstInRange = bst.ceiling(14);

      expect(firstInRange).toBe(15);
      expect(nextKey).toBe(20);
    });
  });
});

describe('BST Range Query Methods', () => {
  let bst: BST<number, string>;

  beforeEach(() => {
    // Create a balanced BST: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20]
    bst = new BST([10, 5, 15, 3, 7, 13, 17, 1, 4, 6, 9, 11, 14, 16, 19, 20]);
  });

  describe('ceiling - finds >= key (minimum value >= target)', () => {
    test('should find ceiling when key exists', () => {
      const result = bst.ceiling(10);
      expect(result).toBeDefined();
      expect(result).toBe(10);
    });

    test('should find ceiling when key does not exist but higher value exists', () => {
      const result = bst.ceiling(8);
      expect(result).toBeDefined();
      expect(result).toBe(9);
    });

    test('should return undefined when no ceiling exists (key greater than all)', () => {
      const result = bst.ceiling(100);
      expect(result).toBeUndefined();
    });

    test('should find minimum element as ceiling for key smaller than all', () => {
      const result = bst.ceiling(-10);
      expect(result).toBeDefined();
      expect(result).toBe(1);
    });

    test('should handle ceiling with node input', () => {
      const targetNode = bst.getNode(7);
      expect(targetNode).toBeDefined();
      const result = bst.ceiling(targetNode!);
      expect(result).toBe(7);
    });

    test('should handle ceiling with entry input', () => {
      const result = bst.ceiling([11, 'test']);
      expect(result).toBeDefined();
      expect(result).toBe(11);
    });

    test('should handle null/undefined inputs', () => {
      expect(bst.ceiling(null)).toBeUndefined();
      expect(bst.ceiling(undefined)).toBeUndefined();
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.ceiling(12);
      expect(result).toBeDefined();
      expect(result).toBe(13);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.ceiling(12);
      expect(result).toBeDefined();
      expect(result).toBe(13);
    });

    test('should find exact match as ceiling', () => {
      const result = bst.ceiling(15);
      expect(result).toBeDefined();
      expect(result).toBe(15);
    });
  });

  describe('higher - finds > key (minimum value > target)', () => {
    test('should find higher when key exists (exclude exact match)', () => {
      const result = bst.higher(10);
      expect(result).toBeDefined();
      expect(result).toBe(11);
      expect(result).not.toBe(10);
    });

    test('should find higher when key does not exist', () => {
      const result = bst.higher(8);
      expect(result).toBeDefined();
      expect(result).toBe(9);
    });

    test('should return undefined when no higher exists (key >= all)', () => {
      const result = bst.higher(20);
      expect(result).toBeUndefined();
    });

    test('should find minimum element as higher for key < all', () => {
      const result = bst.higher(-10);
      expect(result).toBeDefined();
      expect(result).toBe(1);
    });

    test('should not return the key itself', () => {
      const result = bst.higher(7);
      expect(result).not.toBe(7);
      expect(result).toBe(9);
    });

    test('should handle higher with node input', () => {
      const targetNode = bst.getNode(5);
      expect(targetNode).toBeDefined();
      const result = bst.higher(targetNode!);
      expect(result).toBeGreaterThan(5);
      expect(result).toBe(6);
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.higher(13);
      expect(result).toBeDefined();
      expect(result).toBe(14);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.higher(13);
      expect(result).toBeDefined();
      expect(result).toBe(14);
    });
  });

  describe('floor - finds <= key (maximum value <= target)', () => {
    test('should find floor when key exists', () => {
      const result = bst.floor(10);
      expect(result).toBeDefined();
      expect(result).toBe(10);
    });

    test('should find floor when key does not exist but lower value exists', () => {
      const result = bst.floor(12);
      expect(result).toBeDefined();
      expect(result).toBe(11);
    });

    test('should return undefined when no floor exists (key less than all)', () => {
      const result = bst.floor(-10);
      expect(result).toBeUndefined();
    });

    test('should find maximum element as floor for key greater than all', () => {
      const result = bst.floor(100);
      expect(result).toBeDefined();
      expect(result).toBe(20);
    });

    test('should handle floor with node input', () => {
      const targetNode = bst.getNode(13);
      expect(targetNode).toBeDefined();
      const result = bst.floor(targetNode!);
      expect(result).toBe(13);
    });

    test('should handle floor with entry input', () => {
      const result = bst.floor([16, 'test']);
      expect(result).toBeDefined();
      expect(result).toBe(16);
    });

    test('should handle null/undefined inputs', () => {
      expect(bst.floor(null)).toBeUndefined();
      expect(bst.floor(undefined)).toBeUndefined();
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.floor(12);
      expect(result).toBeDefined();
      expect(result).toBe(11);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.floor(12);
      expect(result).toBeDefined();
      expect(result).toBe(11);
    });

    test('should find exact match as floor', () => {
      const result = bst.floor(15);
      expect(result).toBeDefined();
      expect(result).toBe(15);
    });

    test('should correctly find floor between two keys', () => {
      const result = bst.floor(8);
      expect(result).toBeDefined();
      expect(result).toBe(7);
      expect(result).toBeLessThan(8);
    });
  });

  describe('lower - finds < key (maximum value < target)', () => {
    test('should find lower when key exists (exclude exact match)', () => {
      const result = bst.lower(10);
      expect(result).toBeDefined();
      expect(result).toBe(9);
      expect(result).not.toBe(10);
    });

    test('should find lower when key does not exist', () => {
      const result = bst.lower(12);
      expect(result).toBeDefined();
      expect(result).toBe(11);
    });

    test('should return undefined when no lower exists (key <= all)', () => {
      const result = bst.lower(1);
      expect(result).toBeUndefined();
    });

    test('should find maximum element as lower for key > all', () => {
      const result = bst.lower(100);
      expect(result).toBeDefined();
      expect(result).toBe(20);
    });

    test('should not return the key itself', () => {
      const result = bst.lower(15);
      expect(result).not.toBe(15);
      expect(result).toBe(14);
    });

    test('should handle lower with node input', () => {
      const targetNode = bst.getNode(13);
      expect(targetNode).toBeDefined();
      const result = bst.lower(targetNode!);
      expect(result).toBeLessThan(13);
      expect(result).toBe(11);
    });

    test('should handle lower with entry input', () => {
      const result = bst.lower([17, 'test']);
      expect(result).toBeDefined();
      expect(result).toBe(16);
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.lower(14);
      expect(result).toBeDefined();
      expect(result).toBe(13);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.lower(14);
      expect(result).toBeDefined();
      expect(result).toBe(13);
    });
  });

  describe('Edge cases and special scenarios', () => {
    test('single element tree - ceiling', () => {
      const singleBst = new BST([5]);
      expect(singleBst.ceiling(5)).toBe(5);
      expect(singleBst.ceiling(3)).toBe(5);
      expect(singleBst.ceiling(7)).toBeUndefined();
    });

    test('single element tree - higher', () => {
      const singleBst = new BST([5]);
      expect(singleBst.higher(5)).toBeUndefined();
      expect(singleBst.higher(3)).toBe(5);
    });

    test('single element tree - floor', () => {
      const singleBst = new BST([5]);
      expect(singleBst.floor(5)).toBe(5);
      expect(singleBst.floor(7)).toBe(5);
      expect(singleBst.floor(3)).toBeUndefined();
    });

    test('single element tree - lower', () => {
      const singleBst = new BST([5]);
      expect(singleBst.lower(5)).toBeUndefined();
      expect(singleBst.lower(7)).toBe(5);
    });

    test('empty tree handling', () => {
      const emptyBst = new BST<number, string>();
      expect(emptyBst.ceiling(5)).toBeUndefined();
      expect(emptyBst.higher(5)).toBeUndefined();
      expect(emptyBst.floor(5)).toBeUndefined();
      expect(emptyBst.lower(5)).toBeUndefined();
    });

    test('ceiling and floor of adjacent keys', () => {
      const ceiling = bst.ceiling(5);
      const floor = bst.floor(6);
      expect(ceiling).toBe(5);
      expect(floor).toBe(6);
    });

    test('higher and lower of adjacent keys', () => {
      const higher = bst.higher(5);
      const lower = bst.lower(6);
      expect(higher).toBe(6);
      expect(lower).toBe(5);
    });
  });

  describe('Predicate-based search', () => {
    test('ceiling with predicate function', () => {
      const result = bst.ceiling((node: BSTNode<number, string>) => node.key >= 10);
      expect(result).toBeDefined();
      expect(result).toBeGreaterThanOrEqual(10);
    });

    test('floor with predicate function', () => {
      const result = bst.floor((node: BSTNode<number, string>) => node.key <= 15);
      expect(result).toBeDefined();
      expect(result).toBeLessThanOrEqual(15);
    });

    test('higher with predicate function', () => {
      const result = bst.higher((node: BSTNode<number, string>) => node.key > 10);
      expect(result).toBeDefined();
      expect(result).toBeGreaterThan(10);
    });

    test('lower with predicate function', () => {
      const result = bst.lower((node: BSTNode<number, string>) => node.key < 15);
      expect(result).toBeDefined();
      expect(result).toBeLessThan(15);
    });
  });

  describe('Custom comparator', () => {
    test('should work with reverse order comparator', () => {
      const reverseBst = new BST([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20], {
        comparator: (a: number, b: number) => b - a // reverse order
      });

      // In reverse order tree: keys are stored in descending order
      // ceiling (>=) should still work correctly
      const ceiling = reverseBst.ceiling(10);
      expect(ceiling).toBeDefined();
      expect(ceiling).toBeLessThanOrEqual(10);
    });

    test('should work with string comparator', () => {
      const stringBst = new BST(
        [
          { name: 'Alice', id: 1 },
          { name: 'Bob', id: 2 },
          { name: 'Charlie', id: 3 },
          { name: 'David', id: 4 },
          { name: 'Eve', id: 5 }
        ],
        {
          comparator: (a, b) => a.name.localeCompare(b.name)
        }
      );

      const ceiling = stringBst.ceiling({ name: 'Bob', id: 0 });
      expect(ceiling).toBeDefined();
      expect(ceiling?.name).toBe('Bob');
    });
  });

  describe('Performance and correctness validation', () => {
    test('all range methods return keys in order', () => {
      const ceiling = bst.ceiling(10);
      const higher = bst.higher(10);
      const floor = bst.floor(10);
      const lower = bst.lower(10);

      expect(floor).toBeLessThanOrEqual(10);
      expect(ceiling).toBeGreaterThanOrEqual(10);
      expect(higher).toBeGreaterThan(10);
      expect(lower).toBeLessThan(10);
    });

    test('range query iteration with ceiling/higher', () => {
      const results: number[] = [];
      let key = bst.ceiling(5);
      let count = 0;
      while (key && key <= 15 && count < 20) {
        results.push(key);
        key = bst.higher(key);
        count++;
      }

      // Should iterate through keys 5, 6, 7, ..., 15
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeGreaterThanOrEqual(5);
      expect(results[results.length - 1]).toBeLessThanOrEqual(15);
      // Verify ascending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThan(results[i - 1]);
      }
    });

    test('range query iteration with floor/lower', () => {
      const results: number[] = [];
      let key = bst.floor(15);
      let count = 0;
      while (key && key >= 5 && count < 20) {
        results.push(key);
        key = bst.lower(key);
        count++;
      }

      // Should iterate through keys 15, 14, 13, ..., 5
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeLessThanOrEqual(15);
      expect(results[results.length - 1]).toBeGreaterThanOrEqual(5);
      // Verify descending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeLessThan(results[i - 1]);
      }
    });
  });

  describe('Boundary value testing', () => {
    test('boundary: ceiling at min value', () => {
      const result = bst.ceiling(1);
      expect(result).toBe(1);
    });

    test('boundary: floor at max value', () => {
      const result = bst.floor(20);
      expect(result).toBe(20);
    });

    test('boundary: higher at second-last value', () => {
      const result = bst.higher(19);
      expect(result).toBe(20);
    });

    test('boundary: lower at second value', () => {
      const result = bst.lower(3);
      expect(result).toBe(1);
    });

    test('boundary: ceiling slightly below min', () => {
      const result = bst.ceiling(0);
      expect(result).toBe(1);
    });

    test('boundary: floor slightly above max', () => {
      const result = bst.floor(21);
      expect(result).toBe(20);
    });

    test('boundary: higher at max (should be undefined)', () => {
      const result = bst.higher(20);
      expect(result).toBeUndefined();
    });

    test('boundary: lower at min (should be undefined)', () => {
      const result = bst.lower(1);
      expect(result).toBeUndefined();
    });
  });
});

describe('BST Comparator Tests', () => {
  describe('Default Comparator with Primitive Types', () => {
    let bst: BST<number>;

    beforeEach(() => {
      bst = new BST<number>();
    });

    it('should compare two numbers correctly - a > b', () => {
      const result = bst['_compare'](5, 3);
      expect(result).toBe(1);
    });

    it('should compare two numbers correctly - a < b', () => {
      const result = bst['_compare'](2, 8);
      expect(result).toBe(-1);
    });

    it('should compare two numbers correctly - a === b', () => {
      const result = bst['_compare'](5, 5);
      expect(result).toBe(0);
    });

    it('should compare negative numbers correctly', () => {
      const result1 = bst['_compare'](-5, -3);
      const result2 = bst['_compare'](-10, 0);
      expect(result1).toBe(-1);
      expect(result2).toBe(-1);
    });

    it('should compare zero correctly', () => {
      const result1 = bst['_compare'](0, 5);
      const result2 = bst['_compare'](0, 0);
      const result3 = bst['_compare'](-5, 0);
      expect(result1).toBe(-1);
      expect(result2).toBe(0);
      expect(result3).toBe(-1);
    });

    it('should compare decimal numbers correctly', () => {
      const result1 = bst['_compare'](3.14, 3.15);
      const result2 = bst['_compare'](2.5, 2.5);
      expect(result1).toBe(-1);
      expect(result2).toBe(0);
    });

    it('should compare very large numbers correctly', () => {
      const result1 = bst['_compare'](Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1);
      const result2 = bst['_compare'](1e10, 1e9);
      expect(result1).toBe(1);
      expect(result2).toBe(1);
    });
  });

  describe('Default Comparator with String Types', () => {
    let bst: BST<string>;

    beforeEach(() => {
      bst = new BST<string>();
    });

    it('should compare strings alphabetically - a > b', () => {
      const result = bst['_compare']('zebra', 'apple');
      expect(result).toBe(1);
    });

    it('should compare strings alphabetically - a < b', () => {
      const result = bst['_compare']('apple', 'zebra');
      expect(result).toBe(-1);
    });

    it('should compare identical strings', () => {
      const result = bst['_compare']('hello', 'hello');
      expect(result).toBe(0);
    });

    it('should compare string prefixes correctly', () => {
      const result1 = bst['_compare']('app', 'apple');
      const result2 = bst['_compare']('apple', 'app');
      expect(result1).toBe(-1);
      expect(result2).toBe(1);
    });

    it('should compare case-sensitive strings', () => {
      const result1 = bst['_compare']('Apple', 'apple');
      const result2 = bst['_compare']('apple', 'Apple');
      expect(result1).toBe(-1);
      expect(result2).toBe(1);
    });

    it('should compare empty strings', () => {
      const result1 = bst['_compare']('', '');
      const result2 = bst['_compare']('', 'a');
      const result3 = bst['_compare']('a', '');
      expect(result1).toBe(0);
      expect(result2).toBe(-1);
      expect(result3).toBe(1);
    });

    it('should compare special characters in strings', () => {
      const result1 = bst['_compare']('!', 'a');
      const result2 = bst['_compare']('a', '1');
      expect(result1).toBe(-1);
      expect(result2).toBe(1);
    });
  });

  describe('Custom Comparator', () => {
    interface Person {
      name: string;
      age: number;
    }

    it('should accept custom comparator for objects - compare by age', () => {
      const comparator = (a: Person, b: Person): number => {
        if (a.age > b.age) return 1;
        if (a.age < b.age) return -1;
        return 0;
      };

      const bst = new BST<Person>([], { comparator });

      const p1 = { name: 'Alice', age: 30 };
      const p2 = { name: 'Bob', age: 25 };
      const p3 = { name: 'Charlie', age: 30 };

      expect(bst['_compare'](p1, p2)).toBe(1);
      expect(bst['_compare'](p2, p1)).toBe(-1);
      expect(bst['_compare'](p1, p3)).toBe(0);
    });

    it('should accept custom comparator - compare by name length', () => {
      const comparator = (a: string, b: string): number => {
        if (a.length > b.length) return 1;
        if (a.length < b.length) return -1;
        return 0;
      };

      const bst = new BST<string>([], { comparator });

      expect(bst['_compare']('hello', 'hi')).toBe(1);
      expect(bst['_compare']('hi', 'hello')).toBe(-1);
      expect(bst['_compare']('abc', 'def')).toBe(0);
    });

    it('should accept custom comparator - reverse order', () => {
      const comparator = (a: number, b: number): number => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      };

      const bst = new BST<number>([], { comparator });

      expect(bst['_compare'](5, 3)).toBe(-1);
      expect(bst['_compare'](2, 8)).toBe(1);
      expect(bst['_compare'](5, 5)).toBe(0);
    });

    it('should throw error when comparing object types without custom comparator', () => {
      const bst = new BST<{ value: number }>();

      expect(() => {
        bst['_compare']({ value: 1 }, { value: 2 });
      }).toThrow("When comparing object type keys, a custom comparator must be provided in the constructor's options!");
    });
  });

  describe('Comparator Usage in BST Operations', () => {
    let bst: BST<number>;

    beforeEach(() => {
      bst = new BST<number>();
    });

    it('should correctly insert elements based on comparator', () => {
      bst.set(10);
      bst.set(5);
      bst.set(15);
      bst.set(3);
      bst.set(7);

      expect(bst.has(10)).toBe(true);
      expect(bst.has(5)).toBe(true);
      expect(bst.has(15)).toBe(true);
      expect(bst.has(3)).toBe(true);
      expect(bst.has(7)).toBe(true);
      expect(bst.size).toBe(5);
    });

    it('should maintain BST property with in-order traversal', () => {
      bst.setMany([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

      const inOrder: (number | undefined)[] = bst.dfs(node => node?.key);

      for (let i = 1; i < inOrder.length; i++) {
        expect(inOrder[i]! >= inOrder[i - 1]!).toBe(true);
      }
    });

    it('should correctly find min and max using comparator', () => {
      bst.setMany([15, 10, 20, 8, 12, 18, 25]);

      const arr = Array.from(bst.keys());
      const min = Math.min(...arr);
      const max = Math.max(...arr);

      expect(bst.has(min)).toBe(true);
      expect(bst.has(max)).toBe(true);
    });

    it('should correctly delete elements maintaining BST property', () => {
      bst.setMany([10, 5, 15, 3, 7, 12, 18]);
      bst.delete(10);

      expect(bst.has(10)).toBe(false);
      const inOrder: (number | undefined)[] = bst.dfs(node => node?.key);

      for (let i = 1; i < inOrder.length; i++) {
        expect(inOrder[i]! >= inOrder[i - 1]!).toBe(true);
      }
    });

    it('should correctly search using comparator', () => {
      bst.setMany([20, 10, 30, 5, 15, 25, 35]);

      const result = bst.search(15);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBe(15);
    });
  });

  describe('Comparator Edge Cases', () => {
    describe('with numbers', () => {
      let bst: BST<number>;

      beforeEach(() => {
        bst = new BST<number>();
      });

      it('should handle Infinity correctly', () => {
        const result1 = bst['_compare'](Infinity, 100);
        const result2 = bst['_compare'](100, Infinity);
        expect(result1).toBe(1);
        expect(result2).toBe(-1);
      });

      it('should handle -Infinity correctly', () => {
        const result1 = bst['_compare'](-Infinity, -100);
        const result2 = bst['_compare'](-100, -Infinity);
        expect(result1).toBe(-1);
        expect(result2).toBe(1);
      });

      it('should handle NaN correctly', () => {
        const result1 = bst['_compare'](NaN, 5);
        const result2 = bst['_compare'](5, NaN);
        expect(result1).toBe(0);
        expect(result2).toBe(0);
      });
    });

    describe('with strings', () => {
      let bst: BST<string>;

      beforeEach(() => {
        bst = new BST<string>();
      });

      it('should handle Unicode characters', () => {
        const result1 = bst['_compare']('😀', 'abc');
        const result2 = bst['_compare']('中文', 'English');
        expect(typeof result1).toBe('number');
        expect(typeof result2).toBe('number');
      });

      it('should handle whitespace strings', () => {
        const result1 = bst['_compare']('  ', ' ');
        const result2 = bst['_compare']('\n', '\t');
        expect(typeof result1).toBe('number');
        expect(typeof result2).toBe('number');
      });

      it('should maintain consistency with multiple comparisons', () => {
        const a = 'apple';
        const b = 'banana';
        const c = 'cherry';

        const ab = bst['_compare'](a, b);
        const bc = bst['_compare'](b, c);
        const ac = bst['_compare'](a, c);

        if (ab < 0 && bc < 0) {
          expect(ac).toBeLessThan(0);
        }
      });
    });
  });

  describe('Comparator with BST Bound Operations', () => {
    let bst: BST<number>;

    beforeEach(() => {
      bst = new BST<number>();
      bst.setMany([10, 5, 15, 3, 7, 12, 18, 1, 4, 6, 8, 11, 13, 16, 20]);
    });

    it('should find ceiling using comparator', () => {
      const result = bst.ceiling(7);
      expect(result).toBe(7);

      const result2 = bst.ceiling(7.5);
      expect(result2).toBeGreaterThanOrEqual(7.5);
    });

    it('should find floor using comparator', () => {
      const result = bst.floor(7);
      expect(result).toBe(7);

      const result2 = bst.floor(7.5);
      expect(result2!).toBeLessThanOrEqual(7.5);
    });

    it('should find higher using comparator', () => {
      const result = bst.higher(7);
      expect(result).toBeGreaterThan(7);
    });

    it('should find lower using comparator', () => {
      const result = bst.lower(7);
      expect(result).toBeLessThan(7);
    });
  });

  describe('Comparator Consistency', () => {
    let bst: BST<number>;

    beforeEach(() => {
      bst = new BST<number>();
    });

    it('should satisfy reflexivity: a compared with itself returns 0', () => {
      const values = [0, 1, -1, 100, -100, 0.5];

      for (const val of values) {
        expect(bst['_compare'](val, val)).toBe(0);
      }
    });

    it('should satisfy antisymmetry: if a > b then b < a', () => {
      const pairs = [
        [5, 3],
        [10, 2],
        [100, 1]
      ];

      for (const [a, b] of pairs) {
        const cmp1 = bst['_compare'](a, b);
        const cmp2 = bst['_compare'](b, a);
        expect(Math.sign(cmp1)).toBe(-Math.sign(cmp2));
      }
    });

    it('should satisfy transitivity: if a < b and b < c then a < c', () => {
      const a = 1;
      const b = 5;
      const c = 10;

      const cmpAB = bst['_compare'](a, b);
      const cmpBC = bst['_compare'](b, c);
      const cmpAC = bst['_compare'](a, c);

      if (cmpAB < 0 && cmpBC < 0) {
        expect(cmpAC).toBeLessThan(0);
      }
    });
  });

  describe('Custom Comparator with BST Operations', () => {
    interface Student {
      name: string;
      grade: number;
    }

    it('should work with custom comparator for complex operations', () => {
      const comparator = (a: Student, b: Student): number => {
        if (a.grade !== b.grade) {
          return a.grade > b.grade ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      };

      const bst = new BST<Student>([], { comparator });

      const students: Student[] = [
        { name: 'Alice', grade: 85 },
        { name: 'Bob', grade: 90 },
        { name: 'Charlie', grade: 85 },
        { name: 'David', grade: 95 }
      ];

      students.forEach(s => bst.set(s));

      expect(bst.size).toBe(4);
      expect(bst.has(students[0])).toBe(true);
    });

    it('should handle custom comparator with add and search', () => {
      const comparator = (a: number[], b: number[]): number => {
        const sumA = a.reduce((acc, val) => acc + val, 0);
        const sumB = b.reduce((acc, val) => acc + val, 0);
        if (sumA > sumB) return 1;
        if (sumA < sumB) return -1;
        return 0;
      };

      const bst = new BST<number[]>([], { comparator });

      bst.set([1, 2, 3]);
      bst.set([2, 2, 2]);
      bst.set([1, 1, 1]);

      expect(bst.size).toBeGreaterThan(0);
    });
  });

  describe('Composite Key Comparator Tests', () => {
    interface CompositeKey {
      departmentId: number;
      employeeId: number;
    }

    it('should compare composite keys by multiple fields - primary then secondary', () => {
      const comparator = (a: CompositeKey, b: CompositeKey): number => {
        if (a.departmentId !== b.departmentId) {
          return a.departmentId > b.departmentId ? 1 : -1;
        }
        if (a.employeeId !== b.employeeId) {
          return a.employeeId > b.employeeId ? 1 : -1;
        }
        return 0;
      };

      const bst = new BST<CompositeKey>([], { comparator });

      const key1 = { departmentId: 1, employeeId: 101 };
      const key2 = { departmentId: 1, employeeId: 102 };
      const key3 = { departmentId: 2, employeeId: 101 };

      expect(bst['_compare'](key1, key2)).toBe(-1);
      expect(bst['_compare'](key2, key3)).toBe(-1);
      expect(bst['_compare'](key1, key1)).toBe(0);
    });

    it('should maintain BST property with composite keys', () => {
      const comparator = (a: CompositeKey, b: CompositeKey): number => {
        if (a.departmentId !== b.departmentId) {
          return a.departmentId > b.departmentId ? 1 : -1;
        }
        return a.employeeId > b.employeeId ? 1 : a.employeeId < b.employeeId ? -1 : 0;
      };

      const bst = new BST<CompositeKey>([], { comparator });

      const keys = [
        { departmentId: 2, employeeId: 105 },
        { departmentId: 1, employeeId: 101 },
        { departmentId: 1, employeeId: 103 },
        { departmentId: 2, employeeId: 102 },
        { departmentId: 1, employeeId: 102 }
      ];

      keys.forEach(k => bst.set(k));

      expect(bst.size).toBe(5);
      const inOrder = bst.dfs(node => node?.key);

      for (let i = 1; i < inOrder.length; i++) {
        const cmp = comparator(inOrder[i - 1]!, inOrder[i]!);
        expect(cmp).toBeLessThanOrEqual(0);
      }
    });

    it('should search with composite keys', () => {
      const comparator = (a: CompositeKey, b: CompositeKey): number => {
        if (a.departmentId !== b.departmentId) {
          return a.departmentId > b.departmentId ? 1 : -1;
        }
        return a.employeeId > b.employeeId ? 1 : a.employeeId < b.employeeId ? -1 : 0;
      };

      const bst = new BST<CompositeKey>([], { comparator });

      const keys = [
        { departmentId: 1, employeeId: 101 },
        { departmentId: 1, employeeId: 103 },
        { departmentId: 2, employeeId: 102 }
      ];

      keys.forEach(k => bst.set(k));

      const searchKey = keys[1];
      const result = bst.search(searchKey);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(searchKey);
    });

    it('should handle deletion with composite keys', () => {
      const comparator = (a: CompositeKey, b: CompositeKey): number => {
        if (a.departmentId !== b.departmentId) {
          return a.departmentId > b.departmentId ? 1 : -1;
        }
        return a.employeeId > b.employeeId ? 1 : a.employeeId < b.employeeId ? -1 : 0;
      };

      const bst = new BST<CompositeKey>([], { comparator });

      const keys = [
        { departmentId: 1, employeeId: 101 },
        { departmentId: 1, employeeId: 103 },
        { departmentId: 2, employeeId: 102 }
      ];

      keys.forEach(k => bst.set(k));

      const keyToDelete = keys[1];
      const deleted = bst.delete(keyToDelete);

      expect(deleted.length).toBeGreaterThan(0);
      expect(bst.has(keyToDelete)).toBe(false);
      expect(bst.size).toBe(2);
    });

    it('should find ceiling/floor with composite keys', () => {
      const comparator = (a: CompositeKey, b: CompositeKey): number => {
        if (a.departmentId !== b.departmentId) {
          return a.departmentId > b.departmentId ? 1 : -1;
        }
        return a.employeeId > b.employeeId ? 1 : a.employeeId < b.employeeId ? -1 : 0;
      };

      const bst = new BST<CompositeKey>([], { comparator });

      const keys = [
        { departmentId: 1, employeeId: 101 },
        { departmentId: 1, employeeId: 105 },
        { departmentId: 2, employeeId: 102 }
      ];

      keys.forEach(k => bst.set(k));

      const searchKey = { departmentId: 1, employeeId: 103 };
      const ceiling = bst.ceiling(searchKey);
      const floor = bst.floor(searchKey);

      expect(ceiling).toBeDefined();
      expect(floor).toBeDefined();
    });
  });

  describe('Key-Value Storage with Comparator', () => {
    interface PersonKey {
      id: number;
      country: string;
    }

    interface PersonValue {
      name: string;
      email: string;
      age: number;
    }

    it('should store and retrieve key-value pairs with composite keys', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const key1: PersonKey = { id: 1, country: 'USA' };
      const value1: PersonValue = { name: 'Alice', email: 'alice@example.com', age: 30 };

      const key2: PersonKey = { id: 2, country: 'Canada' };
      const value2: PersonValue = { name: 'Bob', email: 'bob@example.com', age: 25 };

      bst.set([key1, value1]);
      bst.set([key2, value2]);

      expect(bst.size).toBe(2);
      expect(bst.get(key1)).toEqual(value1);
      expect(bst.get(key2)).toEqual(value2);
    });

    it('should update values when adding duplicate keys', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const key: PersonKey = { id: 1, country: 'USA' };
      const value1: PersonValue = { name: 'Alice', email: 'alice@example.com', age: 30 };
      const value2: PersonValue = { name: 'Alice Updated', email: 'alice.new@example.com', age: 31 };

      bst.set([key, value1]);
      expect(bst.get(key)).toEqual(value1);

      bst.set([key, value2]);
      expect(bst.size).toBe(1);
      expect(bst.get(key)).toEqual(value2);
    });

    it('should retrieve all entries in sorted order by key', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const entries: Array<[PersonKey, PersonValue]> = [
        [
          { id: 1, country: 'USA' },
          { name: 'Alice', email: 'alice@usa.com', age: 30 }
        ],
        [
          { id: 2, country: 'Canada' },
          { name: 'Bob', email: 'bob@ca.com', age: 25 }
        ],
        [
          { id: 1, country: 'Canada' },
          { name: 'Charlie', email: 'charlie@ca.com', age: 28 }
        ]
      ];

      entries.forEach(([key, value]) => bst.set([key, value]));

      expect(bst.size).toBe(3);

      const values: (PersonValue | undefined)[] = [];
      for (const [key] of entries) {
        const value = bst.get(key);
        if (value) values.push(value);
      }

      expect(values.length).toBeGreaterThan(0);
    });

    it('should delete key-value pairs correctly', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const key1: PersonKey = { id: 1, country: 'USA' };
      const value1: PersonValue = { name: 'Alice', email: 'alice@example.com', age: 30 };

      const key2: PersonKey = { id: 2, country: 'Canada' };
      const value2: PersonValue = { name: 'Bob', email: 'bob@example.com', age: 25 };

      bst.set([key1, value1]);
      bst.set([key2, value2]);

      bst.delete(key1);

      expect(bst.has(key1)).toBe(false);
      expect(bst.has(key2)).toBe(true);
      expect(bst.size).toBe(1);
      expect(bst.get(key1)).toBeUndefined();
    });

    it('should search and retrieve values with composite keys', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const entries: Array<[PersonKey, PersonValue]> = [
        [
          { id: 1, country: 'USA' },
          { name: 'Alice', email: 'alice@usa.com', age: 30 }
        ],
        [
          { id: 2, country: 'USA' },
          { name: 'Amy', email: 'amy@usa.com', age: 28 }
        ],
        [
          { id: 1, country: 'Canada' },
          { name: 'Bob', email: 'bob@ca.com', age: 25 }
        ]
      ];

      entries.forEach(([key, value]) => bst.set([key, value]));

      const searchKey: PersonKey = entries[1][0];
      const value = bst.get(searchKey);

      expect(value).toEqual({ name: 'Amy', email: 'amy@usa.com', age: 28 });
    });

    it('should map over key-value pairs maintaining comparator order', () => {
      const comparator = (a: PersonKey, b: PersonKey): number => {
        const countryCompare = a.country.localeCompare(b.country);
        if (countryCompare !== 0) return countryCompare;
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      const bst = new BST<PersonKey, PersonValue>([], { comparator, isMapMode: true });

      const entries: Array<[PersonKey, PersonValue]> = [
        [
          { id: 1, country: 'USA' },
          { name: 'Alice', email: 'alice@usa.com', age: 30 }
        ],
        [
          { id: 2, country: 'Canada' },
          { name: 'Bob', email: 'bob@ca.com', age: 25 }
        ]
      ];

      entries.forEach(([key, value]) => bst.set([key, value]));

      const mapped = bst.map((value, key) => [key, value?.name], { comparator, isMapMode: false });

      expect(mapped.size).toBe(2);
      const names = Array.from(mapped.values());
      expect(names).toContain('Alice');
      expect(names).toContain('Bob');
    });

    it('should perform range search on key-value pairs', () => {
      const comparator = (a: number, b: number): number => {
        return a > b ? 1 : a < b ? -1 : 0;
      };

      const bst = new BST<number, string>([], { comparator, isMapMode: true });

      for (let i = 1; i <= 10; i++) {
        bst.set([i, `value-${i}`]);
      }

      const result = bst.rangeSearch([3, 7]);

      expect(result.length).toBeGreaterThan(0);
      result.forEach(key => {
        expect(key).toBeGreaterThanOrEqual(3);
        expect(key).toBeLessThanOrEqual(7);
      });
    });

    it('should maintain sorted iteration over key-value pairs', () => {
      const comparator = (a: { priority: number; id: number }, b: { priority: number; id: number }): number => {
        if (a.priority !== b.priority) {
          return a.priority > b.priority ? 1 : -1;
        }
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      };

      type TaskKey = { priority: number; id: number };
      type TaskValue = { title: string; completed: boolean };

      const bst = new BST<TaskKey, TaskValue>([], { comparator, isMapMode: true });

      const tasks: Array<[TaskKey, TaskValue]> = [
        [
          { priority: 2, id: 1 },
          { title: 'Task 1', completed: false }
        ],
        [
          { priority: 1, id: 2 },
          { title: 'Task 2', completed: false }
        ],
        [
          { priority: 3, id: 3 },
          { title: 'Task 3', completed: true }
        ],
        [
          { priority: 1, id: 1 },
          { title: 'Task 4', completed: false }
        ]
      ];

      tasks.forEach(([key, value]) => bst.set([key, value]));

      expect(bst.size).toBe(4);

      const inOrder = bst.dfs(node => node?.key.priority);
      for (let i = 1; i < inOrder.length; i++) {
        expect(inOrder[i]! >= inOrder[i - 1]!).toBe(true);
      }
    });
  });
});

describe('classic use', () => {
  it('@example basic BST creation and add operation', () => {
    // Create a simple BST with numeric keys
    const bst = new BST<number>([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    bst.print();
    //         _______8__________
    //        /                  \
    //     ___4___          ____12_____
    //    /       \        /           \
    //   _2_     _6_     _10__       _14__
    //  /   \   /   \   /     \     /     \
    //  1   3   5   7   9    11    13    15__
    //                                       \
    //                                      16

    // Verify size
    expect(bst.size).toBe(16);

    // Add new elements
    bst.set(17);
    bst.set(0);
    expect(bst.size).toBe(18);

    // Verify keys are searchable
    expect(bst.has(11)).toBe(true);
    expect(bst.has(100)).toBe(false);
  });

  it('@example BST delete and search after deletion', () => {
    const bst = new BST<number>([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    // Delete a leaf node
    bst.delete(1);
    expect(bst.has(1)).toBe(false);

    // Delete a node with one child
    bst.delete(2);
    expect(bst.has(2)).toBe(false);

    // Delete a node with two children
    bst.delete(3);
    expect(bst.has(3)).toBe(false);

    // Size decreases with each deletion
    expect(bst.size).toBe(13);

    // Other nodes remain searchable
    expect(bst.has(11)).toBe(true);
    expect(bst.has(15)).toBe(true);
  });

  it('@example Merge 3 sorted datasets', () => {
    const dataset1 = new BST<number, string>([
      [1, 'A'],
      [7, 'G']
    ]);
    const dataset2 = [
      [2, 'B'],
      [6, 'F']
    ];
    const dataset3 = new BST<number, string>([
      [3, 'C'],
      [5, 'E'],
      [4, 'D']
    ]);

    // Merge datasets into a single BinarySearchTree
    const merged = new BST<number, string>(dataset1);
    merged.setMany(dataset2);
    merged.merge(dataset3);

    // Verify merged dataset is in sorted order
    expect([...merged.values()]).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it('@example BST with custom objects for expression evaluation', () => {
    interface Expression {
      id: number;
      operator: string;
      precedence: number;
    }

    // BST efficiently stores and retrieves operators by precedence
    const operatorTree = new BST<number, Expression>(
      [
        [1, { id: 1, operator: '+', precedence: 1 }],
        [2, { id: 2, operator: '*', precedence: 2 }],
        [3, { id: 3, operator: '/', precedence: 2 }],
        [4, { id: 4, operator: '-', precedence: 1 }],
        [5, { id: 5, operator: '^', precedence: 3 }]
      ],
      { isMapMode: false }
    );

    expect(operatorTree.size).toBe(5);

    // Quick lookup of operators
    const mult = operatorTree.get(2);
    expect(mult?.operator).toBe('*');
    expect(mult?.precedence).toBe(2);

    // Check if operator exists
    expect(operatorTree.has(5)).toBe(true);
    expect(operatorTree.has(99)).toBe(false);

    // Retrieve operator by precedence level
    const expNode = operatorTree.getNode(3);
    expect(expNode?.key).toBe(3);
    expect(expNode?.value?.precedence).toBe(2);

    // Delete operator and verify
    operatorTree.delete(1);
    expect(operatorTree.has(1)).toBe(false);
    expect(operatorTree.size).toBe(4);

    // Get tree height for optimization analysis
    const treeHeight = operatorTree.getHeight();
    expect(treeHeight).toBeGreaterThan(0);

    // Remaining operators are still accessible
    const remaining = operatorTree.get(2);
    expect(remaining).toBeDefined();
  });

  // Test case for Lowest Common Ancestor (LCA)
  it('@example Find lowest common ancestor', () => {
    const bst = new BST<number>([20, 10, 30, 5, 15, 25, 35, 3, 7, 12, 18]);

    // LCA helper function
    const findLCA = (num1: number, num2: number): number | undefined => {
      const path1 = bst.getPathToRoot(num1);
      const path2 = bst.getPathToRoot(num2);
      // Find the first common ancestor
      return findFirstCommon(path1, path2);
    };

    function findFirstCommon(arr1: (number | undefined)[], arr2: (number | undefined)[]): number | undefined {
      for (const num of arr1) {
        if (arr2.indexOf(num) !== -1) {
          return num;
        }
      }
      return undefined;
    }

    // Assertions
    expect(findLCA(3, 10)).toBe(7);
    expect(findLCA(5, 35)).toBe(15);
    expect(findLCA(20, 30)).toBe(25);
  });

  // Test case for finding elements in a given range
  it('Find elements in a range', () => {
    const bst = new BST<number>([10, 5, 15, 3, 7, 12, 18]);
    expect(bst.search(new Range(5, 10))).toEqual([5, 7, 10]);
    expect(bst.rangeSearch([4, 12], node => node.key.toString())).toEqual(['5', '7', '10', '12']);
    expect(bst.search(new Range(4, 12, true, false))).toEqual([5, 7, 10]);
    expect(bst.rangeSearch([15, 20])).toEqual([15, 18]);
    expect(bst.search(new Range(15, 20, false))).toEqual([18]);
  });

  it('BST get and getNode operations', () => {
    const bst = new BST<number>([5, 3, 7, 1, 4, 6, 8]);

    // Get value by key
    const value = bst.get(5);
    expect(value).toBe(undefined);

    // Get node returns the actual node object
    const node = bst.getNode(3);
    expect(node?.key).toBe(3);
    expect(node?.left).toBeDefined();
    expect(node?.right).toBeDefined();

    // Get from non-existent key returns undefined
    expect(bst.get(100)).toBeUndefined();
    expect(bst.getNode(100)).toBeUndefined();
  });

  it('BST getHeight and tree structure queries', () => {
    const bst = new BST<number>([11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5]);

    // Get overall tree height
    const treeHeight = bst.getHeight();
    expect(typeof treeHeight).toBe('number');
    expect(treeHeight).toBeGreaterThan(0);

    // Get height of specific node
    const heightOf3 = bst.getHeight(3);
    expect(typeof heightOf3).toBe('number');

    // Root node should have the maximum height
    const heightOf11 = bst.getHeight(11);
    expect(heightOf11).toBe(0);

    // Leaf nodes have height 0
    const heightOf2 = bst.getHeight(2);
    expect(heightOf2).toBe(1);
  });
});
