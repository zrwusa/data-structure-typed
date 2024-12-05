import { BinaryTreeNode, BSTNode, RedBlackTree, RedBlackTreeNode } from '../../../../src';
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
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);

      expect(rbTree.getNode(10)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(20)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(5)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(15)).toBe(undefined);
    });

    it('should add and find nodes with negative keys', () => {
      rbTree.add(-10);
      rbTree.add(-20);

      expect(rbTree.getNode(-10)).toBeInstanceOf(RedBlackTreeNode);
      expect(rbTree.getNode(-20)).toBeInstanceOf(RedBlackTreeNode);
    });
  });

  describe('deleteNode', () => {
    it('should delete a node from the rbTree', () => {
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.delete(20);

      expect(rbTree.getNode(20)).toBe(undefined);
    });

    it('should handle deleting a non-existent node', () => {
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.delete(15);

      expect(rbTree.getNode(15)).toBe(undefined);
    });

    it('should getNode performance O(log n)', () => {
      for (let i = 0; i < 10; i++) rbTree.add(i);
      rbTree.getNode(6);
    });
  });

  describe('minimum', () => {
    it('should find the minimum node in the rbTree', () => {
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.add(15);
      rbTree.add(3);

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
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.add(15);
      rbTree.add(25);

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
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.add(15);
      rbTree.add(25);

      const node = rbTree.getNode(15);
      const successorNode = rbTree.getSuccessor(node!);

      expect(successorNode?.key).toBe(20);
    });

    it('should handle a node with no getSuccessor', () => {
      rbTree.add(10);
      rbTree.add(5);

      const node = rbTree.getNode(10);
      const successorNode = rbTree.getSuccessor(node!);
      // TODO not sure if it should be undefined or rbTree.NIL
      expect(successorNode).toBe(undefined);
    });
  });

  describe('getPredecessor', () => {
    it('should find the getPredecessor of a node', () => {
      rbTree.add(10);
      rbTree.add(20);
      rbTree.add(5);
      rbTree.add(15);
      rbTree.add(25);

      const node = rbTree.getNode(20);
      const predecessorNode = rbTree.getPredecessor(node!);

      expect(predecessorNode?.key).toBe(15);
    });

    it('should handle a node with no getPredecessor', () => {
      rbTree.add(10);
      rbTree.add(20);

      const node = rbTree.getNode(20);
      const predecessorNode = rbTree.getPredecessor(node!);
      // TODO not sure if it should be rbTree.NIL or something else.
      expect(predecessorNode).toBe(rbTree.getNode(20));
    });
  });

  it('should the clone method', () => {
    function checkTreeStructure(rbTree: RedBlackTree<string, number>) {
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
    rbTree.addMany([
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
    rbTree.add(1, 'a');
    expect(rbTree.get(1)).toBe('a');
    rbTree.add([1, 'b']);
    expect(rbTree.getNode(1)?.value).toBe('b');
    expect(rbTree.get(1)).toBe('b');
    const treeMap = new RedBlackTree<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    treeMap.add(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.add([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    expect(treeMap.get(1)).toBe('b');
  });
});

describe('RedBlackTree 2', () => {
  let rbTree: RedBlackTree<number>;

  beforeEach(() => {
    rbTree = new RedBlackTree<number>();
  });

  it('should add nodes into the rbTree', () => {
    rbTree.add(10);
    expect(rbTree.getNode(10)).toBeDefined();
    rbTree.add(20);
    expect(rbTree.getNode(20)).toBeDefined();
    rbTree.add(5);
    expect(rbTree.getNode(5)).toBeDefined();
  });

  it('should delete nodes from the rbTree', () => {
    rbTree.add(10);
    rbTree.add(20);
    rbTree.add(5);
    rbTree.delete(20);
    expect(rbTree.getNode(20)).toBe(undefined);
  });

  it('should get the successor of a node', () => {
    rbTree.add(10);
    rbTree.add(20);
    const node = rbTree.getNode(10);
    const successor = rbTree.getSuccessor(node!);
    expect(successor?.key).toBe(20);
  });

  it('should get the predecessor of a node', () => {
    rbTree.add(10);
    rbTree.add(20);
    const node = rbTree.getNode(20);
    const predecessor = rbTree.getPredecessor(node!);
    expect(predecessor?.key).toBe(20);
  });

  it('should rotate nodes to the left', () => {
    rbTree.add(10);
    rbTree.add(20);
    rbTree.add(5);
    const node = rbTree.getNode(10);
    rbTree.add(15);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBe(5);
    expect(node?.right?.key).toBe(20);
  });

  it('should rotate nodes to the right', () => {
    rbTree.add(10);
    rbTree.add(20);
    rbTree.add(5);
    const node = rbTree.getNode(20);
    rbTree.add(25);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBeNaN();
    expect(node?.right?.key).toBe(25);
  });

  it('should all node attributes fully conform to the red-black rbTree standards.', () => {
    rbTree.add(10);
    rbTree.add(20);
    rbTree.add(5);
    rbTree.add(15);
    rbTree.add(21);
    rbTree.add(6);
    rbTree.add(2);

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
    rbTree.add(1);
    rbTree.add(2);
    rbTree.add(5);
    rbTree.add(15);
    const node15F = rbTree.getNode(15);
    expect(node15F?.left).toBe(rbTree.NIL);
    expect(node15F?.right).toBe(rbTree.NIL);
    expect(node15F?.parent).toBe(rbTree.getNode(5));

    rbTree.add(25);
    rbTree.add(10);
    rbTree.add(8);
    rbTree.add(28);
    rbTree.add(111);
    rbTree.add(12);
    rbTree.delete(2);
    rbTree.add(22);
    rbTree.add(50);
    rbTree.add(155);
    rbTree.add(225);
    const node225F = rbTree.getNode(225);
    expect(node225F?.left).toBe(rbTree.NIL);
    expect(node225F?.right).toBe(rbTree.NIL);
    expect(node225F?.parent?.key).toBe(155);
    rbTree.add(7);
    if (isDebug) rbTree.print();

    const node15S = rbTree.getNode(15);
    expect(node15S?.left?.key).toBe(10);
    expect(node15S?.right?.key).toBe(25);
    expect(rbTree.root).toBe(rbTree.getNode(8));
    expect(node15S?.parent?.key).toBe(28);
    rbTree.delete(15);
    expect(rbTree.root?.key).toBe(8);
    expect(rbTree.root?.parent).toBe(undefined);

    const node15T = rbTree.getNode(15);
    expect(node15T).toBe(undefined);

    rbTree.add(23);
    rbTree.add(33);
    rbTree.add(15);

    const nodeLM = rbTree.getLeftMost();
    expect(nodeLM).toBe(1);

    const node50 = rbTree.getNode(50);
    expect(node50?.key).toBe(50);
    expect(node50?.left?.key).toBe(33);
    expect(node50?.right).toBe(rbTree.NIL);
    const node15Fo = rbTree.getNode(15);

    expect(node15Fo?.key).toBe(15);
    expect(node15Fo?.left).toBe(rbTree.NIL);
    const node225S = rbTree.getNode(225);
    expect(node225S?.left).toBe(rbTree.NIL);
    expect(node225S?.right).toBe(rbTree.NIL);
    expect(node225S?.parent?.key).toBe(155);
    // TODO
    // expect(rbTree.getNode(0)).toBe(undefined);
    rbTree.add(2);
    rbTree.add(3);
    rbTree.add(4);
    rbTree.add(6);
    rbTree.add(9);
    rbTree.add(11);
    rbTree.add(13);
    rbTree.add(14);
    rbTree.add(16);
    rbTree.add(17);
    rbTree.add(18);
    rbTree.add(19);
    rbTree.add(110);

    if (isDebug) rbTree.print();

    expect(rbTree.dfs()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 28, 33, 50, 110, 111, 155, 225
    ]);

    expect(rbTree.isBST()).toBe(true);
  });

  it('should fix the rbTree after insertion and deletion', () => {
    for (let i = 0; i < 100; i++) {
      rbTree.add(i);
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
      rbTree.add(i);
    }
    for (let i = 0; i < 10000; i++) {
      rbTree.delete(i);
    }

    expect(rbTree.size).toBe(0);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.dfs(n => n.key, 'IN', false, rbTree.root, 'ITERATIVE')).toEqual([]);

    rbTree.clear();
    for (let i = 0; i < 1000; i++) {
      rbTree.add(getRandomInt(-100, 1000));
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
      rbTree.add(arr[i]);
    }
    if (isDebug) console.log(performance.now() - tS);

    const cS = performance.now();

    for (let i = 0; i < arr.length; i++) {
      competitor.setElement(arr[i], arr[i]);
    }
    if (isDebug) console.log(performance.now() - cS);
  });

  it('duplicates', () => {
    rbTree.addMany([9, 8, 7, 8, 8, 8, 2, 3, 6, 5, 5, 4]);
    if (isDebug) rbTree.print();

    expect(rbTree.size).toBe(8);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.isAVLBalanced()).toBe(true);
    rbTree.addMany([10, 5, 2, 11]);
    expect(rbTree.size).toBe(10);
    expect(rbTree.isBST()).toBe(true);
    expect(rbTree.isAVLBalanced()).toBe(true);

    rbTree.clear();
    rbTree.addMany([10, 20, 30, 40, 50, 60]);
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
        rbTree.add(i);
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
        rbTree.add(num);
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
      rbTree.add([1, 'a']);
      rbTree.add(2, 'b');
      rbTree.add([3, 'c']);
    });

    it('The node obtained by get Node should match the node type', () => {
      const node3 = rbTree.getNode(3);
      expect(node3).toBeInstanceOf(BinaryTreeNode);
      expect(node3).toBeInstanceOf(BSTNode);
      expect(node3).toBeInstanceOf(RedBlackTreeNode);
    });

    it('forEach should iterate over all elements', () => {
      const mockCallback = jest.fn();
      rbTree.forEach((key, value) => {
        mockCallback(key, value);
      });

      expect(mockCallback.mock.calls.length).toBe(3);
      expect(mockCallback.mock.calls[0]).toEqual([1, 'a']);
      expect(mockCallback.mock.calls[1]).toEqual([2, 'b']);
      expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
    });

    it('filter should return a new rbTree with filtered elements', () => {
      const filteredTree = rbTree.filter(key => key > 1);
      expect(filteredTree.size).toBe(2);
      expect([...filteredTree]).toEqual([
        [2, 'b'],
        [3, 'c']
      ]);
    });

    it('map should return a new rbTree with modified elements', () => {
      const rbTreeMapped = rbTree.map((key, value) => [(key * 2).toString(), value]);
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
    rbTree.add(10, 10);
    rbTree.add(5, 5); // Red leaf
    rbTree.add(20, 20);

    expect(rbTree.delete(5)).toHaveLength(1); // Delete red leaf
    expect(rbTree.root?.left).toBe(rbTree.NIL); // Left child should be NIL
  });

  it('should handle deleting a black leaf node', () => {
    rbTree.add(10, 10);
    rbTree.add(5, 5); // Black node
    rbTree.add(20, 20);
    rbTree.add(1, 1); // Black leaf node

    expect(rbTree.delete(1)).toHaveLength(1); // Delete black leaf
    expect(rbTree.root?.left?.left).toBe(rbTree.NIL);
  });

  it('should handle deleting black node with red sibling', () => {
    rbTree.add(10, 10);
    rbTree.add(5, 5); // Black node
    rbTree.add(20, 20); // Red sibling
    rbTree.add(25, 25); // Force the sibling to be red

    expect(rbTree.delete(5)).toHaveLength(1); // Delete black node
    expect(rbTree.root?.right?.color).toBe('BLACK'); // Ensure sibling color is black after fixup
  });

  it('should handle deleting black node with black sibling', () => {
    rbTree.add(10, 10);
    rbTree.add(5, 5); // Black node
    rbTree.add(20, 20); // Black sibling

    expect(rbTree.delete(5)).toHaveLength(1); // Delete black node
    expect(rbTree.root?.left).toBe(rbTree.NIL);
  });

  it('should handle deleting the root node', () => {
    rbTree.add(10, 10); // Root node
    rbTree.add(5, 5);
    rbTree.add(20, 20);

    expect(rbTree.delete(10)).toHaveLength(1); // Delete root node
    expect(rbTree.root?.key).toBe(20); // New root should be 20
  });

  it('should handle complex case with multiple rotations', () => {
    rbTree.add(10, 10);
    rbTree.add(5, 5);
    rbTree.add(15, 15);
    rbTree.add(12, 12);
    rbTree.add(18, 18);
    rbTree.add(16, 16);

    // Delete a node that will cause rotations and color changes
    expect(rbTree.delete(5)).toHaveLength(1);

    // Verify the color and structure after fixup
    expect(rbTree.root?.color).toBe('BLACK');
    expect(rbTree.root?.left).toBe(rbTree.NIL);
    expect(rbTree.root?.right?.left?.color).toBe('BLACK');
  });

  it('should handle complex delete fixup scenarios', () => {
    const rbTree = new RedBlackTree<number, number>();

    // Build a rbTree that will require complex fixup
    rbTree.add(20, 20);
    rbTree.add(10, 10);
    rbTree.add(30, 30);
    rbTree.add(5, 5);
    rbTree.add(15, 15);
    rbTree.add(25, 25);
    rbTree.add(35, 35);
    rbTree.add(2, 2);
    rbTree.add(8, 8);

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
      specifyComparable: node => node.rank,
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
  it('@example using Red-Black Tree as a price-based index for stock data', () => {
    // Define the structure of individual stock records
    interface StockRecord {
      price: number; // Stock price (key for indexing)
      symbol: string; // Stock ticker symbol
      volume: number; // Trade volume
    }

    // Simulate stock market data as it might come from an external feed
    const marketStockData: StockRecord[] = [
      { price: 142.5, symbol: 'AAPL', volume: 1000000 },
      { price: 335.2, symbol: 'MSFT', volume: 800000 },
      { price: 3285.04, symbol: 'AMZN', volume: 500000 },
      { price: 267.98, symbol: 'META', volume: 750000 },
      { price: 234.57, symbol: 'GOOGL', volume: 900000 }
    ];

    // Extend the stock record type to include metadata for database usage
    type StockTableRecord = StockRecord & { lastUpdated: Date };

    // Create a Red-Black Tree to index stock records by price
    // Simulates a database index with stock price as the key for quick lookups
    const priceIndex = new RedBlackTree<number, StockTableRecord, StockRecord>(marketStockData, {
      toEntryFn: stockRecord => [
        stockRecord.price, // Use stock price as the key
        {
          ...stockRecord,
          lastUpdated: new Date() // Add a timestamp for when the record was indexed
        }
      ]
    });

    // Query the stock with the highest price
    const highestPricedStock = priceIndex.getRightMost();
    expect(priceIndex.get(highestPricedStock)?.symbol).toBe('AMZN'); // Amazon has the highest price

    // Query stocks within a specific price range (200 to 400)
    const stocksInRange = priceIndex.rangeSearch(
      [200, 400], // Price range
      node => priceIndex.get(node)?.symbol // Extract stock symbols for the result
    );
    expect(stocksInRange).toEqual(['GOOGL', 'META', 'MSFT']); // Verify stocks in the range
  });
});
