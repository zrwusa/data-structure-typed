import { BinaryTreeNode, BSTNode, Range, TreeMultiMap, TreeMultiMapNode } from '../../../../src';
import { getRandomInt } from '../../../utils';

import { isDebugTest } from '../../../config';
import { costOfLiving } from './data/cost-of-living-by-country';

const isDebug = isDebugTest;
// const isDebug = true;

describe('TreeMultiMap 1', () => {
  let tmm: TreeMultiMap<number>;

  beforeEach(() => {
    tmm = new TreeMultiMap<number>();
  });

  it('Should add and delete values', () => {
    tmm.add(3, 3);
    tmm.add(3, 33);
    tmm.add(3, 333);
    expect(tmm.get(3)).toEqual([3, 33, 333]);
    tmm.deleteValue(3, 33);
    expect(tmm.get(3)).toEqual([3, 333]);
    tmm.deleteValue(3, 3);
    expect(tmm.get(3)).toEqual([333]);
    tmm.deleteValue(3, 333);
    expect(tmm.get(3)).toBe(undefined);
    tmm.add(3, 3);
    tmm.add([3, [3333, 33333]]);
    expect(tmm.get(3)).toEqual([3, 3333, 33333]);
  });

  describe('add and getNode', () => {
    it('should add and find a node in the tmm', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);

      expect(tmm.getNode(10)).toBeInstanceOf(TreeMultiMapNode);
      expect(tmm.getNode(20)).toBeInstanceOf(TreeMultiMapNode);
      expect(tmm.getNode(5)).toBeInstanceOf(TreeMultiMapNode);
      expect(tmm.getNode(15)).toBe(undefined);
    });

    it('should add and find nodes with negative keys', () => {
      tmm.add(-10);
      tmm.add(-20);

      expect(tmm.getNode(-10)).toBeInstanceOf(TreeMultiMapNode);
      expect(tmm.getNode(-20)).toBeInstanceOf(TreeMultiMapNode);
    });
  });

  describe('deleteNode', () => {
    it('should delete a node from the tmm', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.delete(20);

      expect(tmm.getNode(20)).toBe(undefined);
    });

    it('should handle deleting a non-existent node', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.delete(15);

      expect(tmm.getNode(15)).toBe(undefined);
    });

    it('should getNode performance O(log n)', () => {
      for (let i = 0; i < 10; i++) tmm.add(i);
      tmm.getNode(6);
    });
  });

  describe('minimum', () => {
    it('should find the minimum node in the tmm', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.add(15);
      tmm.add(3);

      const minNode = tmm.getLeftMost(node => node, tmm.root);
      expect(minNode?.key).toBe(3);
    });

    it('should handle an empty tmm', () => {
      const minNode = tmm.getLeftMost(node => node, tmm.root);
      expect(minNode).toBe(undefined);
    });
  });

  describe('getRightMost', () => {
    it('should find the getRightMost node in the tmm', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.add(15);
      tmm.add(25);

      const maxNode = tmm.getRightMost(node => node, tmm.root);
      expect(maxNode?.key).toBe(25);
    });

    it('should handle an empty tmm', () => {
      const maxNode = tmm.getRightMost(node => node, tmm.root);
      expect(maxNode).toBe(undefined);
    });
  });

  describe('getSuccessor', () => {
    it('should find the getSuccessor of a node', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.add(15);
      tmm.add(25);

      const node = tmm.getNode(15);
      const successorNode = tmm.getSuccessor(node!);

      expect(successorNode?.key).toBe(20);
    });

    it('should handle a node with no getSuccessor', () => {
      tmm.add(10);
      tmm.add(5);

      const node = tmm.getNode(10);
      const successorNode = tmm.getSuccessor(node!);
      // TODO not sure if it should be undefined or tmm.NIL
      expect(successorNode).toBe(undefined);
    });
  });

  describe('getPredecessor', () => {
    it('should find the getPredecessor of a node', () => {
      tmm.add(10);
      tmm.add(20);
      tmm.add(5);
      tmm.add(15);
      tmm.add(25);

      const node = tmm.getNode(20);
      const predecessorNode = tmm.getPredecessor(node!);

      expect(predecessorNode?.key).toBe(15);
    });

    it('should handle a node with no getPredecessor', () => {
      tmm.add(10);
      tmm.add(20);

      const node = tmm.getNode(20);
      const predecessorNode = tmm.getPredecessor(node!);
      // TODO not sure if it should be tmm.NIL or something else.
      expect(predecessorNode).toBe(tmm.getNode(20));
    });
  });

  it('should the clone method', () => {
    function checkTreeStructure(tmm: TreeMultiMap<string, number>) {
      expect(tmm.size).toBe(4);
      expect(tmm.root?.key).toBe('2');
      expect(tmm.root?.left?.key).toBe('1');
      expect(tmm.root?.left?.left?.key).toBe(NaN);
      expect(tmm.root?.left?.right?.key).toBe(NaN);
      expect(tmm.root?.right?.key).toBe('4');
      expect(tmm.root?.right?.left?.key).toBe(NaN);
      expect(tmm.root?.right?.right?.key).toBe('5');
    }

    const tmm = new TreeMultiMap<string, number>();
    tmm.addMany([
      ['2', 2],
      ['4', 4],
      ['5', 5],
      ['3', 3],
      ['1', 1]
    ]);
    expect(tmm.size).toBe(5);
    expect(tmm.root?.key).toBe('2');
    expect(tmm.root?.left?.key).toBe('1');
    expect(tmm.root?.left?.left?.key).toBe(NaN);
    expect(tmm.root?.left?.right?.key).toBe(NaN);
    expect(tmm.root?.right?.key).toBe('4');
    expect(tmm.root?.right?.left?.key).toBe('3');
    expect(tmm.root?.right?.right?.key).toBe('5');
    tmm.delete('3');
    checkTreeStructure(tmm);
    const cloned = tmm.clone();
    checkTreeStructure(cloned);
    cloned.delete('1');
    expect(tmm.size).toBe(4);
    expect(cloned.size).toBe(3);
  });

  it('should add value', () => {
    const tmm = new TreeMultiMap<number, string>([4, 5, [1, ['1']], 2, 3]);
    expect(tmm.get(1)).toEqual(['1']);
    expect(tmm.getNode(1)?.value).toEqual([]);
    tmm.add(1, 'a');
    expect(tmm.get(1)).toEqual(['1', 'a']);
    tmm.add([1, ['b']]);
    expect(tmm.getNode(1)?.value).toEqual([]);
    expect(tmm.get(1)).toEqual(['1', 'a', 'b']);
    const tmmMapped = new TreeMultiMap<number>([4, 5, [1, ['1']], 2, 3]);
    expect(tmmMapped.get(1)).toEqual(['1']);
    expect(tmmMapped.getNode(1)?.value).toEqual([]);
    tmmMapped.add(1, 'a');
    expect(tmmMapped.get(1)).toEqual(['1', 'a']);
    tmmMapped.add([1, ['b']]);
    expect(tmmMapped.getNode(1)?.value).toEqual([]);
    expect(tmmMapped.get(1)).toEqual(['1', 'a', 'b']);
  });
});

describe('TreeMultiMap 2', () => {
  let tmm: TreeMultiMap<number>;

  beforeEach(() => {
    tmm = new TreeMultiMap<number>();
  });

  it('should add nodes into the tmm', () => {
    tmm.add(10);
    expect(tmm.getNode(10)).toBeDefined();
    tmm.add(20);
    expect(tmm.getNode(20)).toBeDefined();
    tmm.add(5);
    expect(tmm.getNode(5)).toBeDefined();
  });

  it('should delete nodes from the tmm', () => {
    tmm.add(10);
    tmm.add(20);
    tmm.add(5);
    tmm.delete(20);
    expect(tmm.getNode(20)).toBe(undefined);
  });

  it('should get the successor of a node', () => {
    tmm.add(10);
    tmm.add(20);
    const node = tmm.getNode(10);
    const successor = tmm.getSuccessor(node!);
    expect(successor?.key).toBe(20);
  });

  it('should get the predecessor of a node', () => {
    tmm.add(10);
    tmm.add(20);
    const node = tmm.getNode(20);
    const predecessor = tmm.getPredecessor(node!);
    expect(predecessor?.key).toBe(20);
  });

  it('should rotate nodes to the left', () => {
    tmm.add(10);
    tmm.add(20);
    tmm.add(5);
    const node = tmm.getNode(10);
    tmm.add(15);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBe(5);
    expect(node?.right?.key).toBe(20);
  });

  it('should rotate nodes to the right', () => {
    tmm.add(10);
    tmm.add(20);
    tmm.add(5);
    const node = tmm.getNode(20);
    tmm.add(25);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBeNaN();
    expect(node?.right?.key).toBe(25);
  });

  it('should all node attributes fully conform to the red-black tmm standards.', () => {
    tmm.add(10);
    tmm.add(20);
    tmm.add(5);
    tmm.add(15);
    tmm.add(21);
    tmm.add(6);
    tmm.add(2);

    let node10F = tmm.getNode(10);
    let node20F = tmm.getNode(20);
    let node5F = tmm.getNode(5);
    let node15F = tmm.getNode(15);
    let node21F = tmm.getNode(21);
    let node6F = tmm.getNode(6);
    let node2F = tmm.getNode(2);
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
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('RED');
    expect(node21F?.left).toBe(tmm.NIL);
    expect(node21F?.right).toBe(tmm.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('RED');
    expect(node6F?.left).toBe(tmm.NIL);
    expect(node6F?.right).toBe(tmm.NIL);
    expect(node6F?.parent).toBe(node5F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(tmm.NIL);
    expect(node2F?.right).toBe(tmm.NIL);
    expect(node2F?.parent).toBe(node5F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node20F);
    tmm.delete(5);
    node10F = tmm.getNode(10);
    node20F = tmm.getNode(20);
    node5F = tmm.getNode(5);
    node15F = tmm.getNode(15);
    node21F = tmm.getNode(21);
    node6F = tmm.getNode(6);
    node2F = tmm.getNode(2);
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
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('RED');
    expect(node21F?.left).toBe(tmm.NIL);
    expect(node21F?.right).toBe(tmm.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('BLACK');
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(tmm.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(tmm.NIL);
    expect(node2F?.right).toBe(tmm.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node20F);
    tmm.delete(20);
    node10F = tmm.getNode(10);
    node20F = tmm.getNode(20);
    node5F = tmm.getNode(5);
    node15F = tmm.getNode(15);
    node21F = tmm.getNode(21);
    node6F = tmm.getNode(6);
    node2F = tmm.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe('BLACK');
    expect(node10F?.left).toBe(node6F);
    expect(node10F?.right).toBe(node21F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F).toBe(undefined);
    expect(node5F).toBe(undefined);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node21F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe('BLACK');
    expect(node21F?.left).toBe(node15F);
    expect(node21F?.right).toBe(tmm.NIL);
    expect(node21F?.parent).toBe(node10F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe('BLACK');
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(tmm.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe('RED');
    expect(node2F?.left).toBe(tmm.NIL);
    expect(node2F?.right).toBe(tmm.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe('RED');
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(node21F);
  });

  it('should fix the tmm after insertion', () => {
    tmm.add(1);
    tmm.add(2);
    tmm.add(5);
    tmm.add(15);
    const node15F = tmm.getNode(15);
    expect(node15F?.left).toBe(tmm.NIL);
    expect(node15F?.right).toBe(tmm.NIL);
    expect(node15F?.parent).toBe(tmm.getNode(5));

    tmm.add(25);
    tmm.add(10);
    tmm.add(8);
    tmm.add(28);
    tmm.add(111);
    tmm.add(12);
    tmm.delete(2);
    tmm.add(22);
    tmm.add(50);
    tmm.add(155);
    tmm.add(225);
    const node225F = tmm.getNode(225);
    expect(node225F?.left).toBe(tmm.NIL);
    expect(node225F?.right).toBe(tmm.NIL);
    expect(node225F?.parent?.key).toBe(155);
    tmm.add(7);
    if (isDebug) tmm.print();

    const node15S = tmm.getNode(15);
    expect(node15S?.left?.key).toBe(10);
    expect(node15S?.right?.key).toBe(25);
    expect(tmm.root).toBe(tmm.getNode(8));
    expect(node15S?.parent?.key).toBe(28);
    tmm.delete(15);
    expect(tmm.root?.key).toBe(8);
    expect(tmm.root?.parent).toBe(undefined);

    const node15T = tmm.getNode(15);
    expect(node15T).toBe(undefined);

    tmm.add(23);
    tmm.add(33);
    tmm.add(15);

    const nodeLM = tmm.getLeftMost();
    expect(nodeLM).toBe(1);

    const node50 = tmm.getNode(50);
    expect(node50?.key).toBe(50);
    expect(node50?.left?.key).toBe(33);
    expect(node50?.right).toBe(tmm.NIL);
    const node15Fo = tmm.getNode(15);

    expect(node15Fo?.key).toBe(15);
    expect(node15Fo?.left).toBe(tmm.NIL);
    const node225S = tmm.getNode(225);
    expect(node225S?.left).toBe(tmm.NIL);
    expect(node225S?.right).toBe(tmm.NIL);
    expect(node225S?.parent?.key).toBe(155);
    // TODO
    // expect(tmm.getNode(0)).toBe(undefined);
    tmm.add(2);
    tmm.add(3);
    tmm.add(4);
    tmm.add(6);
    tmm.add(9);
    tmm.add(11);
    tmm.add(13);
    tmm.add(14);
    tmm.add(16);
    tmm.add(17);
    tmm.add(18);
    tmm.add(19);
    tmm.add(110);

    if (isDebug) tmm.print();

    expect(tmm.dfs()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 28, 33, 50, 110, 111, 155, 225
    ]);

    expect(tmm.isBST()).toBe(true);
  });

  it('should fix the tmm after insertion and deletion', () => {
    for (let i = 0; i < 100; i++) {
      tmm.add(i);
    }
    for (let i = 0; i < 49; i++) {
      tmm.delete(i);
    }

    expect(tmm.size).toBe(51);
    expect(tmm.isBST()).toBe(true);
    expect(tmm.isBST(tmm.root, 'RECURSIVE')).toBe(true);

    expect(tmm.dfs(n => n.key, 'IN', tmm.root, 'ITERATIVE')).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
    expect(tmm.dfs(n => n.key, 'IN', tmm.root, 'RECURSIVE')).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
  });

  it('should fix the tmm after large scale insertion and deletion', () => {
    for (let i = 0; i < 10000; i++) {
      tmm.add(i);
    }
    for (let i = 0; i < 10000; i++) {
      tmm.delete(i);
    }

    expect(tmm.size).toBe(0);
    expect(tmm.isBST()).toBe(true);
    expect(tmm.dfs(n => n.key, 'IN', tmm.root, 'ITERATIVE')).toEqual([]);

    tmm.clear();
    for (let i = 0; i < 1000; i++) {
      tmm.add(getRandomInt(-100, 1000));
      tmm.delete(getRandomInt(-100, 1000));
    }

    // TODO there is a bug when dfs the tmm with NIL node
    // expect(tmm.isBST()).toBe(true);
  });

  it('duplicates', () => {
    tmm.addMany([9, 8, 7, 8, 8, 8, 2, 3, 6, 5, 5, 4]);
    if (isDebug) tmm.print();

    expect(tmm.size).toBe(8);
    expect(tmm.isBST()).toBe(true);
    expect(tmm.isAVLBalanced()).toBe(true);
    tmm.addMany([10, 5, 2, 11]);
    expect(tmm.size).toBe(10);
    expect(tmm.isBST()).toBe(true);
    expect(tmm.isAVLBalanced()).toBe(true);

    tmm.clear();
    tmm.addMany([10, 20, 30, 40, 50, 60]);
    expect(tmm.isAVLBalanced()).toBe(false);
  });

  describe('TreeMultiMap delete test', function () {
    const tmm = new TreeMultiMap<number, number>();
    const inputSize = 100; // Adjust input sizes as needed

    beforeEach(() => {
      tmm.clear();
    });
    it('The structure remains normal after random deletion', function () {
      for (let i = 0; i < inputSize; i++) {
        tmm.add(i);
      }

      for (let i = 0; i < inputSize; i++) {
        const num = getRandomInt(0, inputSize - 1);
        tmm.delete(num);
      }

      let nanCount = 0;
      const dfs = (cur: TreeMultiMapNode<number>) => {
        if (isNaN(cur.key)) nanCount++;
        if (cur.left) dfs(cur.left);
        if (cur.right) dfs(cur.right);
      };
      if (tmm.root) dfs(tmm.root);

      expect(tmm.size).toBeLessThanOrEqual(inputSize);
      expect(tmm.getHeight()).toBeLessThan(Math.log2(inputSize) * 2);

      expect(nanCount).toBeLessThanOrEqual(inputSize);
    });

    it(`Random additions, complete deletions of structures are normal`, function () {
      for (let i = 0; i < inputSize; i++) {
        const num = getRandomInt(0, inputSize - 1);
        if (i === 0 && isDebug) console.log(`first:`, num);
        tmm.add(num);
      }

      for (let i = 0; i < inputSize; i++) {
        tmm.delete(i);
      }

      let nanCount = 0;
      const dfs = (cur: TreeMultiMapNode<number>) => {
        if (isNaN(cur.key)) nanCount++;
        if (cur.left) dfs(cur.left);
        if (cur.right) dfs(cur.right);
      };
      if (tmm.root) dfs(tmm.root);

      expect(tmm.size).toBe(0);
      expect(tmm.getHeight()).toBe(-1);
      expect(nanCount).toBeLessThanOrEqual(inputSize);

      if (isDebug) tmm.print();
    });
  });

  describe('TreeMultiMap iterative methods test', () => {
    let tmm: TreeMultiMap<number, string, object, string, string, object>;
    beforeEach(() => {
      tmm = new TreeMultiMap();
      tmm.add([1, ['a']]);
      tmm.add(2, 'b');
      tmm.add([3, ['c']]);
    });

    it('The node obtained by get Node should match the node type', () => {
      const node3 = tmm.getNode(3);
      expect(node3).toBeInstanceOf(BinaryTreeNode);
      expect(node3).toBeInstanceOf(BSTNode);
      expect(node3).toBeInstanceOf(TreeMultiMapNode);
    });

    it('forEach should iterate over all elements', () => {
      const mockCallback = jest.fn();
      tmm.forEach((key, value) => {
        mockCallback(key, value);
      });

      expect(mockCallback.mock.calls.length).toBe(3);
      expect(mockCallback.mock.calls[0]).toEqual([1, ['a']]);
      expect(mockCallback.mock.calls[1]).toEqual([2, ['b']]);
      expect(mockCallback.mock.calls[2]).toEqual([3, ['c']]);
    });

    it('filter should return a new tmm with filtered elements', () => {
      const filteredTree = tmm.filter(key => key > 1);
      expect(filteredTree.size).toBe(2);
      expect([...filteredTree]).toEqual([
        [2, ['b']],
        [3, ['c']]
      ]);
    });

    it('map should return a new tmm with modified elements', () => {
      const tmmMapped = tmm.map((key, value) => [(key * 2).toString(), value ? value :[]]);
      expect(tmmMapped.size).toBe(3);
      expect([...tmmMapped]).toEqual([
        ['2', ['a']],
        ['4', ['b']],
        ['6', ['c']]
      ]);
    });

    it('reduce should accumulate values', () => {
      const sum = tmm.reduce((acc, value, key) => acc + key, 0);
      expect(sum).toBe(6);
    });

    it('[Symbol.iterator] should provide an iterator', () => {
      const entries = [];
      for (const entry of tmm) {
        entries.push(entry);
      }

      expect(entries.length).toBe(3);
      expect(entries).toEqual([
        [1, ['a']],
        [2, ['b']],
        [3, ['c']]
      ]);
    });
  });
});

describe('TreeMultiMap - _deleteFixup', () => {
  let tmm: TreeMultiMap<number, number>;

  beforeEach(() => {
    tmm = new TreeMultiMap();
  });

  it('should handle deleting a red leaf node', () => {
    tmm.add(10, 10);
    tmm.add(5, 5); // Red leaf
    tmm.add(20, 20);

    expect(tmm.delete(5)).toHaveLength(1); // Delete red leaf
    expect(tmm.root?.left).toBe(tmm.NIL); // Left child should be NIL
  });

  it('should handle deleting a black leaf node', () => {
    tmm.add(10, 10);
    tmm.add(5, 5); // Black node
    tmm.add(20, 20);
    tmm.add(1, 1); // Black leaf node

    expect(tmm.delete(1)).toHaveLength(1); // Delete black leaf
    expect(tmm.root?.left?.left).toBe(tmm.NIL);
  });

  it('should handle deleting black node with red sibling', () => {
    tmm.add(10, 10);
    tmm.add(5, 5); // Black node
    tmm.add(20, 20); // Red sibling
    tmm.add(25, 25); // Force the sibling to be red

    expect(tmm.delete(5)).toHaveLength(1); // Delete black node
    expect(tmm.root?.right?.color).toBe('BLACK'); // Ensure sibling color is black after fixup
  });

  it('should handle deleting black node with black sibling', () => {
    tmm.add(10, 10);
    tmm.add(5, 5); // Black node
    tmm.add(20, 20); // Black sibling

    expect(tmm.delete(5)).toHaveLength(1); // Delete black node
    expect(tmm.root?.left).toBe(tmm.NIL);
  });

  it('should handle deleting the root node', () => {
    tmm.add(10, 10); // Root node
    tmm.add(5, 5);
    tmm.add(20, 20);

    expect(tmm.delete(10)).toHaveLength(1); // Delete root node
    expect(tmm.root?.key).toBe(20); // New root should be 20
  });

  it('should handle complex case with multiple rotations', () => {
    tmm.add(10, 10);
    tmm.add(5, 5);
    tmm.add(15, 15);
    tmm.add(12, 12);
    tmm.add(18, 18);
    tmm.add(16, 16);

    // Delete a node that will cause rotations and color changes
    expect(tmm.delete(5)).toHaveLength(1);

    // Verify the color and structure after fixup
    expect(tmm.root?.color).toBe('BLACK');
    expect(tmm.root?.left).toBe(tmm.NIL);
    expect(tmm.root?.right?.left?.color).toBe('BLACK');
  });

  it('should handle complex delete fixup scenarios', () => {
    const tmm = new TreeMultiMap<number, number>();

    // Build a tmm that will require complex fixup
    tmm.add(20, 20);
    tmm.add(10, 10);
    tmm.add(30, 30);
    tmm.add(5, 5);
    tmm.add(15, 15);
    tmm.add(25, 25);
    tmm.add(35, 35);
    tmm.add(2, 2);
    tmm.add(8, 8);

    // This deletion should trigger a complex fixup
    tmm.delete(2);
    // tmm.print(tmm.root, { isShowNull: true, isShowRedBlackNIL: true, isShowUndefined: false });

    expect(tmm.isLeaf(2)).toBe(false);
    expect(tmm.isLeaf(8)).toBe(true);
    expect(tmm.isLeaf(15)).toBe(true);
    expect(tmm.isLeaf(25)).toBe(true);
    expect(tmm.isLeaf(35)).toBe(true);
    expect(tmm.isLeaf(20)).toBe(false);
    expect(tmm.isLeaf(30)).toBe(false);
    // Verify tmm structure and colors after fixup
    expect(tmm.root?.color).toBe('BLACK');
    expect(tmm.root?.key).toBe(20);
    expect(tmm.root?.left?.color).toBe('RED');
    expect(tmm.root?.left?.key).toBe(10);
    expect(tmm.root?.right?.color).toBe('BLACK');
    expect(tmm.root?.right?.key).toBe(30);
    expect(tmm.root?.left?.left?.color).toBe('BLACK');
    expect(tmm.root?.left?.left?.key).toBe(5);
    expect(tmm.root?.left?.right?.color).toBe('BLACK');
    expect(tmm.root?.left?.right?.key).toBe(15);
    expect(tmm.leaves(node => (node === null ? '' : `${node.key} ${node.color}`), tmm.root, 'RECURSIVE')).toEqual([
      '8 RED',
      '15 BLACK',
      '25 RED',
      '35 RED'
    ]);
    expect(tmm.listLevels(node => (node === tmm.NIL ? 'NIL' : `${node.key} ${node.color}`))).toEqual([
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
    const indexedByRank = new TreeMultiMap(costOfLiving, {
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
  // Test case for finding elements in a given range
  it('@example Find elements in a range', () => {
    const tmm = new TreeMultiMap<number>([10, 5, 15, 3, 7, 12, 18]);
    expect(tmm.search(new Range(5, 10))).toEqual([5, 10, 7]);
    expect(tmm.search(new Range(4, 12))).toEqual([5, 10, 12, 7]);
    expect(tmm.search(new Range(15, 20))).toEqual([15, 18]);
  });
});
