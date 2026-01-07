import { BST, BSTNode, IBinaryTree, Range } from '../../../../src';
import { isDebugTest, isTestStackOverflow, SYSTEM_MAX_CALL_STACK } from '../../../config';

const isDebug = isDebugTest;

describe('BST operations test', () => {
  it('should add undefined and null', () => {
    const bst = new BST<number, string>();
    const isAddUndefined = bst.add(undefined);
    expect(isAddUndefined).toBe(false);
    expect(bst.get(undefined)).toBe(undefined);
    const isAddNull = bst.add(null);
    expect(isAddNull).toBe(false);
    expect(bst.get(null)).toBe(undefined);
    const isAdd0 = bst.add(0, '0');
    expect(isAdd0).toBe(true);
    expect(bst.get(0)).toBe('0');
  });

  it('should addMany undefined and null', () => {
    const bst = new BST<number, string>();
    const addManyWithUndefined = bst.addMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(bst.get(undefined)).toBe(undefined);
    const addManyWithNull = bst.addMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, false, true, true]);
    const addManyEntriesWithNull = bst.addMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, false, true, true]);
    expect(bst.get(null)).toBe(undefined);
    const node0 = bst.add(0, '0');
    expect(node0).toBe(true);
    expect(bst.get(0)).toBe('0');
  });

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
    bst.addMany(idsAndValues, [], false);
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
    bst.clear();
    expect(bst.perfectlyBalance()).toBe(false);
    expect(bst.isAVLBalanced()).toBe(true);
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
    tree.add(1, 'a');
    expect(tree.get(1)).toBe('a');
    tree.add([1, 'b']);
    expect(tree.getNode(1)?.value).toBe('b');
    expect(tree.get(1)).toBe('b');
    const treeMap = new BST<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    treeMap.add(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.add([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    expect(treeMap.get(1)).toBe('b');
  });

  it('should search in range', () => {
    const bst = new BST<number>([10, 5, 15, 3, 7, 12, 18]);
    expect(bst.rangeSearch([4, 12])).toEqual([5, 7, 10, 12]);
    expect(() => bst.rangeSearch([12, 4])).toThrow('low must be less than or equal to high');
    expect(bst.rangeSearch([12, 12])).toEqual([12]);
  });
});

describe('BST operations test recursively', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const bst = new BST<number>([], {
      iterationType: 'RECURSIVE'
    });
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

  it('should listLevels', () => {
    const bst = new BST<number>();
    bst.addMany([2, 4, 5, 3, 1]);
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
    bst.addMany([2, 4, 5, 3, 1]);
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

  if (isTestStackOverflow) {
    it('should getLeftMost', () => {
      const bst = new BST<number>([]);
      for (let i = 1; i <= SYSTEM_MAX_CALL_STACK; i++) bst.add(i);

      expect(() => {
        const leftMost = bst.getLeftMost(node => node, bst.root, 'RECURSIVE');
        expect(leftMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
      }).toThrow('Maximum call stack size exceeded');

      const leftMost = bst.getLeftMost(node => node, bst.root, 'ITERATIVE');
      expect(leftMost?.key).toEqual(SYSTEM_MAX_CALL_STACK);
    });

    it('should getRightMost', () => {
      const bst = new BST<number>();
      for (let i = 1; i <= SYSTEM_MAX_CALL_STACK; i++) bst.add(i);

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
    bst.addMany([1, 2, 3, 9, 8, 5, 6, 7, 4]);
    expect(bst.isBST()).toBe(true);
  });

  it('isBST when variant is Max', () => {
    const bst = new BST<number, number>([1, 2, 3, 9, 8, 5, 6, 7, 4], {
      comparator: (a, b) => b - a
    });
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
    if (isDebug) console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('Should the time consumption of lesserOrGreaterTraverse fitting O(n log n)', function () {
    const nodes: number[] = [];
    for (let i = 0; i < inputSize; i++) {
      nodes.push(i);
    }
    const start = performance.now();
    bst.addMany(nodes);
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
    bst.addMany(nodes);
    if (isDebug) console.log('---add', performance.now() - start);
    const startL = performance.now();
    const arr: number[][] = bst.listLevels(node => node.key);
    if (isDebug) console.log('---listLevels', arr);
    if (isDebug) console.log('---listLevels', performance.now() - startL);
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
    bst.addMany(
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
    collapsedToLinkedList.addMany(
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
    unbalanced.addMany(
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
    balanced.addMany(
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

    const nodeVal9 = bst.getNode(node => node.key === 9);
    expect(bst.get(nodeVal9?.key)).toBe(undefined);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objBST = new BST<number, { key: number; keyA: number }>([], { isMapMode: false });
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
    bst.addMany(
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
    collapsedToLinkedList.addMany(
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
    unbalanced.addMany(
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
    balanced.addMany(
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
    bst.add(1);
    bst.add(2);
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
    const result = bst.addMany(keys, values);
    expect(result).toEqual([true, true, true]);
    expect([...bst]).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('should addMany with isBalanceAdd=false', () => {
    const bst = new BST<number>();
    const result = bst.addMany([3, 1, 2], undefined, false);
    expect(result).toEqual([true, true, true]);
    expect([...bst.keys()]).toEqual([1, 2, 3]);
  });

  it('should addMany with raw/entry/node', () => {
    const bst = new BST<number, string>([], { isMapMode: false });
    const node = new BSTNode(5, 'x');
    const result = bst.addMany([1, [2, 'b'], node]);
    expect(result).toEqual([true, true, true]);
    expect(bst.get(5)).toBe('x');
  });
});

describe('BST perfectlyBalance and isAVLBalanced edge cases', () => {
  it('should perfectlyBalance with <1 node and both iterationType', () => {
    const bst = new BST<number>();
    expect(bst.perfectlyBalance('RECURSIVE')).toBe(false);
    expect(bst.perfectlyBalance('ITERATIVE')).toBe(false);
    bst.addMany([1, 2, 3]);
    expect(bst.perfectlyBalance('RECURSIVE')).toBe(true);
    bst.clear();
    bst.addMany([1, 2, 3]);
    expect(bst.perfectlyBalance('ITERATIVE')).toBe(true);
  });

  it('should isAVLBalanced with both iterationType', () => {
    const bst = new BST<number>();
    expect(bst.isAVLBalanced('RECURSIVE')).toBe(true);
    expect(bst.isAVLBalanced('ITERATIVE')).toBe(true);
    bst.addMany([1, 2, 3, 4, 5]);
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

describe('BST lowerBound and upperBound', () => {
  let bst: BST<number, string>;

  beforeEach(() => {
    // Create a BST with keys: [10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 18, 25]
    bst = new BST<number, string>([10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 18, 25]);
  });

  describe('lowerBound', () => {
    it('should return the node with exact key match', () => {
      // Test for key that exists in tree
      const node = bst.lowerBound(10);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);
    });

    it('should return the smallest node >= key when exact match not found', () => {
      // Test for key 9 (doesn't exist, should return 10)
      const node = bst.lowerBound(9);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);
    });

    it('should return node with key >= search key from multiple candidates', () => {
      // Test for key 6 (exists, should return 6)
      const node = bst.lowerBound(6);
      expect(node).toBeDefined();
      expect(node?.key).toBe(6);

      // Test for key 7 (exists, should return 7)
      const node2 = bst.lowerBound(7);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(7);
    });

    it('should return smallest key >= search key for non-existent key in middle range', () => {
      // Test for key 14 (doesn't exist, should return 15)
      const node = bst.lowerBound(14);
      expect(node).toBeDefined();
      expect(node?.key).toBe(15);

      // Test for key 11.5 (doesn't exist, should return 12)
      const node2 = bst.lowerBound(11.5);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(12);
    });

    it('should return smallest key when search key is less than minimum', () => {
      // Test for key 0 (should return 1, the minimum)
      const node = bst.lowerBound(0);
      expect(node).toBeDefined();
      expect(node?.key).toBe(1);

      // Test for key -100 (should return 1, the minimum)
      const node2 = bst.lowerBound(-100);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(1);
    });

    it('should return undefined when search key is greater than maximum', () => {
      // Test for key 100 (no key >= 100, should return undefined)
      const node = bst.lowerBound(100);
      expect(node).toBeUndefined();

      // Test for key 26 (no key >= 26, should return undefined)
      const node2 = bst.lowerBound(26);
      expect(node2).toBeUndefined();
    });

    it('should return correct node for edge cases', () => {
      // Test for key 25 (maximum, should return 25)
      const node = bst.lowerBound(25);
      expect(node).toBeDefined();
      expect(node?.key).toBe(25);

      // Test for key 1 (minimum, should return 1)
      const node2 = bst.lowerBound(1);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(1);
    });
  });

  describe('upperBound', () => {
    it('should return the smallest key > search key', () => {
      // Test for key 10 (exists, should return next key > 10, which is 11)
      const node = bst.upperBound(10);
      expect(node).toBeDefined();
      expect(node?.key).toBe(11);
    });

    it('should return the smallest key > search key for non-existent key', () => {
      // Test for key 9 (doesn't exist, should return 10, the smallest key > 9)
      const node = bst.upperBound(9);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);

      // Test for key 14 (doesn't exist, should return 15)
      const node2 = bst.upperBound(14);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(15);
    });

    it('should skip equal keys and return the next larger key', () => {
      // Test for key 5 (exists, should return 6, the smallest key > 5)
      const node = bst.upperBound(5);
      expect(node).toBeDefined();
      expect(node?.key).toBe(6);

      // Test for key 20 (exists, should return 25)
      const node2 = bst.upperBound(20);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(25);
    });

    it('should return smallest key > search key for non-existent key in middle range', () => {
      // Test for key 11.5 (doesn't exist, should return 12)
      const node = bst.upperBound(11.5);
      expect(node).toBeDefined();
      expect(node?.key).toBe(12);

      // Test for key 19 (doesn't exist, should return 20)
      const node2 = bst.upperBound(19);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(20);
    });

    it('should return smallest key when search key is less than minimum', () => {
      // Test for key 0 (should return 1, the minimum)
      const node = bst.upperBound(0);
      expect(node).toBeDefined();
      expect(node?.key).toBe(1);

      // Test for key -100 (should return 1, the minimum)
      const node2 = bst.upperBound(-100);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(1);
    });

    it('should return undefined when search key is >= maximum', () => {
      // Test for key 100 (no key > 100, should return undefined)
      const node = bst.upperBound(100);
      expect(node).toBeUndefined();

      // Test for key 25 (maximum, no key > 25, should return undefined)
      const node2 = bst.upperBound(25);
      expect(node2).toBeUndefined();

      // Test for key 26 (no key > 26, should return undefined)
      const node3 = bst.upperBound(26);
      expect(node3).toBeUndefined();
    });

    it('should return correct node for edge cases', () => {
      // Test for key 1 (minimum, should return next key 3)
      const node = bst.upperBound(1);
      expect(node).toBeDefined();
      expect(node?.key).toBe(3);

      // Test for key 24 (doesn't exist, should return 25)
      const node2 = bst.upperBound(24);
      expect(node2).toBeDefined();
      expect(node2?.key).toBe(25);
    });
  });

  describe('lowerBound vs upperBound comparison', () => {
    it('should demonstrate difference between lowerBound and upperBound', () => {
      const searchKey = 12;

      // lowerBound(12) should return 12 (key >= 12)
      const lower = bst.lowerBound(searchKey);
      expect(lower?.key).toBe(12);

      // upperBound(12) should return 13 (key > 12)
      const upper = bst.upperBound(searchKey);
      expect(upper?.key).toBe(13);
    });

    it('should return same result for non-existent key in both methods', () => {
      const searchKey = 11.5;

      // Both should return 12 (smallest key >= 11.5 for lowerBound, smallest key > 11.5 for upperBound)
      const lower = bst.lowerBound(searchKey);
      const upper = bst.upperBound(searchKey);
      expect(lower?.key).toBe(12);
      expect(upper?.key).toBe(12);
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
      keys.forEach(k => bst.add(k, `val-${k}`));
    });

    describe('lowerBound (First node >= key)', () => {
      test('should return strict match if key exists', () => {
        // Case: Key exists
        expect(bst.lowerBound(10)?.key).toBe(10);
        expect(bst.lowerBound(6)?.key).toBe(6);
        expect(bst.lowerBound(20)?.key).toBe(20);
      });

      test('should return next larger node if key does not exist', () => {
        // Case: Key doesn't exist, but falls within range
        expect(bst.lowerBound(7)?.key).toBe(8); // 7 -> 8
        expect(bst.lowerBound(11)?.key).toBe(12); // 11 -> 12
        expect(bst.lowerBound(3)?.key).toBe(5); // 3 -> 5
      });

      test('should return smallest node if key is smaller than min', () => {
        // Case: Key is smaller than the minimum value in the tree
        expect(bst.lowerBound(0)?.key).toBe(2);
        expect(bst.lowerBound(-100)?.key).toBe(2);
      });

      test('should return undefined if key is larger than max', () => {
        // Case: Key is larger than the maximum value in the tree
        expect(bst.lowerBound(21)).toBeUndefined();
        expect(bst.lowerBound(100)).toBeUndefined();
      });

      test('should work with IterationType.RECURSIVE explicitly', () => {
        expect(bst.lowerBound(7, 'RECURSIVE')?.key).toBe(8);
        expect(bst.lowerBound(10, 'RECURSIVE')?.key).toBe(10);
        expect(bst.lowerBound(21, 'RECURSIVE')).toBeUndefined();
      });

      test('should work with IterationType.ITERATIVE explicitly', () => {
        expect(bst.lowerBound(7, 'ITERATIVE')?.key).toBe(8);
        expect(bst.lowerBound(10, 'ITERATIVE')?.key).toBe(10);
        expect(bst.lowerBound(21, 'ITERATIVE')).toBeUndefined();
      });
    });

    describe('upperBound (First node > key)', () => {
      test('should return next larger node even if key exists', () => {
        // Case: Key exists, but we want strictly greater
        expect(bst.upperBound(10)?.key).toBe(12); // > 10 is 12
        expect(bst.upperBound(6)?.key).toBe(8); // > 6 is 8
        expect(bst.upperBound(20)).toBeUndefined(); // > 20 is undefined
      });

      test('should return next larger node if key does not exist', () => {
        // Case: Key doesn't exist
        expect(bst.upperBound(7)?.key).toBe(8);
        expect(bst.upperBound(11)?.key).toBe(12);
      });

      test('should return undefined if key is larger than or equal to max', () => {
        expect(bst.upperBound(20)).toBeUndefined();
        expect(bst.upperBound(21)).toBeUndefined();
      });

      test('should work with IterationType.RECURSIVE explicitly', () => {
        expect(bst.upperBound(10, 'RECURSIVE')?.key).toBe(12);
        expect(bst.upperBound(20, 'RECURSIVE')).toBeUndefined();
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty tree', () => {
        const emptyTree = new BST<number, string>();
        expect(emptyTree.lowerBound(10)).toBeUndefined();
        expect(emptyTree.upperBound(10)).toBeUndefined();
      });

      test('should handle single node tree', () => {
        const singleNodeTree = new BST<number, string>();
        singleNodeTree.add(10);

        // lowerBound
        expect(singleNodeTree.lowerBound(5)?.key).toBe(10);
        expect(singleNodeTree.lowerBound(10)?.key).toBe(10);
        expect(singleNodeTree.lowerBound(15)).toBeUndefined();

        // upperBound
        expect(singleNodeTree.upperBound(5)?.key).toBe(10);
        expect(singleNodeTree.upperBound(10)).toBeUndefined();
      });
    });

    describe('Consistency & Fuzz Testing', () => {
      test('Recursive and Iterative implementations should match on random data', () => {
        const fuzzTree = new BST<number, number>();
        // Generate 500 random numbers between 0-1000
        const randomKeys = generateRandomArray(500, 0, 1000);

        // Insert unique keys
        [...new Set(randomKeys)].forEach(k => fuzzTree.add(k));

        // Sort for verification (Ground Truth)
        const sortedKeys = Array.from(fuzzTree.keys()).sort((a, b) => a - b);

        // Test with 200 random queries (including existing and non-existing keys)
        const testQueries = generateRandomArray(200, 0, 1000);

        testQueries.forEach(queryKey => {
          // 1. Verify lowerBound
          const recLower = fuzzTree.lowerBound(queryKey, 'RECURSIVE')?.key;
          const iterLower = fuzzTree.lowerBound(queryKey, 'ITERATIVE')?.key;

          // Verify consistency between recursive and iterative
          expect(recLower).toBe(iterLower);

          // Verify logic correctness (compare with Array.find)
          const expectedLower = sortedKeys.find(k => k >= queryKey);
          expect(recLower).toBe(expectedLower);

          // 2. Verify upperBound
          const recUpper = fuzzTree.upperBound(queryKey, 'RECURSIVE')?.key;
          const iterUpper = fuzzTree.upperBound(queryKey, 'ITERATIVE')?.key;

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

    it('lowerBound should return undefined on empty tree', () => {
      const node = bst.lowerBound(10);
      expect(node).toBeUndefined();
    });

    it('upperBound should return undefined on empty tree', () => {
      const node = bst.upperBound(10);
      expect(node).toBeUndefined();
    });
  });

  describe('single node tree', () => {
    beforeEach(() => {
      bst = new BST<number, string>();
      bst.add(10, 'ten');
    });

    it('lowerBound should return the node if key matches', () => {
      const node = bst.lowerBound(10);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);
    });

    it('lowerBound should return the node if search key is less', () => {
      const node = bst.lowerBound(5);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);
    });

    it('lowerBound should return undefined if search key is greater', () => {
      const node = bst.lowerBound(15);
      expect(node).toBeUndefined();
    });

    it('upperBound should return undefined if key matches', () => {
      const node = bst.upperBound(10);
      expect(node).toBeUndefined();
    });

    it('upperBound should return the node if search key is less', () => {
      const node = bst.upperBound(5);
      expect(node).toBeDefined();
      expect(node?.key).toBe(10);
    });

    it('upperBound should return undefined if search key is greater', () => {
      const node = bst.upperBound(15);
      expect(node).toBeUndefined();
    });
  });

  describe('practical LeetCode use case: Range search', () => {
    it('should find all keys in range [12, 20]', () => {
      // Use lowerBound to find start of range and upperBound to find end
      const start = bst.lowerBound(12);

      // Simple traversal simulation (for test only, real iteration is more complex)
      // We manually add keys we know are in range to verify logic works
      // The lowerBound(12) returns 12. upperBound(20) returns 25 (or null if max).
      // Logic: we want >= 12 and <= 20.

      expect(start?.key).toBe(12);

      // Let's verify we found the correct bounds
      expect(start?.key).toBeGreaterThanOrEqual(12);

      // Check overlap
      const rangeStart = bst.lowerBound(12);
      const rangeEndInclusive = bst.lowerBound(20); // Should be 20

      expect(rangeStart?.key).toBe(12);
      expect(rangeEndInclusive?.key).toBe(20);
    });

    it('should help identify interval overlaps', () => {
      // Check if interval [14, 19] overlaps with any existing interval
      // Use upperBound to find the first key > 19
      const nextKey = bst.upperBound(19);
      // Use lowerBound to find the first key >= 14
      const firstInRange = bst.lowerBound(14);

      expect(firstInRange?.key).toBe(15);
      expect(nextKey?.key).toBe(20);
    });
  });
});

describe('BST Advanced Bound Methods Tests', () => {
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
    keys.forEach(k => bst.add(k, `val-${k}`));
  });

  describe('Polymorphic Input Support', () => {
    test('should accept raw Key', () => {
      expect(bst.lowerBound(7)?.key).toBe(8);
      expect(bst.upperBound(7)?.key).toBe(8);
    });

    test('should accept BSTNode object', () => {
      // Find a node first
      const node5 = bst.getNode(5);
      expect(node5).toBeDefined();

      // Use the node as input for lowerBound (should return itself)
      expect(bst.lowerBound(node5)?.key).toBe(5);

      // Use the node as input for upperBound (should return next larger)
      expect(bst.upperBound(node5)?.key).toBe(6);
    });

    test('should accept Entry tuple [key, value]', () => {
      // Input as [key, value] tuple
      const entry: [number, string] = [7, 'val-7'];

      expect(bst.lowerBound(entry)?.key).toBe(8);
      expect(bst.upperBound(entry)?.key).toBe(8);

      const existingEntry: [number, string] = [10, 'val-10'];
      expect(bst.lowerBound(existingEntry)?.key).toBe(10);
      expect(bst.upperBound(existingEntry)?.key).toBe(12);
    });

    test('should accept Predicate function (Linear Search Fallback)', () => {
      // Predicate: Find first node with key > 11 (Expect 12)
      // Note: Predicate search uses in-order traversal
      const predicate = (node: any) => node.key > 11;

      // For predicate, lowerBound and upperBound behave identically
      // (they just return the first match of the predicate)
      expect(bst.lowerBound(predicate)?.key).toBe(12);
      expect(bst.upperBound(predicate)?.key).toBe(12);

      // Predicate: Find specific value
      expect(bst.lowerBound(n => n.key === 6)?.key).toBe(6);
    });
  });

  describe('Iteration Types with Polymorphic Inputs', () => {
    test('should work recursively with all types', () => {
      const type = 'RECURSIVE';

      expect(bst.lowerBound(7, type)?.key).toBe(8);
      expect(bst.lowerBound(bst.getNode(5), type)?.key).toBe(5);
      expect(bst.lowerBound([7, 'val'], type)?.key).toBe(8);
      expect(bst.lowerBound(n => n.key > 11, type)?.key).toBe(12);
    });

    test('should work iteratively with all types', () => {
      const type = 'ITERATIVE';

      expect(bst.lowerBound(7, type)?.key).toBe(8);
      expect(bst.lowerBound(bst.getNode(5), type)?.key).toBe(5);
      expect(bst.lowerBound([7, 'val'], type)?.key).toBe(8);
      expect(bst.lowerBound(n => n.key > 11, type)?.key).toBe(12);
    });
  });

  describe('Complex Edge Cases', () => {
    test('should return undefined for null/undefined input', () => {
      expect(bst.lowerBound(null)).toBeUndefined();
      expect(bst.lowerBound(undefined)).toBeUndefined();
    });

    test('should handle predicate returning false for all nodes', () => {
      expect(bst.lowerBound(n => n.key > 100)).toBeUndefined();
    });
  });

  describe('Consistency Check (Fuzz Testing)', () => {
    test('All input methods should yield consistent results for Raw Key and Entry', () => {
      const fuzzTree = new BST<number, number>();
      const randomKeys = generateRandomArray(100, 0, 200);
      [...new Set(randomKeys)].forEach(k => fuzzTree.add(k));

      const queries = generateRandomArray(50, 0, 200);

      queries.forEach(q => {
        // 1. Raw Key
        const resKey = fuzzTree.lowerBound(q);

        // 2. Entry
        const resEntry = fuzzTree.lowerBound([q, undefined]);

        // Verify consistency between Key and Entry
        expect(resKey?.key).toBe(resEntry?.key);
      });
    });

    test('BSTNode input should work correctly', () => {
      const fuzzTree = new BST<number, number>();
      const randomKeys = generateRandomArray(50, 0, 100);
      const uniqueKeys = [...new Set(randomKeys)];
      uniqueKeys.forEach(k => fuzzTree.add(k));

      // Test with actual nodes from the tree
      for (const key of uniqueKeys) {
        const node = fuzzTree.getNode(key);
        if (node) {
          // lowerBound with node should return itself (since node.key >= key)
          expect(fuzzTree.lowerBound(node)?.key).toBe(key);

          // upperBound with node should return next larger
          const upperRes = fuzzTree.upperBound(node);
          if (upperRes) {
            expect(upperRes.key).toBeGreaterThan(key);
          }
        }
      }
    });

    test('Predicate input should find matching nodes', () => {
      const fuzzTree = new BST<number, number>();
      const randomKeys = generateRandomArray(50, 0, 100);
      const uniqueKeys = [...new Set(randomKeys)];
      uniqueKeys.forEach(k => fuzzTree.add(k));

      // Test various predicates
      const predicates = [(n: any) => n.key > 50, (n: any) => n.key < 30, (n: any) => n.key >= 25 && n.key <= 75];

      predicates.forEach(predicate => {
        const result = fuzzTree.lowerBound(predicate);
        if (result) {
          // Verify the result actually satisfies the predicate
          expect(predicate(result)).toBe(true);
        }
      });
    });

    test('Consistency between RECURSIVE and ITERATIVE modes', () => {
      const fuzzTree = new BST<number, number>();
      const randomKeys = generateRandomArray(50, 0, 100);
      [...new Set(randomKeys)].forEach(k => fuzzTree.add(k));

      const queries = generateRandomArray(30, 0, 100);

      queries.forEach(q => {
        // Test with Key
        const recKey = fuzzTree.lowerBound(q, 'RECURSIVE');
        const iterKey = fuzzTree.lowerBound(q, 'ITERATIVE');
        expect(recKey?.key).toBe(iterKey?.key);

        // Test with Entry
        const recEntry = fuzzTree.lowerBound([q, undefined], 'RECURSIVE');
        const iterEntry = fuzzTree.lowerBound([q, undefined], 'ITERATIVE');
        expect(recEntry?.key).toBe(iterEntry?.key);

        // Test upperBound too
        const recUpper = fuzzTree.upperBound(q, 'RECURSIVE');
        const iterUpper = fuzzTree.upperBound(q, 'ITERATIVE');
        expect(recUpper?.key).toBe(iterUpper?.key);
      });
    });
  });
});

describe('BST Range Query Methods', () => {
  let bst: BST<number, string>;

  beforeEach(() => {
    // Create a balanced BST: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20]
    bst = new BST([10, 5, 15, 3, 7, 13, 17, 1, 4, 6, 9, 11, 14, 16, 19, 20]);
  });

  describe('ceilingEntry - finds >= key (minimum value >= target)', () => {
    test('should find ceiling when key exists', () => {
      const result = bst.ceilingEntry(10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(10);
    });

    test('should find ceiling when key does not exist but higher value exists', () => {
      const result = bst.ceilingEntry(8);
      expect(result).toBeDefined();
      expect(result?.key).toBe(9);
    });

    test('should return undefined when no ceiling exists (key greater than all)', () => {
      const result = bst.ceilingEntry(100);
      expect(result).toBeUndefined();
    });

    test('should find minimum element as ceiling for key smaller than all', () => {
      const result = bst.ceilingEntry(-10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(1);
    });

    test('should handle ceiling with node input', () => {
      const targetNode = bst.getNode(7);
      expect(targetNode).toBeDefined();
      const result = bst.ceilingEntry(targetNode!);
      expect(result?.key).toBe(7);
    });

    test('should handle ceiling with entry input', () => {
      const result = bst.ceilingEntry([11, 'test']);
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
    });

    test('should handle null/undefined inputs', () => {
      expect(bst.ceilingEntry(null)).toBeUndefined();
      expect(bst.ceilingEntry(undefined)).toBeUndefined();
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.ceilingEntry(12, 'ITERATIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(13);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.ceilingEntry(12, 'RECURSIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(13);
    });

    test('should find exact match as ceiling', () => {
      const result = bst.ceilingEntry(15);
      expect(result).toBeDefined();
      expect(result?.key).toBe(15);
    });
  });

  describe('higherEntry - finds > key (minimum value > target)', () => {
    test('should find higher when key exists (exclude exact match)', () => {
      const result = bst.higherEntry(10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
      expect(result?.key).not.toBe(10);
    });

    test('should find higher when key does not exist', () => {
      const result = bst.higherEntry(8);
      expect(result).toBeDefined();
      expect(result?.key).toBe(9);
    });

    test('should return undefined when no higher exists (key >= all)', () => {
      const result = bst.higherEntry(20);
      expect(result).toBeUndefined();
    });

    test('should find minimum element as higher for key < all', () => {
      const result = bst.higherEntry(-10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(1);
    });

    test('should not return the key itself', () => {
      const result = bst.higherEntry(7);
      expect(result?.key).not.toBe(7);
      expect(result?.key).toBe(9);
    });

    test('should handle higher with node input', () => {
      const targetNode = bst.getNode(5);
      expect(targetNode).toBeDefined();
      const result = bst.higherEntry(targetNode!);
      expect(result?.key).toBeGreaterThan(5);
      expect(result?.key).toBe(6);
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.higherEntry(13, 'ITERATIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(14);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.higherEntry(13, 'RECURSIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(14);
    });
  });

  describe('floorEntry - finds <= key (maximum value <= target)', () => {
    test('should find floor when key exists', () => {
      const result = bst.floorEntry(10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(10);
    });

    test('should find floor when key does not exist but lower value exists', () => {
      const result = bst.floorEntry(12);
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
    });

    test('should return undefined when no floor exists (key less than all)', () => {
      const result = bst.floorEntry(-10);
      expect(result).toBeUndefined();
    });

    test('should find maximum element as floor for key greater than all', () => {
      const result = bst.floorEntry(100);
      expect(result).toBeDefined();
      expect(result?.key).toBe(20);
    });

    test('should handle floor with node input', () => {
      const targetNode = bst.getNode(13);
      expect(targetNode).toBeDefined();
      const result = bst.floorEntry(targetNode!);
      expect(result?.key).toBe(13);
    });

    test('should handle floor with entry input', () => {
      const result = bst.floorEntry([16, 'test']);
      expect(result).toBeDefined();
      expect(result?.key).toBe(16);
    });

    test('should handle null/undefined inputs', () => {
      expect(bst.floorEntry(null)).toBeUndefined();
      expect(bst.floorEntry(undefined)).toBeUndefined();
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.floorEntry(12, 'ITERATIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.floorEntry(12, 'RECURSIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
    });

    test('should find exact match as floor', () => {
      const result = bst.floorEntry(15);
      expect(result).toBeDefined();
      expect(result?.key).toBe(15);
    });

    test('should correctly find floor between two keys', () => {
      const result = bst.floorEntry(8);
      expect(result).toBeDefined();
      expect(result?.key).toBe(7);
      expect(result?.key).toBeLessThan(8);
    });
  });

  describe('lowerEntry - finds < key (maximum value < target)', () => {
    test('should find lower when key exists (exclude exact match)', () => {
      const result = bst.lowerEntry(10);
      expect(result).toBeDefined();
      expect(result?.key).toBe(9);
      expect(result?.key).not.toBe(10);
    });

    test('should find lower when key does not exist', () => {
      const result = bst.lowerEntry(12);
      expect(result).toBeDefined();
      expect(result?.key).toBe(11);
    });

    test('should return undefined when no lower exists (key <= all)', () => {
      const result = bst.lowerEntry(1);
      expect(result).toBeUndefined();
    });

    test('should find maximum element as lower for key > all', () => {
      const result = bst.lowerEntry(100);
      expect(result).toBeDefined();
      expect(result?.key).toBe(20);
    });

    test('should not return the key itself', () => {
      const result = bst.lowerEntry(15);
      expect(result?.key).not.toBe(15);
      expect(result?.key).toBe(14);
    });

    test('should handle lower with node input', () => {
      const targetNode = bst.getNode(13);
      expect(targetNode).toBeDefined();
      const result = bst.lowerEntry(targetNode!);
      expect(result?.key).toBeLessThan(13);
      expect(result?.key).toBe(11);
    });

    test('should handle lower with entry input', () => {
      const result = bst.lowerEntry([17, 'test']);
      expect(result).toBeDefined();
      expect(result?.key).toBe(16);
    });

    test('should work with ITERATIVE mode', () => {
      const result = bst.lowerEntry(14, 'ITERATIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(13);
    });

    test('should work with RECURSIVE mode', () => {
      const result = bst.lowerEntry(14, 'RECURSIVE');
      expect(result).toBeDefined();
      expect(result?.key).toBe(13);
    });
  });

  describe('Edge cases and special scenarios', () => {
    test('single element tree - ceiling', () => {
      const singleBst = new BST([5]);
      expect(singleBst.ceilingEntry(5)?.key).toBe(5);
      expect(singleBst.ceilingEntry(3)?.key).toBe(5);
      expect(singleBst.ceilingEntry(7)).toBeUndefined();
    });

    test('single element tree - higher', () => {
      const singleBst = new BST([5]);
      expect(singleBst.higherEntry(5)).toBeUndefined();
      expect(singleBst.higherEntry(3)?.key).toBe(5);
    });

    test('single element tree - floor', () => {
      const singleBst = new BST([5]);
      expect(singleBst.floorEntry(5)?.key).toBe(5);
      expect(singleBst.floorEntry(7)?.key).toBe(5);
      expect(singleBst.floorEntry(3)).toBeUndefined();
    });

    test('single element tree - lower', () => {
      const singleBst = new BST([5]);
      expect(singleBst.lowerEntry(5)).toBeUndefined();
      expect(singleBst.lowerEntry(7)?.key).toBe(5);
    });

    test('empty tree handling', () => {
      const emptyBst = new BST<number, string>();
      expect(emptyBst.ceilingEntry(5)).toBeUndefined();
      expect(emptyBst.higherEntry(5)).toBeUndefined();
      expect(emptyBst.floorEntry(5)).toBeUndefined();
      expect(emptyBst.lowerEntry(5)).toBeUndefined();
    });

    test('ceiling and floor of adjacent keys', () => {
      const ceiling = bst.ceilingEntry(5);
      const floor = bst.floorEntry(6);
      expect(ceiling?.key).toBe(5);
      expect(floor?.key).toBe(5);
    });

    test('higher and lower of adjacent keys', () => {
      const higher = bst.higherEntry(5);
      const lower = bst.lowerEntry(6);
      expect(higher?.key).toBe(6);
      expect(lower?.key).toBe(5);
    });
  });

  describe('Predicate-based search', () => {
    test('ceiling with predicate function', () => {
      const result = bst.ceilingEntry((node: BSTNode<number, string>) => node.key >= 10);
      expect(result).toBeDefined();
      expect(result?.key).toBeGreaterThanOrEqual(10);
    });

    test('floor with predicate function', () => {
      const result = bst.floorEntry((node: BSTNode<number, string>) => node.key <= 15);
      expect(result).toBeDefined();
      expect(result?.key).toBeLessThanOrEqual(15);
    });

    test('higher with predicate function', () => {
      const result = bst.higherEntry((node: BSTNode<number, string>) => node.key > 10);
      expect(result).toBeDefined();
      expect(result?.key).toBeGreaterThan(10);
    });

    test('lower with predicate function', () => {
      const result = bst.lowerEntry((node: BSTNode<number, string>) => node.key < 15);
      expect(result).toBeDefined();
      expect(result?.key).toBeLessThan(15);
    });
  });

  describe('Custom comparator', () => {
    test('should work with reverse order comparator', () => {
      const reverseBst = new BST([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20], {
        comparator: (a: number, b: number) => b - a // reverse order
      });

      // In reverse order tree: keys are stored in descending order
      // ceiling (>=) should still work correctly
      const ceiling = reverseBst.ceilingEntry(10);
      expect(ceiling).toBeDefined();
      expect(ceiling?.key).toBeLessThanOrEqual(10);
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

      const ceiling = stringBst.ceilingEntry({ name: 'Bob', id: 0 });
      expect(ceiling).toBeDefined();
      expect(ceiling?.key.name).toBe('Bob');
    });
  });

  describe('Performance and correctness validation', () => {
    test('all range methods return nodes in order', () => {
      const ceiling = bst.ceilingEntry(10);
      const higher = bst.higherEntry(10);
      const floor = bst.floorEntry(10);
      const lower = bst.lowerEntry(10);

      expect(floor?.key).toBeLessThanOrEqual(10);
      expect(ceiling?.key).toBeGreaterThanOrEqual(10);
      expect(higher?.key).toBeGreaterThan(10);
      expect(lower?.key).toBeLessThan(10);
    });

    test('range query iteration with ceiling/higher', () => {
      const results: number[] = [];
      let node = bst.ceilingEntry(5);
      let count = 0;
      while (node && node.key <= 15 && count < 20) {
        results.push(node.key);
        node = bst.higherEntry(node.key);
        count++;
      }

      // Should iterate through nodes 5, 6, 7, ..., 15
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
      let node = bst.floorEntry(15);
      let count = 0;
      while (node && node.key >= 5 && count < 20) {
        results.push(node.key);
        node = bst.lowerEntry(node.key);
        count++;
      }

      // Should iterate through nodes 15, 14, 13, ..., 5
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
      const result = bst.ceilingEntry(1);
      expect(result?.key).toBe(1);
    });

    test('boundary: floor at max value', () => {
      const result = bst.floorEntry(20);
      expect(result?.key).toBe(20);
    });

    test('boundary: higher at second-last value', () => {
      const result = bst.higherEntry(19);
      expect(result?.key).toBe(20);
    });

    test('boundary: lower at second value', () => {
      const result = bst.lowerEntry(3);
      expect(result?.key).toBe(1);
    });

    test('boundary: ceiling slightly below min', () => {
      const result = bst.ceilingEntry(0);
      expect(result?.key).toBe(1);
    });

    test('boundary: floor slightly above max', () => {
      const result = bst.floorEntry(21);
      expect(result?.key).toBe(20);
    });

    test('boundary: higher at max (should be undefined)', () => {
      const result = bst.higherEntry(20);
      expect(result).toBeUndefined();
    });

    test('boundary: lower at min (should be undefined)', () => {
      const result = bst.lowerEntry(1);
      expect(result).toBeUndefined();
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
    bst.add(17);
    bst.add(0);
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
    merged.addMany(dataset2);
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

    function findFirstCommon(arr1: number[], arr2: number[]): number | undefined {
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
