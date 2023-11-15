import {IterationType, RBTNColor, RedBlackTree, RedBlackTreeNode} from '../../../../src';
import {getRandomInt, getRandomIntArray, magnitude} from '../../../utils';
import {isDebugTest} from '../../../config';
import {OrderedMap} from 'js-sdsl';

const isDebug = isDebugTest;

describe('RedBlackTree', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  describe('add and getNode', () => {
    it('should add and find a node in the tree', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);

      expect(tree.getNode(10)).toBeInstanceOf(RedBlackTreeNode);
      expect(tree.getNode(20)).toBeInstanceOf(RedBlackTreeNode);
      expect(tree.getNode(5)).toBeInstanceOf(RedBlackTreeNode);
      expect(tree.getNode(15)).toBe(undefined);
    });

    it('should add and find nodes with negative keys', () => {
      tree.add(-10);
      tree.add(-20);

      expect(tree.getNode(-10)).toBeInstanceOf(RedBlackTreeNode);
      expect(tree.getNode(-20)).toBeInstanceOf(RedBlackTreeNode);
    });
  });

  describe('deleteNode', () => {
    it('should delete a node from the tree', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.delete(20);

      expect(tree.getNode(20)).toBe(undefined);
    });

    it('should handle deleting a non-existent node', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.delete(15);

      expect(tree.getNode(15)).toBe(undefined);
    });
  });

  describe('minimum', () => {
    it('should find the minimum node in the tree', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.add(15);
      tree.add(3);

      const minNode = tree.getLeftMost(tree.root);
      expect(minNode?.key).toBe(3);
    });

    it('should handle an empty tree', () => {
      const minNode = tree.getLeftMost(tree.root);
      expect(minNode).toBe(tree.NIL);
    });
  });

  describe('getRightMost', () => {
    it('should find the getRightMost node in the tree', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.add(15);
      tree.add(25);

      const maxNode = tree.getRightMost(tree.root);
      expect(maxNode?.key).toBe(25);
    });

    it('should handle an empty tree', () => {
      const maxNode = tree.getRightMost(tree.root);
      expect(maxNode).toBe(tree.NIL);
    });
  });

  describe('getSuccessor', () => {
    it('should find the getSuccessor of a node', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.add(15);
      tree.add(25);

      const node = tree.getNode(15);
      const successorNode = tree.getSuccessor(node!);

      expect(successorNode?.key).toBe(20);
    });

    it('should handle a node with no getSuccessor', () => {
      tree.add(10);
      tree.add(5);

      const node = tree.getNode(10);
      const successorNode = tree.getSuccessor(node!);
      // TODO not sure if it should be undefined or tree.NIL
      expect(successorNode).toBe(undefined);
    });
  });

  describe('getPredecessor', () => {
    it('should find the getPredecessor of a node', () => {
      tree.add(10);
      tree.add(20);
      tree.add(5);
      tree.add(15);
      tree.add(25);

      const node = tree.getNode(20);
      const predecessorNode = tree.getPredecessor(node!);

      expect(predecessorNode?.key).toBe(15);
    });

    it('should handle a node with no getPredecessor', () => {
      tree.add(10);
      tree.add(20);

      const node = tree.getNode(20);
      const predecessorNode = tree.getPredecessor(node!);
      // TODO not sure if it should be tree.NIL or something else.
      expect(predecessorNode).toBe(tree.getNode(10));
    });
  });
});

describe('RedBlackTree', () => {
  let tree: RedBlackTree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  it('should add nodes into the tree', () => {
    tree.add(10);
    expect(tree.getNode(10)).toBeDefined();
    tree.add(20);
    expect(tree.getNode(20)).toBeDefined();
    tree.add(5);
    expect(tree.getNode(5)).toBeDefined();
  });

  it('should delete nodes from the tree', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.delete(20);
    expect(tree.getNode(20)).toBe(undefined);
  });

  it('should get the successor of a node', () => {
    tree.add(10);
    tree.add(20);
    const node = tree.getNode(10);
    const successor = tree.getSuccessor(node!);
    expect(successor?.key).toBe(20);
  });

  it('should get the predecessor of a node', () => {
    tree.add(10);
    tree.add(20);
    const node = tree.getNode(20);
    const predecessor = tree.getPredecessor(node!);
    expect(predecessor?.key).toBe(10);
  });

  it('should rotate nodes to the left', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    const node = tree.getNode(10);
    tree.add(15);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBe(5);
    expect(node?.right?.key).toBe(20);
  });

  it('should rotate nodes to the right', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    const node = tree.getNode(20);
    tree.add(25);
    // Verify that rotation has occurred
    expect(node?.left?.key).toBeNaN();
    expect(node?.right?.key).toBe(25);
  });

  it('should all node attributes fully conform to the red-black tree standards.', () => {
    tree.add(10);
    tree.add(20);
    tree.add(5);
    tree.add(15);
    tree.add(21);
    tree.add(6);
    tree.add(2);

    let node10F = tree.getNode(10);
    let node20F = tree.getNode(20);
    let node5F = tree.getNode(5);
    let node15F = tree.getNode(15);
    let node21F = tree.getNode(21);
    let node6F = tree.getNode(6);
    let node2F = tree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe(RBTNColor.BLACK);
    expect(node10F?.left).toBe(node5F);
    expect(node10F?.right).toBe(node20F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F?.key).toBe(20);
    expect(node20F?.color).toBe(RBTNColor.BLACK);
    expect(node20F?.left).toBe(node15F);
    expect(node20F?.right).toBe(node21F);
    expect(node20F?.parent).toBe(node10F);
    expect(node5F?.key).toBe(5);
    expect(node5F?.color).toBe(RBTNColor.BLACK);
    expect(node5F?.left).toBe(node2F);
    expect(node5F?.right).toBe(node6F);
    expect(node5F?.parent).toBe(node10F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe(RBTNColor.RED);
    expect(node21F?.left).toBe(tree.NIL);
    expect(node21F?.right).toBe(tree.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe(RBTNColor.RED);
    expect(node6F?.left).toBe(tree.NIL);
    expect(node6F?.right).toBe(tree.NIL);
    expect(node6F?.parent).toBe(node5F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe(RBTNColor.RED);
    expect(node2F?.left).toBe(tree.NIL);
    expect(node2F?.right).toBe(tree.NIL);
    expect(node2F?.parent).toBe(node5F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node20F);
    tree.delete(5);
    node10F = tree.getNode(10);
    node20F = tree.getNode(20);
    node5F = tree.getNode(5);
    node15F = tree.getNode(15);
    node21F = tree.getNode(21);
    node6F = tree.getNode(6);
    node2F = tree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe(RBTNColor.BLACK);
    expect(node10F?.left).toBe(node6F);
    expect(node10F?.right).toBe(node20F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F?.key).toBe(20);
    expect(node20F?.color).toBe(RBTNColor.BLACK);
    expect(node20F?.left).toBe(node15F);
    expect(node20F?.right).toBe(node21F);
    expect(node20F?.parent).toBe(node10F);
    expect(node5F).toBe(undefined);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node20F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe(RBTNColor.RED);
    expect(node21F?.left).toBe(tree.NIL);
    expect(node21F?.right).toBe(tree.NIL);
    expect(node21F?.parent).toBe(node20F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe(RBTNColor.BLACK);
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(tree.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe(RBTNColor.RED);
    expect(node2F?.left).toBe(tree.NIL);
    expect(node2F?.right).toBe(tree.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node20F);
    tree.delete(20);
    node10F = tree.getNode(10);
    node20F = tree.getNode(20);
    node5F = tree.getNode(5);
    node15F = tree.getNode(15);
    node21F = tree.getNode(21);
    node6F = tree.getNode(6);
    node2F = tree.getNode(2);
    expect(node10F?.key).toBe(10);
    expect(node10F?.color).toBe(RBTNColor.BLACK);
    expect(node10F?.left).toBe(node6F);
    expect(node10F?.right).toBe(node21F);
    expect(node10F?.parent).toBe(undefined);
    expect(node20F).toBe(undefined);
    expect(node5F).toBe(undefined);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node21F);
    expect(node21F?.key).toBe(21);
    expect(node21F?.color).toBe(RBTNColor.BLACK);
    expect(node21F?.left).toBe(node15F);
    expect(node21F?.right).toBe(tree.NIL);
    expect(node21F?.parent).toBe(node10F);
    expect(node6F?.key).toBe(6);
    expect(node6F?.color).toBe(RBTNColor.BLACK);
    expect(node6F?.left).toBe(node2F);
    expect(node6F?.right).toBe(tree.NIL);
    expect(node6F?.parent).toBe(node10F);
    expect(node2F?.key).toBe(2);
    expect(node2F?.color).toBe(RBTNColor.RED);
    expect(node2F?.left).toBe(tree.NIL);
    expect(node2F?.right).toBe(tree.NIL);
    expect(node2F?.parent).toBe(node6F);
    expect(node15F?.key).toBe(15);
    expect(node15F?.color).toBe(RBTNColor.RED);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(node21F);
  });

  it('should fix the tree after insertion', () => {
    tree.add(1);
    tree.add(2);
    tree.add(5);
    tree.add(15);
    const node15F = tree.getNode(15);
    expect(node15F?.left).toBe(tree.NIL);
    expect(node15F?.right).toBe(tree.NIL);
    expect(node15F?.parent).toBe(tree.getNode(5));

    tree.add(25);
    tree.add(10);
    tree.add(8);
    tree.add(28);
    tree.add(111);
    tree.add(12);
    tree.delete(2);
    tree.add(22);
    tree.add(50);
    tree.add(155);
    tree.add(225);
    const node225F = tree.getNode(225);
    expect(node225F?.left).toBe(tree.NIL);
    expect(node225F?.right).toBe(tree.NIL);
    expect(node225F?.parent?.key).toBe(155);
    tree.add(7);

    const node15S = tree.getNode(15);
    expect(node15S?.left?.key).toBe(8);
    expect(node15S?.right?.key).toBe(28);
    expect(node15S).toBe(tree.root);
    expect(node15S?.parent).toBe(undefined);
    tree.delete(15);
    expect(tree.root.key).toBe(22);
    expect(tree.root.parent).toBe(undefined);

    const node15T = tree.getNode(15);
    expect(node15T).toBe(undefined);

    tree.add(23);
    tree.add(33);
    tree.add(15);

    const nodeLM = tree.getLeftMost();
    expect(nodeLM?.key).toBe(1);

    const node50 = tree.getNode(50);
    expect(node50?.key).toBe(50);
    expect(node50?.left?.key).toBe(33);
    expect(node50?.right).toBe(tree.NIL);
    const node15Fo = tree.getNode(15);

    expect(node15Fo?.key).toBe(15);
    expect(node15Fo?.left).toBe(tree.NIL);
    const node225S = tree.getNode(225);
    expect(node225S?.left).toBe(tree.NIL);
    expect(node225S?.right).toBe(tree.NIL);
    expect(node225S?.parent?.key).toBe(155);
    // TODO
    // expect(tree.getNode(0)).toBe(undefined);
    tree.add(2);
    tree.add(3);
    tree.add(4);
    tree.add(6);
    tree.add(9);
    tree.add(11);
    tree.add(13);
    tree.add(14);
    tree.add(16);
    tree.add(17);
    tree.add(18);
    tree.add(19);
    tree.add(110);

    isDebug && tree.print();

    expect(tree.dfs()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 28, 33, 50, 110, 111, 155, 225
    ]);

    expect(tree.isBST()).toBe(true);
  });

  it('should fix the tree after insertion and deletion', () => {
    for (let i = 0; i < 100; i++) {
      tree.add(i);
    }
    for (let i = 0; i < 49; i++) {
      tree.delete(i);
    }

    expect(tree.size).toBe(51);
    expect(tree.isBST()).toBe(true);
    expect(tree.dfs(n => n.key, 'in', tree.root, IterationType.ITERATIVE)).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
      82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
    expect(tree.dfs(n => n.key, 'in', tree.root, IterationType.RECURSIVE)).toEqual([
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
      82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);
  });

  it('should fix the tree after large scale insertion and deletion', () => {
    for (let i = 0; i < 10000; i++) {
      tree.add(i);
    }
    for (let i = 0; i < 10000; i++) {
      tree.delete(i);
    }

    expect(tree.size).toBe(0);
    expect(tree.isBST()).toBe(true);
    expect(tree.dfs(n => n.key, 'in', tree.root, IterationType.ITERATIVE)).toEqual([]);

    tree.clear();
    for (let i = 0; i < 1000; i++) {
      tree.add(getRandomInt(-100, 1000));
      tree.delete(getRandomInt(-100, 1000));
    }

    // TODO there is a bug when dfs the tree with NIL node
    // expect(tree.isBST()).toBe(true);
  });
  const {HUNDRED_THOUSAND} = magnitude;
  const arr = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND, true);
  const competitor = new OrderedMap<number, number>();

  it('should fix the tree after large scale insertion and deletion', () => {
    tree.clear();
    const tS = performance.now();
    for (let i = 0; i < arr.length; i++) {
      tree.add(arr[i]);
    }
    isDebug && console.log(performance.now() - tS);

    const cS = performance.now();

    for (let i = 0; i < arr.length; i++) {
      competitor.setElement(arr[i], arr[i]);
    }
    isDebug && console.log(performance.now() - cS);
  });
});
