import { AVLTreeMultiMap, AVLTreeMultiMapNode, AVLTreeNode, BinaryTreeNode, BSTNode } from '../../../../src';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;

describe('AVLTreeMultiMap count', () => {
  let tm: AVLTreeMultiMap<number>;
  beforeEach(() => {
    tm = new AVLTreeMultiMap<number>();
  });
  it('Should added isolated node count ', () => {
    tm.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new AVLTreeMultiMapNode(3, 33, 10);
    tm.add(newNode);
    expect(tm.count).toBe(15);
  });

  it('Should count', () => {
    tm.addMany([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
    tm.add([2, 2], undefined, 10);
    tm.lesserOrGreaterTraverse(node => (node.count += 2), 1, 1);
    tm.delete(2);
    expect(tm.count).toBe(12);
    expect(tm.getComputedCount()).toBe(16);
  });
});

describe('AVLTreeMultiMap operations test1', () => {
  it('should perform various operations on a Binary Search Tree with numeric values1', () => {
    const treeMultimap = new AVLTreeMultiMap<number>();

    expect(treeMultimap instanceof AVLTreeMultiMap);
    treeMultimap.add([11, 11]);
    treeMultimap.add([3, 3]);
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
    treeMultimap.addMany(idAndValues);
    expect(treeMultimap.root instanceof AVLTreeMultiMapNode);

    if (treeMultimap.root) expect(treeMultimap.root.key == 11);

    expect(treeMultimap.size).toBe(16);
    expect(treeMultimap.count).toBe(18);

    expect(treeMultimap.has(6));

    expect(treeMultimap.getHeight(6)).toBe(4);
    expect(treeMultimap.getDepth(6)).toBe(0);
    const nodeId10 = treeMultimap.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeMultimap.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeMultimap.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeMultimap.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeMultimap.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = treeMultimap.getNode(15);
    const minNodeBySpecificNode = node15 && treeMultimap.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(15);

    let subTreeSum = 0;
    node15 && treeMultimap.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(31);
    let lesserSum = 0;
    treeMultimap.lesserOrGreaterTraverse((node: AVLTreeMultiMapNode<number>) => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof AVLTreeMultiMapNode);
    if (node15 instanceof AVLTreeMultiMapNode) {
      const subTreeAdd = treeMultimap.dfs(node => (node.count += 1), 'PRE', 15);
      expect(subTreeAdd);
    }
    const node11 = treeMultimap.getNode(11);
    expect(node11 instanceof AVLTreeMultiMapNode);
    if (node11 instanceof AVLTreeMultiMapNode) {
      const allGreaterNodesAdded = treeMultimap.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeMultimap.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeMultimap.isPerfectlyBalanced()).toBe(false);

    treeMultimap.perfectlyBalance();

    expect(treeMultimap.isPerfectlyBalanced()).toBe(true);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = treeMultimap.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeMultimap.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight(15)).toBe(1);

    const removed1 = treeMultimap.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(4);

    const removed4 = treeMultimap.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(4);

    const removed10 = treeMultimap.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(3);

    const removed15 = treeMultimap.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed5 = treeMultimap.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed13 = treeMultimap.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed3 = treeMultimap.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed8 = treeMultimap.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed6 = treeMultimap.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeMultimap.delete(6, undefined, true).length).toBe(0);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(2);

    const removed7 = treeMultimap.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(2);

    const removed9 = treeMultimap.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(2);

    const removed14 = treeMultimap.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(1);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    const bfsIDs = treeMultimap.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeMultimap.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeMultimap.count).toBe(8);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objAVLTreeMultiMap = new AVLTreeMultiMap<number, { key: number; keyA: number }>();
    expect(objAVLTreeMultiMap).toBeInstanceOf(AVLTreeMultiMap);
    objAVLTreeMultiMap.add([11, { key: 11, keyA: 11 }]);
    objAVLTreeMultiMap.add([3, { key: 3, keyA: 3 }]);
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

    objAVLTreeMultiMap.addMany(values);

    expect(objAVLTreeMultiMap.root).toBeInstanceOf(AVLTreeMultiMapNode);

    if (objAVLTreeMultiMap.root) expect(objAVLTreeMultiMap.root.key).toBe(6);

    expect(objAVLTreeMultiMap.count).toBe(16);

    expect(objAVLTreeMultiMap.has(6)).toBe(true);
  });
});

describe('AVLTreeMultiMap operations test recursively1', () => {
  it('should perform various operations on a Binary Search Tree with numeric values1', () => {
    const treeMultimap = new AVLTreeMultiMap<number>([], { iterationType: 'RECURSIVE' });

    expect(treeMultimap instanceof AVLTreeMultiMap);
    treeMultimap.add([11, 11]);
    treeMultimap.add([3, 3]);
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
    treeMultimap.addMany(idAndValues);
    expect(treeMultimap.root).toBeInstanceOf(AVLTreeMultiMapNode);

    if (treeMultimap.root) expect(treeMultimap.root.key).toBe(6);

    expect(treeMultimap.size).toBe(16);
    expect(treeMultimap.count).toBe(18);

    expect(treeMultimap.has(6));

    expect(treeMultimap.getHeight(6)).toBe(4);
    expect(treeMultimap.getDepth(6)).toBe(0);
    const nodeId10 = treeMultimap.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeMultimap.getNode(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeMultimap.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeMultimap.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeMultimap.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = treeMultimap.getNode(15);
    const minNodeBySpecificNode = node15 && treeMultimap.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(15);

    let subTreeSum = 0;
    node15 && treeMultimap.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(31);
    let lesserSum = 0;
    treeMultimap.lesserOrGreaterTraverse((node: AVLTreeMultiMapNode<number>) => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof AVLTreeMultiMapNode);
    if (node15 instanceof AVLTreeMultiMapNode) {
      const subTreeAdd = treeMultimap.dfs(node => (node.count += 1), 'PRE', 15);
      expect(subTreeAdd);
    }
    const node11 = treeMultimap.getNode(11);
    expect(node11 instanceof AVLTreeMultiMapNode);
    if (node11 instanceof AVLTreeMultiMapNode) {
      const allGreaterNodesAdded = treeMultimap.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeMultimap.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeMultimap.isPerfectlyBalanced()).toBe(true);

    treeMultimap.perfectlyBalance();

    expect(treeMultimap.isPerfectlyBalanced()).toBe(true);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = treeMultimap.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeMultimap.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight(15)).toBe(1);

    const removed1 = treeMultimap.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(4);

    const removed4 = treeMultimap.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(4);

    const removed10 = treeMultimap.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(3);

    const removed15 = treeMultimap.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed5 = treeMultimap.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed13 = treeMultimap.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed3 = treeMultimap.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed8 = treeMultimap.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(3);

    const removed6 = treeMultimap.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeMultimap.delete(6, undefined, true).length).toBe(0);
    expect(treeMultimap.isAVLBalanced()).toBe(true);

    expect(treeMultimap.getHeight()).toBe(2);

    const removed7 = treeMultimap.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(2);

    const removed9 = treeMultimap.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(2);

    const removed14 = treeMultimap.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeMultimap.isAVLBalanced()).toBe(true);
    expect(treeMultimap.getHeight()).toBe(1);

    expect(treeMultimap.isAVLBalanced()).toBe(true);

    const bfsIDs = treeMultimap.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeMultimap.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeMultimap.count).toBe(8);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objAVLTreeMultiMap = new AVLTreeMultiMap<number, { key: number; keyA: number }>();
    expect(objAVLTreeMultiMap).toBeInstanceOf(AVLTreeMultiMap);
    objAVLTreeMultiMap.add([11, { key: 11, keyA: 11 }]);
    objAVLTreeMultiMap.add([3, { key: 3, keyA: 3 }]);
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

    objAVLTreeMultiMap.addMany(values);

    expect(objAVLTreeMultiMap.root).toBeInstanceOf(AVLTreeMultiMapNode);

    if (objAVLTreeMultiMap.root) expect(objAVLTreeMultiMap.root.key).toBe(6);

    expect(objAVLTreeMultiMap.count).toBe(16);

    expect(objAVLTreeMultiMap.has(6)).toBe(true);
  });
});

describe('AVLTreeMultiMap Performance test', function () {
  const treeMS = new AVLTreeMultiMap<number, number>();
  const inputSize = 100000; // Adjust input sizes as needed

  beforeEach(() => {
    treeMS.clear();
  });

  it(`Observe the time consumption of AVLTreeMultiMap.dfs be good`, function () {
    const startDFS = performance.now();
    const dfs = treeMS.dfs(node => node);
    isDebug && console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('Should the time consumption of lesserOrGreaterTraverse fitting O(n log n)', function () {
    const start = performance.now();
    for (let i = 0; i < inputSize; i++) {
      treeMS.add(i);
    }
    isDebug && console.log('---add', performance.now() - start);
    const startL = performance.now();
    treeMS.lesserOrGreaterTraverse(node => (node.count += 1), -1, inputSize / 2);
    isDebug && console.log('---lesserOrGreaterTraverse', performance.now() - startL);
  });

  it('should the clone method', () => {
    function checkTreeStructure(treeMultimap: AVLTreeMultiMap<string, number>) {
      expect(treeMultimap.size).toBe(4);
      expect(treeMultimap.root?.key).toBe('2');
      expect(treeMultimap.root?.left?.key).toBe('1');
      expect(treeMultimap.root?.left?.left?.key).toBe(undefined);
      expect(treeMultimap.root?.left?.right?.key).toBe(undefined);
      expect(treeMultimap.root?.right?.key).toBe('4');
      expect(treeMultimap.root?.right?.left?.key).toBe(undefined);
      expect(treeMultimap.root?.right?.right?.key).toBe('5');
    }

    const treeMultimap = new AVLTreeMultiMap<string, number>();
    treeMultimap.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(treeMultimap.size).toBe(5);
    expect(treeMultimap.root?.key).toBe('2');
    expect(treeMultimap.root?.left?.key).toBe('1');
    expect(treeMultimap.root?.left?.left?.key).toBe(undefined);
    expect(treeMultimap.root?.left?.right?.key).toBe(undefined);
    expect(treeMultimap.root?.right?.key).toBe('4');
    expect(treeMultimap.root?.right?.left?.key).toBe('3');
    expect(treeMultimap.root?.right?.right?.key).toBe('5');
    treeMultimap.delete('3');
    checkTreeStructure(treeMultimap);
    const cloned = treeMultimap.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(treeMultimap.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('AVLTreeMultiMap iterative methods test', () => {
  let treeMM: AVLTreeMultiMap<number, string>;
  beforeEach(() => {
    treeMM = new AVLTreeMultiMap<number, string>();
    treeMM.add(1, 'a', 10);
    treeMM.add([2, 'b'], undefined, 10);
    treeMM.add([3, 'c'], undefined, 1);
  });

  test('The node obtained by get Node should match the node type', () => {
    const node3 = treeMM.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
    expect(node3).toBeInstanceOf(AVLTreeNode);
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

describe('AVLTree toEntryFn', () => {
  it('should toEntryFn 1', () => {
    const tree = new AVLTreeMultiMap<number, number, { obj: { id: number } }>([], {
      toEntryFn: ele => [ele.obj.id, ele.obj.id]
    });
    tree.add({ obj: { id: 1 } });
    tree.add({ obj: { id: 2 } });
    tree.add({ obj: { id: 3 } });
    tree.add({ obj: { id: 4 } });
    tree.add({ obj: { id: 5 } });

    const expected = [1, 2, 3, 4, 5];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn 2', () => {
    const tree = new AVLTreeMultiMap<number, number, { obj: { id: number } }>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      {
        toEntryFn: ele => [ele.obj.id, ele.obj.id]
      }
    );

    const expected = [1, 2, 3, 4, 5];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn throw error', () => {
    expect(
      () =>
        new AVLTreeMultiMap<{ obj: { id: number } }, number>([
          { obj: { id: 1 } },
          { obj: { id: 2 } },
          { obj: { id: 3 } },
          { obj: { id: 4 } },
          { obj: { id: 5 } }
        ])
    ).toThrowError(
      `When comparing object types, a custom comparator must be defined in the constructor's options parameter.`
    );
  });

  it('should toEntryFn 3', () => {
    const tree = new AVLTreeMultiMap<{ obj: { id: number } }, number>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      { comparator: (a, b) => a.obj.id - b.obj.id }
    );

    const expected = [
      { obj: { id: 1 } },
      { obj: { id: 2 } },
      { obj: { id: 3 } },
      { obj: { id: 4 } },
      { obj: { id: 5 } }
    ];

    expect(tree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });
});
