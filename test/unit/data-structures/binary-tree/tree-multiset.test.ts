import {TreeMultiset, TreeMultisetNode} from '../../../../src';

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
    expect(treeMultiset.bfs('key'));

    expect(treeMultiset.has(6));

    expect(treeMultiset.getHeight(6)).toBe(3);
    expect(treeMultiset.getDepth(6)).toBe(1);
    const nodeId10 = treeMultiset.get(10);
    expect(nodeId10?.key).toBe(10);

    const nodeVal9 = treeMultiset.get(9, 'val');
    expect(nodeVal9?.key).toBe(9);

    const nodesByCount1 = treeMultiset.getNodesByCount(1);
    expect(nodesByCount1.length).toBe(14);

    const nodesByCount2 = treeMultiset.getNodesByCount(2);
    expect(nodesByCount2.length).toBe(2);
    const leftMost = treeMultiset.getLeftMost();
    expect(leftMost?.key).toBe(1);

    const node15 = treeMultiset.get(15);
    const minNodeBySpecificNode = node15 && treeMultiset.getLeftMost(node15);
    expect(minNodeBySpecificNode?.key).toBe(12);

    const subTreeSum = node15 && treeMultiset.subTreeSum(15);
    expect(subTreeSum).toBe(70);
    const lesserSum = treeMultiset.lesserSum(10);
    expect(lesserSum).toBe(45);

    expect(node15 instanceof TreeMultisetNode);
    if (node15 instanceof TreeMultisetNode) {
      const subTreeAdd = treeMultiset.subTreeAddCount(15, 1);
      expect(subTreeAdd);
    }
    const node11 = treeMultiset.get(11);
    expect(node11 instanceof TreeMultisetNode);
    if (node11 instanceof TreeMultisetNode) {
      const allGreaterNodesAdded = treeMultiset.allGreaterNodesAddCount(11, 2);
      expect(allGreaterNodesAdded);
    }

    const dfsInorderNodes = treeMultiset.dfs('in', 'node');
    expect(dfsInorderNodes[0].key).toBe(1);
    expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    expect(treeMultiset.isPerfectlyBalanced()).toBe(false);

    treeMultiset.perfectlyBalance();

    expect(treeMultiset.isPerfectlyBalanced()).toBe(true);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsNodesAfterBalanced = treeMultiset.bfs('node');
    expect(bfsNodesAfterBalanced[0].key).toBe(8);
    expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);

    const removed11 = treeMultiset.remove(11, true);
    expect(removed11 instanceof Array);
    expect(removed11[0]);
    expect(removed11[0].deleted);

    if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight(15)).toBe(1);

    const removed1 = treeMultiset.remove(1, true);
    expect(removed1 instanceof Array);
    expect(removed1[0]);
    expect(removed1[0].deleted);
    if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(4);

    const removed4 = treeMultiset.remove(4, true);
    expect(removed4 instanceof Array);
    expect(removed4[0]);
    expect(removed4[0].deleted);
    if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(4);

    const removed10 = treeMultiset.remove(10, true);
    expect(removed10 instanceof Array);
    expect(removed10[0]);
    expect(removed10[0].deleted);
    if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(3);

    const removed15 = treeMultiset.remove(15, true);
    expect(removed15 instanceof Array);
    expect(removed15[0]);
    expect(removed15[0].deleted);
    if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed5 = treeMultiset.remove(5, true);
    expect(removed5 instanceof Array);
    expect(removed5[0]);
    expect(removed5[0].deleted);
    if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);

    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed13 = treeMultiset.remove(13, true);
    expect(removed13 instanceof Array);
    expect(removed13[0]);
    expect(removed13[0].deleted);
    if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed3 = treeMultiset.remove(3, true);
    expect(removed3 instanceof Array);
    expect(removed3[0]);
    expect(removed3[0].deleted);
    if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed8 = treeMultiset.remove(8, true);
    expect(removed8 instanceof Array);
    expect(removed8[0]);
    expect(removed8[0].deleted);
    if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(3);

    const removed6 = treeMultiset.remove(6, true);
    expect(removed6 instanceof Array);
    expect(removed6[0]);
    expect(removed6[0].deleted);
    if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    expect(treeMultiset.remove(6, true).length).toBe(0);
    expect(treeMultiset.isAVLBalanced()).toBe(true);

    expect(treeMultiset.getHeight()).toBe(2);

    const removed7 = treeMultiset.remove(7, true);
    expect(removed7 instanceof Array);
    expect(removed7[0]);
    expect(removed7[0].deleted);
    if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed9 = treeMultiset.remove(9, true);
    expect(removed9 instanceof Array);
    expect(removed9[0]);
    expect(removed9[0].deleted);
    if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(2);

    const removed14 = treeMultiset.remove(14, true);
    expect(removed14 instanceof Array);
    expect(removed14[0]);
    expect(removed14[0].deleted);
    if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    expect(treeMultiset.isAVLBalanced()).toBe(true);
    expect(treeMultiset.getHeight()).toBe(1);

    expect(treeMultiset.isAVLBalanced()).toBe(true);

    const bfsIDs = treeMultiset.bfs();

    expect(bfsIDs[0]).toBe(12);
    expect(bfsIDs[1]).toBe(2);
    expect(bfsIDs[2]).toBe(16);

    const bfsNodes = treeMultiset.bfs('node');

    expect(bfsNodes[0].key).toBe(12);
    expect(bfsNodes[1].key).toBe(2);
    expect(bfsNodes[2].key).toBe(16);

    expect(treeMultiset.count).toBe(9);
  });

  it('should perform various operations on a Binary Search Tree with object values', () => {
    const objTreeMultiset = new TreeMultiset<TreeMultisetNode<{key: number; keyA: number}>>();
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

    // const node6 = objTreeMultiset.get(6);
    // expect(node6 && objTreeMultiset.getHeight(node6)).toBe(2);
    // expect(node6 && objTreeMultiset.getDepth(node6)).toBe(3);
    //
    // const nodeId10 = objTreeMultiset.get(10, 'key');
    // expect(nodeId10?.key).toBe(10);
    //
    // const nodeVal9 = objTreeMultiset.get(9, 'key');
    // expect(nodeVal9?.key).toBe(9);
    //
    // const nodesByCount1 = objTreeMultiset.getNodesByCount(1);
    // expect(nodesByCount1.length).toBe(16);
    //
    // const leftMost = objTreeMultiset.getLeftMost();
    // expect(leftMost?.key).toBe(1);
    //
    // const node15 = objTreeMultiset.get(15);
    // expect(node15?.val).toEqual({key: 15, keyA: 15});
    // const minNodeBySpecificNode = node15 && objTreeMultiset.getLeftMost(node15);
    // expect(minNodeBySpecificNode?.key).toBe(12);
    //
    // const subTreeSum = node15 && objTreeMultiset.subTreeSum(node15);
    // expect(subTreeSum).toBe(70);
    //
    // const lesserSum = objTreeMultiset.lesserSum(10);
    // expect(lesserSum).toBe(45);
    //
    // expect(node15).toBeInstanceOf(TreeMultisetNode);
    // if (node15 instanceof TreeMultisetNode) {
    //     const subTreeAdd = objTreeMultiset.subTreeAddCount(node15, 1);
    //     expect(subTreeAdd).toBeDefined();
    // }
    //
    // const node11 = objTreeMultiset.get(11);
    // expect(node11).toBeInstanceOf(TreeMultisetNode);
    // if (node11 instanceof TreeMultisetNode) {
    //     const allGreaterNodesAdded = objTreeMultiset.allGreaterNodesAddCount(node11, 2);
    //     expect(allGreaterNodesAdded).toBeDefined();
    // }
    //
    // const dfsInorderNodes = objTreeMultiset.dfs('in', 'node');
    // expect(dfsInorderNodes[0].key).toBe(1);
    // expect(dfsInorderNodes[dfsInorderNodes.length - 1].key).toBe(16);
    //
    // objTreeMultiset.perfectlyBalance();
    // expect(objTreeMultiset.isPerfectlyBalanced()).toBe(true);
    //
    // const bfsNodesAfterBalanced = objTreeMultiset.bfs('node');
    // expect(bfsNodesAfterBalanced[0].key).toBe(8);
    // expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].key).toBe(16);
    //
    // const removed11 = objTreeMultiset.remove(11, true);
    // expect(removed11).toBeInstanceOf(Array);
    // expect(removed11[0]).toBeDefined();
    // expect(removed11[0].deleted).toBeDefined();
    //
    // if (removed11[0].deleted) expect(removed11[0].deleted.key).toBe(11);
    //
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    //
    // expect(node15 && objTreeMultiset.getHeight(node15)).toBe(2);
    //
    // const removed1 = objTreeMultiset.remove(1, true);
    // expect(removed1).toBeInstanceOf(Array);
    // expect(removed1[0]).toBeDefined();
    // expect(removed1[0].deleted).toBeDefined();
    // if (removed1[0].deleted) expect(removed1[0].deleted.key).toBe(1);
    //
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    //
    // expect(objTreeMultiset.getHeight()).toBe(4);
    //
    // const removed4 = objTreeMultiset.remove(4, true);
    // expect(removed4).toBeInstanceOf(Array);
    // expect(removed4[0]).toBeDefined();
    // expect(removed4[0].deleted).toBeDefined();
    // if (removed4[0].deleted) expect(removed4[0].deleted.key).toBe(4);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    // expect(objTreeMultiset.getHeight()).toBe(4);
    //
    // const removed10 = objTreeMultiset.remove(10, true);
    // expect(removed10).toBeInstanceOf(Array);
    // expect(removed10[0]).toBeDefined();
    // expect(removed10[0].deleted).toBeDefined();
    // if (removed10[0].deleted) expect(removed10[0].deleted.key).toBe(10);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(4);
    //
    // const removed15 = objTreeMultiset.remove(15, true);
    // expect(removed15).toBeInstanceOf(Array);
    // expect(removed15[0]).toBeDefined();
    // expect(removed15[0].deleted).toBeDefined();
    // if (removed15[0].deleted) expect(removed15[0].deleted.key).toBe(15);
    //
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed5 = objTreeMultiset.remove(5, true);
    // expect(removed5).toBeInstanceOf(Array);
    // expect(removed5[0]).toBeDefined();
    // expect(removed5[0].deleted).toBeDefined();
    // if (removed5[0].deleted) expect(removed5[0].deleted.key).toBe(5);
    //
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed13 = objTreeMultiset.remove(13, true);
    // expect(removed13).toBeInstanceOf(Array);
    // expect(removed13[0]).toBeDefined();
    // expect(removed13[0].deleted).toBeDefined();
    // if (removed13[0].deleted) expect(removed13[0].deleted.key).toBe(13);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed3 = objTreeMultiset.remove(3, true);
    // expect(removed3).toBeInstanceOf(Array);
    // expect(removed3[0]).toBeDefined();
    // expect(removed3[0].deleted).toBeDefined();
    // if (removed3[0].deleted) expect(removed3[0].deleted.key).toBe(3);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed8 = objTreeMultiset.remove(8, true);
    // expect(removed8).toBeInstanceOf(Array);
    // expect(removed8[0]).toBeDefined();
    // expect(removed8[0].deleted).toBeDefined();
    // if (removed8[0].deleted) expect(removed8[0].deleted.key).toBe(8);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(true);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed6 = objTreeMultiset.remove(6, true);
    // expect(removed6).toBeInstanceOf(Array);
    // expect(removed6[0]).toBeDefined();
    // expect(removed6[0].deleted).toBeDefined();
    // if (removed6[0].deleted) expect(removed6[0].deleted.key).toBe(6);
    // expect(objTreeMultiset.remove(6, true).length).toBe(0);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed7 = objTreeMultiset.remove(7, true);
    // expect(removed7).toBeInstanceOf(Array);
    // expect(removed7[0]).toBeDefined();
    // expect(removed7[0].deleted).toBeDefined();
    // if (removed7[0].deleted) expect(removed7[0].deleted.key).toBe(7);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed9 = objTreeMultiset.remove(9, true);
    // expect(removed9).toBeInstanceOf(Array);
    // expect(removed9[0]).toBeDefined();
    // expect(removed9[0].deleted).toBeDefined();
    // if (removed9[0].deleted) expect(removed9[0].deleted.key).toBe(9);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(3);
    //
    // const removed14 = objTreeMultiset.remove(14, true);
    // expect(removed14).toBeInstanceOf(Array);
    // expect(removed14[0]).toBeDefined();
    // expect(removed14[0].deleted).toBeDefined();
    // if (removed14[0].deleted) expect(removed14[0].deleted.key).toBe(14);
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    // expect(objTreeMultiset.getHeight()).toBe(2);
    //
    //
    // expect(objTreeMultiset.isAVLBalanced()).toBe(false);
    //
    // const bfsIDs = objTreeMultiset.bfs();
    // expect(bfsIDs[0]).toBe(2);
    // expect(bfsIDs[1]).toBe(12);
    // expect(bfsIDs[2]).toBe(16);
    //
    // const bfsNodes = objTreeMultiset.bfs('node');
    // expect(bfsNodes[0].key).toBe(2);
    // expect(bfsNodes[1].key).toBe(12);
    // expect(bfsNodes[2].key).toBe(16);
    //
    // expect(objTreeMultiset.count).toBe(5);
  });
});

describe('TreeMultiset Performance test', function () {
  // const treeMS = new TreeMultiset<TreeMultisetNode<number>>();
  // const inputSizes = [100]; // Adjust input sizes as needed
  //
  // // Define a function to calculate the expected O(n log n) time
  // function expectedTime(n: number): number {
  //   return n * Math.log(n);
  // }

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
    // const inputArray = generateRandomArray(inputSizes[0]);
    //
    // suite.add(`TreeMultiset addMany (n=${inputSizes[0]})`, () => {
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
    //     console.log(`Benchmark (n=${inputSizes[0]}) completed.`);
    //     done(); // Call done to indicate the test is complete
    //   })
    //   .run({async: true});
  });
});
