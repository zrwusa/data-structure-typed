import { AVLTreeMultiMap, AVLTreeMultiMapNode, IBinaryTree } from '../../../../src';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('AVLTreeMultiMap', () => {
  let avlTmm: AVLTreeMultiMap<number, number>;
  beforeEach(() => {
    avlTmm = new AVLTreeMultiMap<number, number>();
  });

  it('Should add and delete values', () => {
    avlTmm.add(3, 3);
    avlTmm.add(3, 33);
    avlTmm.add(3, 333);
    expect(avlTmm.get(3)).toEqual([3, 33, 333]);
    avlTmm.deleteValue(3, 33);
    expect(avlTmm.get(3)).toEqual([3, 333]);
    avlTmm.deleteValue(3, 3);
    expect(avlTmm.get(3)).toEqual([333]);
    avlTmm.deleteValue(3, 333);
    expect(avlTmm.get(3)).toBe(undefined);
    avlTmm.add(3, 3);
    avlTmm.add([3, [3333, 33333]]);
    expect(avlTmm.get(3)).toEqual([3, 3333, 33333]);
  });
});

describe('AVLTreeMultiMap Test', () => {
  it('should perform various operations on a AVLTreeMultiMap', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTmm = new AVLTreeMultiMap<number>();

    for (const i of arr) avlTmm.add([i, [i]]);

    avlTmm.add(null);
    const node6 = avlTmm.getNode(6);

    expect(node6 && avlTmm.getHeight(node6)).toBe(3);
    expect(node6 && avlTmm.getDepth(node6)).toBe(1);

    const getNodeById = avlTmm.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTmm.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTmm.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTmm.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTmm.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTmm.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTmm.get(15)).toEqual([15]);
    const dfs = avlTmm.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);
    avlTmm.perfectlyBalance();
    const bfs = avlTmm.bfs(node => node);
    expect(avlTmm.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(avlTmm.delete(avlTmm.getNode(11))[0].deleted?.key).toBe(11);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(node15 && avlTmm.getHeight(node15)).toBe(1);

    expect(avlTmm.delete(1)[0].deleted?.key).toBe(1);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(4);

    expect(avlTmm.delete(4)[0].deleted?.key).toBe(4);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(4);

    expect(avlTmm.delete(10)[0].deleted?.key).toBe(10);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(15)[0].deleted?.key).toBe(15);
    expect(avlTmm.isAVLBalanced()).toBe(true);

    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(5)[0].deleted?.key).toBe(5);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(13)[0].deleted?.key).toBe(13);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(3)[0].deleted?.key).toBe(3);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(8)[0].deleted?.key).toBe(8);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(6)[0].deleted?.key).toBe(6);
    expect(avlTmm.delete(6).length).toBe(0);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);

    expect(avlTmm.delete(7)[0].deleted?.key).toBe(7);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);

    expect(avlTmm.delete(9)[0].deleted?.key).toBe(9);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);
    expect(avlTmm.delete(14)[0].deleted?.key).toBe(14);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(1);

    expect(avlTmm.isAVLBalanced()).toBe(true);
    const lastBFSIds = avlTmm.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = avlTmm.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });

  it('should add value', () => {
    const avlTmm = new AVLTreeMultiMap<number, string>([4, 5, [1, ['1']], 2, 3]);
    expect(avlTmm.get(1)).toEqual(['1']);
    expect(avlTmm.getNode(1)?.value).toEqual([]);
    avlTmm.add(1, 'a');
    expect(avlTmm.get(1)).toEqual(['1', 'a']);
    avlTmm.add([1, ['b']]);
    expect(avlTmm.getNode(1)?.value).toEqual([]);
    expect(avlTmm.get(1)).toEqual(['1', 'a', 'b']);
    const treeMap = new AVLTreeMultiMap<number>([4, 5, [1, ['1']], 2, 3]);
    expect(treeMap.get(1)).toEqual(['1']);
    expect(treeMap.getNode(1)?.value).toEqual([]);
    treeMap.add(1, 'a');
    expect(treeMap.get(1)).toEqual(['1', 'a']);
    treeMap.add([1, ['b']]);
    expect(treeMap.getNode(1)?.value).toEqual([]);
    expect(treeMap.get(1)).toEqual(['1', 'a', 'b']);
  });
});

describe('AVLTreeMultiMap Test recursively', () => {
  it('should perform various operations on a AVLTreeMultiMap', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTmm = new AVLTreeMultiMap<number>([], { iterationType: 'RECURSIVE' });

    for (const i of arr) avlTmm.add([i, [i]]);

    const node6 = avlTmm.getNode(6);

    expect(node6 && avlTmm.getHeight(node6)).toBe(3);
    expect(node6 && avlTmm.getDepth(node6)).toBe(1);

    const getNodeById = avlTmm.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTmm.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTmm.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTmm.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTmm.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTmm.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTmm.get(15)).toEqual([15]);

    const dfs = avlTmm.dfs(node => node, 'IN');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);

    avlTmm.perfectlyBalance();
    const bfs = avlTmm.bfs(node => node);
    expect(avlTmm.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(avlTmm.delete(11)[0].deleted?.key).toBe(11);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(node15 && avlTmm.getHeight(node15)).toBe(1);

    expect(avlTmm.delete(1)[0].deleted?.key).toBe(1);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(4);

    expect(avlTmm.delete(4)[0].deleted?.key).toBe(4);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(4);

    expect(avlTmm.delete(10)[0].deleted?.key).toBe(10);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(15)[0].deleted?.key).toBe(15);
    expect(avlTmm.isAVLBalanced()).toBe(true);

    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(5)[0].deleted?.key).toBe(5);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(13)[0].deleted?.key).toBe(13);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(3)[0].deleted?.key).toBe(3);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(8)[0].deleted?.key).toBe(8);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(3);

    expect(avlTmm.delete(6)[0].deleted?.key).toBe(6);
    expect(avlTmm.delete(6).length).toBe(0);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);

    expect(avlTmm.delete(7)[0].deleted?.key).toBe(7);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);

    expect(avlTmm.delete(9)[0].deleted?.key).toBe(9);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(2);
    expect(avlTmm.delete(14)[0].deleted?.key).toBe(14);
    expect(avlTmm.isAVLBalanced()).toBe(true);
    expect(avlTmm.getHeight()).toBe(1);

    expect(avlTmm.isAVLBalanced()).toBe(true);
    const lastBFSIds = avlTmm.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = avlTmm.bfs(node => node);
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });
});

describe('AVLTreeMultiMap APIs test', () => {
  const avlTmm = new AVLTreeMultiMap<number, { id: number; text: string }>();
  beforeEach(() => {
    avlTmm.clear();
  });

  it('add', () => {
    avlTmm.add(1);
    const node2 = new AVLTreeMultiMapNode(2, []);
    avlTmm.add(node2);
    const node3 = new AVLTreeMultiMapNode(3, [
      {
        id: 3,
        text: 'text3'
      }
    ]);
    avlTmm.add(node3);
    avlTmm.add([3, [{ id: 3, text: 'text33' }]]);

    const bfsRes = avlTmm.bfs(node => node.key);
    expect(bfsRes[0]).toBe(2);
  });

  it('should the clone method', () => {
    function checkTreeStructure(avlTmm: IBinaryTree<string, number[]>) {
      expect(avlTmm.size).toBe(4);
      expect(avlTmm.root?.key).toBe('2');
      expect(avlTmm.root?.left?.key).toBe('1');
      expect(avlTmm.root?.left?.left?.key).toBe(undefined);
      expect(avlTmm.root?.left?.right?.key).toBe(undefined);
      expect(avlTmm.root?.right?.key).toBe('4');
      expect(avlTmm.root?.right?.left?.key).toBe(undefined);
      expect(avlTmm.root?.right?.right?.key).toBe('5');
    }

    const avlTmm = new AVLTreeMultiMap<string, number>();
    avlTmm.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(avlTmm.size).toBe(5);
    expect(avlTmm.root?.key).toBe('2');
    expect(avlTmm.root?.left?.key).toBe('1');
    expect(avlTmm.root?.left?.left?.key).toBe(undefined);
    expect(avlTmm.root?.left?.right?.key).toBe(undefined);
    expect(avlTmm.root?.right?.key).toBe('4');
    expect(avlTmm.root?.right?.left?.key).toBe('3');
    expect(avlTmm.root?.right?.right?.key).toBe('5');
    avlTmm.delete('3');
    checkTreeStructure(avlTmm);
    const cloned = avlTmm.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(avlTmm.size).toBe(4);
    expect(cloned.size).toBe(3);
  });
});

describe('AVLTreeMultiMap', () => {
  it('should balance the avlTmm using _balanceLR when nodes are added', () => {
    const avlTmm = new AVLTreeMultiMap();
    avlTmm.add([10, 'A']);
    avlTmm.add([5, 'B']);
    avlTmm.add([15, 'C']);
    avlTmm.add([3, 'D']);
    avlTmm.add([7, 'E']);

    // Adding nodes to trigger _balanceLR
    avlTmm.add([12, 'F']);

    // You can add more specific assertions to check the avlTmm's balance and structure.
  });

  it('should addMany undefined and null', () => {
    const avlTmm = new AVLTreeMultiMap<number, string>();
    const addManyWithUndefined = avlTmm.addMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(avlTmm.get(undefined)).toBe(undefined);
    const addManyWithNull = avlTmm.addMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, false, true, true]);
    const addManyEntriesWithNull = avlTmm.addMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, false, true, true]);
    expect(avlTmm.get(null)).toBe(undefined);
    const node0 = avlTmm.add(0, '0');
    expect(node0).toBe(true);
    expect(avlTmm.get(0)).toEqual(['0']);
  });

  it('should balance the avlTmm using _balanceLR when nodes are deleted', () => {
    const avlTmm = new AVLTreeMultiMap();
    avlTmm.add([10, 'A']);
    avlTmm.add([5, 'B']);
    avlTmm.add([15, 'C']);
    avlTmm.add([3, 'D']);
    avlTmm.add([7, 'E']);
    avlTmm.add([12, 'F']);

    // Deleting nodes to trigger _balanceLR
    avlTmm.delete(3);

    // You can add more specific assertions to check the avlTmm's balance and structure.
  });

  describe('BinaryTree APIs test', () => {
    const avlTmm = new AVLTreeMultiMap<number, { id: number; text: string }>();
    beforeEach(() => {
      avlTmm.clear();
    });

    it('add', () => {
      avlTmm.add(1);
      const node2 = new AVLTreeMultiMapNode(2, []);
      avlTmm.add(node2);
      const node3 = new AVLTreeMultiMapNode(3, [
        {
          id: 3,
          text: 'text3'
        }
      ]);
      avlTmm.add(node3);
      avlTmm.add([3, [{ id: 3, text: 'text33' }]]);

      const bfsRes = avlTmm.bfs(node => node);
      expect(bfsRes[0]?.key).toBe(2);
    });
  });
});

describe('AVLTreeMultiMap iterative methods test', () => {
  let avlTmm: AVLTreeMultiMap<number, string, object>;
  beforeEach(() => {
    avlTmm = new AVLTreeMultiMap();
    avlTmm.add([1, ['a']]);
    avlTmm.add([2, ['b']]);
    avlTmm.add([3, ['c']]);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = avlTmm.getNode(3);

    expect(node3).toBeInstanceOf(AVLTreeMultiMapNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    avlTmm.forEach((key, value) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1, ['a']]);
    expect(mockCallback.mock.calls[1]).toEqual([2, ['b']]);
    expect(mockCallback.mock.calls[2]).toEqual([3, ['c']]);
  });

  it('filter should return a new avlTmm with filtered elements', () => {
    const filteredTree = avlTmm.filter(key => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [2, ['b']],
      [3, ['c']]
    ]);
  });

  it('map should return a new avlTmm with modified elements', () => {
    const avlTmmMapped = avlTmm.map((key, value) => [(key * 2).toString(), value ? value : []]);
    expect(avlTmmMapped.size).toBe(3);
    expect([...avlTmmMapped]).toEqual([
      ['2', ['a']],
      ['4', ['b']],
      ['6', ['c']]
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = avlTmm.reduce((acc, value, key) => acc + key, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of avlTmm) {
      entries.push(entry);
    }

    expect(entries.length).toBe(3);
    expect(entries).toEqual([
      [1, ['a']],
      [2, ['b']],
      [3, ['c']]
    ]);
  });

  it('should clone work well', () => {
    const cloned = avlTmm.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.root?.right?.value).toEqual([]);
  });

  it('should keys', () => {
    const keys = avlTmm.keys();
    expect([...keys]).toEqual([1, 2, 3]);
  });

  it('should values', () => {
    const values = avlTmm.values();
    expect([...values]).toEqual([['a'], ['b'], ['c']]);
  });

  it('should leaves', () => {
    const leaves = avlTmm.leaves();
    expect(leaves).toEqual([1, 3]);
  });
});

describe('AVLTreeMultiMap not map mode', () => {
  it('should perform various operations on a AVLTreeMultiMap', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTmm = new AVLTreeMultiMap<number>([]);

    for (const i of arr) avlTmm.add([i, [i]]);

    avlTmm.add(null);
    const node6 = avlTmm.getNode(6);

    expect(node6 && avlTmm.getHeight(node6)).toBe(3);
    expect(node6 && avlTmm.getDepth(node6)).toBe(1);

    const getNodeById = avlTmm.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTmm.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTmm.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTmm.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTmm.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTmm.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTmm.get(node15)).toEqual([15]);
  });
});

describe('AVLTreeMultiMap not map mode test recursively', () => {
  it('should perform various operations on a AVLTreeMultiMap', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const avlTmm = new AVLTreeMultiMap<number>([], { iterationType: 'RECURSIVE' });

    for (const i of arr) avlTmm.add([i, [i]]);
    const node6 = avlTmm.getNode(6);

    expect(node6 && avlTmm.getHeight(node6)).toBe(3);
    expect(node6 && avlTmm.getDepth(node6)).toBe(1);

    const getNodeById = avlTmm.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = avlTmm.getLeftMost();
    expect(getMinNodeByRoot).toBe(1);

    const node15 = avlTmm.getNode(15);
    const getMinNodeBySpecificNode = node15 && avlTmm.getLeftMost(node => node, node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    if (node15) avlTmm.dfs(node => (subTreeSum += node.key), 'PRE', false, node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    avlTmm.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(avlTmm.get(node15)).toEqual([15]);
  });
});

describe('AVLTreeMultiMap iterative methods not map mode', () => {
  let avlTmm: AVLTreeMultiMap<number, string>;
  beforeEach(() => {
    avlTmm = new AVLTreeMultiMap<number, string>([]);
    avlTmm.add([1, ['a']]);
    avlTmm.add([2, ['b']]);
    avlTmm.add([3, ['c']]);
  });

  it('should clone work well', () => {
    const cloned = avlTmm.clone();
    expect(cloned.root?.left?.key).toBe(1);
    expect(cloned.get(cloned.root?.right?.key)).toEqual(['c']);
  });
});

describe('classic use', () => {
  // Test suite for TreeMultiMap with player ranking and equipment
  it('players ranked by score with their equipment', () => {
    type Equipment = {
      name: string; // Equipment name
      quality: 'legendary' | 'epic' | 'rare' | 'common';
      level: number;
    };

    type Player = {
      name: string;
      score: number;
      equipments: Equipment[];
    };

    // Mock player data with their scores and equipment
    const players: Player[] = [
      {
        name: 'DragonSlayer',
        score: 8750,
        equipments: [
          { name: 'AWM', quality: 'legendary', level: 85 },
          { name: 'Level 3 Helmet', quality: 'epic', level: 80 },
          { name: 'Extended Quickdraw Mag', quality: 'rare', level: 75 },
          { name: 'Compensator', quality: 'epic', level: 78 },
          { name: 'Vertical Grip', quality: 'rare', level: 72 }
        ]
      },
      {
        name: 'ShadowNinja',
        score: 7200,
        equipments: [
          { name: 'M416', quality: 'epic', level: 75 },
          { name: 'Ghillie Suit', quality: 'rare', level: 70 },
          { name: 'Red Dot Sight', quality: 'common', level: 65 },
          { name: 'Extended QuickDraw Mag', quality: 'rare', level: 68 }
        ]
      },
      {
        name: 'RuneMaster',
        score: 9100,
        equipments: [
          { name: 'KAR98K', quality: 'legendary', level: 90 },
          { name: 'Level 3 Vest', quality: 'legendary', level: 85 },
          { name: 'Holographic Sight', quality: 'epic', level: 82 },
          { name: 'Suppressor', quality: 'legendary', level: 88 },
          { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
        ]
      },
      {
        name: 'BattleKing',
        score: 8500,
        equipments: [
          { name: 'AUG', quality: 'epic', level: 82 },
          { name: 'Red Dot Sight', quality: 'rare', level: 75 },
          { name: 'Extended Mag', quality: 'common', level: 70 },
          { name: 'Tactical Stock', quality: 'rare', level: 76 }
        ]
      },
      {
        name: 'SniperElite',
        score: 7800,
        equipments: [
          { name: 'M24', quality: 'legendary', level: 88 },
          { name: 'Compensator', quality: 'epic', level: 80 },
          { name: 'Scope 8x', quality: 'legendary', level: 85 },
          { name: 'Level 2 Helmet', quality: 'rare', level: 75 }
        ]
      },
      {
        name: 'RushMaster',
        score: 7500,
        equipments: [
          { name: 'Vector', quality: 'rare', level: 72 },
          { name: 'Level 2 Helmet', quality: 'common', level: 65 },
          { name: 'Quickdraw Mag', quality: 'common', level: 60 },
          { name: 'Laser Sight', quality: 'rare', level: 68 }
        ]
      },
      {
        name: 'GhostWarrior',
        score: 8200,
        equipments: [
          { name: 'SCAR-L', quality: 'epic', level: 78 },
          { name: 'Extended Quickdraw Mag', quality: 'rare', level: 70 },
          { name: 'Holographic Sight', quality: 'epic', level: 75 },
          { name: 'Suppressor', quality: 'rare', level: 72 },
          { name: 'Vertical Grip', quality: 'common', level: 65 }
        ]
      },
      {
        name: 'DeathDealer',
        score: 7300,
        equipments: [
          { name: 'SKS', quality: 'epic', level: 76 },
          { name: 'Holographic Sight', quality: 'rare', level: 68 },
          { name: 'Extended Mag', quality: 'common', level: 65 }
        ]
      },
      {
        name: 'StormRider',
        score: 8900,
        equipments: [
          { name: 'MK14', quality: 'legendary', level: 92 },
          { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
          { name: 'Scope 8x', quality: 'epic', level: 80 },
          { name: 'Suppressor', quality: 'legendary', level: 88 },
          { name: 'Tactical Stock', quality: 'rare', level: 75 }
        ]
      },
      {
        name: 'CombatLegend',
        score: 7600,
        equipments: [
          { name: 'UMP45', quality: 'rare', level: 74 },
          { name: 'Level 2 Vest', quality: 'common', level: 67 },
          { name: 'Red Dot Sight', quality: 'common', level: 62 },
          { name: 'Extended Mag', quality: 'rare', level: 70 }
        ]
      }
    ];

    // Create a TreeMultiMap for player rankings
    const playerRankings = new AVLTreeMultiMap<number, Equipment, Player>(players, {
      toEntryFn: ({ score, equipments }) => [score, equipments],
      isMapMode: false
    });

    const topPlayersEquipments = playerRankings.rangeSearch([8900, 10000], node => playerRankings.get(node));
    expect(topPlayersEquipments).toEqual([
      [
        {
          name: 'MK14',
          quality: 'legendary',
          level: 92
        },
        { name: 'Level 3 Backpack', quality: 'legendary', level: 85 },
        {
          name: 'Scope 8x',
          quality: 'epic',
          level: 80
        },
        { name: 'Suppressor', quality: 'legendary', level: 88 },
        {
          name: 'Tactical Stock',
          quality: 'rare',
          level: 75
        }
      ],
      [
        { name: 'KAR98K', quality: 'legendary', level: 90 },
        {
          name: 'Level 3 Vest',
          quality: 'legendary',
          level: 85
        },
        { name: 'Holographic Sight', quality: 'epic', level: 82 },
        {
          name: 'Suppressor',
          quality: 'legendary',
          level: 88
        },
        { name: 'Level 3 Backpack', quality: 'epic', level: 80 }
      ]
    ]);
  });
});
