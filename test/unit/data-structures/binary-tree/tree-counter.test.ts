import { BinaryTreeNode, BSTNode, RedBlackTreeNode, TreeCounter, TreeCounterNode } from '../../../../src';
import { isDebugTest } from '../../../config';
import { getRandomInt } from '../../../utils';

const isDebug = isDebugTest;
// const isDebug = true;

describe('TreeCounter count', () => {
  let treeCounter: TreeCounter<number>;
  beforeEach(() => {
    treeCounter = new TreeCounter<number>();
  });

  it('Should added node count ', () => {
    treeCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new TreeCounterNode(3, 33, 10);
    treeCounter.add(newNode);
    expect(treeCounter.count).toBe(15);
    expect(treeCounter.getComputedCount()).toBe(15);
    expect(treeCounter.getNode(3)?.count).toBe(11);
  });

  it('Should count', () => {
    treeCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
    treeCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 1);
    expect(treeCounter.getComputedCount()).toBe(7);
    expect(treeCounter.count).toBe(3);
  });
});

describe('TreeCounter operations test1', () => {
  it('should height ', () => {
    const treeCounter = new TreeCounter();
    expect(treeCounter.getHeight()).toBe(-1);
    expect(treeCounter.getMinHeight()).toBe(-1);

    treeCounter.addMany([1, 6, 7, 2, 3, 4, 9, 11, 8, 5, 10, 12, 16, 14, 13, 15]);
    // treeCounter.print()
    expect(treeCounter.getHeight()).toBe(5);
    expect(treeCounter.getMinHeight()).toBe(2);
  });

  it('should size and count', () => {
    const treeCounter = new TreeCounter();

    expect(treeCounter instanceof TreeCounter);

    treeCounter.add([11, 11]);
    treeCounter.add([3, 3]);
    expect(treeCounter.count).toBe(2);
    expect(treeCounter.getComputedCount()).toBe(2);
    expect(treeCounter.size).toBe(2);

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

    treeCounter.addMany(keyValuePairs);
    expect(treeCounter.size).toBe(16);
    expect(treeCounter.count).toBe(18);
    expect(treeCounter.getComputedCount()).toBe(18);
    treeCounter.delete(11);
    expect(treeCounter.count).toBe(17);
    expect(treeCounter.getComputedCount()).toBe(17);
    treeCounter.delete(3, true);
    expect(treeCounter.count).toBe(15);
    expect(treeCounter.getComputedCount()).toBe(15);
  });

  it('should perform various operations on a TreeCounter with numeric values1', () => {
    const treeCounter = new TreeCounter<number, number>();

    expect(treeCounter instanceof TreeCounter);

    treeCounter.add([11, 11]);
    treeCounter.add([3, 3]);
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
    treeCounter.addMany(idAndValues);
    expect(treeCounter.root instanceof TreeCounterNode);

    if (treeCounter.root) expect(treeCounter.root.key == 11);

    expect(treeCounter.size).toBe(16);
    expect(treeCounter.count).toBe(18);
    expect(treeCounter.getComputedCount()).toBe(18);

    expect(treeCounter.has(6));
    if (isDebug) treeCounter.print();
    expect(treeCounter.getHeight(6)).toBe(1);
    expect(treeCounter.getDepth(6)).toBe(3);
    const nodeId10 = treeCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeCounter.getNodes(node => node.count === 1);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeCounter.getNodes(node => node.count === 2);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeCounter.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = treeCounter.getNode(15);
    const minNodeBySpecificNode = node15 && treeCounter.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(14);

    let subTreeSum = 0;
    if (node15) treeCounter.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
    expect(subTreeSum).toBe(45);
    let lesserSum = 0;
    treeCounter.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeCounterNode);
    if (node15 instanceof TreeCounterNode) {
      const subTreeAdd = treeCounter.dfs(node => (node.count += 1), 'PRE', false, 15);
      expect(subTreeAdd);
    }
    const node11 = treeCounter.getNode(11);
    expect(node11 instanceof TreeCounterNode);
    if (node11 instanceof TreeCounterNode) {
      const allGreaterNodesAdded = treeCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeCounter.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeCounter.isPerfectlyBalanced()).toBe(false);
    treeCounter.perfectlyBalance();
    expect(treeCounter.isPerfectlyBalanced()).toBe(false);

    expect(treeCounter.isAVLBalanced()).toBe(false);

    const bfsNodesAfterBalanced = treeCounter.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(6);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeCounter.delete(11, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight(15)).toBe(1);

    const removed1 = treeCounter.delete(1, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(5);

    const removed4 = treeCounter.delete(4, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(5);

    const removed10 = treeCounter.delete(10, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(4);

    const removed15 = treeCounter.delete(15, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed5 = treeCounter.delete(5, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(3);

    const removed13 = treeCounter.delete(13, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(3);

    const removed3 = treeCounter.delete(3, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed8 = treeCounter.delete(8, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed6 = treeCounter.delete(6, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeCounter.delete(6, true).length).toBe(0);
    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(3);

    const removed7 = treeCounter.delete(7, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed9 = treeCounter.delete(9, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(2);

    const removed14 = treeCounter.delete(14, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(1);

    expect(treeCounter.isAVLBalanced()).toBe(true);

    const bfsIDs = treeCounter.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeCounter.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeCounter.count).toBe(6);
    expect(treeCounter.getComputedCount()).toBe(8);
  });

  it('should perform various operations on a TreeCounter with object values', () => {
    const objTreeCounter = new TreeCounter<number, { key: number; keyA: number }>();
    expect(objTreeCounter).toBeInstanceOf(TreeCounter);
    objTreeCounter.add([11, { key: 11, keyA: 11 }]);
    objTreeCounter.add([3, { key: 3, keyA: 3 }]);
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

    objTreeCounter.addMany(values);

    expect(objTreeCounter.root).toBeInstanceOf(TreeCounterNode);

    if (objTreeCounter.root) expect(objTreeCounter.root.key).toBe(5);

    expect(objTreeCounter.count).toBe(16);
    expect(objTreeCounter.getComputedCount()).toBe(16);

    expect(objTreeCounter.has(6)).toBe(true);
  });
});

describe('TreeCounter operations test recursively1', () => {
  it('should perform various operations on a TreeCounter with numeric values1', () => {
    const treeCounter = new TreeCounter<number>([], {
      iterationType: 'RECURSIVE'
    });

    expect(treeCounter instanceof TreeCounter);
    treeCounter.add([11, 11]);
    treeCounter.add([3, 3]);
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
    treeCounter.addMany(idAndValues);
    expect(treeCounter.root).toBeInstanceOf(TreeCounterNode);

    if (treeCounter.root) expect(treeCounter.root.key).toBe(5);

    expect(treeCounter.size).toBe(16);
    expect(treeCounter.count).toBe(18);
    expect(treeCounter.getComputedCount()).toBe(18);

    expect(treeCounter.has(6));

    expect(treeCounter.getHeight(6)).toBe(1);
    expect(treeCounter.getDepth(6)).toBe(3);
    const nodeId10 = treeCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeCounter.getNodes(node => node.count === 1);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeCounter.getNodes(node => node.count === 2);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeCounter.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = treeCounter.getNode(15);
    const minNodeBySpecificNode = node15 && treeCounter.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(14);

    let subTreeSum = 0;
    if (node15) treeCounter.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
    expect(subTreeSum).toBe(45);
    let lesserSum = 0;
    expect(treeCounter.has(9)).toBe(true);
    treeCounter.lesserOrGreaterTraverse(
      node => {
        lesserSum += node.key;
        return node.key;
      },
      -1,
      10
    );
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeCounterNode);
    if (node15 instanceof TreeCounterNode) {
      const subTreeAdd = treeCounter.dfs(node => (node.count += 1), 'PRE', false, 15);
      expect(subTreeAdd);
    }
    const node11 = treeCounter.getNode(11);
    expect(node11 instanceof TreeCounterNode);
    if (node11 instanceof TreeCounterNode) {
      const allGreaterNodesAdded = treeCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeCounter.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeCounter.isPerfectlyBalanced()).toBe(false);

    treeCounter.perfectlyBalance();

    expect(treeCounter.isPerfectlyBalanced()).toBe(false);
    expect(treeCounter.isAVLBalanced()).toBe(false);

    const bfsNodesAfterBalanced = treeCounter.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(6);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeCounter.delete(11, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight(15)).toBe(1);

    const removed1 = treeCounter.delete(1, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(5);

    const removed4 = treeCounter.delete(4, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(5);

    const removed10 = treeCounter.delete(10, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(4);

    const removed15 = treeCounter.delete(15, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed5 = treeCounter.delete(5, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(3);

    const removed13 = treeCounter.delete(13, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(3);

    const removed3 = treeCounter.delete(3, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed8 = treeCounter.delete(8, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed6 = treeCounter.delete(6, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeCounter.delete(6, true).length).toBe(0);
    expect(treeCounter.isAVLBalanced()).toBe(false);

    expect(treeCounter.getHeight()).toBe(3);

    const removed7 = treeCounter.delete(7, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeCounter.isAVLBalanced()).toBe(false);
    expect(treeCounter.getHeight()).toBe(3);

    const removed9 = treeCounter.delete(9, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(2);

    const removed14 = treeCounter.delete(14, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeCounter.isAVLBalanced()).toBe(true);
    expect(treeCounter.getHeight()).toBe(1);

    expect(treeCounter.isAVLBalanced()).toBe(true);

    const bfsIDs = treeCounter.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeCounter.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeCounter.count).toBe(6);
    expect(treeCounter.getComputedCount()).toBe(8);
  });

  it('should perform various operations on a TreeCounter with object values', () => {
    const objTreeCounter = new TreeCounter<number, { key: number; keyA: number }>();
    expect(objTreeCounter).toBeInstanceOf(TreeCounter);
    objTreeCounter.add([11, { key: 11, keyA: 11 }]);
    objTreeCounter.add([3, { key: 3, keyA: 3 }]);
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

    objTreeCounter.addMany(values);

    expect(objTreeCounter.root).toBeInstanceOf(TreeCounterNode);

    if (objTreeCounter.root) expect(objTreeCounter.root.key).toBe(5);

    expect(objTreeCounter.count).toBe(16);
    expect(objTreeCounter.getComputedCount()).toBe(16);

    expect(objTreeCounter.has(6)).toBe(true);
  });
});

describe('TreeCounter delete test', function () {
  const treeCounter = new TreeCounter<number, number>();
  const inputSize = 1000; // Adjust input sizes as needed

  beforeEach(() => {
    treeCounter.clear();
  });

  it(`Observe the time consumption of TreeCounter.dfs be good`, function () {
    const startDFS = performance.now();
    const dfs = treeCounter.dfs(node => node);
    if (isDebug) console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('The structure remains normal after random deletion', function () {
    for (let i = 0; i < inputSize; i++) {
      treeCounter.add(i);
    }

    expect(treeCounter.size).toBe(inputSize);

    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      treeCounter.delete(num);
    }

    let nilCount = 0;
    const dfs = (cur: TreeCounterNode<number>) => {
      if (isNaN(cur.key)) nilCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (treeCounter.root) dfs(treeCounter.root);

    expect(treeCounter.size).toBeLessThanOrEqual(inputSize);
    expect(treeCounter.getHeight()).toBeGreaterThan(Math.log2(inputSize) - 1);
    expect(treeCounter.getHeight()).toBeLessThan(Math.log2(inputSize) * 2);

    expect(nilCount).toBe(treeCounter.size + 1);
  });

  it(`Random additions, complete deletions of structures are normal`, function () {
    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      if (i === 0 && isDebug) console.log(`first:`, num);
      treeCounter.add(num);
    }

    for (let i = 0; i < inputSize; i++) {
      treeCounter.delete(i, true);
    }

    let nilCount = 0;
    const dfs = (cur: TreeCounterNode<number>) => {
      if (isNaN(cur.key)) nilCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (treeCounter.root) dfs(treeCounter.root);

    expect(treeCounter.size).toBe(0);
    expect(treeCounter.getHeight()).toBe(-1);
    expect(nilCount).toBe(treeCounter.size + 1);

    if (isDebug) treeCounter.print();
  });

  it(`Random additions, count deletions of structures are normal`, function () {
    for (let i = 0; i < inputSize; i++) {
      const num = getRandomInt(0, inputSize - 1);
      if (i === 0 && isDebug) console.log(`first:`, num);
      treeCounter.add(num);
    }

    for (let i = 0; i < inputSize; i++) {
      treeCounter.delete(i);
    }

    let nanCount = 0;
    const dfs = (cur: TreeCounterNode<number>) => {
      if (isNaN(cur.key)) nanCount++;
      if (cur.left) dfs(cur.left);
      if (cur.right) dfs(cur.right);
    };
    if (treeCounter.root) dfs(treeCounter.root);

    expect(treeCounter.size).toBeGreaterThanOrEqual(0);
    expect(treeCounter.getHeight()).toBeGreaterThanOrEqual(0);
    expect(nanCount).toBeLessThanOrEqual(inputSize);

    if (isDebug) treeCounter.print();
  });

  it('should the clone method', () => {
    function checkTreeStructure(treeCounter: TreeCounter<string, number>) {
      expect(treeCounter.size).toBe(4);
      expect(treeCounter.root?.key).toBe('2');
      expect(treeCounter.root?.left?.key).toBe('1');
      expect(treeCounter.root?.left?.left?.key).toBe(NaN);
      expect(treeCounter.root?.left?.right?.key).toBe(NaN);
      expect(treeCounter.root?.right?.key).toBe('4');
      expect(treeCounter.root?.right?.left?.key).toBe(NaN);
      expect(treeCounter.root?.right?.right?.key).toBe('5');
    }

    const treeCounter = new TreeCounter<string, number>();
    treeCounter.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(treeCounter.size).toBe(5);
    expect(treeCounter.root?.key).toBe('2');
    expect(treeCounter.root?.left?.key).toBe('1');
    expect(treeCounter.root?.left?.left?.key).toBe(NaN);
    expect(treeCounter.root?.left?.right?.key).toBe(NaN);
    expect(treeCounter.root?.right?.key).toBe('4');
    expect(treeCounter.root?.right?.left?.key).toBe(`3`);
    expect(treeCounter.root?.right?.right?.key).toBe('5');
    treeCounter.delete('3');
    checkTreeStructure(treeCounter);
    const cloned = treeCounter.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(treeCounter.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('TreeCounter iterative methods test', () => {
  let treeCounter: TreeCounter<number, string>;
  beforeEach(() => {
    treeCounter = new TreeCounter<number, string>();
    treeCounter.add(1, 'a', 10);
    treeCounter.add([2, 'b'], undefined, 10);
    treeCounter.add([3, 'c'], undefined, 1);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = treeCounter.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
    expect(node3).toBeInstanceOf(RedBlackTreeNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    treeCounter.forEach((key, value) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
    expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
    expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
  });

  it('filter should return a new tree with filtered elements', () => {
    const filteredTree = treeCounter.filter(key => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('map should return a new tree with modified elements', () => {
    const treeCounterMapped = treeCounter.map((key, value) => [(key * 2).toString(), value]);
    expect(treeCounterMapped.size).toBe(3);
    expect([...treeCounterMapped]).toEqual([
      ['2', 'a'],
      ['4', 'b'],
      ['6', 'c']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = treeCounter.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of treeCounter) {
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
    expect(treeCounter.count).toBe(21);
    expect(treeCounter.getComputedCount()).toBe(21);
    const cloned = treeCounter.clone();
    expect(cloned.root?.left?.key).toBe(1);
    if (cloned.isMapMode) expect(cloned.get(cloned.root?.right)).toBe('c');
    else expect(cloned.root?.right?.value).toBe(undefined);
  });

  it('should keys', () => {
    const keys = treeCounter.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = treeCounter.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });

  it('should leaves', () => {
    const leaves = treeCounter.leaves();
    expect(leaves).toEqual([1, 3]);
  });
});

describe('TreeCounter count not map mode', () => {
  let treeCounter: TreeCounter<number>;
  beforeEach(() => {
    treeCounter = new TreeCounter<number>([], { isMapMode: false });
  });

  it('Should added node count ', () => {
    treeCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new TreeCounterNode(3, undefined, 10);
    treeCounter.add(newNode, 33, 20);
    // TODO expect(treeCounter.count).toBe(25);
    expect(treeCounter.count).toBe(15);
    expect(treeCounter.getComputedCount()).toBe(15);
    expect(treeCounter.getNode(3)?.count).toBe(11);
  });
});

describe('TreeCounter operations test1 not map mode', () => {
  it('should perform various operations on a TreeCounter with numeric values1', () => {
    const treeCounter = new TreeCounter<number, number>([], { isMapMode: false });

    expect(treeCounter instanceof TreeCounter);

    treeCounter.add([11, 11]);
    treeCounter.add([3, 3]);
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
    treeCounter.addMany(idAndValues);
    expect(treeCounter.root instanceof TreeCounterNode);

    if (treeCounter.root) expect(treeCounter.root.key == 11);

    expect(treeCounter.size).toBe(16);
    expect(treeCounter.count).toBe(18);
    expect(treeCounter.getComputedCount()).toBe(18);

    expect(treeCounter.has(6));
    if (isDebug) treeCounter.print();
    expect(treeCounter.getHeight(6)).toBe(1);
    expect(treeCounter.getDepth(6)).toBe(3);
    const nodeId10 = treeCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);
  });
});

describe('TreeCounter operations test recursively1 not map mode', () => {
  it('should perform various operations on a TreeCounter with numeric values1', () => {
    const treeCounter = new TreeCounter<number>([], {
      iterationType: 'RECURSIVE',
      isMapMode: false
    });

    expect(treeCounter instanceof TreeCounter);
    treeCounter.add([11, 11]);
    treeCounter.add([3, 3]);
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
    treeCounter.addMany(idAndValues);
    expect(treeCounter.root).toBeInstanceOf(TreeCounterNode);

    if (treeCounter.root) expect(treeCounter.root.key).toBe(5);

    expect(treeCounter.size).toBe(16);
    expect(treeCounter.count).toBe(18);
    expect(treeCounter.getComputedCount()).toBe(18);

    expect(treeCounter.has(6));

    expect(treeCounter.getHeight(6)).toBe(1);
    expect(treeCounter.getDepth(6)).toBe(3);
    const nodeId10 = treeCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);
  });
});

describe('TreeCounter iterative methods test not map mode', () => {
  let treeCounter: TreeCounter<number, string>;
  beforeEach(() => {
    treeCounter = new TreeCounter<number, string>([], { isMapMode: false });
    treeCounter.add(1, 'a', 10);
    treeCounter.add([2, 'b'], undefined, 10);
    treeCounter.add([3, 'c'], undefined, 1);
  });

  it('should clone work well', () => {
    expect(treeCounter.count).toBe(21);
    expect(treeCounter.getComputedCount()).toBe(21);
    const cloned = treeCounter.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.get(cloned.root?.right)).toBe(undefined);
  });
});
