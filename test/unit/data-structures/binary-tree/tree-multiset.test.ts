import {CP, IterationType, TreeMultiset, TreeMultisetNode} from '../../../../src';
import {isDebugTest} from '../../../config';

const isDebug = isDebugTest;

describe('TreeMultiset operations test', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const treeMultiset = new TreeMultiset();

    expect(treeMultiset instanceof TreeMultiset);
    treeMultiset.add(11, 11);
    treeMultiset.add(3, 3);
    const idAndValues = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    treeMultiset.addMany(idAndValues, idAndValues);
    expect(treeMultiset.root instanceof TreeMultisetNode);

    if (treeMultiset.root) expect(treeMultiset.root.key == 11);

    expect(treeMultiset.size).toBe(16);
    expect(treeMultiset.count).toBe(18);

    expect(treeMultiset.has(6));

    expect(treeMultiset.getHeight(6)).toBe(3);
    expect(treeMultiset.getDepth(6)).toBe(1);
    const nodeId10 = treeMultiset.get(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeMultiset.get(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeMultiset.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeMultiset.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeMultiset.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = treeMultiset.get(15);
    const minNodeBySpecificNode = node15 && treeMultiset.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && treeMultiset.subTreeTraverse((node: TreeMultisetNode<number>) => (subTreeSum += node.key), 15);
    expect(subTreeSum).toBe(70);
    let lesserSum = 0;
    treeMultiset.lesserOrGreaterTraverse((node: TreeMultisetNode<number>) => (lesserSum += node.key), CP.lt, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeMultisetNode);
    if (node15 instanceof TreeMultisetNode) {
      const subTreeAdd = treeMultiset.subTreeTraverse((node: TreeMultisetNode<number>) => (node.count += 1), 15);
      expect(subTreeAdd);
    }
    const node11 = treeMultiset.get(11);
    expect(node11 instanceof TreeMultisetNode);
    if (node11 instanceof TreeMultisetNode) {
      const allGreaterNodesAdded = treeMultiset.lesserOrGreaterTraverse(node => (node.count += 2), CP.gt, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeMultiset.dfs(node => node, 'in');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeMultiset.isPerfectlyBalanced()).toBe(false);

    treeMultiset.perfectlyBalance();

    expect(treeMultiset.isPerfectlyBalanced()).toBe(true);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = treeMultiset.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeMultiset.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight(15)).toBe(1);

    const removed1 = treeMultiset.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(4);

    const removed4 = treeMultiset.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(4);

    const removed10 = treeMultiset.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(3);

    const removed15 = treeMultiset.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed5 = treeMultiset.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed13 = treeMultiset.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed3 = treeMultiset.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed8 = treeMultiset.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed6 = treeMultiset.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeMultiset.delete(6, undefined, true).length).toBe(0);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(2);

    const removed7 = treeMultiset.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed9 = treeMultiset.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed14 = treeMultiset.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsIDs = treeMultiset.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeMultiset.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeMultiset.count).toBe(9);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objTreeMultiset = new TreeMultiset<{key: number; keyA: number}>();
    expect(objTreeMultiset).toBeInstanceOf(TreeMultiset);
    objTreeMultiset.add(11, {key: 11, keyA: 11});
    objTreeMultiset.add(3, {key: 3, keyA: 3});
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

    objTreeMultiset.addMany(
      values.map(item => item.key),
      values
    );

    expect(objTreeMultiset.root).toBeInstanceOf(TreeMultisetNode);

    if (objTreeMultiset.root) expect(objTreeMultiset.root.key).toBe(11);

    expect(objTreeMultiset.count).toBe(16);

    expect(objTreeMultiset.has(6)).toBe(true);
  });
});

describe('TreeMultiset operations test recursively', () => {
  it('should perform various operations on a Binary Search Tree with numeric values', () => {
    const treeMultiset = new TreeMultiset({iterationType: IterationType.RECURSIVE});

    expect(treeMultiset instanceof TreeMultiset);
    treeMultiset.add(11, 11);
    treeMultiset.add(3, 3);
    const idAndValues = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    treeMultiset.addMany(idAndValues, idAndValues);
    expect(treeMultiset.root instanceof TreeMultisetNode);

    if (treeMultiset.root) expect(treeMultiset.root.key == 11);

    expect(treeMultiset.size).toBe(16);
    expect(treeMultiset.count).toBe(18);

    expect(treeMultiset.has(6));

    expect(treeMultiset.getHeight(6)).toBe(3);
    expect(treeMultiset.getDepth(6)).toBe(1);
    const nodeId10 = treeMultiset.get(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeMultiset.get(9, node => node.value);
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeMultiset.getNodes(1, node => node.count);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeMultiset.getNodes(2, node => node.count);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeMultiset.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = treeMultiset.get(15);
    const minNodeBySpecificNode = node15 && treeMultiset.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && treeMultiset.subTreeTraverse((node: TreeMultisetNode<number>) => (subTreeSum += node.key), 15);
    expect(subTreeSum).toBe(70);
    let lesserSum = 0;
    treeMultiset.lesserOrGreaterTraverse((node: TreeMultisetNode<number>) => (lesserSum += node.key), CP.lt, 10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeMultisetNode);
    if (node15 instanceof TreeMultisetNode) {
      const subTreeAdd = treeMultiset.subTreeTraverse((node: TreeMultisetNode<number>) => (node.count += 1), 15);
      expect(subTreeAdd);
    }
    const node11 = treeMultiset.get(11);
    expect(node11 instanceof TreeMultisetNode);
    if (node11 instanceof TreeMultisetNode) {
      const allGreaterNodesAdded = treeMultiset.lesserOrGreaterTraverse(node => (node.count += 2), CP.gt, 11);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeMultiset.dfs(node => node, 'in');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeMultiset.isPerfectlyBalanced()).toBe(false);

    treeMultiset.perfectlyBalance();

    expect(treeMultiset.isPerfectlyBalanced()).toBe(true);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = treeMultiset.bfs(node => node);
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeMultiset.delete(11, undefined, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight(15)).toBe(1);

    const removed1 = treeMultiset.delete(1, undefined, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(4);

    const removed4 = treeMultiset.delete(4, undefined, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(4);

    const removed10 = treeMultiset.delete(10, undefined, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(3);

    const removed15 = treeMultiset.delete(15, undefined, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed5 = treeMultiset.delete(5, undefined, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed13 = treeMultiset.delete(13, undefined, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed3 = treeMultiset.delete(3, undefined, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed8 = treeMultiset.delete(8, undefined, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed6 = treeMultiset.delete(6, undefined, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeMultiset.delete(6, undefined, true).length).toBe(0);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(2);

    const removed7 = treeMultiset.delete(7, undefined, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed9 = treeMultiset.delete(9, undefined, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed14 = treeMultiset.delete(14, undefined, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsIDs = treeMultiset.bfs(node => node.key);

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeMultiset.bfs(node => node);

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeMultiset.count).toBe(9);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objTreeMultiset = new TreeMultiset<{key: number; keyA: number}>();
    expect(objTreeMultiset).toBeInstanceOf(TreeMultiset);
    objTreeMultiset.add(11, {key: 11, keyA: 11});
    objTreeMultiset.add(3, {key: 3, keyA: 3});
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

    objTreeMultiset.addMany(
      values.map(item => item.key),
      values
    );

    expect(objTreeMultiset.root).toBeInstanceOf(TreeMultisetNode);

    if (objTreeMultiset.root) expect(objTreeMultiset.root.key).toBe(11);

    expect(objTreeMultiset.count).toBe(16);

    expect(objTreeMultiset.has(6)).toBe(true);
  });
});

describe('TreeMultiset Performance test', function () {
  const treeMS = new TreeMultiset<TreeMultisetNode<number>>();
  const inputSize = 100000; // Adjust input sizes as needed

  beforeEach(() => {
    treeMS.clear();
  });
  it(`Observe the time consumption of TreeMultiset.add fitting O(n log n)`, function () {
    // // Create a benchmark suite
    // const suite = new Benchmark.Suite();
    // // Define a function to generate a random array of a given size
    // function generateRandomArray(size: number): number[] {
    //   const arr: number[] = [];
    //   for (let i = 0; i < size; i++) {
    //     arr.push(Math.floor(Math.random() * size));
    //   }
    //   return arr;
    // }
    // const inputArray = generateRandomArray(inputSize[0]);
    //
    // suite.add(`TreeMultiset addMany (n=${inputSize[0]})`, () => {
    //   treeMS.addMany([...inputArray]);
    // });
    //
    // // Run the benchmarks
    // suite
    //   .on('cycle', (event: any) => {
    //     const benchmark = event.target;
    //     const n = parseInt(benchmark.name.split('=')[1]);
    //     const observedTime = benchmark.times.elapsed;
    //     const expected = expectedTime(n);
    //     console.log(`Input size (n): ${n}, Observed time: ${observedTime.toFixed(2)}ms, Expected time: ${expected.toFixed(2)}ms`);
    //   })
    //   .on('complete', () => {
    //     console.log(`Benchmark (n=${inputSize[0]}) completed.`);
    //     done(); // Call done to indicate the test is complete
    //   })
    //   .run({async: true});
  });

  it(`Observe the time consumption of TreeMultiset.dfs be good`, function () {
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
    treeMS.lesserOrGreaterTraverse(node => (node.count += 1), CP.lt, inputSize / 2);
    isDebug && console.log('---lesserOrGreaterTraverse', performance.now() - startL);
  });
});
