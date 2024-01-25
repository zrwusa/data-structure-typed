import { BinaryTreeNode, BSTNode, RedBlackTreeNode, TreeMultiMap, TreeMultiMapNode } from '../../../../src';
import { isDebugTest } from '../../../config';
import { getRandomInt } from '../../../utils';

const isDebug = isDebugTest;
// const isDebug = true;

describe('TreeMultiMap count', () => {
  let tmm: TreeMultiMap<number>;
  beforeEach(() => {
    tmm = new TreeMultiMap<number>();
  });

  it('Should added node count ', () => {
    tmm.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new TreeMultiMapNode(3, 33, 10);
    tmm.add(newNode);
    expect(tmm.count).toBe(15);
    expect(tmm.getComputedCount()).toBe(15);
    expect(tmm.getNode(3)?.count).toBe(11);
  });

  it('Should count', () => {
    tmm.addMany([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
    tmm.lesserOrGreaterTraverse(node => (node.count += 2), 1, 1);
    expect(tmm.getComputedCount()).toBe(7);
    expect(tmm.count).toBe(3);
  });
});

describe('TreeMultiMap operations test1', () => {
  it('should height ', () => {
    const tmm = new TreeMultiMap();
    expect(tmm.getHeight()).toBe(-1);
    expect(tmm.getMinHeight()).toBe(-1);

    tmm.addMany([1, 6, 7, 2, 3, 4, 9, 11, 8, 5, 10, 12, 16, 14, 13, 15]);
    // tmm.print()
    expect(tmm.getHeight()).toBe(5);
    expect(tmm.getMinHeight()).toBe(2);
  });

  it('should size and count', () => {
    const tmm = new TreeMultiMap();

    expect(tmm instanceof TreeMultiMap);

    tmm.add([11, 11]);
    tmm.add([3, 3]);
    expect(tmm.count).toBe(2);
    expect(tmm.getComputedCount()).toBe(2);
    expect(tmm.size).toBe(2);

    const keyValuePairs: [number, number][] = [
      [11, 11],
      [3, 3],
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

    tmm.addMany(keyValuePairs);
    expect(tmm.size).toBe(16);
    expect(tmm.count).toBe(18);
    expect(tmm.getComputedCount()).toBe(18);
    tmm.delete(11);
    expect(tmm.count).toBe(17);
    expect(tmm.getComputedCount()).toBe(17);
    tmm.delete(3, undefined, true);
    expect(tmm.count).toBe(15);
    expect(tmm.getComputedCount()).toBe(15);
  });

  it('should perform various operations on a Binary Search Tree with numeric values1', () => {
    const tmm = new TreeMultiMap<number, number>();

    expect(tmm instanceof TreeMultiMap);

    tmm.add([11, 11]);
    tmm.add([3, 3]);
    const idAndValues: [number, number][] = [
      [11, 11],
      [3, 3],
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
    tmm.addMany(idAndValues);
    expect(tmm.root instanceof TreeMultiMapNode);

    if (tmm.root) expect(tmm.root.key == 11);

    expect(tmm.size).toBe(16);
    expect(tmm.count).toBe(18);
    expect(tmm.getComputedCount()).toBe(18);

    expect(tmm.has(6));
    isDebug && tmm.print();
    expect(tmm.getHeight(6)).toBe(1);
    expect(tmm.getDepth(6)).toBe(3);
    const nodeId10 = tmm.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = tmm.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = tmm.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = tmm.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = tmm.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = tmm.getNode(15);
    const minNodeBySpecificNode = node15 && tmm.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(14);

    let subTreeSum = 0;
    node15 && tmm.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(45);
    let lesserSum = 0;
    tmm.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeMultiMapNode);
    if (node15 instanceof TreeMultiMapNode) {
      const subTreeAdd = tmm.dfs(node => (node.count += 1), 'PRE', 15);
      expect(subTreeAdd);
    }
    const node11 = tmm.getNode(11);
    expect(node11 instanceof TreeMultiMapNode);
    if (node11 instanceof TreeMultiMapNode) {
      const allGreaterNodesAdded = tmm.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = tmm.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(tmm.isPerfectlyBalanced()).toBe(false);
    tmm.perfectlyBalance();
    expect(tmm.isPerfectlyBalanced()).toBe(false);

    expect(tmm.isAVLBalanced()).toBe(false);

    const bfsNodesAfterBalanced = tmm.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(6);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = tmm.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight(15)).toBe(1);

    const removed1 = tmm.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(5);

    const removed4 = tmm.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(5);

    const removed10 = tmm.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(4);

    const removed15 = tmm.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed5 = tmm.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(3);

    const removed13 = tmm.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(3);

    const removed3 = tmm.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed8 = tmm.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed6 = tmm.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(tmm.delete(6, undefined, true).length).toBe(0);
    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(3);

    const removed7 = tmm.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed9 = tmm.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(2);

    const removed14 = tmm.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(1);

    expect(tmm.isAVLBalanced()).toBe(true);

    const bfsIDs = tmm.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = tmm.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(tmm.count).toBe(6);
    expect(tmm.getComputedCount()).toBe(8);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objTreeMultiMap = new TreeMultiMap<number, { key: number; keyA: number }>();
    expect(objTreeMultiMap).toBeInstanceOf(TreeMultiMap);
    objTreeMultiMap.add([11, { key: 11, keyA: 11 }]);
    objTreeMultiMap.add([3, { key: 3, keyA: 3 }]);
    const values: [number, { key: number; keyA: number }][] = [
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

    objTreeMultiMap.addMany(values);

    expect(objTreeMultiMap.root).toBeInstanceOf(TreeMultiMapNode);

    if (objTreeMultiMap.root) expect(objTreeMultiMap.root.key).toBe(5);

    expect(objTreeMultiMap.count).toBe(16);
    expect(objTreeMultiMap.getComputedCount()).toBe(16);

    expect(objTreeMultiMap.has(6)).toBe(true);
  });
});

describe('TreeMultiMap operations test recursively1', () => {
  it('should perform various operations on a Binary Search Tree with numeric values1', () => {
    const tmm = new TreeMultiMap<number>([], { iterationType: 'RECURSIVE' });

    expect(tmm instanceof TreeMultiMap);
    tmm.add([11, 11]);
    tmm.add([3, 3]);
    const idAndValues: [number, number][] = [
      [11, 11],
      [3, 3],
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
    tmm.addMany(idAndValues);
    expect(tmm.root).toBeInstanceOf(TreeMultiMapNode);

    if (tmm.root) expect(tmm.root.key).toBe(5);

    expect(tmm.size).toBe(16);
    expect(tmm.count).toBe(18);
    expect(tmm.getComputedCount()).toBe(18);

    expect(tmm.has(6));

    expect(tmm.getHeight(6)).toBe(1);
    expect(tmm.getDepth(6)).toBe(3);
    const nodeId10 = tmm.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = tmm.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = tmm.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = tmm.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = tmm.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = tmm.getNode(15);
    const minNodeBySpecificNode = node15 && tmm.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(14);

    let subTreeSum = 0;
    node15 && tmm.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(45);
    let lesserSum = 0;
    expect(tmm.has(9)).toBe(true);
    tmm.lesserOrGreaterTraverse(
      node => {
        lesserSum += node.key;
        return node.key;
      },
      -1,
      10
    );
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeMultiMapNode);
    if (node15 instanceof TreeMultiMapNode) {
      const subTreeAdd = tmm.dfs(node => (node.count += 1), 'PRE', 15);
      expect(subTreeAdd);
    }
    const node11 = tmm.getNode(11);
    expect(node11 instanceof TreeMultiMapNode);
    if (node11 instanceof TreeMultiMapNode) {
      const allGreaterNodesAdded = tmm.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = tmm.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(tmm.isPerfectlyBalanced()).toBe(false);

    tmm.perfectlyBalance();

    expect(tmm.isPerfectlyBalanced()).toBe(false);
    expect(tmm.isAVLBalanced()).toBe(false);

    const bfsNodesAfterBalanced = tmm.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(6);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = tmm.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight(15)).toBe(1);

    const removed1 = tmm.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(5);

    const removed4 = tmm.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(5);

    const removed10 = tmm.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(4);

    const removed15 = tmm.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed5 = tmm.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(3);

    const removed13 = tmm.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(3);

    const removed3 = tmm.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed8 = tmm.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed6 = tmm.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(tmm.delete(6, undefined, true).length).toBe(0);
    expect(tmm.isAVLBalanced()).toBe(false);

    expect(tmm.getHeight()).toBe(3);

    const removed7 = tmm.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(tmm.isAVLBalanced()).toBe(false);
    expect(tmm.getHeight()).toBe(3);

    const removed9 = tmm.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(2);

    const removed14 = tmm.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(tmm.isAVLBalanced()).toBe(true);
    expect(tmm.getHeight()).toBe(1);

    expect(tmm.isAVLBalanced()).toBe(true);

    const bfsIDs = tmm.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = tmm.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(tmm.count).toBe(6);
    expect(tmm.getComputedCount()).toBe(8);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objTreeMultiMap = new TreeMultiMap<number, { key: number; keyA: number }>();
    expect(objTreeMultiMap).toBeInstanceOf(TreeMultiMap);
    objTreeMultiMap.add([11, { key: 11, keyA: 11 }]);
    objTreeMultiMap.add([3, { key: 3, keyA: 3 }]);
    const values: [number, { key: number; keyA: number }][] = [
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

    objTreeMultiMap.addMany(values);

    expect(objTreeMultiMap.root).toBeInstanceOf(TreeMultiMapNode);

    if (objTreeMultiMap.root) expect(objTreeMultiMap.root.key).toBe(5);

    expect(objTreeMultiMap.count).toBe(16);
    expect(objTreeMultiMap.getComputedCount()).toBe(16);

    expect(objTreeMultiMap.has(6)).toBe(true);
  });
});

describe('TreeMultiMap delete test', function () {
  const tmm = new TreeMultiMap<number, number>();
  const inputSize = 1000; // Adjust input sizes as needed

  beforeEach(() => {
    tmm.clear();
  });

  it(`Observe the time consumption of TreeMultiMap.dfs be good`, function () {
    const startDFS = performance.now();
    const dfs = tmm.dfs(node => node);
    isDebug && console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('The structure remains normal after random deletion', function () {
    for (let i = 0; i < inputSize; i++) {
      tmm.add(i);
    }

    expect(tmm.size).toBe(inputSize);

    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      tmm.delete(num);
    }

    let nilCount = 0;
    const dfs = (cur: TreeMultiMapNode<number>) => {
      if (isNaN(cur.key)) nilCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (tmm.root) dfs(tmm.root);

    expect(tmm.size).toBeLessThanOrEqual(inputSize);
    expect(tmm.getHeight()).toBeGreaterThan(Math.log2(inputSize) - 1);
    expect(tmm.getHeight()).toBeLessThan(Math.log2(inputSize) * 2);

    expect(nilCount).toBe(tmm.size + 1);
  });

  it(`Random additions, complete deletions of structures are normal`, function () {
    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      if (i === 0 && isDebug) console.log(`first:`, num);
      tmm.add(num);
    }

    for (let i = 0; i < inputSize; i++) {
      tmm.delete(i, undefined, true);
    }

    let nilCount = 0;
    const dfs = (cur: TreeMultiMapNode<number>) => {
      if (isNaN(cur.key)) nilCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (tmm.root) dfs(tmm.root);

    expect(tmm.size).toBe(0);
    expect(tmm.getHeight()).toBe(-1);
    expect(nilCount).toBe(tmm.size + 1);

    isDebug && tmm.print();
  });

  it(`Random additions, count deletions of structures are normal`, function () {
    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      if (i === 0 && isDebug) console.log(`first:`, num);
      tmm.add(num);
    }

    for (let i = 0; i < inputSize; i++) {
      tmm.delete(i);
    }

    let nanCount = 0;
    const dfs = (cur: TreeMultiMapNode<number>) => {
      if (isNaN(cur.key)) nanCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (tmm.root) dfs(tmm.root);

    expect(tmm.size).toBeGreaterThanOrEqual(0);
    expect(tmm.getHeight()).toBeGreaterThanOrEqual(0);
    expect(nanCount).toBeLessThanOrEqual(inputSize);

    isDebug && tmm.print();
  });

  it('should the clone method', () => {
    function checkTreeStructure(tmm: TreeMultiMap<string, number>) {
      expect(tmm.size).toBe(4);
      expect(tmm.root?.key).toBe('2');
      expect(tmm.root?.left?.key).toBe('1');
      expect(tmm.root?.left?.left?.key).toBe(NaN);
      expect(tmm.root?.left?.right?.key).toBe(NaN);
      expect(tmm.root?.right?.key).toBe('4');
      expect(tmm.root?.right?.left?.key).toBe(NaN);
      expect(tmm.root?.right?.right?.key).toBe('5');
    }

    const tmm = new TreeMultiMap<string, number>();
    tmm.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(tmm.size).toBe(5);
    expect(tmm.root?.key).toBe('2');
    expect(tmm.root?.left?.key).toBe('1');
    expect(tmm.root?.left?.left?.key).toBe(NaN);
    expect(tmm.root?.left?.right?.key).toBe(NaN);
    expect(tmm.root?.right?.key).toBe('4');
    expect(tmm.root?.right?.left?.key).toBe(`3`);
    expect(tmm.root?.right?.right?.key).toBe('5');
    tmm.delete('3');
    checkTreeStructure(tmm);
    const cloned = tmm.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(tmm.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('TreeMultiMap iterative methods test', () => {
  let treeMM: TreeMultiMap<number, string>;
  beforeEach(() => {
    treeMM = new TreeMultiMap<number, string>();
    treeMM.add(1, 'a', 10);
    treeMM.add([2, 'b'], undefined, 10);
    treeMM.add([3, 'c'], undefined, 1);
  });

  test('The node obtained by get Node should match the node type', () => {
    const node3 = treeMM.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
    expect(node3).toBeInstanceOf(RedBlackTreeNode);
  });

  test('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    treeMM.forEach((value, key) => {
      mockCallback(value, key);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['a', 1]);
    expect(mockCallback.mock.calls[1]).toEqual(['b', 2]);
    expect(mockCallback.mock.calls[2]).toEqual(['c', 3]);
  });

  test('filter should return a new tree with filtered elements', () => {
    const filteredTree = treeMM.filter((value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  test('map should return a new tree with modified elements', () => {
    const mappedTree = treeMM.map((value, key) => (key * 2).toString());
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      [1, '2'],
      [2, '4'],
      [3, '6']
    ]);
  });

  test('reduce should accumulate values', () => {
    const sum = treeMM.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  test('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of treeMM) {
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
    expect(treeMM.count).toBe(21);
    expect(treeMM.getComputedCount()).toBe(21);
    const cloned = treeMM.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.root?.right?.value).toBe('c');
  });

  test('should keys', () => {
    const keys = treeMM.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  test('should values', () => {
    const values = treeMM.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });
});
