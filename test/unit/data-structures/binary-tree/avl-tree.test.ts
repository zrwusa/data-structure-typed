import { AVLTree, AVLTreeNode, IBinaryTree } from '../../../../src';

describe('AVL Tree Test', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTree = new AVLTree<number>();

    for (const i of arr) avlTree.add([i, i]);

    avlTree.add(null);
    const node6 = avlTree.getNode(6);

    expect(node6 && avlTree.getHeight(node6)).toBe(3);
    expect(node6 && avlTree.getDepth(node6)).toBe(1);

    const getNodeById = avlTree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTree.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTree.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(undefined);
    const dfs = avlTree.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);
    avlTree.perfectlyBalance();
    const bfs = avlTree.bfs(node => node);
    expect(avlTree.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(avlTree.delete(avlTree.getNode(11))[0].deleted?.key).toBe(11);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(node15 && avlTree.getHeight(node15)).toBe(1);

    expect(avlTree.delete(1)[0].deleted?.key).toBe(1);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(4);

    expect(avlTree.delete(4)[0].deleted?.key).toBe(4);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(4);

    expect(avlTree.delete(10)[0].deleted?.key).toBe(10);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(15)[0].deleted?.key).toBe(15);
    expect(avlTree.isAVLBalanced()).toBe(true);

    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(5)[0].deleted?.key).toBe(5);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(13)[0].deleted?.key).toBe(13);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(3)[0].deleted?.key).toBe(3);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(8)[0].deleted?.key).toBe(8);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(6)[0].deleted?.key).toBe(6);
    expect(avlTree.delete(6).length).toBe(0);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);

    expect(avlTree.delete(7)[0].deleted?.key).toBe(7);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);

    expect(avlTree.delete(9)[0].deleted?.key).toBe(9);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);
    expect(avlTree.delete(14)[0].deleted?.key).toBe(14);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(1);

    expect(avlTree.isAVLBalanced()).toBe(true);
    const lastBFSIds = avlTree.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = avlTree.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });

  it('should replace value', () => {
    const avlTree = new AVLTree<number, string>([4, 5, [1, '1'], 2, 3], { isMapMode: false });
    expect(avlTree.get(1)).toBe('1');
    expect(avlTree.getNode(1)?.value).toBe('1');
    avlTree.add(1, 'a');
    expect(avlTree.get(1)).toBe('a');
    avlTree.add([1, 'b']);
    expect(avlTree.getNode(1)?.value).toBe('b');
    expect(avlTree.get(1)).toBe('b');
    const treeMap = new AVLTree<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    treeMap.add(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.add([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    expect(treeMap.get(1)).toBe('b');
  });
});

describe('AVL Tree Test recursively', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTree = new AVLTree<number>([], { iterationType: 'RECURSIVE' });

    for (const i of arr) avlTree.add([i, i]);

    const node6 = avlTree.getNode(6);

    expect(node6 && avlTree.getHeight(node6)).toBe(3);
    expect(node6 && avlTree.getDepth(node6)).toBe(1);

    const getNodeById = avlTree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTree.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTree.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(undefined);

    const dfs = avlTree.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);

    avlTree.perfectlyBalance();
    const bfs = avlTree.bfs(node => node);
    expect(avlTree.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(avlTree.delete(11)[0].deleted?.key).toBe(11);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(node15 && avlTree.getHeight(node15)).toBe(1);

    expect(avlTree.delete(1)[0].deleted?.key).toBe(1);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(4);

    expect(avlTree.delete(4)[0].deleted?.key).toBe(4);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(4);

    expect(avlTree.delete(10)[0].deleted?.key).toBe(10);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(15)[0].deleted?.key).toBe(15);
    expect(avlTree.isAVLBalanced()).toBe(true);

    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(5)[0].deleted?.key).toBe(5);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(13)[0].deleted?.key).toBe(13);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(3)[0].deleted?.key).toBe(3);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(8)[0].deleted?.key).toBe(8);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(3);

    expect(avlTree.delete(6)[0].deleted?.key).toBe(6);
    expect(avlTree.delete(6).length).toBe(0);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);

    expect(avlTree.delete(7)[0].deleted?.key).toBe(7);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);

    expect(avlTree.delete(9)[0].deleted?.key).toBe(9);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(2);
    expect(avlTree.delete(14)[0].deleted?.key).toBe(14);
    expect(avlTree.isAVLBalanced()).toBe(true);
    expect(avlTree.getHeight()).toBe(1);

    expect(avlTree.isAVLBalanced()).toBe(true);
    const lastBFSIds = avlTree.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = avlTree.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });
});

describe('AVLTree APIs test', () => {
  const avlTree = new AVLTree<number, { id: number; text: string }>();
  beforeEach(() => {
    avlTree.clear();
  });

  it('add', () => {
    avlTree.add(1);
    const node2 = new AVLTreeNode(2);
    avlTree.add(node2);
    const node3 = new AVLTreeNode(3, {
      id: 3,
      text: 'text3'
    });
    avlTree.add(node3);
    avlTree.add([3, { id: 3, text: 'text33' }]);

    const bfsRes = avlTree.bfs(node => node.key);
    expect(bfsRes[0]).toBe(2);
  });

  it('should the clone method', () => {
    function checkTreeStructure(avlTree: IBinaryTree<string, number>) {
      expect(avlTree.size).toBe(4);
      expect(avlTree.root?.key).toBe('2');
      expect(avlTree.root?.left?.key).toBe('1');
      expect(avlTree.root?.left?.left?.key).toBe(undefined);
      expect(avlTree.root?.left?.right?.key).toBe(undefined);
      expect(avlTree.root?.right?.key).toBe('4');
      expect(avlTree.root?.right?.left?.key).toBe(undefined);
      expect(avlTree.root?.right?.right?.key).toBe('5');
    }

    const avlTree = new AVLTree<string, number>();
    avlTree.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(avlTree.size).toBe(5);
    expect(avlTree.root?.key).toBe('2');
    expect(avlTree.root?.left?.key).toBe('1');
    expect(avlTree.root?.left?.left?.key).toBe(undefined);
    expect(avlTree.root?.left?.right?.key).toBe(undefined);
    expect(avlTree.root?.right?.key).toBe('4');
    expect(avlTree.root?.right?.left?.key).toBe('3');
    expect(avlTree.root?.right?.right?.key).toBe('5');
    avlTree.delete('3');
    checkTreeStructure(avlTree);
    const cloned = avlTree.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(avlTree.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('AVLTree', () => {
  it('should balance the avlTree using _balanceLR when nodes are added', () => {
    const avlTree = new AVLTree();
    avlTree.add([10, 'A']);
    avlTree.add([5, 'B']);
    avlTree.add([15, 'C']);
    avlTree.add([3, 'D']);
    avlTree.add([7, 'E']);

    // Adding nodes to trigger _balanceLR
    avlTree.add([12, 'F']);

    // You can add more specific assertions to check the avlTree's balance and structure.
  });

  it('should addMany undefined and null', () => {
    const avlTree = new AVLTree<number, string>();
    const addManyWithUndefined = avlTree.addMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(avlTree.get(undefined)).toBe(undefined);
    const addManyWithNull = avlTree.addMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, false, true, true]);
    const addManyEntriesWithNull = avlTree.addMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, false, true, true]);
    expect(avlTree.get(null)).toBe(undefined);
    const node0 = avlTree.add(0, '0');
    expect(node0).toBe(true);
    expect(avlTree.get(0)).toBe('0');
  });

  it('should balance the avlTree using _balanceLR when nodes are deleted', () => {
    const avlTree = new AVLTree();
    avlTree.add([10, 'A']);
    avlTree.add([5, 'B']);
    avlTree.add([15, 'C']);
    avlTree.add([3, 'D']);
    avlTree.add([7, 'E']);
    avlTree.add([12, 'F']);

    // Deleting nodes to trigger _balanceLR
    avlTree.delete(3);

    // You can add more specific assertions to check the avlTree's balance and structure.
  });

  describe('AVLTree APIs test', () => {
    const avlTree = new AVLTree<number, { id: number; text: string }>();
    beforeEach(() => {
      avlTree.clear();
    });

    it('add', () => {
      avlTree.add(1);
      const node2 = new AVLTreeNode(2);
      avlTree.add(node2);
      const node3 = new AVLTreeNode(3, {
        id: 3,
        text: 'text3'
      });
      avlTree.add(node3);
      avlTree.add([3, { id: 3, text: 'text33' }]);

      const bfsRes = avlTree.bfs(node => node);
      expect(bfsRes[0]?.key).toBe(2);
    });
  });
});

describe('AVLTree iterative methods test', () => {
  let avlTree: AVLTree<number, string>;
  beforeEach(() => {
    avlTree = new AVLTree();
    avlTree.add([1, 'a']);
    avlTree.add([2, 'b']);
    avlTree.add([3, 'c']);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = avlTree.getNode(3);
    // expect(node3).toBeInstanceOf(BinaryTreeNode);
    // expect(node3).toBeInstanceOf(BSTNode);
    expect(node3).toBeInstanceOf(AVLTreeNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    avlTree.forEach((value, key) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
    expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
    expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
  });

  it('filter should return a new avlTree with filtered elements', () => {
    const filteredTree = avlTree.filter((_value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('map should return a new avlTree with modified elements', () => {
    const mappedTree = avlTree.map((value, key) => [(key * 2).toString(), value]);
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      ['2', 'a'],
      ['4', 'b'],
      ['6', 'c']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = avlTree.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of avlTree) {
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
    const cloned = avlTree.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.root?.right?.value).toBe(undefined);
  });

  it('should keys', () => {
    const keys = avlTree.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = avlTree.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });

  it('should leaves', () => {
    const leaves = avlTree.leaves();
    expect(leaves).toEqual([1, 3]);
  });
});

describe('AVL Tree not map mode', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTree = new AVLTree<number>([], { isMapMode: false });

    for (const i of arr) avlTree.add([i, i]);

    avlTree.add(null);
    const node6 = avlTree.getNode(6);

    expect(node6 && avlTree.getHeight(node6)).toBe(3);
    expect(node6 && avlTree.getDepth(node6)).toBe(1);

    const getNodeById = avlTree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTree.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTree.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTree.get(node15)).toBe(15);
  });
});

describe('AVL Tree not map mode test recursively', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTree = new AVLTree<number>([], { iterationType: 'RECURSIVE', isMapMode: false });

    for (const i of arr) avlTree.add([i, i]);

    const node6 = avlTree.getNode(6);

    expect(node6 && avlTree.getHeight(node6)).toBe(3);
    expect(node6 && avlTree.getDepth(node6)).toBe(1);

    const getNodeById = avlTree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTree.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTree.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTree.get(node15)).toBe(15);
  });
});

describe('AVLTree iterative methods not map mode', () => {
  let avlTree: AVLTree<number, string>;
  beforeEach(() => {
    avlTree = new AVLTree<number, string>([], { isMapMode: false });
    avlTree.add([1, 'a']);
    avlTree.add([2, 'b']);
    avlTree.add([3, 'c']);
  });

  it('should clone work well', () => {
    const cloned = avlTree.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.get(cloned.root?.right?.key)).toBe('c');
  });
});

describe('classic use', () => {
  // Test case for finding elements in a given range
  it('@example Find elements in a range', () => {
    // In interval queries, AVL trees, with their strictly balanced structure and lower height, offer better query efficiency, making them ideal for frequent and high-performance interval queries. In contrast, Red-Black trees, with lower update costs, are more suitable for scenarios involving frequent insertions and deletions where the requirements for interval queries are less demanding.
    type Datum = { timestamp: Date; temperature: number };
    // Fixed dataset of CPU temperature readings
    const cpuData: Datum[] = [
      { timestamp: new Date('2024-12-02T00:00:00'), temperature: 55.1 },
      { timestamp: new Date('2024-12-02T00:01:00'), temperature: 56.3 },
      { timestamp: new Date('2024-12-02T00:02:00'), temperature: 54.8 },
      { timestamp: new Date('2024-12-02T00:03:00'), temperature: 57.2 },
      { timestamp: new Date('2024-12-02T00:04:00'), temperature: 58.0 },
      { timestamp: new Date('2024-12-02T00:05:00'), temperature: 59.4 },
      { timestamp: new Date('2024-12-02T00:06:00'), temperature: 60.1 },
      { timestamp: new Date('2024-12-02T00:07:00'), temperature: 61.3 },
      { timestamp: new Date('2024-12-02T00:08:00'), temperature: 62.0 },
      { timestamp: new Date('2024-12-02T00:09:00'), temperature: 63.5 },
      { timestamp: new Date('2024-12-02T00:10:00'), temperature: 64.0 },
      { timestamp: new Date('2024-12-02T00:11:00'), temperature: 62.8 },
      { timestamp: new Date('2024-12-02T00:12:00'), temperature: 61.5 },
      { timestamp: new Date('2024-12-02T00:13:00'), temperature: 60.2 },
      { timestamp: new Date('2024-12-02T00:14:00'), temperature: 59.8 },
      { timestamp: new Date('2024-12-02T00:15:00'), temperature: 58.6 },
      { timestamp: new Date('2024-12-02T00:16:00'), temperature: 57.4 },
      { timestamp: new Date('2024-12-02T00:17:00'), temperature: 56.2 },
      { timestamp: new Date('2024-12-02T00:18:00'), temperature: 55.7 },
      { timestamp: new Date('2024-12-02T00:19:00'), temperature: 54.5 },
      { timestamp: new Date('2024-12-02T00:20:00'), temperature: 53.2 },
      { timestamp: new Date('2024-12-02T00:21:00'), temperature: 52.8 },
      { timestamp: new Date('2024-12-02T00:22:00'), temperature: 51.9 },
      { timestamp: new Date('2024-12-02T00:23:00'), temperature: 50.5 },
      { timestamp: new Date('2024-12-02T00:24:00'), temperature: 49.8 },
      { timestamp: new Date('2024-12-02T00:25:00'), temperature: 48.7 },
      { timestamp: new Date('2024-12-02T00:26:00'), temperature: 47.5 },
      { timestamp: new Date('2024-12-02T00:27:00'), temperature: 46.3 },
      { timestamp: new Date('2024-12-02T00:28:00'), temperature: 45.9 },
      { timestamp: new Date('2024-12-02T00:29:00'), temperature: 45.0 }
    ];

    // Create an AVL tree to store CPU temperature data
    const cpuTemperatureTree = new AVLTree<Date, number, Datum>(cpuData, {
      toEntryFn: ({ timestamp, temperature }) => [timestamp, temperature]
    });

    // Query a specific time range (e.g., from 00:05 to 00:15)
    const rangeStart = new Date('2024-12-02T00:05:00');
    const rangeEnd = new Date('2024-12-02T00:15:00');
    const rangeResults = cpuTemperatureTree.rangeSearch([rangeStart, rangeEnd], node => ({
      minute: node ? node.key.getMinutes() : 0,
      temperature: cpuTemperatureTree.get(node ? node.key : undefined)
    }));

    expect(rangeResults).toEqual([
      { minute: 5, temperature: 59.4 },
      { minute: 6, temperature: 60.1 },
      { minute: 7, temperature: 61.3 },
      { minute: 8, temperature: 62 },
      { minute: 9, temperature: 63.5 },
      { minute: 10, temperature: 64 },
      { minute: 11, temperature: 62.8 },
      { minute: 12, temperature: 61.5 },
      { minute: 13, temperature: 60.2 },
      { minute: 14, temperature: 59.8 },
      { minute: 15, temperature: 58.6 }
    ]);
  });
});
