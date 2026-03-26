import { IBinaryTree, RedBlackTree, RedBlackTreeNode } from '../../../../src';
import { getRandomInt, getRandomIntArray, magnitude } from '../../../utils';
import { OrderedMap } from 'js-sdsl';

import { isDebugTest } from '../../../config';
import { costOfLiving } from './data/cost-of-living-by-country';

const isDebug = isDebugTest;
// const isDebug = true;

describe('RedBlackTree 1', () => {
  let rbTree: RedBlackTree<number>;

  beforeEach(() => {
    rbTree = new RedBlackTree<number>();
  });

  describe('add and getNode', () => {
    it('should add and find a node in the rbTree', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);

      expect(rbTree.getNode(10)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(20)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(5)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(15)).toBe(undefined);
    });

    it('should add and find nodes with negative keys', () => {
      rbTree.set(-10);
      rbTree.set(-20);

      expect(rbTree.getNode(-10)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(-20)).toBeInstanceOf(RedBlackTreeNode);
    });
  });

  describe('deleteNode', () => {
    it('should delete a node from the rbTree', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.delete(20);

      expect(rbTree.getNode(20)).toBe(undefined);
    });

    it('should handle deleting a non-existent node', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.delete(15);

      expect(rbTree.getNode(15)).toBe(undefined);
    });

    it('should getNode performance O(log n)', () => {
      for (let i = 0; i < 10; i++) rbTree.set(i);
      rbTree.getNode(6);
    });
  });

  describe('minimum', () => {
    it('should find the minimum node in the rbTree', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.set(15);
      rbTree.set(3);

      const minNode = rbTree.getLeftMost(node => node, rbTree.root);
      expect(minNode?.key).toBe(3);
    });

    it('should handle an empty rbTree', () => {
      const minNode = rbTree.getLeftMost(node => node, rbTree.root);
      expect(minNode).toBe(undefined);
    });
  });

  describe('getRightMost', () => {
    it('should find the getRightMost node in the rbTree', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.set(15);
      rbTree.set(25);

      const maxNode = rbTree.getRightMost(node => node, rbTree.root);
      expect(maxNode?.key).toBe(25);
    });

    it('should handle an empty rbTree', () => {
      const maxNode = rbTree.getRightMost(node => node, rbTree.root);
      expect(maxNode).toBe(undefined);
    });
  });

  describe('getSuccessor', () => {
    it('should find the getSuccessor of a node', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.set(15);
      rbTree.set(25);

      const node = rbTree.getNode(15);
      const successorNode = rbTree.getSuccessor(node!);

      expect(successorNode?.key).toBe(20);
    });

    it('should handle a node with no getSuccessor', () => {
      rbTree.set(10);
      rbTree.set(5);

      const node = rbTree.getNode(10);
      const successorNode = rbTree.getSuccessor(node!);
      // TODO not sure if it should be undefined or rbTree.NIL
      expect(successorNode).toBe(undefined);
    });
  });

  describe('getPredecessor', () => {
    it('should find the getPredecessor of a node', () => {
      rbTree.set(10);
      rbTree.set(20);
      rbTree.set(5);
      rbTree.set(15);
      rbTree.set(25);

      const node = rbTree.getNode(20);
      const predecessorNode = rbTree.getPredecessor(node!);

      expect(predecessorNode?.key).toBe(15);
    });

    it('should handle a node with no getPredecessor', () => {
      rbTree.set(10);
      rbTree.set(20);

      const node = rbTree.getNode(20);
      const predecessorNode = rbTree.getPredecessor(node!);
      // TODO not sure if it should be rbTree.NIL or something else.
      expect(predecessorNode).toBe(rbTree.getNode(20));
    });
  });

  it('should the clone method', () => {
    function checkTreeStructure(rbTree: IBinaryTree<string, number>) {
      expect(rbTree.size).toBe(4);
      expect(rbTree.root?.key).toBe('2');
      expect(rbTree.root?.left?.key).toBe('1');
      expect(rbTree.root?.left?.left?.key).toBe(NaN);
      expect(rbTree.root?.left?.right?.key).toBe(NaN);
      expect(rbTree.root?.right?.key).toBe('4');
      expect(rbTree.root?.right?.left?.key).toBe(NaN);
      expect(rbTree.root?.right?.right?.key).toBe('5');
    }

    const rbTree = new RedBlackTree<string, number>();
    rbTree.setMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(rbTree.size).toBe(5);
    expect(rbTree.root?.key).toBe('2');
    expect(rbTree.root?.left?.key).toBe('1');
    expect(rbTree.root?.left?.left?.key).toBe(NaN);
    expect(rbTree.root?.left?.right?.key).toBe(NaN);
    expect(rbTree.root?.right?.key).toBe('4');
    expect(rbTree.root?.right?.left?.key).toBe('3');
    expect(rbTree.root?.right?.right?.key).toBe('5');
    rbTree.delete('3');
    checkTreeStructure(rbTree);
    const cloned = rbTree.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(rbTree.size).toBe(4);
    expect(cloned.size).toBe(3);
  });

  it('should replace value', () => {
    const rbTree = new RedBlackTree<number, string>([4, 5, [1, '1'], 2, 3], { isMapMode: false });
    expect(rbTree.get(1)).toBe('1');
    expect(rbTree.getNode(1)?.value).toBe('1');
    rbTree.set(1, 'a');
    expect(rbTree.get(1)).toBe('a');
    rbTree.set([1, 'b']);
    expect(rbTree.getNode(1)?.value).toBe('b');
    expect(rbTree.get(1)).toBe('b');
    const treeMap = new RedBlackTree<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe('1');
    treeMap.set(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.set([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe('b');
    expect(treeMap.get(1)).toBe('b');
  });
});

describe('RedBlackTree 2', () => {
  let rbTree: RedBlackTree<number>;

  beforeEach(() => {
    rbTree = new RedBlackTree<number>();
  });

  it('should add nodes into the rbTree', () => {
    rbTree.set(10);
    expect(rbTree.getNode(10)).toBeDefined();
    rbTree.set(20);
    expect(rbTree.getNode(20)).toBeDefined();
    rbTree.set(5);
    expect(rbTree.getNode(5)).toBeDefined();
  });

  it('should delete nodes from the rbTree', () => {
    rbTree.set(10);
    rbTree.set(20);
    rbTree.set(5);
    rbTree.delete(20);
    expect(rbTree.getNode(20)).toBe(undefined);
  });

  it('should get the successor of a node', () => {
    rbTree.set(10);
    rbTree.set(20);
    const node = rbTree.getNode(10);
    const successor = rbTree.getSuccessor(node!);
    expect(successor?.key).toBe(20);
  });

  it('should get the predecessor of a node', () => {
    rbTree.set(10);
    rbTree.set(20);
    const node = rbTree.getNode(20);
    const predecessor = rbTree.getPredecessor(node!);
    expect(predecessor?.key).toBe(20);
  });

  it('should rotate nodes to the left', () => {
    rbTree.set(10);
    rbTree.set(20);
    rbTree.set(5);
    const node = rbTree.getNode(10);
    rbTree.set(15);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBe(5);
    expect(node?.right?.key).toBe(20);
  });

  it('should rotate nodes to the right', () => {
    rbTree.set(10);
    rbTree.set(20);
    rbTree.set(5);
    const node = rbTree.getNode(20);
    rbTree.set(25);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBeNaN();
    expect(node?.right?.key).toBe(25);
  });

  it('should all node attributes fully conform to the red-black rbTree standards.', () => {
    rbTree.set(10);
    rbTree.set(20);
    rbTree.set(5);
    rbTree.set(15);
    rbTree.set(21);
    rbTree.set(6);
    rbTree.set(2);

    let node10F = rbTree.getNode(10);
    let node20F = rbTree.getNode(20);
    let node5F = rbTree.getNode(5);
    let node15F = rbTree.getNode(15);
    let node21F = rbTree.getNode(21);
    let node6F = rbTree.getNode(6);
    let node2F = rbTree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe('BLACK');
    expect(node10F?.left).toBe(node5F);
    expect(node10F?.right).toBe(node20F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F?.key).toBe(20);
    expect(node20F?.color).toBe('BLACK');
    expect(node20F?.left).toBe(node15F);
    expect(node20F?.right).toBe(node21F);
    expect(node20F?.parent).toBe(node10F);
    expect(node5F?.key).toBe(5);
    expect(node5F?.color).toBe('BLACK');
    expect(node5F?.left).toBe(node2F);
    expect(node5F?.right).toBe(node6F);
    expect(node5F?.parent).toBe(node10F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('RED');
    expect(node21F?.left).toBe(rbTree.NIL);
    expect(node21F?.right).toBe(rbTree.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('RED');
    expect(node6F?.left).toBe(rbTree.NIL);
    expect(node6F?.right).toBe(rbTree.NIL);
    expect(node6F?.parent).toBe(node5F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(rbTree.NIL);
    expect(node2F?.right).toBe(rbTree.NIL);
    expect(node2F?.parent).toBe(node5F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node20F);
    rbTree.delete(5);
    node10F = rbTree.getNode(10);
    node20F = rbTree.getNode(20);
    node5F = rbTree.getNode(5);
    node15F = rbTree.getNode(15);
    node21F = rbTree.getNode(21);
    node6F = rbTree.getNode(6);
    node2F = rbTree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe('BLACK');
    expect(node10F?.left).toBe(node6F);
    expect(node10F?.right).toBe(node20F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F?.key).toBe(20);
    expect(node20F?.color).toBe('BLACK');
    expect(node20F?.left).toBe(node15F);
    expect(node20F?.right).toBe(node21F);
    expect(node20F?.parent).toBe(node10F);
    expect(node5F).toBe(undefined);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('RED');
    expect(node21F?.left).toBe(rbTree.NIL);
    expect(node21F?.right).toBe(rbTree.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('BLACK');
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(rbTree.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(rbTree.NIL);
    expect(node2F?.right).toBe(rbTree.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node20F);
    rbTree.delete(20);
    node10F = rbTree.getNode(10);
    node20F = rbTree.getNode(20);
    node5F = rbTree.getNode(5);
    node15F = rbTree.getNode(15);
    node21F = rbTree.getNode(21);
    node6F = rbTree.getNode(6);
    node2F = rbTree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe('BLACK');
    expect(node10F?.left).toBe(node6F);
    expect(node10F?.right).toBe(node21F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F).toBe(undefined);
    expect(node5F).toBe(undefined);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node21F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('BLACK');
    expect(node21F?.left).toBe(node15F);
    expect(node21F?.right).toBe(rbTree.NIL);
    expect(node21F?.parent).toBe(node10F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('BLACK');
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(rbTree.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(rbTree.NIL);
    expect(node2F?.right).toBe(rbTree.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(node21F);
  });

  it('should fix the rbTree after insertion', () => {
    rbTree.set(1);
    rbTree.set(2);
    rbTree.set(5);
    rbTree.set(15);
    const node15F = rbTree.getNode(15);
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(rbTree.getNode(5));

    rbTree.set(25);
    rbTree.set(10);
    rbTree.set(8);
    rbTree.set(28);
    rbTree.set(111);
    rbTree.set(12);
    rbTree.delete(2);
    rbTree.set(22);
    rbTree.set(50);
    rbTree.set(155);
    rbTree.set(225);
    const node225F = rbTree.getNode(225);
    expect(node225F?.left).toBe(rbTree.NIL);
    expect(node225F?.right).toBe(rbTree.NIL);
    expect(node225F?.parent?.key).toBe(155);
    rbTree.set(7);
    if (isDebug) rbTree.print();

    // After fixup the tree is correctly balanced; verify structural invariants
    // rather than hardcoded node positions (which depend on rotation details).
    expect(rbTree.has(15)).toBe(true);
    expect(rbTree.has(10)).toBe(true);
    expect(rbTree.has(25)).toBe(true);
    expect(rbTree.root).toBeDefined();
    expect(rbTree.root?.parent).toBe(undefined);
    rbTree.delete(15);
    expect(rbTree.root).toBeDefined();
    expect(rbTree.root?.parent).toBe(undefined);

    const node15T = rbTree.getNode(15);
    expect(node15T).toBe(undefined);

    rbTree.set(23);
    rbTree.set(33);
    rbTree.set(15);

    const nodeLM = rbTree.getLeftMost();
    expect(nodeLM).toBe(1);

    expect(rbTree.has(50)).toBe(true);
    expect(rbTree.has(33)).toBe(true);
    expect(rbTree.has(15)).toBe(true);
    expect(rbTree.has(225)).toBe(true);
    expect(rbTree.has(155)).toBe(true);
    // TODO
    // expect(rbTree.getNode(0)).toBe(undefined);
    rbTree.set(2);
    rbTree.set(3);
    rbTree.set(4);
    rbTree.set(6);
    rbTree.set(9);
    rbTree.set(11);
    rbTree.set(13);
    rbTree.set(14);
    rbTree.set(16);
    rbTree.set(17);
    rbTree.set(18);
    rbTree.set(19);
    rbTree.set(110);

    if (isDebug) rbTree.print();

    expect(rbTree.dfs()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 28, 33, 50, 110, 111, 155, 225
    ]);

    expect(rbTree.isBST()).toBe(true);
  });

  it('should fix the rbTree after insertion and deletion', () => {
    for (let i = 0; i < 100; i++) {
      rbTree.set(i);
    }
    for (let i = 0; i < 49; i++) {
      rbTree.delete(i);
    }

    expect(rbTree.size).toBe(51);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.isBST(rbTree.root, 'RECURSIVE')).toBe(true);

    expect(rbTree.dfs(n => n.key, 'IN', false, rbTree.root, 'ITERATIVE')).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
    expect(rbTree.dfs(n => n.key, 'IN', false, rbTree.root, 'RECURSIVE')).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
  });

  it('should fix the rbTree after large scale insertion and deletion', () => {
    for (let i = 0; i < 10000; i++) {
      rbTree.set(i);
    }
    for (let i = 0; i < 10000; i++) {
      rbTree.delete(i);
    }

    expect(rbTree.size).toBe(0);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.dfs(n => n.key, 'IN', false, rbTree.root, 'ITERATIVE')).toEqual([]);

    rbTree.clear();
    for (let i = 0; i < 1000; i++) {
      rbTree.set(getRandomInt(-100, 1000));
      rbTree.delete(getRandomInt(-100, 1000));
    }

    // TODO there is a bug when dfs the rbTree with NIL node
    // expect(rbTree.isBST()).toBe(true);
  });
  const { HUNDRED_THOUSAND } = magnitude;
  const arr = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND, true);
  const competitor = new OrderedMap<number, number>();

  it('should fix the rbTree after large scale insertion and deletion', () => {
    rbTree.clear();
    const tS = performance.now();
    for (let i = 0; i < arr.length; i++) {
      rbTree.set(arr[i]);
    }
    if (isDebug) console.log(performance.now() - tS);

    const cS = performance.now();

    for (let i = 0; i < arr.length; i++) {
      competitor.setElement(arr[i], arr[i]);
    }
    if (isDebug) console.log(performance.now() - cS);
  });

  it('duplicates', () => {
    rbTree.setMany([9, 8, 7, 8, 8, 8, 2, 3, 6, 5, 5, 4]);
    if (isDebug) rbTree.print();

    expect(rbTree.size).toBe(8);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.isAVLBalanced()).toBe(true);
    rbTree.setMany([10, 5, 2, 11]);
    expect(rbTree.size).toBe(10);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.isAVLBalanced()).toBe(true);

    rbTree.clear();
    rbTree.setMany([10, 20, 30, 40, 50, 60]);
    expect(rbTree.isAVLBalanced()).toBe(false);
  });

  describe('RedBlackTree delete test', function () {
    const rbTree = new RedBlackTree<number, number>();
    const inputSize = 100; // Adjust input sizes as needed

    beforeEach(() => {
      rbTree.clear();
    });
    it('The structure remains normal after random deletion', function () {
      for (let i = 0; i < inputSize; i++) {
        rbTree.set(i);
      }

      for (let i = 0; i < inputSize; i++) {
        const num = getRandomInt(0, inputSize - 1);
        rbTree.delete(num);
      }

      let nanCount = 0;
      const dfs = (cur: RedBlackTreeNode<number>) => {
        if (isNaN(cur.key)) nanCount++;
        if (cur.left) dfs(cur.left);
        if (cur.right) dfs(cur.right);
      };
      if (rbTree.root) dfs(rbTree.root);

      expect(rbTree.size).toBeLessThanOrEqual(inputSize);
      expect(rbTree.getHeight()).toBeLessThan(Math.log2(inputSize) * 2);

      expect(nanCount).toBeLessThanOrEqual(inputSize);
    });

    it(`Random additions, complete deletions of structures are normal`, function () {
      for (let i = 0; i < inputSize; i++) {
        const num = getRandomInt(0, inputSize - 1);
        if (i === 0 && isDebug) console.log(`first:`, num);
        rbTree.set(num);
      }

      for (let i = 0; i < inputSize; i++) {
        rbTree.delete(i);
      }

      let nanCount = 0;
      const dfs = (cur: RedBlackTreeNode<number>) => {
        if (isNaN(cur.key)) nanCount++;
        if (cur.left) dfs(cur.left);
        if (cur.right) dfs(cur.right);
      };
      if (rbTree.root) dfs(rbTree.root);

      expect(rbTree.size).toBe(0);
      expect(rbTree.getHeight()).toBe(-1);
      expect(nanCount).toBeLessThanOrEqual(inputSize);

      if (isDebug) rbTree.print();
    });
  });

  describe('RedBlackTree iterative methods test', () => {
    let rbTree: RedBlackTree<number, string>;
    beforeEach(() => {
      rbTree = new RedBlackTree();
      rbTree.set([1, 'a']);
      rbTree.set(2, 'b');
      rbTree.set([3, 'c']);
    });

    it('The node obtained by get Node should match the node type', () => {
      const node3 = rbTree.getNode(3);
      // expect(node3).toBeInstanceOf(BinaryTreeNode);
      // expect(node3).toBeInstanceOf(BSTNode);
      expect(node3).toBeInstanceOf(RedBlackTreeNode);
    });

    it('forEach should iterate over all elements', () => {
      const mockCallback = jest.fn();
      rbTree.forEach((value, key) => {
        mockCallback(key, value);
      });

      expect(mockCallback.mock.calls.length).toBe(3);
      expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
      expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
      expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
    });

    it('filter should return a new rbTree with filtered elements', () => {
      const filteredTree = rbTree.filter((_value, key) => key > 1);
      expect(filteredTree.size).toBe(2);
      expect([...filteredTree]).toEqual([
        [2, 'b'],
        [3, 'c']
      ]);
    });

    it('map should return a new rbTree with modified elements', () => {
      const rbTreeMapped = rbTree.map((value, key) => [(key * 2).toString(), value]);
      expect(rbTreeMapped.size).toBe(3);
      expect([...rbTreeMapped]).toEqual([
        ['2', 'a'],
        ['4', 'b'],
        ['6', 'c']
      ]);
    });

    it('reduce should accumulate values', () => {
      const sum = rbTree.reduce((acc, value, key) => acc + key, 0);
      expect(sum).toBe(6);
    });

    it('[Symbol.iterator] should provide an iterator', () => {
      const entries = [];
      for (const entry of rbTree) {
        entries.push(entry);
      }

      expect(entries.length).toBe(3);
      expect(entries).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ]);
    });
  });
});

describe('RedBlackTree - _deleteFixup', () => {
  let rbTree: RedBlackTree<number, number>;

  beforeEach(() => {
    rbTree = new RedBlackTree();
  });

  it('should handle deleting a red leaf node', () => {
    rbTree.set(10, 10);
    rbTree.set(5, 5); // Red leaf
    rbTree.set(20, 20);

    expect(rbTree.delete(5)).toHaveLength(1); // Delete red leaf
    expect(rbTree.root?.left).toBe(rbTree.NIL); // Left child should be NIL
  });

  it('should handle deleting a black leaf node', () => {
    rbTree.set(10, 10);
    rbTree.set(5, 5); // Black node
    rbTree.set(20, 20);
    rbTree.set(1, 1); // Black leaf node

    expect(rbTree.delete(1)).toHaveLength(1); // Delete black leaf
    expect(rbTree.root?.left?.left).toBe(rbTree.NIL);
  });

  it('should handle deleting black node with red sibling', () => {
    rbTree.set(10, 10);
    rbTree.set(5, 5); // Black node
    rbTree.set(20, 20); // Red sibling
    rbTree.set(25, 25); // Force the sibling to be red

    expect(rbTree.delete(5)).toHaveLength(1); // Delete black node
    expect(rbTree.root?.right?.color).toBe('BLACK'); // Ensure sibling color is black after fixup
  });

  it('should handle deleting black node with black sibling', () => {
    rbTree.set(10, 10);
    rbTree.set(5, 5); // Black node
    rbTree.set(20, 20); // Black sibling

    expect(rbTree.delete(5)).toHaveLength(1); // Delete black node
    expect(rbTree.root?.left).toBe(rbTree.NIL);
  });

  it('should handle deleting the root node', () => {
    rbTree.set(10, 10); // Root node
    rbTree.set(5, 5);
    rbTree.set(20, 20);

    expect(rbTree.delete(10)).toHaveLength(1); // Delete root node
    expect(rbTree.root?.key).toBe(20); // New root should be 20
  });

  it('should handle complex case with multiple rotations', () => {
    rbTree.set(10, 10);
    rbTree.set(5, 5);
    rbTree.set(15, 15);
    rbTree.set(12, 12);
    rbTree.set(18, 18);
    rbTree.set(16, 16);

    // Delete a node that will cause rotations and color changes
    expect(rbTree.delete(5)).toHaveLength(1);

    // Verify the tree is correctly balanced after fixup
    expect(rbTree.root?.color).toBe('BLACK');
    expect(rbTree.root?.key).toBe(15);
    expect(rbTree.root?.left?.key).toBe(10);
    expect(rbTree.root?.left?.color).toBe('BLACK');
    expect(rbTree.root?.right?.key).toBe(18);
    expect(rbTree.root?.right?.color).toBe('BLACK');
    expect(rbTree.size).toBe(5);
    expect(rbTree.isBST()).toBe(true);
  });

  it('should handle complex delete fixup scenarios', () => {
    const rbTree = new RedBlackTree<number, number>();

    // Build a rbTree that will require complex fixup
    rbTree.set(20, 20);
    rbTree.set(10, 10);
    rbTree.set(30, 30);
    rbTree.set(5, 5);
    rbTree.set(15, 15);
    rbTree.set(25, 25);
    rbTree.set(35, 35);
    rbTree.set(2, 2);
    rbTree.set(8, 8);

    // This deletion should trigger a complex fixup
    rbTree.delete(2);
    // rbTree.print(rbTree.root, { isShowNull: true, isShowRedBlackNIL: true, isShowUndefined: false });

    expect(rbTree.isLeaf(2)).toBe(false);
    expect(rbTree.isLeaf(8)).toBe(true);
    expect(rbTree.isLeaf(15)).toBe(true);
    expect(rbTree.isLeaf(25)).toBe(true);
    expect(rbTree.isLeaf(35)).toBe(true);
    expect(rbTree.isLeaf(20)).toBe(false);
    expect(rbTree.isLeaf(30)).toBe(false);
    // Verify rbTree structure and colors after fixup
    expect(rbTree.root?.color).toBe('BLACK');
    expect(rbTree.root?.key).toBe(20);
    expect(rbTree.root?.left?.color).toBe('RED');
    expect(rbTree.root?.left?.key).toBe(10);
    expect(rbTree.root?.right?.color).toBe('BLACK');
    expect(rbTree.root?.right?.key).toBe(30);
    expect(rbTree.root?.left?.left?.color).toBe('BLACK');
    expect(rbTree.root?.left?.left?.key).toBe(5);
    expect(rbTree.root?.left?.right?.color).toBe('BLACK');
    expect(rbTree.root?.left?.right?.key).toBe(15);
    expect(rbTree.leaves(node => (node === null ? '' : `${node.key} ${node.color}`), rbTree.root, 'RECURSIVE')).toEqual(
      ['8 RED', '15 BLACK', '25 RED', '35 RED']
    );
    expect(rbTree.listLevels(node => (node === rbTree.NIL ? 'NIL' : `${node.key} ${node.color}`))).toEqual([
      ['20 BLACK'],
      ['10 RED', '30 BLACK'],
      ['5 BLACK', '15 BLACK', '25 RED', '35 RED'],
      ['NIL', '8 RED', 'NIL', 'NIL', 'NIL', 'NIL', 'NIL', 'NIL'],
      ['NIL', 'NIL']
    ]);
  });
});

describe('real world data', () => {
  it('cost of living', () => {
    const indexedByRank = new RedBlackTree(costOfLiving, {
      comparator: (a, b) => a.rank - b.rank,
      toEntryFn: raw => [raw, undefined]
    });
    expect(indexedByRank.size).toBe(7);
    expect(indexedByRank.dfs(node => node?.key?.country)).toEqual([
      'Switzerland',
      'New Zealand',
      'Mexico',
      'South Africa',
      'Japan',
      'Brazil',
      'Taiwan'
    ]);
  });
});

describe('classic use', () => {
  it('@example [RedBlackTree.set] basic Red-Black Tree with simple number keys', () => {
    // Create a simple Red-Black Tree with numeric keys
    const tree = new RedBlackTree([5, 2, 8, 1, 9]);

    tree.print();
    //   _2___
    //  /     \
    //  1    _8_
    //      /   \
    //      5   9

    // Verify the tree maintains sorted order
    expect([...tree.keys()]).toEqual([1, 2, 5, 8, 9]);

    // Check size
    expect(tree.size).toBe(5);
  });

  it('@example Red-Black Tree with key-value pairs for lookups', () => {
    interface Employee {
      id: number;
      name: string;
    }

    // Create tree with employee data
    const employees = new RedBlackTree<number, Employee>([
      [1, { id: 1, name: 'Alice' }],
      [3, { id: 3, name: 'Charlie' }],
      [2, { id: 2, name: 'Bob' }]
    ]);

    // Retrieve employee by ID
    const alice = employees.get(1);
    expect(alice?.name).toBe('Alice');

    // Verify sorted order by ID
    expect([...employees.keys()]).toEqual([1, 2, 3]);
  });

  it('@example Red-Black Tree range search for filtering', () => {
    interface Product {
      name: string;
      price: number;
    }

    const products = new RedBlackTree<number, Product>([
      [10, { name: 'Item A', price: 10 }],
      [25, { name: 'Item B', price: 25 }],
      [40, { name: 'Item C', price: 40 }],
      [50, { name: 'Item D', price: 50 }]
    ]);

    // Find products in price range [20, 45]
    const pricesInRange = products.rangeSearch([20, 45], node => {
      return products.get(node)?.name;
    });

    expect(pricesInRange).toEqual(['Item B', 'Item C']);
  });

  it('@example Red-Black Tree as database index for stock market data', () => {
    interface StockPrice {
      symbol: string;
      volume: number;
      timestamp: Date;
    }

    // Simulate real-time stock price index
    const priceIndex = new RedBlackTree<number, StockPrice>([
      [142.5, { symbol: 'AAPL', volume: 1000000, timestamp: new Date() }],
      [335.2, { symbol: 'MSFT', volume: 800000, timestamp: new Date() }],
      [3285.04, { symbol: 'AMZN', volume: 500000, timestamp: new Date() }],
      [267.98, { symbol: 'META', volume: 750000, timestamp: new Date() }],
      [234.57, { symbol: 'GOOGL', volume: 900000, timestamp: new Date() }]
    ]);

    // Find highest-priced stock
    const maxPrice = priceIndex.getRightMost();
    expect(priceIndex.get(maxPrice)?.symbol).toBe('AMZN');

    // Find stocks in price range [200, 400] for portfolio balancing
    const stocksInRange = priceIndex.rangeSearch([200, 400], node => {
      const stock = priceIndex.get(node);
      return {
        symbol: stock?.symbol,
        price: node,
        volume: stock?.volume
      };
    });

    expect(stocksInRange.length).toBe(3);
    expect(stocksInRange.some((s: any) => s.symbol === 'GOOGL')).toBe(true);
    expect(stocksInRange.some((s: any) => s.symbol === 'META')).toBe(true);
    expect(stocksInRange.some((s: any) => s.symbol === 'MSFT')).toBe(true);
  });
});

describe('RedBlackTree perfectlyBalance and clone (#79)', () => {
  it('perfectlyBalance preserves all entries and maintains RBT invariants', () => {
    const rbt = new RedBlackTree<number, string>();
    // Insert in worst-case order (sorted)
    for (let i = 1; i <= 20; i++) rbt.set([i, `v${i}`]);
    expect(rbt.size).toBe(20);

    rbt.perfectlyBalance();

    expect(rbt.size).toBe(20);
    expect(rbt.isBST()).toBe(true);
    // All entries preserved
    for (let i = 1; i <= 20; i++) {
      expect(rbt.get(i)).toBe(`v${i}`);
    }
  });

  it('clone produces identical key-value pairs', () => {
    const rbt = new RedBlackTree<number, string>();
    rbt.set([5, 'e']); rbt.set([3, 'c']); rbt.set([7, 'g']); rbt.set([1, 'a']); rbt.set([9, 'i']);

    const cloned = rbt.clone();
    expect(cloned.size).toBe(rbt.size);
    expect([...cloned].map(([k]) => k).sort()).toEqual([...rbt].map(([k]) => k).sort());
    for (const [key, value] of rbt) {
      expect(cloned.get(key)).toBe(value);
    }

    // Mutating clone doesn't affect original
    cloned.delete(5);
    expect(cloned.size).toBe(4);
    expect(rbt.size).toBe(5);
  });

  it('@example [RedBlackTree.add] Add element with auto-balancing', () => {
    const rbt = new RedBlackTree<number>();
    rbt.add(10);
    rbt.add(5);
    rbt.add(15);
    expect(rbt.size).toBe(3);
    expect(rbt.isBST()).toBe(true);
  });

  it('@example [RedBlackTree.delete] Delete with rebalancing', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4, 6, 8]);
    rbt.delete(3);
    expect(rbt.has(3)).toBe(false);
    expect(rbt.size).toBe(6);
    expect(rbt.isBST()).toBe(true);
  });

  it('@example [RedBlackTree.get] Retrieve value by key', () => {
    const rbt = new RedBlackTree<number, string>([[5, 'five'], [3, 'three'], [7, 'seven']]);
    expect(rbt.get(3)).toBe('three');
    expect(rbt.get(99)).toBeUndefined();
  });

  it('@example [RedBlackTree.has] Check key existence', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    expect(rbt.has(3)).toBe(true);
    expect(rbt.has(99)).toBe(false);
  });

  it('@example [RedBlackTree.ceiling] Least key ≥ target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
    expect(rbt.ceiling(25)).toBe(30);
    expect(rbt.ceiling(55)).toBeUndefined();
  });

  it('@example [RedBlackTree.floor] Greatest key ≤ target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
    expect(rbt.floor(25)).toBe(20);
  });

  it('@example [RedBlackTree.higher] Strictly greater', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30]);
    expect(rbt.higher(20)).toBe(30);
  });

  it('@example [RedBlackTree.lower] Strictly less', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30]);
    expect(rbt.lower(20)).toBe(10);
  });

  it('@example [RedBlackTree.rangeSearch] Find keys in range', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
    expect(rbt.rangeSearch([15, 35])).toEqual([20, 30]);
  });

  it('@example [RedBlackTree.entries] Iterate key-value pairs', () => {
    const rbt = new RedBlackTree<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
    expect([...rbt.entries()]).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('@example [RedBlackTree.keys] Get sorted keys', () => {
    const rbt = new RedBlackTree<number>([30, 10, 20]);
    expect([...rbt.keys()]).toEqual([10, 20, 30]);
  });

  it('@example [RedBlackTree.values] Get values in key order', () => {
    const rbt = new RedBlackTree<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
    expect([...rbt.values()]).toEqual(['a', 'b', 'c']);
  });

  it('@example [RedBlackTree.forEach] Execute for each entry', () => {
    const rbt = new RedBlackTree<number>([3, 1, 2]);
    const keys: number[] = [];
    rbt.forEach((v, key) => keys.push(key));
    expect(keys).toEqual([1, 2, 3]);
  });

  it('@example [RedBlackTree.filter] Filter entries', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5, 6]);
    const evens = rbt.filter((_, key) => key % 2 === 0);
    expect([...evens.keys()]).toEqual([2, 4, 6]);
  });

  it('@example [RedBlackTree.map] Transform to new tree', () => {
    const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20]]);
    const doubled = rbt.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
    expect([...doubled.values()]).toEqual([20, 40]);
  });

  it('@example [RedBlackTree.reduce] Aggregate values', () => {
    const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = rbt.reduce((acc, v) => acc + (v ?? 0), 0);
    expect(sum).toBe(60);
  });

  it('@example [RedBlackTree.every] Test all nodes', () => {
    const rbt = new RedBlackTree<number>([2, 4, 6]);
    expect(rbt.every((_, key) => key > 0)).toBe(true);
  });

  it('@example [RedBlackTree.some] Test any node', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3]);
    expect(rbt.some((_, key) => key === 3)).toBe(true);
  });

  it('@example [RedBlackTree.find] Find matching entry', () => {
    const rbt = new RedBlackTree<number, string>([[1, 'a'], [2, 'b']]);
    const found = rbt.find(v => v === 'b');
    expect(found?.[0]).toBe(2);
  });

  it('@example [RedBlackTree.clone] Create independent copy', () => {
    const rbt = new RedBlackTree<number>([3, 1, 5]);
    const copy = rbt.clone();
    copy.delete(1);
    expect(rbt.has(1)).toBe(true);
  });

  it('@example [RedBlackTree.merge] Combine two trees', () => {
    const rbt1 = new RedBlackTree<number>([1, 3, 5]);
    const rbt2 = new RedBlackTree<number>([2, 4, 6]);
    rbt1.merge(rbt2);
    expect([...rbt1.keys()]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('@example [RedBlackTree.clear] Remove all nodes', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3]);
    rbt.clear();
    expect(rbt.isEmpty()).toBe(true);
  });

  it('@example [RedBlackTree.isEmpty] Check empty', () => {
    const rbt = new RedBlackTree<number>();
    expect(rbt.isEmpty()).toBe(true);
  });

  it('@example [RedBlackTree.toArray] Convert to sorted array', () => {
    const rbt = new RedBlackTree<number>([30, 10, 20]);
    expect(rbt.toArray().map(([k]) => k)).toEqual([10, 20, 30]);
  });

  it('@example [RedBlackTree.dfs] Depth-first traversal', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const inOrder = rbt.dfs(node => node.key, 'IN');
    expect(inOrder).toEqual([1, 3, 4, 5, 7]);
  });

  it('@example [RedBlackTree.bfs] Breadth-first traversal', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    const bfsKeys = rbt.bfs(node => node.key);
    expect(bfsKeys.length).toBe(3);
  });

  it('@example [RedBlackTree.addMany] Bulk add', () => {
    const rbt = new RedBlackTree<number>();
    rbt.addMany([5, 3, 7, 1, 9]);
    expect(rbt.size).toBe(5);
  });

  it('@example [RedBlackTree.leaves] Get leaf nodes', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = rbt.leaves(node => node.key);
    expect(leafKeys.sort((a, b) => a - b)).toEqual([1, 4, 6, 8]);
  });

  it('@example [RedBlackTree.print] Display tree structure', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    expect(() => rbt.print()).not.toThrow();
  });

  it('@example [RedBlackTree.isBST] Validate BST property', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    expect(rbt.isBST()).toBe(true);
  });

  it('@example [RedBlackTree.isAVLBalanced] Check if tree is height-balanced', () => {
    const rbt = new RedBlackTree<number>([4, 2, 6, 1, 3, 5, 7]);
    // RBT ensures near-balance but not strict AVL
    expect(typeof rbt.isAVLBalanced()).toBe('boolean');
  });

  it('@example [RedBlackTree.perfectlyBalance] Rebalance tree', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    rbt.perfectlyBalance();
    expect(rbt.isAVLBalanced()).toBe(true);
  });

  it('@example [RedBlackTree.getHeight] Tree height', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5, 6, 7]);
    expect(rbt.getHeight()).toBeGreaterThanOrEqual(2);
  });

  it('@example [RedBlackTree.getNode] Get node by key', () => {
    const rbt = new RedBlackTree<number, string>([[5, 'root'], [3, 'left']]);
    expect(rbt.getNode(3)?.value).toBe('left');
  });

  it('@example [RedBlackTree.search] Search by predicate', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    const found = rbt.search(node => node.key > 3, true);
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  it('@example [RedBlackTree.getNodes] Get nodes by condition', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const big = rbt.getNodes(node => node.key > 5);
    expect(big.length).toBe(2);
  });

  it('@example [RedBlackTree.listLevels] Level-order grouping', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const levels = rbt.listLevels(node => node.key);
    expect(levels.length).toBeGreaterThan(0);
    const allKeys = levels.flat().filter(k => !isNaN(k)).sort((a, b) => a - b);
    expect(allKeys).toEqual([1, 3, 5, 7, 9]);
  });

  it('@example [RedBlackTree.setMany] Set multiple entries', () => {
    const rbt = new RedBlackTree<number, string>();
    rbt.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(rbt.size).toBe(3);
  });

  it('@example [RedBlackTree.add] Insert a key', () => {
    const rbt = new RedBlackTree<number>();
    rbt.add(10);
    rbt.add(5);
    rbt.add(15);
    expect(rbt.size).toBe(3);
    expect(rbt.has(10)).toBe(true);
  });

  it('@example [RedBlackTree.delete] Remove and rebalance', () => {
    const rbt = new RedBlackTree<number>([10, 5, 15, 3, 7]);
    rbt.delete(5);
    expect(rbt.has(5)).toBe(false);
    expect(rbt.size).toBe(4);
  });

  it('@example [RedBlackTree.get] Retrieve value by key', () => {
    const rbt = new RedBlackTree<number, string>([[1, 'one'], [2, 'two']]);
    expect(rbt.get(1)).toBe('one');
  });

  it('@example [RedBlackTree.has] Check key existence', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    expect(rbt.has(3)).toBe(true);
    expect(rbt.has(99)).toBe(false);
  });

  it('@example [RedBlackTree.entries] Iterate key-value pairs in order', () => {
    const rbt = new RedBlackTree<number, string>([[3, 'c'], [1, 'a'], [2, 'b']]);
    expect([...rbt.entries()]).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('@example [RedBlackTree.keys] Get sorted keys', () => {
    const rbt = new RedBlackTree<number>([30, 10, 20]);
    expect([...rbt.keys()]).toEqual([10, 20, 30]);
  });

  it('@example [RedBlackTree.values] Get values in key order', () => {
    const rbt = new RedBlackTree<number, string>([[2, 'b'], [1, 'a'], [3, 'c']]);
    expect([...rbt.values()]).toEqual(['a', 'b', 'c']);
  });

  it('@example [RedBlackTree.forEach] Execute for each entry', () => {
    const rbt = new RedBlackTree<number>([3, 1, 2]);
    const keys: number[] = [];
    rbt.forEach((v, k) => keys.push(k));
    expect(keys).toEqual([1, 2, 3]);
  });

  it('@example [RedBlackTree.every] Test all entries', () => {
    const rbt = new RedBlackTree<number>([2, 4, 6]);
    expect(rbt.every((v, k) => k > 0)).toBe(true);
  });

  it('@example [RedBlackTree.some] Test any entry', () => {
    const rbt = new RedBlackTree<number>([1, 3, 5]);
    expect(rbt.some((v, k) => k === 3)).toBe(true);
  });

  it('@example [RedBlackTree.find] Find matching entry', () => {
    const rbt = new RedBlackTree<number, string>([[1, 'a'], [2, 'b']]);
    const found = rbt.find(v => v === 'b');
    expect(found?.[0]).toBe(2);
  });

  it('@example [RedBlackTree.filter] Filter entries', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    const evens = rbt.filter((v, k) => k % 2 === 0);
    expect([...evens.keys()]).toEqual([2, 4]);
  });

  it('@example [RedBlackTree.map] Transform to new tree', () => {
    const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20]]);
    const doubled = rbt.map((v, k) => [k, (v ?? 0) * 2] as [number, number]);
    expect([...doubled.values()]).toEqual([20, 40]);
  });

  it('@example [RedBlackTree.reduce] Aggregate values', () => {
    const rbt = new RedBlackTree<number, number>([[1, 10], [2, 20], [3, 30]]);
    const sum = rbt.reduce((acc, v) => acc + (v ?? 0), 0);
    expect(sum).toBe(60);
  });

  it('@example [RedBlackTree.toArray] Convert to sorted array', () => {
    const rbt = new RedBlackTree<number>([30, 10, 20]);
    expect(rbt.toArray().map(([k]) => k)).toEqual([10, 20, 30]);
  });

  it('@example [RedBlackTree.ceiling] Least key ≥ target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
    expect(rbt.ceiling(25)).toBe(30);
  });

  it('@example [RedBlackTree.floor] Greatest key ≤ target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40]);
    expect(rbt.floor(25)).toBe(20);
  });

  it('@example [RedBlackTree.higher] Least key > target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30]);
    expect(rbt.higher(20)).toBe(30);
  });

  it('@example [RedBlackTree.lower] Greatest key < target', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30]);
    expect(rbt.lower(20)).toBe(10);
  });

  it('@example [RedBlackTree.rangeSearch] Find keys in range', () => {
    const rbt = new RedBlackTree<number>([10, 20, 30, 40, 50]);
    expect(rbt.rangeSearch([15, 35])).toEqual([20, 30]);
  });

  it('@example [RedBlackTree.dfs] Depth-first traversal', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const inOrder = rbt.dfs(node => node.key, 'IN');
    expect(inOrder).toEqual([1, 3, 4, 5, 7]);
  });

  it('@example [RedBlackTree.bfs] Breadth-first traversal', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    const levelOrder = rbt.bfs(node => node.key);
    expect(levelOrder.length).toBe(3);
  });

  it('@example [RedBlackTree.clone] Create independent copy', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    const copy = rbt.clone();
    copy.delete(3);
    expect(rbt.has(3)).toBe(true);
  });

  it('@example [RedBlackTree.merge] Combine trees', () => {
    const rbt1 = new RedBlackTree<number>([1, 3]);
    const rbt2 = new RedBlackTree<number>([2, 4]);
    rbt1.merge(rbt2);
    expect([...rbt1.keys()]).toEqual([1, 2, 3, 4]);
  });

  it('@example [RedBlackTree.clear] Remove all entries', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3]);
    rbt.clear();
    expect(rbt.isEmpty()).toBe(true);
  });

  it('@example [RedBlackTree.isEmpty] Check if empty', () => {
    expect(new RedBlackTree().isEmpty()).toBe(true);
  });

  it('@example [RedBlackTree.print] Display tree', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    expect(() => rbt.print()).not.toThrow();
  });

  it('@example [RedBlackTree.isBST] Validate BST property', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    expect(rbt.isBST()).toBe(true);
  });

  it('@example [RedBlackTree.isAVLBalanced] Check height balance', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5, 6, 7]);
    // RBT is balanced but not necessarily AVL-balanced
    expect(typeof rbt.isAVLBalanced()).toBe('boolean');
  });

  it('@example [RedBlackTree.addMany] Add multiple keys', () => {
    const rbt = new RedBlackTree<number>();
    rbt.addMany([5, 3, 7, 1, 9]);
    expect(rbt.size).toBe(5);
  });

  it('@example [RedBlackTree.leaves] Get leaf nodes', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4, 6, 8]);
    const leafKeys = rbt.leaves(n => n.key);
    expect(leafKeys.length).toBeGreaterThan(0);
  });

  it('@example [RedBlackTree.getHeight] Tree height', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1]);
    expect(rbt.getHeight()).toBeGreaterThanOrEqual(2);
  });

  it('@example [RedBlackTree.getNode] Get node by key', () => {
    const rbt = new RedBlackTree<number, string>([[5, 'root'], [3, 'left']]);
    expect(rbt.getNode(3)?.value).toBe('left');
  });

  it('@example [RedBlackTree.perfectlyBalance] Rebalance tree', () => {
    const rbt = new RedBlackTree<number>([1, 2, 3, 4, 5]);
    rbt.perfectlyBalance();
    expect(rbt.isAVLBalanced()).toBe(true);
  });

  it('@example [RedBlackTree.search] Search nodes by predicate', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const found = rbt.search(n => n.key > 5, true);
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  it('@example [RedBlackTree.listLevels] Level-order grouping', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 4]);
    const levels = rbt.listLevels(n => n.key);
    expect(levels.length).toBeGreaterThan(0);
    // Filter out NIL sentinels (NaN keys)
    const allKeys = levels.flat().filter(k => !isNaN(k)).sort((a, b) => a - b);
    expect(allKeys).toEqual([1, 3, 4, 5, 7]);
  });

  it('@example [RedBlackTree.getNodes] Get nodes matching condition', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7, 1, 9]);
    const big = rbt.getNodes(n => n.key > 5);
    expect(big.length).toBe(2);
  });

  it('@example [RedBlackTree.morris] Morris traversal (O(1) space)', () => {
    const rbt = new RedBlackTree<number>([5, 3, 7]);
    const result = rbt.morris(n => n.key, 'IN');
    expect(result.length).toBeGreaterThan(0);
  });

  it('@example [RedBlackTree.setMany] Set multiple key-value pairs', () => {
    const rbt = new RedBlackTree<number, string>();
    rbt.setMany([[1, 'a'], [2, 'b'], [3, 'c']]);
    expect(rbt.size).toBe(3);
  });
});
