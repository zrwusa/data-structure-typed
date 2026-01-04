import { AVLTreeCounter, AVLTreeCounterNode, IBinaryTree } from '../../../../src';
import { isDebugTest } from '../../../config';

const isDebug = isDebugTest;

describe('AVLTreeCounter count', () => {
  let avlCounter: AVLTreeCounter<number>;
  beforeEach(() => {
    avlCounter = new AVLTreeCounter<number>();
  });
  it('Should added isolated node count ', () => {
    avlCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new AVLTreeCounterNode(3, 33, 10);
    avlCounter.add(newNode);
    expect(avlCounter.count).toBe(15);
  });

  it('Should count', () => {
    avlCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
    avlCounter.add([2, 2], undefined, 10);
    avlCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 1);
    avlCounter.delete(2);
    expect(avlCounter.count).toBe(12);
    expect(avlCounter.getComputedCount()).toBe(16);
  });
});

describe('AVLTreeCounter operations test1', () => {
  it('should perform various operations on a AVLTreeCounter with numeric values1', () => {
    const avlCounter = new AVLTreeCounter<number>();

    expect(avlCounter instanceof AVLTreeCounter);
    avlCounter.add([11, 11]);
    avlCounter.add([3, 3]);
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
    avlCounter.addMany(idAndValues);
    expect(avlCounter.root instanceof AVLTreeCounterNode);

    if (avlCounter.root) expect(avlCounter.root.key == 11);

    expect(avlCounter.size).toBe(16);
    expect(avlCounter.count).toBe(18);

    expect(avlCounter.has(6));

    expect(avlCounter.getHeight(6)).toBe(4);
    expect(avlCounter.getDepth(6)).toBe(0);
    const nodeId10 = avlCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = avlCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = avlCounter.getNodes(node => node.count === 1);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = avlCounter.getNodes(node => node.count === 2);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = avlCounter.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = avlCounter.getNode(15);
    const minNodeBySpecificNode = node15 && avlCounter.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(15);

    let subTreeSum = 0;
    if (node15) avlCounter.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
    expect(subTreeSum).toBe(31);
    let lesserSum = 0;
    avlCounter.lesserOrGreaterTraverse((node: AVLTreeCounterNode<number>) => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof AVLTreeCounterNode);
    if (node15 instanceof AVLTreeCounterNode) {
      const subTreeAdd = avlCounter.dfs(node => (node.count += 1), 'PRE', false, 15);
      expect(subTreeAdd);
    }
    const node11 = avlCounter.getNode(11);
    expect(node11 instanceof AVLTreeCounterNode);
    if (node11 instanceof AVLTreeCounterNode) {
      const allGreaterNodesAdded = avlCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = avlCounter.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(avlCounter.isPerfectlyBalanced()).toBe(false);

    avlCounter.perfectlyBalance();

    expect(avlCounter.isPerfectlyBalanced()).toBe(true);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = avlCounter.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = avlCounter.delete(11, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight(15)).toBe(1);

    const removed1 = avlCounter.delete(1, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(4);

    const removed4 = avlCounter.delete(4, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(4);

    const removed10 = avlCounter.delete(10, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(3);

    const removed15 = avlCounter.delete(15, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed5 = avlCounter.delete(5, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed13 = avlCounter.delete(13, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed3 = avlCounter.delete(3, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed8 = avlCounter.delete(8, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed6 = avlCounter.delete(6, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(avlCounter.delete(6, true).length).toBe(0);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(2);

    const removed7 = avlCounter.delete(7, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(2);

    const removed9 = avlCounter.delete(9, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(2);

    const removed14 = avlCounter.delete(14, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(1);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    const bfsIDs = avlCounter.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = avlCounter.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(avlCounter.count).toBe(8);
  });

  it('should perform various operations on a AVLTreeCounter with object values', () => {
    const objAvlCounter = new AVLTreeCounter<number, { key: number; keyA: number }>();
    expect(objAvlCounter).toBeInstanceOf(AVLTreeCounter);
    objAvlCounter.add([11, { key: 11, keyA: 11 }]);
    objAvlCounter.add([3, { key: 3, keyA: 3 }]);
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

    objAvlCounter.addMany(values);

    expect(objAvlCounter.root).toBeInstanceOf(AVLTreeCounterNode);

    if (objAvlCounter.root) expect(objAvlCounter.root.key).toBe(6);

    expect(objAvlCounter.count).toBe(16);

    expect(objAvlCounter.has(6)).toBe(true);
  });
});

describe('AVLTreeCounter operations test recursively1', () => {
  it('should perform various operations on a AVLTreeCounter with numeric values1', () => {
    const avlCounter = new AVLTreeCounter<number>([], {
      iterationType: 'RECURSIVE'
    });

    expect(avlCounter instanceof AVLTreeCounter);
    avlCounter.add([11, 11]);
    avlCounter.add([3, 3]);
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
    avlCounter.addMany(idAndValues);
    expect(avlCounter.root).toBeInstanceOf(AVLTreeCounterNode);

    if (avlCounter.root) expect(avlCounter.root.key).toBe(6);

    expect(avlCounter.size).toBe(16);
    expect(avlCounter.count).toBe(18);

    expect(avlCounter.has(6));

    expect(avlCounter.getHeight(6)).toBe(4);
    expect(avlCounter.getDepth(6)).toBe(0);
    const nodeId10 = avlCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = avlCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = avlCounter.getNodes(node => node.count === 1);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = avlCounter.getNodes(node => node.count === 2);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = avlCounter.getLeftMost();
    expect(leftMost).toBe(1);

    const node15 = avlCounter.getNode(15);
    const minNodeBySpecificNode = node15 && avlCounter.getLeftMost(node => node, node15);
    expect(minNodeBySpecificNode?.key).toBe(15);

    let subTreeSum = 0;
    if (node15) avlCounter.dfs(node => (subTreeSum += node.key), 'PRE', false, 15);
    expect(subTreeSum).toBe(31);
    let lesserSum = 0;
    avlCounter.lesserOrGreaterTraverse((node: AVLTreeCounterNode<number>) => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof AVLTreeCounterNode);
    if (node15 instanceof AVLTreeCounterNode) {
      const subTreeAdd = avlCounter.dfs(node => (node.count += 1), 'PRE', false, 15);
      expect(subTreeAdd);
    }
    const node11 = avlCounter.getNode(11);
    expect(node11 instanceof AVLTreeCounterNode);
    if (node11 instanceof AVLTreeCounterNode) {
      const allGreaterNodesAdded = avlCounter.lesserOrGreaterTraverse(node => (node.count += 2), 1, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = avlCounter.dfs(node => node, 'IN');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(avlCounter.isPerfectlyBalanced()).toBe(true);

    avlCounter.perfectlyBalance();

    expect(avlCounter.isPerfectlyBalanced()).toBe(true);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = avlCounter.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = avlCounter.delete(11, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight(15)).toBe(1);

    const removed1 = avlCounter.delete(1, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(4);

    const removed4 = avlCounter.delete(4, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(4);

    const removed10 = avlCounter.delete(10, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(3);

    const removed15 = avlCounter.delete(15, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed5 = avlCounter.delete(5, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed13 = avlCounter.delete(13, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed3 = avlCounter.delete(3, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed8 = avlCounter.delete(8, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(3);

    const removed6 = avlCounter.delete(6, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(avlCounter.delete(6, true).length).toBe(0);
    expect(avlCounter.isAVLBalanced()).toBe(true);

    expect(avlCounter.getHeight()).toBe(2);

    const removed7 = avlCounter.delete(7, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(2);

    const removed9 = avlCounter.delete(9, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(2);

    const removed14 = avlCounter.delete(14, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(avlCounter.isAVLBalanced()).toBe(true);
    expect(avlCounter.getHeight()).toBe(1);

    expect(avlCounter.isAVLBalanced()).toBe(true);

    const bfsIDs = avlCounter.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = avlCounter.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(avlCounter.count).toBe(8);
  });

  it('should perform various operations on a AVLTreeCounter with object values', () => {
    const objAvlCounter = new AVLTreeCounter<number, { key: number; keyA: number }>();
    expect(objAvlCounter).toBeInstanceOf(AVLTreeCounter);
    objAvlCounter.add([11, { key: 11, keyA: 11 }]);
    objAvlCounter.add([3, { key: 3, keyA: 3 }]);
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

    objAvlCounter.addMany(values);

    expect(objAvlCounter.root).toBeInstanceOf(AVLTreeCounterNode);

    if (objAvlCounter.root) expect(objAvlCounter.root.key).toBe(6);

    expect(objAvlCounter.count).toBe(16);

    expect(objAvlCounter.has(6)).toBe(true);
  });
});

describe('AVLTreeCounter Performance test', function () {
  const avlCounter = new AVLTreeCounter<number, number>();
  const inputSize = 100000; // Adjust input sizes as needed

  beforeEach(() => {
    avlCounter.clear();
  });

  it(`Observe the time consumption of AVLTreeCounter.dfs be good`, function () {
    const startDFS = performance.now();
    const dfs = avlCounter.dfs(node => node);
    if (isDebug) console.log('---bfs', performance.now() - startDFS, dfs.length);
  });

  it('Should the time consumption of lesserOrGreaterTraverse fitting O(n log n)', function () {
    const start = performance.now();
    for (let i = 0; i < inputSize; i++) {
      avlCounter.add(i);
    }
    if (isDebug) console.log('---add', performance.now() - start);
    const startL = performance.now();
    avlCounter.lesserOrGreaterTraverse(node => (node.count += 1), -1, inputSize / 2);
    if (isDebug) console.log('---lesserOrGreaterTraverse', performance.now() - startL);
  });

  it('should the clone method', () => {
    function checkTreeStructure(avlCounter: IBinaryTree<string, number>) {
      expect(avlCounter.size).toBe(4);
      expect(avlCounter.root?.key).toBe('2');
      expect(avlCounter.root?.left?.key).toBe('1');
      expect(avlCounter.root?.left?.left?.key).toBe(undefined);
      expect(avlCounter.root?.left?.right?.key).toBe(undefined);
      expect(avlCounter.root?.right?.key).toBe('4');
      expect(avlCounter.root?.right?.left?.key).toBe(undefined);
      expect(avlCounter.root?.right?.right?.key).toBe('5');
    }

    const avlCounter = new AVLTreeCounter<string, number>();
    avlCounter.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(avlCounter.size).toBe(5);
    expect(avlCounter.root?.key).toBe('2');
    expect(avlCounter.root?.left?.key).toBe('1');
    expect(avlCounter.root?.left?.left?.key).toBe(undefined);
    expect(avlCounter.root?.left?.right?.key).toBe(undefined);
    expect(avlCounter.root?.right?.key).toBe('4');
    expect(avlCounter.root?.right?.left?.key).toBe('3');
    expect(avlCounter.root?.right?.right?.key).toBe('5');
    avlCounter.delete('3');
    checkTreeStructure(avlCounter);
    const cloned = avlCounter.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(avlCounter.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('AVLTreeCounter iterative methods test', () => {
  let avlCounter: AVLTreeCounter<number, string>;
  beforeEach(() => {
    avlCounter = new AVLTreeCounter<number, string>();
    avlCounter.add(1, 'a', 10);
    avlCounter.add([2, 'b'], undefined, 10);
    avlCounter.add([3, 'c'], undefined, 1);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = avlCounter.getNode(3);
    // expect(node3).toBeInstanceOf(BinaryTreeNode);
    // expect(node3).toBeInstanceOf(BSTNode);
    // expect(node3).toBeInstanceOf(AVLTreeNode);
    expect(node3).toBeInstanceOf(AVLTreeCounterNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    avlCounter.forEach((value, key) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
    expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
    expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
  });

  it('filter should return a new avlCounter with filtered elements', () => {
    const filteredTree = avlCounter.filter((_value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('map should return a new avlCounter with modified elements', () => {
    const avlCounterMapped = avlCounter.map((value, key) => [(key * 2).toString(), value]);
    expect(avlCounterMapped.size).toBe(3);
    expect([...avlCounterMapped]).toEqual([
      ['2', 'a'],
      ['4', 'b'],
      ['6', 'c']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = avlCounter.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of avlCounter) {
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
    expect(avlCounter.count).toBe(21);
    const cloned = avlCounter.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.get(cloned.root?.right)).toBe('c');
  });

  it('should keys', () => {
    const keys = avlCounter.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = avlCounter.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });
});

describe('AVLTreeCounter toEntryFn', () => {
  it('should toEntryFn 1', () => {
    const avlCounter = new AVLTreeCounter<number, number, { obj: { id: number } }>([], {
      toEntryFn: ele => [ele.obj.id, ele.obj.id]
    });
    avlCounter.addMany([
      { obj: { id: 1 } },
      { obj: { id: 2 } },
      { obj: { id: 3 } },
      { obj: { id: 4 } },
      { obj: { id: 5 } }
    ]);

    const expected = [1, 2, 3, 4, 5];

    expect(avlCounter.morris(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN', false, avlCounter.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn 2', () => {
    const avlCounter = new AVLTreeCounter<number, number, { obj: { id: number } }>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      {
        toEntryFn: ele => [ele.obj.id, ele.obj.id]
      }
    );

    const expected = [1, 2, 3, 4, 5];

    expect(avlCounter.morris(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN', false, avlCounter.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn throw error', () => {
    expect(
      () =>
        new AVLTreeCounter<{ obj: { id: number } }, number>([
          { obj: { id: 1 } },
          { obj: { id: 2 } },
          { obj: { id: 3 } },
          { obj: { id: 4 } },
          { obj: { id: 5 } }
        ])
    ).toThrowError(
      `When comparing object types, a custom specifyComparable must be defined in the constructor's options.`
    );
  });

  it('should toEntryFn 3', () => {
    const avlCounter = new AVLTreeCounter<{ obj: { id: number } }, number>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      {
        specifyComparable: key => key.obj.id
      }
    );

    const expected = [
      { obj: { id: 1 } },
      { obj: { id: 2 } },
      { obj: { id: 3 } },
      { obj: { id: 4 } },
      { obj: { id: 5 } }
    ];

    expect(avlCounter.morris(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(avlCounter.dfs(node => node.key, 'IN', false, avlCounter.root, 'RECURSIVE')).toEqual(expected);
  });
});

describe('AVLTreeCounter not map mode count', () => {
  let avlCounter: AVLTreeCounter<number>;
  beforeEach(() => {
    avlCounter = new AVLTreeCounter<number>([], { isMapMode: false });
  });
  it('Should added isolated node count ', () => {
    avlCounter.addMany([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5]
    ]);
    const newNode = new AVLTreeCounterNode(3, undefined, 10);
    avlCounter.add(newNode, 33);
    expect(avlCounter.count).toBe(15);
  });
});

describe('AVLTreeCounter not map mode operations test1', () => {
  it('should perform various operations on a AVLTreeCounter with numeric values1', () => {
    const avlCounter = new AVLTreeCounter<number>([], { isMapMode: false });

    expect(avlCounter instanceof AVLTreeCounter);
    avlCounter.add([11, 11]);
    avlCounter.add([3, 3]);
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
    avlCounter.addMany(idAndValues);
    expect(avlCounter.root instanceof AVLTreeCounterNode);

    if (avlCounter.root) expect(avlCounter.root.key == 11);

    expect(avlCounter.size).toBe(16);
    expect(avlCounter.count).toBe(18);

    expect(avlCounter.has(6));

    expect(avlCounter.getHeight(6)).toBe(4);
    expect(avlCounter.getDepth(6)).toBe(0);
    const nodeId10 = avlCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = avlCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);
  });
});

describe('AVLTreeCounter not map mode operations test recursively1', () => {
  it('should perform various operations on a AVLTreeCounter with numeric values1', () => {
    const avlCounter = new AVLTreeCounter<number>([], {
      iterationType: 'RECURSIVE',
      isMapMode: false
    });

    expect(avlCounter instanceof AVLTreeCounter);
    avlCounter.add([11, 11]);
    avlCounter.add([3, 3]);
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
    avlCounter.addMany(idAndValues);
    expect(avlCounter.root).toBeInstanceOf(AVLTreeCounterNode);

    if (avlCounter.root) expect(avlCounter.root.key).toBe(6);

    expect(avlCounter.size).toBe(16);
    expect(avlCounter.count).toBe(18);

    expect(avlCounter.has(6));

    expect(avlCounter.getHeight(6)).toBe(4);
    expect(avlCounter.getDepth(6)).toBe(0);
    const nodeId10 = avlCounter.getNode(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = avlCounter.getNode(node => node.key === 9);
    expect(nodeVal9?.key).toBe(9);
  });
});
