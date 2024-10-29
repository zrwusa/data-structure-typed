import { BinaryTree, BinaryTreeNode, BTNEntry } from '../../../../src';
import { getRandomIntArray } from '../../../utils';
// import { isDebugTest } from '../../../config';

// const isDebug = isDebugTest;

describe('BinaryTreeNode', () => {
  it('should create an instance of BinaryTreeNode', () => {
    const node = new BinaryTreeNode<number>(1);
    expect(node).toBeInstanceOf(BinaryTreeNode);
  });

  it('should set and get the ID correctly', () => {
    const node = new BinaryTreeNode<number>(1);
    expect(node.key).toBe(1);

    node.key = 2;
    expect(node.key).toBe(2);
  });

  it('should set and get the value correctly', () => {
    const node: BinaryTreeNode<number> = new BinaryTreeNode<number>(1, 42);
    expect(node.value).toBe(42);

    node.value = 55;
    expect(node.value).toBe(55);
  });

  it('should set and get the left child correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.left = node2;

    expect(node1.left).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the right child correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.right = node2;

    expect(node1.right).toBe(node2);
    expect(node2.parent).toBe(node1);
  });

  it('should set and get the parent correctly', () => {
    const node1 = new BinaryTreeNode<number>(1);
    const node2 = new BinaryTreeNode<number>(2);

    node1.left = node2;

    expect(node2.parent).toBe(node1);
    expect(node1.left).toBe(node2);
  });

  it('should determine family position correctly', () => {
    const root = new BinaryTreeNode<number>(1);
    const leftChild = new BinaryTreeNode<number>(2);
    const rightChild = new BinaryTreeNode<number>(3);

    root.left = leftChild;
    root.right = rightChild;

    expect(leftChild.familyPosition).toBe('LEFT');
    leftChild.right = new BinaryTreeNode<number>(4);
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root.familyPosition).toBe('ROOT');
    expect(leftChild.familyPosition).toBe('ROOT_LEFT');
    rightChild.left = new BinaryTreeNode<number>(5);
    expect(rightChild.familyPosition).toBe('ROOT_RIGHT');
  });

  it('should determine only right child family position correctly', () => {
    const root = new BinaryTreeNode<number>(1);
    const rightChild = new BinaryTreeNode<number>(3);
    const isolated = new BinaryTreeNode<number>(2);

    root.right = rightChild;

    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(isolated.familyPosition).toBe('ISOLATED');
    expect(root.familyPosition).toBe('ROOT');
  });
});

describe('BinaryTree addMany', () => {
  it('should addMany', () => {
    const tree = new BinaryTree<number, number, { id: number; name: number }>([], {
      toEntryFn: ({ id, name }) => [id, name]
    });
    tree.addMany(
      [
        { id: 1, name: 1 },
        { id: 2, name: 2 },
        { id: 4, name: 4 },
        { id: 3, name: 3 }
      ],
      [undefined, 22, 44, 33]
    );
    expect(tree.getNodeByKey(2)?.value).toBe(22);
    expect(tree.getNodeByKey(3)?.value).toBe(33);
    expect(tree.getNodeByKey(4)?.value).toBe(44);
    expect(tree.getNodeByKey(1)?.value).toBe(1);
  });
});

describe('BinaryTree', () => {
  let tree: BinaryTree<number>;

  beforeEach(() => {
    tree = new BinaryTree<number>();
  });

  afterEach(() => {
    tree.clear();
  });

  it('should add a node', () => {
    const node = tree.add(1);
    expect(node).not.toBeNull();
    expect(tree.size).toBe(1);
  });

  it('should delete nodes', () => {
    expect(tree.getHeight(tree.root, 'ITERATIVE')).toBe(-1);
    expect(tree.getMinHeight()).toBe(-1);
    const node1 = tree.createNode(1);
    tree.add(node1);
    expect(tree.size).toBe(1);

    const leftChild = new BinaryTreeNode<number>(2);
    const rightChild = new BinaryTreeNode<number>(3);
    tree.add(leftChild);
    tree.add(rightChild);
    const root = tree.root;

    expect(leftChild.familyPosition).toBe('LEFT');
    tree.add(null);
    tree.add(new BinaryTreeNode<number>(4));
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root?.familyPosition).toBe('ROOT');
    expect(leftChild.familyPosition).toBe('ROOT_LEFT');
    tree.add(new BinaryTreeNode<number>(5));
    expect(rightChild.familyPosition).toBe('ROOT_RIGHT');

    tree.delete(new BinaryTreeNode<number>(200));
    tree.delete(rightChild);

    if (node1) {
      const result = tree.delete(node1);
      expect(result).toHaveLength(1);
      expect(tree.size).toBe(4);
      expect(tree.getMinHeight(tree.root, 'RECURSIVE')).toBe(1);
    }
  });

  it('should add and find nodes', () => {
    tree.add([1, 1]);
    tree.add(undefined);
    tree.add([2, 2]);
    tree.add([3, 3]);

    expect(tree.has(1)).toBe(true);
    expect(tree.has(2)).toBe(true);
    expect(tree.has(3)).toBe(true);
    expect(tree.has(4)).toBe(false);
    const node4 = tree.getNode(4);
    expect(tree.has(node4)).toBe(false);
    expect(tree.has(node4, node => node)).toBe(false);
    expect(tree.has('3', node => node.value?.toString())).toBe(true);
  });

  it('should the clone method work fine', () => {
    expect(tree.isEmpty()).toBe(true);
    tree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(tree.root?.key).toBe(4);
    expect(tree.root?.left?.key).toBe(2);
    expect(tree.root?.left?.left).toBe(null);
    expect(tree.root?.left?.right?.key).toBe(1);
    expect(tree.root?.right?.key).toBe(6);
    expect(tree.root?.right?.left?.key).toBe(3);
    expect(tree.root?.right?.right).toBe(null);

    const cloned = tree.clone();
    expect(cloned.root?.key).toBe(4);
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.root?.left?.left).toBe(null);
    expect(cloned.root?.left?.right?.key).toBe(1);
    expect(cloned.root?.right?.key).toBe(6);
    expect(cloned.root?.right?.left?.key).toBe(3);
    expect(cloned.root?.right?.right).toBe(null);
    expect(cloned.dfs(node => node.key, 'PRE', cloned.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : node), 'PRE', cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', cloned.getNode(6), 'RECURSIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    cloned.delete(6);
    cloned.delete(3);
    cloned.delete(7);
    cloned.delete(1);
    cloned.delete(5);
    cloned.delete(4);
    cloned.delete(2);
    // cloned.delete(null);
    // cloned.delete(null);
    // cloned.delete(null);
    expect(tree.size).toBe(10);
    expect(cloned.size).toBe(3);
    // expect(cloned.size).toBe(0);
    // expect(cloned.isEmpty()).toBe(true);
  });

  it('should be a balance tree after malicious manipulation', () => {
    tree.add(3);
    tree.add(12);
    tree.addMany(getRandomIntArray(100, 1, 100));
    tree.add(10);

    expect(tree.isPerfectlyBalanced()).toBe(true);
    const node3 = tree.getNode(3);

    if (node3) node3.right = tree.createNode(1);
    expect(tree.isPerfectlyBalanced()).toBe(false);

    tree.clear();
    tree.addMany([1, null, 2, null, 3, null, 4, null, 5, null, 6, null]);
    expect(tree.isPerfectlyBalanced()).toBe(false);
  });

  it('should getDepth return correct depth', () => {
    tree.add(1);
    expect(tree.getDepth(1)).toBe(0);
    tree.add(2);
    expect(tree.getDepth(2)).toBe(1);
    tree.add(3);
    expect(tree.getDepth(3, 1)).toBe(1);
    tree.add(4);
    expect(tree.getDepth(4, 1)).toBe(2);
    expect(tree.getDepth(4)).toBe(2);
    expect(tree.getDepth(4, 2)).toBe(1);
  });

  it('should traverse in-order', () => {
    tree.add(null);
    tree.delete(1);
    expect(tree.getHeight()).toBe(-1);
    tree.add(4);
    tree.add(2);
    expect(tree.getHeight()).toBe(1);
    tree.iterationType = 'RECURSIVE';
    expect(tree.getHeight()).toBe(1);
    tree.iterationType = 'ITERATIVE';

    tree.add(6);
    tree.add(1);
    tree.add(new BinaryTreeNode(3));
    tree.add(5);
    tree.add(7);

    const inOrder = tree.dfs(node => node.key);

    expect(inOrder).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should isSubtreeBST', () => {
    tree.addMany([
      new BinaryTreeNode(4, 4),
      new BinaryTreeNode(2, 2),
      new BinaryTreeNode(6, 6),
      new BinaryTreeNode(1, 1),
      new BinaryTreeNode(3, 3),
      new BinaryTreeNode(5, 5),
      new BinaryTreeNode(7, 7),
      new BinaryTreeNode(4, 4)
    ]);

    expect(tree.isBST(tree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(tree.isBST(tree.getNode(4), 'ITERATIVE')).toBe(true);
  });

  it('should isSubtreeBST', () => {
    tree.addMany([4, 2, 6, 1, 3, 5, 7, 4]);
    expect(tree.print()).toBe(
      '    ___4___    \n' +
        '   /       \\   \n' +
        '  _2_     _6_  \n' +
        ' /   \\   /   \\ \n' +
        ' 1   3   5   7 \n' +
        '               \n'
    );

    expect(tree.isBST(tree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(tree.isBST(tree.getNode(4), 'ITERATIVE')).toBe(true);
    expect(tree.getNodes(2, undefined, false, null)).toEqual([]);
    expect(tree.getNodes(undefined)).toEqual([]);
    expect(tree.getNodes(tree.getNodeByKey(2), undefined, false, tree.root)).toEqual([tree.getNodeByKey(2)]);
  });

  describe('should isKey', () => {
    describe('primitive types', () => {
      it('numbers should be a key', () => {
        expect(tree.isKey(42)).toBe(true);
        expect(tree.isKey(0)).toBe(true);
        expect(tree.isKey(-1)).toBe(true);
        expect(tree.isKey(Infinity)).toBe(true);
        expect(tree.isKey(-Infinity)).toBe(true);
      });

      it('NaN should not be a key', () => {
        expect(tree.isKey(NaN)).toBe(false);
      });

      it('strings should be a key', () => {
        expect(tree.isKey('hello')).toBe(true);
        expect(tree.isKey('')).toBe(true);
        expect(tree.isKey('123')).toBe(true);
      });

      it('BigInt should be a key', () => {
        expect(tree.isKey(BigInt(42))).toBe(true);
        expect(tree.isKey(BigInt(0))).toBe(true);
        expect(tree.isKey(BigInt(-1))).toBe(true);
      });

      it('boolean should not be a key', () => {
        expect(tree.isKey(true)).toBe(true);
        expect(tree.isKey(false)).toBe(true);
      });

      it('null and undefined should not be a key', () => {
        expect(tree.isKey(null)).toBe(true);
        expect(tree.isKey(undefined)).toBe(false);
      });

      it('symbols should not be a key', () => {
        expect(tree.isKey(Symbol('test'))).toBe(false);
        expect(tree.isKey(Symbol.for('test'))).toBe(false);
      });
    });

    describe('Date objects', () => {
      it('valid Date objects should be a key', () => {
        expect(tree.isKey(new Date())).toBe(true);
        expect(tree.isKey(new Date('2024-01-01'))).toBe(true);
      });

      it('invalid Date objects should not be a key', () => {
        expect(tree.isKey(new Date('invalid'))).toBe(false);
      });
    });

    describe('arrays', () => {
      it('arrays should be a key as they convert to string', () => {
        expect(tree.isKey([])).toBe(true);
        expect(tree.isKey([1, 2, 3])).toBe(true);
        expect(tree.isKey(['a', 'b', 'c'])).toBe(true);
      });
    });

    describe('plain objects', () => {
      it('plain objects should not be a key', () => {
        expect(tree.isKey({})).toBe(false);
        expect(tree.isKey({ a: 1 })).toBe(false);
      });
    });

    describe('custom objects', () => {
      it('objects with numeric valueOf should be a key', () => {
        expect(tree.isKey({ valueOf: () => 42 })).toBe(true);
      });

      it('objects with string valueOf should be a key', () => {
        expect(tree.isKey({ valueOf: () => 'test' })).toBe(true);
      });

      it('objects with boolean valueOf should not be a key', () => {
        expect(tree.isKey({ valueOf: () => true })).toBe(true);
      });

      it('objects with nested valueOf/toString should be a key', () => {
        expect(
          tree.isKey({
            valueOf: () => ({ toString: () => '42' })
          })
        ).toBe(true);
      });
    });

    describe('deeply nested objects', () => {
      it('objects with deeply nested valueOf should be a key', () => {
        const deeplyNested = {
          valueOf: () => ({
            valueOf: () => 42
          })
        };
        expect(tree.isKey(deeplyNested)).toBe(true);
      });

      it('objects with very deeply nested conversion should be a key', () => {
        const veryDeeplyNested = {
          valueOf: () => ({
            valueOf: () => ({
              toString: () => '42'
            })
          })
        };
        expect(tree.isKey(veryDeeplyNested)).toBe(true);
      });

      it('objects with circular references should not be a key', () => {
        const circular: any = {
          valueOf: () => circular
        };
        expect(tree.isKey(circular)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('objects returning non-primitive values should be handled correctly', () => {
        const complexObject = {
          valueOf: () => ({
            toString: () => ({
              valueOf: () => 'valid'
            })
          })
        };
        expect(tree.isKey(complexObject)).toBe(false);
      });

      it('objects returning primitive values should be handled correctly', () => {
        const complexObject = {
          valueOf: () => ({
            valueOf: () => ({
              valueOf: () => ({
                valueOf: () => ({
                  toString: () => `{
                                   valueOf: () => 'valid'
                                 }`
                })
              })
            })
          })
        };
        expect(tree.isKey(complexObject)).toBe(true);
      });
    });

    describe('type checking', () => {
      it('should work with type guard in array methods', () => {
        const values: unknown[] = [42, 'test', true, null, undefined, new Date()];
        const comparableValues = values.filter(item => tree.isKey(item));
        expect(comparableValues.length).toBe(5);
      });
    });
  });

  it('should isLeaf', () => {
    tree.addMany([4, 2, 6, 1, 3, 5, 7, 4]);
    const leftMost = tree.getLeftMost();
    expect(tree.isLeaf(leftMost)).toBe(true);
    expect(tree.isLeaf(null)).toBe(true);
  });

  it('should tree traverse', () => {
    tree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(tree.dfs(node => node.key, 'PRE', undefined, 'ITERATIVE')).toEqual([4, 2, 1, 5, 6, 3, 7]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', undefined, 'ITERATIVE', false)).toEqual([
      4, 2, 1, 5, 6, 3, 7
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', undefined, 'ITERATIVE', true)).toEqual([
      4,
      2,
      null,
      1,
      5,
      null,
      6,
      3,
      7,
      null
    ]);

    expect(tree.dfs(node => node.key, 'PRE', undefined, 'RECURSIVE')).toEqual([4, 2, 1, 5, 6, 3, 7]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', undefined, 'RECURSIVE', false)).toEqual([
      4, 2, 1, 5, 6, 3, 7
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', undefined, 'RECURSIVE', true)).toEqual([
      4,
      2,
      null,
      1,
      5,
      null,
      6,
      3,
      7,
      null
    ]);

    expect(tree.dfs(node => node.key, 'IN', undefined, 'ITERATIVE')).toEqual([2, 5, 1, 4, 7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', undefined, 'ITERATIVE', false)).toEqual([
      2, 5, 1, 4, 7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', undefined, 'ITERATIVE', true)).toEqual([
      null,
      2,
      5,
      1,
      null,
      4,
      7,
      3,
      6,
      null
    ]);

    expect(tree.dfs(node => node.key, 'IN', undefined, 'RECURSIVE')).toEqual([2, 5, 1, 4, 7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', undefined, 'RECURSIVE', false)).toEqual([
      2, 5, 1, 4, 7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', undefined, 'RECURSIVE', true)).toEqual([
      null,
      2,
      5,
      1,
      null,
      4,
      7,
      3,
      6,
      null
    ]);

    expect(tree.dfs(node => node.key, 'POST', undefined, 'ITERATIVE')).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', undefined, 'ITERATIVE', false)).toEqual([
      5, 1, 2, 7, 3, 6, 4
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', undefined, 'ITERATIVE', true)).toEqual([
      null,
      5,
      null,
      1,
      2,
      7,
      3,
      null,
      6,
      4
    ]);

    expect(tree.dfs(node => node.key, 'POST', undefined, 'RECURSIVE')).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', undefined, 'RECURSIVE', false)).toEqual([
      5, 1, 2, 7, 3, 6, 4
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', undefined, 'RECURSIVE', true)).toEqual([
      null,
      5,
      null,
      1,
      2,
      7,
      3,
      null,
      6,
      4
    ]);
  });

  it('should sub tree traverse', () => {
    tree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(tree.dfs(node => node.key, 'PRE', tree.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', tree.getNode(6), 'ITERATIVE', false)).toEqual([
      6, 3, 7
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', tree.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);

    expect(tree.dfs(node => node.key, 'PRE', tree.getNode(6), 'RECURSIVE')).toEqual([6, 3, 7]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', tree.getNode(6), 'RECURSIVE', false)).toEqual([
      6, 3, 7
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'PRE', tree.getNode(6), 'RECURSIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);

    expect(tree.dfs(node => node.key, 'IN', tree.getNode(6), 'ITERATIVE')).toEqual([7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', tree.getNode(6), 'ITERATIVE', false)).toEqual([
      7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', tree.getNode(6), 'ITERATIVE', true)).toEqual([
      7,
      3,
      6,
      null
    ]);

    expect(tree.dfs(node => node.key, 'IN', tree.getNode(6), 'RECURSIVE')).toEqual([7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', tree.getNode(6), 'RECURSIVE', false)).toEqual([
      7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'IN', tree.getNode(6), 'RECURSIVE', true)).toEqual([
      7,
      3,
      6,
      null
    ]);

    expect(tree.dfs(node => node.key, 'POST', tree.getNode(6), 'ITERATIVE')).toEqual([7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', tree.getNode(6), 'ITERATIVE', false)).toEqual([
      7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', tree.getNode(6), 'ITERATIVE', true)).toEqual([
      7,
      3,
      null,
      6
    ]);

    expect(tree.dfs(node => node.key, 'POST', tree.getNode(6), 'RECURSIVE')).toEqual([7, 3, 6]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', tree.getNode(6), 'RECURSIVE', false)).toEqual([
      7, 3, 6
    ]);
    expect(tree.dfs(node => (node !== null ? node.key : null), 'POST', tree.getNode(6), 'RECURSIVE', true)).toEqual([
      7,
      3,
      null,
      6
    ]);
  });

  it('should clear the tree', () => {
    tree.add(1);
    tree.add(2);

    expect(tree.size).toBe(2);

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.root).toBeUndefined();
  });

  it('should duplicated nodes just replace the node exists', function () {
    tree.clear();
    tree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);

    expect(tree.bfs(node => (node ? node.key : null), undefined, undefined, true)).toEqual([
      -10,
      9,
      20,
      null,
      null,
      15,
      7,
      8,
      null,
      2,
      null,
      6,
      null,
      null
    ]);
  });

  it('should keyValueOrEntryOrRawElementToNode', () => {
    const tree = new BinaryTree<number>();
    const node0 = tree.keyValueOrEntryOrRawElementToNode(0);
    expect(node0).toEqual({
      _left: undefined,
      _right: undefined,
      key: 0,
      parent: undefined,
      value: undefined
    });

    const nodeUndefined = tree.keyValueOrEntryOrRawElementToNode(undefined);
    expect(nodeUndefined).toBe(undefined);

    const nodeNull = tree.keyValueOrEntryOrRawElementToNode(null);
    expect(nodeNull).toBe(null);

    const nodeWithSeparateValue = tree.keyValueOrEntryOrRawElementToNode(7, 77);
    expect(nodeWithSeparateValue?.value).toBe(77);

    expect(tree.keyValueOrEntryOrRawElementToNode([undefined, 2])).toBe(undefined);

    expect(tree.keyValueOrEntryOrRawElementToNode(Symbol('test') as unknown as number)).toBe(undefined);

    const bTree = new BinaryTree<number, number, { obj: { id: number } }>([], {
      toEntryFn: (ele: { obj: { id: number } }) => [Symbol('test') as unknown as number, ele.obj.id]
    });
    expect(bTree.keyValueOrEntryOrRawElementToNode({ obj: { id: 1 } })).toBe(undefined);
  });
});

describe('BinaryTree ensureNode', () => {
  it('should ensureNode with toEntryFn', () => {
    const tree = new BinaryTree<
      number,
      string,
      {
        id: number;
        name: string;
      }
    >([], { toEntryFn: rawElement => [rawElement.id, rawElement.name] });
    tree.add({ id: 1, name: 'Pablo' });
    const node = tree.getNode(1);
    expect(tree.ensureNode({ id: 1, name: 'Pablo' })).toBe(node);
    expect(tree.ensureNode([1, 'Pablo'])).toBe(node);
    expect(tree.ensureNode([null, 'Pablo'])).toBe(null);
    expect(tree.ensureNode([undefined, 'Pablo'])).toBe(undefined);
    expect(tree.ensureNode(Symbol('test') as unknown as number)).toBe(undefined);
  });
});

describe('BinaryTree Morris Traversal', () => {
  // Create a binary tree
  const tree = new BinaryTree<number>();
  tree.add(1);
  tree.add(2);
  tree.add(3);
  tree.add(4);
  tree.add(5);
  it('should perform in-order Morris traversal correctly as dfs traversal', () => {
    // Perform in-order Morris traversal
    const result = tree.morris(node => node.key, 'IN');

    // Expected in-order traversal result
    const expected = [4, 2, 5, 1, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should perform pre-order Morris traversal correctly as dfs traversal', () => {
    // Perform pre-order Morris traversal
    const result = tree.morris(node => node.key, 'PRE');

    // Expected pre-order traversal result
    const expected = [1, 2, 4, 5, 3];

    expect(result).toEqual(expected);
    expect(tree.dfs(node => node.key, 'PRE')).toEqual(expected);
  });

  it('should perform post-order Morris traversal correctly as dfs traversal', () => {
    // Perform post-order Morris traversal
    const result = tree.morris(node => node.key, 'POST');

    // Expected post-order traversal result
    const expected = [4, 5, 2, 3, 1];

    expect(result).toEqual([4, 5, 2, 3, 1]);
    expect(tree.dfs(node => node.key, 'POST')).toEqual(expected);
  });

  it('after morris traversals should the structure of the tree be correct', () => {
    const node1 = tree.getNode(1);
    const node2 = tree.getNode(2);
    const node3 = tree.getNode(3);
    expect(node1?.left).toBe(node2);
    expect(node1?.right).toBe(node3);
  });
});

describe('BinaryTree toEntryFn', () => {
  it('should toEntryFn throw', () => {
    expect(() => {
      new BinaryTree<number, number, { obj: { id: number } }>([], {
        toEntryFn: `ele => [ele.obj.id, ele.obj.id]` as unknown as (rawElement: {
          obj: { id: number };
        }) => BTNEntry<number, number>
      });
    }).toThrow('toEntryFn must be a function type');
  });

  it('should toEntryFn with add', () => {
    const binTree = new BinaryTree<number, number, { obj: { id: number } }>([], {
      toEntryFn: ele => [ele.obj.id, ele.obj.id]
    });
    binTree.add({ obj: { id: 1 } });
    binTree.add({ obj: { id: 2 } });
    binTree.add({ obj: { id: 3 } });
    binTree.add({ obj: { id: 4 } });
    binTree.add({ obj: { id: 5 } });

    const expected = [4, 2, 5, 1, 3];

    expect(binTree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN', binTree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should toEntryFn with initial', () => {
    const binTree = new BinaryTree<number, number, { obj: { id: number } }>(
      [{ obj: { id: 1 } }, { obj: { id: 2 } }, { obj: { id: 3 } }, { obj: { id: 4 } }, { obj: { id: 5 } }],
      {
        toEntryFn: ele => [ele.obj.id, ele.obj.id]
      }
    );

    const expected = [4, 2, 5, 1, 3];

    expect(binTree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN', binTree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should no toEntryFn', () => {
    const data = [
      { obj: { id: 4 }, valueOf: () => 4 },
      { obj: { id: 2 }, valueOf: () => 2 },
      { obj: { id: 5 }, valueOf: () => 5 },
      { obj: { id: 1 }, valueOf: () => 1 },
      { obj: { id: 3 }, valueOf: () => 3 }
    ];
    const tree = new BinaryTree<{ obj: { id: number }; valueOf: () => number }, number>(data);

    expect(tree.morris(node => node.key, 'IN')).toEqual(data.sort((a, b) => a.obj.id - b.obj.id));
    expect(tree.dfs(node => node.key, 'IN')).toEqual(data);
    expect(tree.dfs(node => node.key, 'IN', tree.root, 'RECURSIVE')).toEqual(data);
  });
});

describe('BinaryTree traversals', () => {
  const tree = new BinaryTree<number>();

  const arr = [35, 20, 40, 15, 29, null, 50, null, 16, 28, 30, 45, 55];
  tree.refill(arr);
  expect(tree.bfs(node => node, tree.root, 'ITERATIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    40,
    15,
    29,
    null,
    50,
    null,
    16,
    28,
    30,
    45,
    55
  ]);
  expect(tree.bfs(node => node, tree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    40,
    15,
    29,
    null,
    50,
    null,
    16,
    28,
    30,
    45,
    55
  ]);
  expect(tree.bfs(node => node, tree.root, 'ITERATIVE').map(node => (node === null ? null : node.key))).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);
  expect(tree.bfs(node => node, tree.root, 'RECURSIVE').map(node => (node === null ? null : node.key))).toEqual([
    35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
  ]);

  expect(tree.dfs(node => node.key, 'PRE')).toEqual([35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55]);
  expect(tree.dfs(node => node.key, 'PRE', tree.root, 'RECURSIVE')).toEqual([
    35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55
  ]);
  expect(tree.dfs(node => node, 'PRE', tree.root, 'ITERATIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    15,
    null,
    16,
    29,
    28,
    30,
    40,
    null,
    50,
    45,
    55
  ]);
  expect(tree.dfs(node => node, 'PRE', tree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))).toEqual([
    35,
    20,
    15,
    null,
    16,
    29,
    28,
    30,
    40,
    null,
    50,
    45,
    55
  ]);

  expect(tree.dfs(node => node.key, 'IN')).toEqual([15, 16, 20, 28, 29, 30, 35, 40, 45, 50, 55]);
  expect(tree.dfs(node => node.key, 'POST')).toEqual([16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35]);
  expect(tree.dfs(node => node.key, 'POST', tree.root, 'RECURSIVE')).toEqual([
    16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35
  ]);
  expect(tree.bfs(node => node.key, tree.root, 'RECURSIVE')).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);
  expect(tree.bfs(node => node.key, tree.root, 'ITERATIVE')).toEqual([35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]);

  expect(tree.listLevels(node => node.key)).toEqual([[35], [20, 40], [15, 29, 50], [16, 28, 30, 45, 55]]);

  expect(tree.listLevels(node => node.key, tree.root, 'RECURSIVE')).toEqual([
    [35],
    [20, 40],
    [15, 29, 50],
    [16, 28, 30, 45, 55]
  ]);
  expect(tree.listLevels(node => (node ? node.key : null), tree.root, 'ITERATIVE', true)).toEqual([
    [35],
    [20, 40],
    [15, 29, null, 50],
    [null, 16, 28, 30, 45, 55]
  ]);
  expect(tree.listLevels(node => (node ? node.key : null), tree.root, 'RECURSIVE', true)).toEqual([
    [35],
    [20, 40],
    [15, 29, null, 50],
    [null, 16, 28, 30, 45, 55]
  ]);
});

describe('BinaryTree', () => {
  let tree: BinaryTree<number, string>;

  beforeEach(() => {
    tree = new BinaryTree<number, string>([], {
      iterationType: 'RECURSIVE'
    });
  });

  afterEach(() => {
    tree.clear();
  });

  it('should create an empty BinaryTree', () => {
    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(undefined);
  });

  it('should add nodes to the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.size).toBe(3);
    expect(tree.isEmpty()).toBe(false);
    expect(tree.root?.key).toBe(5);
  });

  it('should clear the BinaryTree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.clear();

    expect(tree.size).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.root).toBe(undefined);
  });

  it('should get nodes by key', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const nodeA = tree.getNode(5);
    const nodeB = tree.getNode(3);

    expect(nodeA?.key).toBe(5);
    expect(nodeA?.value).toBe('A');
    expect(nodeB?.key).toBe(3);
    expect(nodeB?.value).toBe('B');
  });

  it('should return null when getting a non-existent node', () => {
    tree.add([5, 'A']);

    const node = tree.getNode(3);

    expect(node).toBe(null);
  });

  it('should get the depth of a node', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.getDepth(7)).toBe(1);
    expect(tree.getDepth(3)).toBe(1);
  });

  it('should get the height of the tree', () => {
    tree.add([5, 'A']);
    tree.add(3, 'B');
    tree.add([7, 'C']);

    expect(tree.getHeight()).toBe(1);
    expect(tree.getHeight(undefined, 'RECURSIVE')).toBe(1);
    expect(tree.getMinHeight(undefined, 'RECURSIVE')).toBe(1);
  });

  it('should check if the tree is a binary search tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.isBST()).toBe(true);
  });

  it('should perform a depth-first traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const result = tree.dfs();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of depth-first traversal
  });

  it('should perform a breadth-first traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const result = tree.bfs(node => node.key);
    expect(result).toEqual([5, 3, 7]);
    // Add assertions for the result of breadth-first traversal
  });

  it('should list levels of the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    const levels = tree.listLevels();
    expect(levels).toEqual([[5], [3, 7]]);
    // Add assertions for the levels of the tree
  });

  it('should delete nodes from the tree', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.delete(3);

    expect(tree.size).toBe(2);
    expect(tree.getNode(3)).toBe(null);
  });

  it('should check if the tree is perfectly balanced', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    expect(tree.isPerfectlyBalanced()).toBe(true);
  });

  it('should get nodes by a custom callback', () => {
    tree.add([5, 'E']);
    tree.add([4, 'D']);
    tree.add([3, 'C']);
    tree.add([7, 'G']);
    tree.add([null, 'null']);
    tree.add([1, 'A']);
    tree.add([6, 'F']);
    tree.add([null, 'null']);
    tree.add([2, 'B']);
    tree.add([null, 'null']);

    const nodes = tree.getNodes('B', node => node.value);

    expect(nodes.length).toBe(1);
    expect(nodes[0].key).toBe(2);

    const nodesRec = tree.getNodes('B', node => node.value, false, tree.root, 'RECURSIVE');

    expect(nodesRec.length).toBe(1);
    expect(nodesRec[0].key).toBe(2);

    const nodesItr = tree.getNodes('B', node => node.value, false, tree.root, 'ITERATIVE');

    expect(nodesItr.length).toBe(1);
    expect(nodesItr[0].key).toBe(2);

    expect(nodesItr).toEqual(nodesRec);
  });

  it('should perform Morris traversal', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.iterationType = 'ITERATIVE';
    expect([...tree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    tree.iterationType = 'RECURSIVE';
    expect([...tree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    tree.iterationType = 'ITERATIVE';

    const result = tree.morris();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of Morris traversal
  });

  it('should perform delete all', () => {
    tree.add([5, 'A']);
    tree.add([3, 'B']);
    tree.add([7, 'C']);

    tree.delete(5);
    tree.delete(7);
    tree.delete(3);
    expect(tree.root).toBe(undefined);
    expect(tree.getHeight()).toBe(-1);
  });
});

describe('BinaryTree iterative methods test', () => {
  let binaryTree: BinaryTree<number, string>;
  beforeEach(() => {
    binaryTree = new BinaryTree();
    binaryTree.add([1, 'a']);
    binaryTree.add(2, 'b');
    binaryTree.add([3, 'c']);
  });

  it('The node obtained by get Node should match the node type', () => {
    const node3 = binaryTree.getNode(3);
    expect(node3).toBeInstanceOf(BinaryTreeNode);
  });

  it('forEach should iterate over all elements', () => {
    const mockCallback = jest.fn();
    binaryTree.forEach((value, key) => {
      mockCallback(value, key);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['b', 2]);
    expect(mockCallback.mock.calls[1]).toEqual(['a', 1]);
    expect(mockCallback.mock.calls[2]).toEqual(['c', 3]);
  });

  it('filter should return a new tree with filtered elements', () => {
    const filteredTree = binaryTree.filter((value, key) => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [3, 'c'],
      [2, 'b']
    ]);
  });

  it('map should return a new tree with modified elements', () => {
    const mappedTree = binaryTree.map((value, key) => (key * 2).toString());
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      [1, '2'],
      [2, '4'],
      [3, '6']
    ]);
  });

  it('reduce should accumulate values', () => {
    const sum = binaryTree.reduce((acc, currentValue, currentKey) => acc + currentKey, 0);
    expect(sum).toBe(6);
  });

  it('[Symbol.iterator] should provide an iterator', () => {
    const entries = [];
    for (const entry of binaryTree) {
      entries.push(entry);
    }

    expect(entries.length).toBe(3);
    expect(entries).toEqual([
      [2, 'b'],
      [1, 'a'],
      [3, 'c']
    ]);
  });

  it('should clone work well', () => {
    const cloned = binaryTree.clone();
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.root?.right?.value).toBe('c');
  });

  it('should keys', () => {
    const keys = binaryTree.keys();
    expect([...keys]).toEqual([2, 1, 3]);
  });

  it('should values', () => {
    const values = binaryTree.values();
    expect([...values]).toEqual(['b', 'a', 'c']);
  });

  it('should leaves', () => {
    const leaves = binaryTree.leaves();
    expect(leaves).toEqual([2, 3]);
  });

  it('should iterative method return undefined when the node is null', () => {
    const tree = new BinaryTree();
    tree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);
    const bfsResult = tree.bfs(undefined, undefined, undefined, true);
    expect(bfsResult).toEqual([
      -10,
      9,
      20,
      undefined,
      undefined,
      15,
      7,
      8,
      undefined,
      2,
      undefined,
      6,
      undefined,
      undefined
    ]);
  });
});
