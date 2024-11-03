import { AVLTree, AVLTreeNode, BinaryTreeNode, BSTNode } from '../../../../src';

describe('AVL Tree Test', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>();

    for (const i of arr) tree.add([i, i]);

    tree.add(null);
    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) tree.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(undefined);
    const dfs = tree.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);
    tree.perfectlyBalance();
    const bfs = tree.bfs(node => node);
    expect(tree.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(tree.delete(tree.getNode(11))[0].deleted?.key).toBe(11);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(node15 && tree.getHeight(node15)).toBe(2);

    expect(tree.delete(1)[0].deleted?.key).toBe(1);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.delete(4)[0].deleted?.key).toBe(4);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.delete(10)[0].deleted?.key).toBe(10);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(15)[0].deleted?.key).toBe(15);
    expect(tree.isAVLBalanced()).toBe(true);

    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(5)[0].deleted?.key).toBe(5);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(13)[0].deleted?.key).toBe(13);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(3)[0].deleted?.key).toBe(3);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(8)[0].deleted?.key).toBe(8);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(6)[0].deleted?.key).toBe(6);
    expect(tree.delete(6).length).toBe(0);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.delete(7)[0].deleted?.key).toBe(7);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.delete(9)[0].deleted?.key).toBe(9);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);
    expect(tree.delete(14)[0].deleted?.key).toBe(14);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(1);

    expect(tree.isAVLBalanced()).toBe(true);
    const lastBFSIds = tree.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = tree.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });

  it('should replace value', () => {
    const tree = new AVLTree<number, string>([4, 5, [1, '1'], 2, 3], { isMapMode: false });
    expect(tree.get(1)).toBe('1');
    expect(tree.getNode(1)?.value).toBe('1');
    tree.add(1, 'a');
    expect(tree.get(1)).toBe('a');
    tree.add([1, 'b']);
    expect(tree.getNode(1)?.value).toBe('b');
    expect(tree.get(1)).toBe('b');
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
    const tree = new AVLTree<number>([], { iterationType: 'RECURSIVE' });

    for (const i of arr) tree.add([i, i]);

    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) tree.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(undefined);

    const dfs = tree.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);

    tree.perfectlyBalance();
    const bfs = tree.bfs(node => node);
    expect(tree.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(tree.delete(11)[0].deleted?.key).toBe(11);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(node15 && tree.getHeight(node15)).toBe(2);

    expect(tree.delete(1)[0].deleted?.key).toBe(1);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.delete(4)[0].deleted?.key).toBe(4);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.delete(10)[0].deleted?.key).toBe(10);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(15)[0].deleted?.key).toBe(15);
    expect(tree.isAVLBalanced()).toBe(true);

    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(5)[0].deleted?.key).toBe(5);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(13)[0].deleted?.key).toBe(13);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(3)[0].deleted?.key).toBe(3);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(8)[0].deleted?.key).toBe(8);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.delete(6)[0].deleted?.key).toBe(6);
    expect(tree.delete(6).length).toBe(0);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.delete(7)[0].deleted?.key).toBe(7);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.delete(9)[0].deleted?.key).toBe(9);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);
    expect(tree.delete(14)[0].deleted?.key).toBe(14);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(1);

    expect(tree.isAVLBalanced()).toBe(true);
    const lastBFSIds = tree.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = tree.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });
});

describe('AVLTree APIs test', () => {
  const avl = new AVLTree<number, { id: number; text: string }>();
  beforeEach(() => {
    avl.clear();
  });

  it('add', () => {
    avl.add(1);
    const node2 = new AVLTreeNode(2);
    avl.add(node2);
    const node3 = new AVLTreeNode(3, {
      id: 3,
      text: 'text3'
    });
    avl.add(node3);
    avl.add([3, { id: 3, text: 'text33' }]);

    const bfsRes = avl.bfs(node => node.key);
    expect(bfsRes[0]).toBe(2);
  });

  it('should the clone method', () => {
    function checkTreeStructure(avl: AVLTree<string, number>) {
      expect(avl.size).toBe(4);
      expect(avl.root?.key).toBe('2');
      expect(avl.root?.left?.key).toBe('1');
      expect(avl.root?.left?.left?.key).toBe(undefined);
      expect(avl.root?.left?.right?.key).toBe(undefined);
      expect(avl.root?.right?.key).toBe('4');
      expect(avl.root?.right?.left?.key).toBe(undefined);
      expect(avl.root?.right?.right?.key).toBe('5');
    }

    const avl = new AVLTree<string, number>();
    avl.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(avl.size).toBe(5);
    expect(avl.root?.key).toBe('2');
    expect(avl.root?.left?.key).toBe('1');
    expect(avl.root?.left?.left?.key).toBe(undefined);
    expect(avl.root?.left?.right?.key).toBe(undefined);
    expect(avl.root?.right?.key).toBe('4');
    expect(avl.root?.right?.left?.key).toBe('3');
    expect(avl.root?.right?.right?.key).toBe('5');
    avl.delete('3');
    checkTreeStructure(avl);
    const cloned = avl.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(avl.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('AVLTree', () => {
  it('should balance the tree using _balanceLR when nodes are added', () => {
    const avlTree = new AVLTree();
    avlTree.add([10, 'A']);
    avlTree.add([5, 'B']);
    avlTree.add([15, 'C']);
    avlTree.add([3, 'D']);
    avlTree.add([7, 'E']);

    // Adding nodes to trigger _balanceLR
    avlTree.add([12, 'F']);

    // You can add more specific assertions to check the tree's balance and structure.
  });

  it('should addMany undefined and null', () => {
    const avl = new AVLTree<number, string>();
    const addManyWithUndefined = avl.addMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(avl.get(undefined)).toBe(undefined);
    const addManyWithNull = avl.addMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, false, true, true]);
    const addManyEntriesWithNull = avl.addMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, false, true, true]);
    expect(avl.get(null)).toBe(undefined);
    const node0 = avl.add(0, '0');
    expect(node0).toBe(true);
    expect(avl.get(0)).toBe('0');
  });

  it('should balance the tree using _balanceLR when nodes are deleted', () => {
    const avlTree = new AVLTree();
    avlTree.add([10, 'A']);
    avlTree.add([5, 'B']);
    avlTree.add([15, 'C']);
    avlTree.add([3, 'D']);
    avlTree.add([7, 'E']);
    avlTree.add([12, 'F']);

    // Deleting nodes to trigger _balanceLR
    avlTree.delete(3);

    // You can add more specific assertions to check the tree's balance and structure.
  });

  describe('BinaryTree APIs test', () => {
    const avl = new AVLTree<number, { id: number; text: string }>();
    beforeEach(() => {
      avl.clear();
    });

    it('add', () => {
      avl.add(1);
      const node2 = new AVLTreeNode(2);
      avl.add(node2);
      const node3 = new AVLTreeNode(3, {
        id: 3,
        text: 'text3'
      });
      avl.add(node3);
      avl.add([3, { id: 3, text: 'text33' }]);

      const bfsRes = avl.bfs(node => node);
      expect(bfsRes[0]?.key).toBe(2);
    });
  });
});

describe('AVLTree iterative methods test', () => {
  let avl: AVLTree<number, string>;
  beforeEach(() => {
    avl = new AVLTree();
    avl.add([1, 'a']);
    avl.add([2, 'b']);
    avl.add([3, 'c']);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = avl.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
    expect(node3).toBeInstanceOf(BSTNode);
    expect(node3).toBeInstanceOf(AVLTreeNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    avl.forEach((value, key) => {
      mockCallback(value, key);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['a', 1]);
    expect(mockCallback.mock.calls[1]).toEqual(['b', 2]);
    expect(mockCallback.mock.calls[2]).toEqual(['c', 3]);
  });

  it('filter should return a new tree with filtered elements', () => {
    const filteredTree = avl.filter((value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('map should return a new tree with modified elements', () => {
    const mappedTree = avl.map((value, key) => (key * 2).toString());
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      [1, '2'],
      [2, '4'],
      [3, '6']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = avl.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of avl) {
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
    const cloned = avl.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.root?.right?.value).toBe(undefined);
  });

  it('should keys', () => {
    const keys = avl.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = avl.values();
    expect([...values]).toEqual(['a', 'b', 'c']);
  });

  it('should leaves', () => {
    const leaves = avl.leaves();
    expect(leaves).toEqual([1, 3]);
  });
});

describe('AVL Tree not map mode', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>([], { isMapMode: false });

    for (const i of arr) tree.add([i, i]);

    tree.add(null);
    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) tree.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(tree.get(node15)).toBe(15);
  });
});

describe('AVL Tree not map mode test recursively', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>([], { iterationType: 'RECURSIVE', isMapMode: false });

    for (const i of arr) tree.add([i, i]);

    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) tree.dfs(node => (subTreeSum += node.key), 'PRE', node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(tree.get(node15)).toBe(15);
  });
});

describe('AVLTree iterative methods not map mode', () => {
  let avl: AVLTree<number, string>;
  beforeEach(() => {
    avl = new AVLTree<number, string>([], { isMapMode: false });
    avl.add([1, 'a']);
    avl.add([2, 'b']);
    avl.add([3, 'c']);
  });

  it('should clone work well', () => {
    const cloned = avl.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.get(cloned.root?.right?.key)).toBe('c');
  });
});
