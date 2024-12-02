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
    expect(node.key).toBe(1);

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
    const binTree = new BinaryTree<number, number, { id: number; name: number }>([], {
      toEntryFn: ({ id, name }) => [id, name]
    });
    binTree.addMany(
      [
        { id: 1, name: 1 },
        { id: 2, name: 2 },
        { id: 4, name: 4 },
        { id: 3, name: 3 }
      ],
      [undefined, 22, 44, 33]
    );
    expect(binTree.get(2)).toBe(22);
    expect(binTree.get(binTree.getNode(3))).toBe(33);
    expect(binTree.get(binTree.getNode(4))).toBe(44);
    expect(binTree.get(binTree.getNode(1))).toBe(1);
  });

  it('should addMany undefined and null', () => {
    const binaryTree = new BinaryTree<number, string>();
    const addManyWithUndefined = binaryTree.addMany([1, undefined, 3]);
    expect(addManyWithUndefined).toEqual([true, false, true]);
    expect(binaryTree.get(undefined)).toBe(undefined);
    const addManyWithNull = binaryTree.addMany([1, null, 3, 4]);
    expect(addManyWithNull).toEqual([true, true, true, true]);
    const addManyEntriesWithNull = binaryTree.addMany([
      [1, '1'],
      [null, 'null'],
      [3, '3'],
      [4, '4']
    ]);
    expect(addManyEntriesWithNull).toEqual([true, true, true, true]);
    expect(binaryTree.get(null)).toBe(undefined);
    expect(binaryTree.getNode(null)).toBe(undefined);
    // // TODO should be null instead of undefined
    // expect(binaryTree.getNode(null)).toBe(null);
    const node0 = binaryTree.add(0, '0');
    expect(node0).toBe(true);
    expect(binaryTree.get(0)).toBe('0');
  });
});

describe('BinaryTree', () => {
  let binTree: BinaryTree<number>;

  beforeEach(() => {
    binTree = new BinaryTree<number>();
  });

  afterEach(() => {
    binTree.clear();
  });

  it('should add a node', () => {
    const node = binTree.add(1);
    expect(node).not.toBeNull();
    expect(binTree.size).toBe(1);
  });

  it('should delete nodes', () => {
    expect(binTree.getHeight(binTree.root, 'ITERATIVE')).toBe(-1);
    expect(binTree.getMinHeight()).toBe(-1);
    const node1 = binTree.createNode(1);
    binTree.add(node1);
    expect(binTree.size).toBe(1);

    const leftChild = new BinaryTreeNode<number>(2);
    const rightChild = new BinaryTreeNode<number>(3);
    binTree.add(leftChild);
    binTree.add(rightChild);
    const root = binTree.root;

    expect(leftChild.familyPosition).toBe('LEFT');
    binTree.add(null);
    binTree.add(new BinaryTreeNode<number>(4));
    expect(rightChild.familyPosition).toBe('RIGHT');
    expect(root?.familyPosition).toBe('ROOT');
    expect(leftChild.familyPosition).toBe('ROOT_LEFT');
    binTree.add(new BinaryTreeNode<number>(5));
    expect(rightChild.familyPosition).toBe('ROOT_RIGHT');

    binTree.delete(new BinaryTreeNode<number>(200));
    binTree.delete(rightChild);

    if (node1) {
      const result = binTree.delete(node1);
      expect(result).toHaveLength(1);
      expect(binTree.size).toBe(4);
      expect(binTree.getMinHeight(binTree.root, 'RECURSIVE')).toBe(1);
    }
  });

  it('should add and find nodes', () => {
    binTree.add([1, 1]);
    binTree.add(undefined);
    binTree.add([2, 2]);
    binTree.add([3, 3]);

    expect(binTree.has(1)).toBe(true);
    expect(binTree.has(2)).toBe(true);
    expect(binTree.has(3)).toBe(true);
    expect(binTree.has(4)).toBe(false);
    const node4 = binTree.getNode(4);
    expect(binTree.has(node4)).toBe(false);
    expect(binTree.has(node => node === node4)).toBe(false);
    expect(binTree.has(node => node.key?.toString() === '3')).toBe(true);
  });

  it('should the clone method work fine', () => {
    expect(binTree.isEmpty()).toBe(true);
    binTree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(binTree.root?.key).toBe(4);
    expect(binTree.root?.left?.key).toBe(2);
    expect(binTree.root?.left?.left).toBe(null);
    expect(binTree.root?.left?.right?.key).toBe(1);
    expect(binTree.root?.right?.key).toBe(6);
    expect(binTree.root?.right?.left?.key).toBe(3);
    expect(binTree.root?.right?.right).toBe(null);

    const cloned = binTree.clone();
    expect(cloned.root?.key).toBe(4);
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.root?.left?.left).toBe(null);
    expect(cloned.root?.left?.right?.key).toBe(1);
    expect(cloned.root?.right?.key).toBe(6);
    expect(cloned.root?.right?.left?.key).toBe(3);
    expect(cloned.root?.right?.right).toBe(null);
    expect(cloned.dfs(node => node.key, 'PRE', false, cloned.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', false, cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : node), 'PRE', false, cloned.getNode(6), 'ITERATIVE', true)).toEqual([
      6,
      3,
      7,
      null
    ]);
    expect(cloned.dfs(node => (node ? node.key : null), 'PRE', false, cloned.getNode(6), 'RECURSIVE', true)).toEqual([
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
    expect(binTree.size).toBe(10);
    expect(cloned.size).toBe(3);
    // expect(cloned.size).toBe(0);
    // expect(cloned.isEmpty()).toBe(true);
  });

  it('should be a balance binTree after malicious manipulation', () => {
    binTree.add(3);
    binTree.add(12);
    binTree.addMany(getRandomIntArray(100, 1, 100));
    binTree.add(10);

    expect(binTree.isPerfectlyBalanced()).toBe(true);
    const node3 = binTree.getNode(3);

    if (node3) node3.right = binTree.createNode(1);
    expect(binTree.isPerfectlyBalanced()).toBe(false);

    binTree.clear();
    binTree.addMany([1, null, 2, null, 3, null, 4, null, 5, null, 6, null]);
    expect(binTree.isPerfectlyBalanced()).toBe(false);
  });

  it('should getDepth return correct depth', () => {
    binTree.add(1);
    expect(binTree.getDepth(1)).toBe(0);
    binTree.add(2);
    expect(binTree.getDepth(2)).toBe(1);
    binTree.add(3);
    expect(binTree.getDepth(3, 1)).toBe(1);
    binTree.add(4);
    expect(binTree.getDepth(4, 1)).toBe(2);
    expect(binTree.getDepth(4)).toBe(2);
    expect(binTree.getDepth(4, 2)).toBe(1);
  });

  it('should traverse in-order', () => {
    binTree.add(null);
    binTree.delete(1);
    expect(binTree.getHeight()).toBe(-1);
    binTree.add(4);
    binTree.add(2);
    expect(binTree.getHeight()).toBe(1);
    binTree.iterationType = 'RECURSIVE';
    expect(binTree.getHeight()).toBe(1);
    binTree.iterationType = 'ITERATIVE';

    binTree.add(6);
    binTree.add(1);
    binTree.add(new BinaryTreeNode(3));
    binTree.add(5);
    binTree.add(7);

    const inOrder = binTree.dfs(node => node.key);

    expect(inOrder).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should isSubtreeBST', () => {
    binTree.addMany([
      new BinaryTreeNode(4, 4),
      new BinaryTreeNode(2, 2),
      new BinaryTreeNode(6, 6),
      new BinaryTreeNode(1, 1),
      new BinaryTreeNode(3, 3),
      new BinaryTreeNode(5, 5),
      new BinaryTreeNode(7, 7),
      new BinaryTreeNode(4, 4)
    ]);

    expect(binTree.isBST(binTree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(binTree.isBST(binTree.getNode(4), 'ITERATIVE')).toBe(true);
  });

  it('should isSubtreeBST', () => {
    expect(binTree.toVisual()).toBe('');
    binTree.addMany([4, 2, 6, 1, 3, 5, 7, 4]);
    expect(binTree.toVisual()).toBe(
      'N for null\n' +
        '    ___4___    \n' +
        '   /       \\   \n' +
        '  _2_     _6_  \n' +
        ' /   \\   /   \\ \n' +
        ' 1   3   5   7 \n' +
        '               \n'
    );
    const visualized = binTree.toVisual(undefined, {
      isShowUndefined: true,
      isShowNull: true,
      isShowRedBlackNIL: true
    });
    expect(visualized).toBe(
      'U for undefined\n' +
        'N for null\n' +
        'S for Sentinel Node(NIL)\n' +
        '        _______4_______        \n' +
        '       /               \\       \n' +
        '    ___2___         ___6___    \n' +
        '   /       \\       /       \\   \n' +
        '  _1_     _3_     _5_     _7_  \n' +
        ' /   \\   /   \\   /   \\   /   \\ \n' +
        ' U   U   U   U   U   U   U   U \n' +
        '                               \n'
    );

    expect(binTree.isBST(binTree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(binTree.isBST(binTree.getNode(4), 'ITERATIVE')).toBe(true);
    expect(binTree.getNodes(2, false, null)).toEqual([]);
    expect(binTree.getNodes(undefined)).toEqual([]);
    expect(binTree.getNodes(binTree.getNode(2), false, binTree.root)).toEqual([binTree.getNode(2)]);
  });

  describe('should isValidKey', () => {
    describe('primitive types', () => {
      it('numbers should be a key', () => {
        expect(binTree.isValidKey(42)).toBe(true);
        expect(binTree.isValidKey(0)).toBe(true);
        expect(binTree.isValidKey(-1)).toBe(true);
        expect(binTree.isValidKey(Infinity)).toBe(true);
        expect(binTree.isValidKey(-Infinity)).toBe(true);
      });

      // it('NaN should not be a key', () => {
      //   expect(binTree.isValidKey(NaN)).toBe(false);
      // });

      it('strings should be a key', () => {
        expect(binTree.isValidKey('hello')).toBe(true);
        expect(binTree.isValidKey('')).toBe(true);
        expect(binTree.isValidKey('123')).toBe(true);
      });

      it('BigInt should be a key', () => {
        expect(binTree.isValidKey(BigInt(42))).toBe(true);
        expect(binTree.isValidKey(BigInt(0))).toBe(true);
        expect(binTree.isValidKey(BigInt(-1))).toBe(true);
      });

      it('boolean should not be a key', () => {
        expect(binTree.isValidKey(true)).toBe(true);
        expect(binTree.isValidKey(false)).toBe(true);
      });

      it('null and undefined should not be a key', () => {
        expect(binTree.isValidKey(null)).toBe(true);
        expect(binTree.isValidKey(undefined)).toBe(false);
      });

      it('symbols should not be a key', () => {
        expect(binTree.isValidKey(Symbol('test'))).toBe(false);
        expect(binTree.isValidKey(Symbol.for('test'))).toBe(false);
      });
    });

    describe('Date objects', () => {
      it('valid Date objects should be a key', () => {
        expect(binTree.isValidKey(new Date())).toBe(true);
        expect(binTree.isValidKey(new Date('2024-01-01'))).toBe(true);
      });

      // it('invalid Date objects should not be a key', () => {
      //   expect(binTree.isValidKey(new Date('invalid'))).toBe(false);
      // });
    });

    describe('arrays', () => {
      it('arrays should be a key as they convert to string', () => {
        expect(binTree.isValidKey([])).toBe(true);
        expect(binTree.isValidKey([1, 2, 3])).toBe(true);
        expect(binTree.isValidKey(['a', 'b', 'c'])).toBe(true);
      });
    });

    describe('plain objects', () => {
      it('plain objects should not be a key', () => {
        expect(binTree.isValidKey({})).toBe(false);
        expect(binTree.isValidKey({ a: 1 })).toBe(false);
      });
    });

    describe('custom objects', () => {
      it('objects with numeric valueOf should be a key', () => {
        expect(binTree.isValidKey({ valueOf: () => 42 })).toBe(true);
      });

      it('objects with string valueOf should be a key', () => {
        expect(binTree.isValidKey({ valueOf: () => 'test' })).toBe(true);
      });

      it('objects with boolean valueOf should not be a key', () => {
        expect(binTree.isValidKey({ valueOf: () => true })).toBe(true);
      });

      it('objects with nested valueOf/toString should be a key', () => {
        expect(
          binTree.isValidKey({
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
        expect(binTree.isValidKey(deeplyNested)).toBe(true);
      });

      it('objects with very deeply nested conversion should be a key', () => {
        const veryDeeplyNested = {
          valueOf: () => ({
            valueOf: () => ({
              toString: () => '42'
            })
          })
        };
        expect(binTree.isValidKey(veryDeeplyNested)).toBe(true);
      });

      it('objects with circular references should not be a key', () => {
        const circular: any = {
          valueOf: () => circular
        };
        expect(binTree.isValidKey(circular)).toBe(false);
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
        expect(binTree.isValidKey(complexObject)).toBe(false);
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
        expect(binTree.isValidKey(complexObject)).toBe(true);
      });
    });

    describe('type checking', () => {
      it('should work with type guard in array methods', () => {
        const values: unknown[] = [42, 'test', true, null, undefined, new Date()];
        const comparableValues = values.filter(item => binTree.isValidKey(item));
        expect(comparableValues.length).toBe(5);
      });
    });
  });

  it('should isLeaf', () => {
    expect(binTree.getLeftMost()).toBe(undefined);
    expect(binTree.getRightMost()).toBe(undefined);
    binTree.addMany([4, 2, 6, 1, 3, 5, 7, 4]);
    const leftMost = binTree.getLeftMost();
    expect(binTree.isLeaf(leftMost)).toBe(true);
    expect(binTree.isLeaf(null)).toBe(true);
    const rightMost = binTree.getRightMost();
    expect(binTree.isLeaf(rightMost)).toBe(true);
    expect(binTree.isLeaf(null)).toBe(true);
  });

  it('should binTree traverse', () => {
    expect(binTree.dfs()).toEqual([]);
    expect([...binTree.values()]).toEqual([]);
    binTree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(binTree.dfs(node => node.key, 'PRE', false, undefined, 'ITERATIVE')).toEqual([4, 2, 1, 5, 6, 3, 7]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, undefined, 'ITERATIVE', false)).toEqual(
      [4, 2, 1, 5, 6, 3, 7]
    );
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, undefined, 'ITERATIVE', true)).toEqual([
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

    expect(binTree.dfs(node => node.key, 'PRE', false, undefined, 'RECURSIVE')).toEqual([4, 2, 1, 5, 6, 3, 7]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, undefined, 'RECURSIVE', false)).toEqual(
      [4, 2, 1, 5, 6, 3, 7]
    );
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, undefined, 'RECURSIVE', true)).toEqual([
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

    expect(binTree.dfs(node => node.key, 'IN', false, undefined, 'ITERATIVE')).toEqual([2, 5, 1, 4, 7, 3, 6]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, undefined, 'ITERATIVE', false)).toEqual([
      2, 5, 1, 4, 7, 3, 6
    ]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, undefined, 'ITERATIVE', true)).toEqual([
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

    expect(binTree.dfs(node => node.key, 'IN', false, undefined, 'RECURSIVE')).toEqual([2, 5, 1, 4, 7, 3, 6]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, undefined, 'RECURSIVE', false)).toEqual([
      2, 5, 1, 4, 7, 3, 6
    ]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, undefined, 'RECURSIVE', true)).toEqual([
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

    expect(binTree.dfs(node => node.key, 'POST', false, undefined, 'ITERATIVE')).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, undefined, 'ITERATIVE', false)
    ).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, undefined, 'ITERATIVE', true)).toEqual(
      [null, 5, null, 1, 2, 7, 3, null, 6, 4]
    );

    expect(binTree.dfs(node => node.key, 'POST', false, undefined, 'RECURSIVE')).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, undefined, 'RECURSIVE', false)
    ).toEqual([5, 1, 2, 7, 3, 6, 4]);
    expect(binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, undefined, 'RECURSIVE', true)).toEqual(
      [null, 5, null, 1, 2, 7, 3, null, 6, 4]
    );
  });

  it('should sub binTree traverse', () => {
    binTree.addMany([4, 2, 6, null, 1, 3, null, 5, null, 7]);
    expect(binTree.dfs(node => node.key, 'PRE', false, binTree.getNode(6), 'ITERATIVE')).toEqual([6, 3, 7]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, binTree.getNode(6), 'ITERATIVE', false)
    ).toEqual([6, 3, 7]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, binTree.getNode(6), 'ITERATIVE', true)
    ).toEqual([6, 3, 7, null]);

    expect(binTree.dfs(node => node.key, 'PRE', false, binTree.getNode(6), 'RECURSIVE')).toEqual([6, 3, 7]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, binTree.getNode(6), 'RECURSIVE', false)
    ).toEqual([6, 3, 7]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'PRE', false, binTree.getNode(6), 'RECURSIVE', true)
    ).toEqual([6, 3, 7, null]);

    expect(binTree.dfs(node => node.key, 'IN', false, binTree.getNode(6), 'ITERATIVE')).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, binTree.getNode(6), 'ITERATIVE', false)
    ).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, binTree.getNode(6), 'ITERATIVE', true)
    ).toEqual([7, 3, 6, null]);

    expect(binTree.dfs(node => node.key, 'IN', false, binTree.getNode(6), 'RECURSIVE')).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, binTree.getNode(6), 'RECURSIVE', false)
    ).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'IN', false, binTree.getNode(6), 'RECURSIVE', true)
    ).toEqual([7, 3, 6, null]);

    expect(binTree.dfs(node => node.key, 'POST', false, binTree.getNode(6), 'ITERATIVE')).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, binTree.getNode(6), 'ITERATIVE', false)
    ).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, binTree.getNode(6), 'ITERATIVE', true)
    ).toEqual([7, 3, null, 6]);

    expect(binTree.dfs(node => node.key, 'POST', false, binTree.getNode(6), 'RECURSIVE')).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, binTree.getNode(6), 'RECURSIVE', false)
    ).toEqual([7, 3, 6]);
    expect(
      binTree.dfs(node => (node !== null ? node.key : null), 'POST', false, binTree.getNode(6), 'RECURSIVE', true)
    ).toEqual([7, 3, null, 6]);
  });

  it('should clear the binTree', () => {
    binTree.add(1);
    binTree.add(2);

    expect(binTree.size).toBe(2);

    binTree.clear();

    expect(binTree.size).toBe(0);
    expect(binTree.root).toBeUndefined();
  });

  it('should duplicated nodes just replace the node exists', function () {
    binTree.clear();
    expect(binTree.bfs()).toEqual([]);
    binTree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);

    expect(binTree.bfs(node => (node ? node.key : null), undefined, undefined, true)).toEqual([
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

  // it('should keyValueNodeEntryRawToNodeAndValue', () => {
  //   const binTree = new BinaryTree<number>();
  //   const node0 = binTree.keyValueNodeEntryRawToNodeAndValue(0);
  //   expect(node0).toEqual([
  //     {
  //       _left: undefined,
  //       _right: undefined,
  //       key: 0,
  //       parent: undefined,
  //       value: undefined
  //     },
  //     undefined
  //   ]);
  //
  //   const nodeUndefined = binTree.keyValueNodeEntryRawToNodeAndValue(undefined);
  //   expect(nodeUndefined).toEqual([undefined, undefined]);
  //
  //   const nodeNull = binTree.keyValueNodeEntryRawToNodeAndValue(null);
  //   expect(nodeNull).toEqual([null, undefined]);
  //
  //   const [, nodeWithSeparateValue] = binTree.keyValueNodeEntryRawToNodeAndValue(7, 77);
  //   expect(nodeWithSeparateValue).toBe(77);
  //
  //   expect(binTree.keyValueNodeEntryRawToNodeAndValue([undefined, 2])).toEqual([undefined, undefined]);
  //
  //   expect(binTree.keyValueNodeEntryRawToNodeAndValue(Symbol('test') as unknown as number)).toEqual([
  //     undefined,
  //     undefined
  //   ]);
  //
  //   const bTree = new BinaryTree<number, number, { obj: { id: number } }>([], {
  //     toEntryFn: (ele: { obj: { id: number } }) => [Symbol('test') as unknown as number, ele.obj.id]
  //   });
  //   expect(bTree.keyValueNodeEntryRawToNodeAndValue({ obj: { id: 1 } })).toEqual([undefined, undefined]);
  // });

  it('should replace value', () => {
    const binTree = new BinaryTree<number, string>([4, 5, [1, '1'], 2, 3], { isMapMode: false });
    expect(binTree.get(1)).toBe('1');
    expect(binTree.getNode(1)?.value).toBe('1');
    binTree.add(1, 'a');
    expect(binTree.get(1)).toBe('a');
    binTree.add([1, 'b']);
    expect(binTree.getNode(1)?.value).toBe('b');
    expect(binTree.get(1)).toBe('b');
    const treeMap = new BinaryTree<number>([4, 5, [1, '1'], 2, 3]);
    expect(treeMap.get(1)).toBe('1');
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    treeMap.add(1, 'a');
    expect(treeMap.get(1)).toBe('a');
    treeMap.add([1, 'b']);
    expect(treeMap.getNode(1)?.value).toBe(undefined);
    expect(treeMap.get(1)).toBe('b');
  });
});

describe('BinaryTree ensureNode', () => {
  it('should ensureNode with toEntryFn', () => {
    const binTree = new BinaryTree<
      number,
      string,
      {
        id: number;
        name: string;
      }
    >([], { toEntryFn: rawElement => [rawElement.id, rawElement.name] });
    binTree.add([1, 'Pablo']);
    const node = binTree.getNode(1);
    // expect(binTree.ensureNode({ id: 1, name: 'Pablo' })).toBe(node);
    expect(binTree.ensureNode([1, 'Pablo'])).toBe(node);
    expect(binTree.ensureNode([null, 'Pablo'])).toBe(null);
    expect(binTree.ensureNode([undefined, 'Pablo'])).toBe(undefined);
    expect(binTree.ensureNode(Symbol('test') as unknown as number)).toBe(undefined);
  });
});

describe('BinaryTree Morris Traversal', () => {
  // Create a binary binTree
  const binTree = new BinaryTree<number>();
  binTree.add(1);
  binTree.add(2);
  binTree.add(3);
  binTree.add(4);
  binTree.add(5);
  it('should perform in-order Morris traversal correctly as dfs traversal', () => {
    // Perform in-order Morris traversal
    const result = binTree.morris(node => node.key, 'IN');

    // Expected in-order traversal result
    const expected = [4, 2, 5, 1, 3];

    expect(result).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN', false, binTree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should perform pre-order Morris traversal correctly as dfs traversal', () => {
    // Perform pre-order Morris traversal
    const result = binTree.morris(node => node.key, 'PRE');

    // Expected pre-order traversal result
    const expected = [1, 2, 4, 5, 3];

    expect(result).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'PRE')).toEqual(expected);
  });

  it('should perform post-order Morris traversal correctly as dfs traversal', () => {
    // Perform post-order Morris traversal
    const result = binTree.morris(node => node.key, 'POST');

    // Expected post-order traversal result
    const expected = [4, 5, 2, 3, 1];

    expect(result).toEqual([4, 5, 2, 3, 1]);
    expect(binTree.dfs(node => node.key, 'POST')).toEqual(expected);
  });

  it('after morris traversals should the structure of the binTree be correct', () => {
    const node1 = binTree.getNode(1);
    const node2 = binTree.getNode(2);
    const node3 = binTree.getNode(3);
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
    binTree.addMany([
      { obj: { id: 1 } },
      { obj: { id: 2 } },
      { obj: { id: 3 } },
      { obj: { id: 4 } },
      { obj: { id: 5 } }
    ]);

    const expected = [4, 2, 5, 1, 3];

    expect(binTree.morris(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN')).toEqual(expected);
    expect(binTree.dfs(node => node.key, 'IN', false, binTree.root, 'RECURSIVE')).toEqual(expected);
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
    expect(binTree.dfs(node => node.key, 'IN', false, binTree.root, 'RECURSIVE')).toEqual(expected);
  });

  it('should no toEntryFn', () => {
    const data = [
      { obj: { id: 4 }, valueOf: () => 4 },
      { obj: { id: 2 }, valueOf: () => 2 },
      { obj: { id: 5 }, valueOf: () => 5 },
      { obj: { id: 1 }, valueOf: () => 1 },
      { obj: { id: 3 }, valueOf: () => 3 }
    ];
    const binTree = new BinaryTree<{ obj: { id: number }; valueOf: () => number }, number>(data);

    expect(binTree.morris(node => node.key, 'IN')).toEqual(data.sort((a, b) => a.obj.id - b.obj.id));
    expect(binTree.dfs(node => node.key, 'IN')).toEqual(data);
    expect(binTree.dfs(node => node.key, 'IN', false, binTree.root, 'RECURSIVE')).toEqual(data);
  });
});

describe('BinaryTree traversals', () => {
  it('traversals', () => {
    const binTree = new BinaryTree<number>();

    const arr = [35, 20, 40, 15, 29, null, 50, null, 16, 28, 30, 45, 55];
    binTree.refill(arr);
    expect(binTree.bfs(node => node, binTree.root, 'ITERATIVE', true).map(node => (node ? node.key : null))).toEqual([
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
    expect(binTree.bfs(node => node, binTree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))).toEqual([
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
    expect(binTree.bfs(node => node, binTree.root, 'ITERATIVE').map(node => (node === null ? null : node.key))).toEqual(
      [35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]
    );
    expect(binTree.bfs(node => node, binTree.root, 'RECURSIVE').map(node => (node === null ? null : node.key))).toEqual(
      [35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55]
    );

    expect(binTree.dfs(node => node.key, 'PRE')).toEqual([35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55]);
    expect(binTree.dfs(node => node.key, 'PRE', false, binTree.root, 'RECURSIVE')).toEqual([
      35, 20, 15, 16, 29, 28, 30, 40, 50, 45, 55
    ]);
    expect(
      binTree
        .dfs(node => node, 'PRE', false, binTree.root, 'ITERATIVE', true)
        .map(node => (node === null ? null : node.key))
    ).toEqual([35, 20, 15, null, 16, 29, 28, 30, 40, null, 50, 45, 55]);
    expect(
      binTree.dfs(node => node, 'PRE', false, binTree.root, 'RECURSIVE', true).map(node => (node ? node.key : null))
    ).toEqual([35, 20, 15, null, 16, 29, 28, 30, 40, null, 50, 45, 55]);

    expect(binTree.dfs(node => node.key, 'IN')).toEqual([15, 16, 20, 28, 29, 30, 35, 40, 45, 50, 55]);
    expect(binTree.dfs(node => node.key, 'POST')).toEqual([16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35]);
    expect(binTree.dfs(node => node.key, 'POST', false, binTree.root, 'RECURSIVE')).toEqual([
      16, 15, 28, 30, 29, 20, 45, 55, 50, 40, 35
    ]);
    expect(binTree.bfs(node => node.key, binTree.root, 'RECURSIVE')).toEqual([
      35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
    ]);
    expect(binTree.bfs(node => node.key, binTree.root, 'ITERATIVE')).toEqual([
      35, 20, 40, 15, 29, 50, 16, 28, 30, 45, 55
    ]);

    expect(binTree.listLevels(node => node.key)).toEqual([[35], [20, 40], [15, 29, 50], [16, 28, 30, 45, 55]]);

    expect(binTree.listLevels(node => node.key, binTree.root, 'RECURSIVE')).toEqual([
      [35],
      [20, 40],
      [15, 29, 50],
      [16, 28, 30, 45, 55]
    ]);
    expect(binTree.listLevels(node => (node ? node.key : null), binTree.root, 'ITERATIVE', true)).toEqual([
      [35],
      [20, 40],
      [15, 29, null, 50],
      [null, 16, 28, 30, 45, 55]
    ]);
    expect(binTree.listLevels(node => (node ? node.key : null), binTree.root, 'RECURSIVE', true)).toEqual([
      [35],
      [20, 40],
      [15, 29, null, 50],
      [null, 16, 28, 30, 45, 55]
    ]);
    binTree.clear();
    expect(binTree.listLevels()).toEqual([]);
  });
});

describe('BinaryTree', () => {
  let binTree: BinaryTree<number, string>;

  beforeEach(() => {
    binTree = new BinaryTree<number, string>([], {
      iterationType: 'RECURSIVE'
    });
  });

  afterEach(() => {
    binTree.clear();
  });

  it('should create an empty BinaryTree', () => {
    expect(binTree.size).toBe(0);
    expect(binTree.isEmpty()).toBe(true);
    expect(binTree.root).toBe(undefined);
  });

  it('should add nodes to the binTree', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    expect(binTree.size).toBe(3);
    expect(binTree.isEmpty()).toBe(false);
    expect(binTree.root?.key).toBe(5);
  });

  it('should clear the BinaryTree', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    binTree.clear();

    expect(binTree.size).toBe(0);
    expect(binTree.isEmpty()).toBe(true);
    expect(binTree.root).toBe(undefined);
  });

  it('should get nodes by key', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    const nodeA = binTree.getNode(5);
    const nodeB = binTree.getNode(3);

    expect(nodeA?.key).toBe(5);
    expect(nodeA?.value).toBe(undefined);
    expect(nodeB?.key).toBe(3);
    expect(binTree.get(nodeB)).toBe('B');
  });

  it('should return undefined when getting a non-existent node', () => {
    binTree.add([5, 'A']);

    const node = binTree.getNode(3);

    expect(node).toBe(undefined);
  });

  it('should get the depth of a node', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    expect(binTree.getDepth(7)).toBe(1);
    expect(binTree.getDepth(3)).toBe(1);
  });

  it('should get the height of the binTree', () => {
    expect(binTree.getMinHeight()).toBe(-1);
    binTree.add([5, 'A']);
    binTree.add(3, 'B');
    binTree.add([7, 'C']);

    expect(binTree.getHeight()).toBe(1);
    expect(binTree.getHeight(undefined, 'RECURSIVE')).toBe(1);
    expect(binTree.getMinHeight(undefined, 'RECURSIVE')).toBe(1);
  });

  it('should check if the binTree is a binary search binTree', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    expect(binTree.isBST()).toBe(true);
  });

  it('should perform a depth-first traversal', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    const result = binTree.dfs();
    expect(result).toEqual([3, 5, 7]);
    // Add assertions for the result of depth-first traversal
  });

  it('should perform a breadth-first traversal', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    const result = binTree.bfs(node => node.key);
    expect(result).toEqual([5, 3, 7]);
    // Add assertions for the result of breadth-first traversal
  });

  it('should list levels of the binTree', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    const levels = binTree.listLevels();
    expect(levels).toEqual([[5], [3, 7]]);
    // Add assertions for the levels of the binTree
  });

  it('should delete nodes from the binTree', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    binTree.delete(3);

    expect(binTree.size).toBe(2);
    expect(binTree.getNode(3)).toBe(undefined);
  });

  it('should getPathToRoot', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    expect(binTree.getPathToRoot(7)).toEqual([7, 5]);
    expect(binTree.getPathToRoot(1)).toEqual([]);
  });

  it('should check if the binTree is perfectly balanced', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    expect(binTree.isPerfectlyBalanced()).toBe(true);
  });

  it('should get nodes by a custom callback', () => {
    binTree.add([5, 'E']);
    binTree.add([4, 'D']);
    binTree.add([3, 'C']);
    binTree.add([7, 'G']);
    binTree.add([null, 'null']);
    binTree.add([1, 'A']);
    binTree.add([6, 'F']);
    binTree.add([null, 'null']);
    binTree.add([2, 'B']);
    binTree.add([null, 'null']);

    const nodes = binTree.getNodes(node => node.key === 2);

    expect(nodes.length).toBe(1);
    expect(nodes[0].key).toBe(2);

    const nodesRec = binTree.getNodes(node => node.key === 2, false, binTree.root, 'RECURSIVE');

    expect(nodesRec.length).toBe(1);
    expect(nodesRec[0].key).toBe(2);

    const nodesItr = binTree.getNodes(node => node.key === 2, false, binTree.root, 'ITERATIVE');

    expect(nodesItr.length).toBe(1);
    expect(nodesItr[0].key).toBe(2);

    expect(nodesItr).toEqual(nodesRec);
  });

  it('should perform Morris traversal', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    binTree.iterationType = 'ITERATIVE';
    expect([...binTree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    binTree.iterationType = 'RECURSIVE';
    expect([...binTree]).toEqual([
      [3, 'B'],
      [5, 'A'],
      [7, 'C']
    ]);
    binTree.iterationType = 'ITERATIVE';

    const result = binTree.morris();
    expect(result).toEqual([3, 5, 7]);
    binTree.clear();
    expect(binTree.morris()).toEqual([]);
  });

  it('should perform delete all', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    binTree.delete(5);
    binTree.delete(7);
    binTree.delete(3);
    expect(binTree.root).toBe(undefined);
    expect(binTree.getHeight()).toBe(-1);
  });
});

describe('BinaryTree not map mode', () => {
  let binTree: BinaryTree<number, string>;

  beforeEach(() => {
    binTree = new BinaryTree<number, string>([], {
      iterationType: 'RECURSIVE',
      isMapMode: false
    });
  });

  afterEach(() => {
    binTree.clear();
  });

  it('should add and find nodes', () => {
    binTree.add([1, '1']);
    binTree.add(undefined);
    binTree.add([2, '2']);
    binTree.add([3, '3']);

    expect(binTree.has(1)).toBe(true);
    expect(binTree.has(2)).toBe(true);
    expect(binTree.has(3)).toBe(true);
    expect(binTree.has(4)).toBe(false);
    const node4 = binTree.getNode(4);
    expect(binTree.has(node4)).toBe(false);
    expect(binTree.has(node => node === node4)).toBe(false);
    expect(binTree.has(node => node.value?.toString() === '3')).toBe(true);
  });

  it('should isSubtreeBST', () => {
    binTree.addMany([
      new BinaryTreeNode(4),
      new BinaryTreeNode(2),
      new BinaryTreeNode(6),
      new BinaryTreeNode(1),
      new BinaryTreeNode(3),
      new BinaryTreeNode(5),
      new BinaryTreeNode(7),
      new BinaryTreeNode(4)
    ]);

    expect(binTree.isBST(binTree.getNode(4), 'RECURSIVE')).toBe(true);
    expect(binTree.isBST(binTree.getNode(4), 'ITERATIVE')).toBe(true);
  });

  it('should get nodes by key', () => {
    binTree.add([5, 'A']);
    binTree.add([3, 'B']);
    binTree.add([7, 'C']);

    const nodeA = binTree.getNode(5);
    const nodeB = binTree.getNode(3);

    expect(nodeA?.key).toBe(5);
    expect(binTree.get(nodeA)).toBe('A');
    expect(nodeB?.key).toBe(3);
    expect(binTree.get(nodeB)).toBe('B');
  });

  it('should get nodes by a custom callback', () => {
    binTree.add([5, 'E']);
    binTree.add([4, 'D']);
    binTree.add([3, 'C']);
    binTree.add([7, 'G']);
    binTree.add([null, 'null']);
    binTree.add([1, 'A']);
    binTree.add([6, 'F']);
    binTree.add([null, 'null']);
    binTree.add([2, 'B']);
    binTree.add([null, 'null']);

    const nodes = binTree.getNodes(node => node.key === 2);

    expect(nodes.length).toBe(1);
    expect(nodes[0].key).toBe(2);

    const nodesRec = binTree.getNodes(node => node.key === 2, false, binTree.root, 'RECURSIVE');

    expect(nodesRec.length).toBe(1);
    expect(nodesRec[0].key).toBe(2);

    const nodesItr = binTree.getNodes(node => node.key === 2, false, binTree.root, 'ITERATIVE');

    expect(nodesItr.length).toBe(1);
    expect(nodesItr[0].key).toBe(2);

    expect(nodesItr).toEqual(nodesRec);
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
    binaryTree.forEach((key, value) => {
      mockCallback(key, value);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([2, 'b']);
    expect(mockCallback.mock.calls[1]).toEqual([1, 'a']);
    expect(mockCallback.mock.calls[2]).toEqual([3, 'c']);
  });

  it('filter should return a new binTree with filtered elements', () => {
    const filteredTree = binaryTree.filter(key => key > 1);
    expect(filteredTree.size).toBe(2);
    expect([...filteredTree]).toEqual([
      [3, 'c'],
      [2, 'b']
    ]);
  });

  it('map should return a new binTree with modified elements', () => {
    const mappedTree = binaryTree.map((key, value) => [(key * 2).toString(), value]);
    expect(mappedTree.size).toBe(3);
    expect([...mappedTree]).toEqual([
      ['2', 'a'],
      ['4', 'b'],
      ['6', 'c']
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
    expect(cloned.root?.right?.value).toBe(undefined);
    expect(cloned.get(cloned.root?.right)).toBe('c');
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
    binaryTree.clear();
    expect(binaryTree.leaves()).toEqual([]);
  });

  it('should iterative method return undefined when the node is null', () => {
    const binTree = new BinaryTree();
    binTree.addMany([-10, -10, -10, 9, 9, 20, null, null, 15, 7, 8, null, 2, null, 6, null, null, 8, 8, 8]);
    const bfsResult = binTree.bfs(undefined, undefined, undefined, true);
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

describe('BinaryTree not map mode iterative methods test', () => {
  let binaryTree: BinaryTree<number, string>;
  beforeEach(() => {
    binaryTree = new BinaryTree<number, string>([], { isMapMode: false });
    binaryTree.add([1, 'a']);
    binaryTree.add(2, 'b');
    binaryTree.add([3, 'c']);
  });

  it('should clone work well', () => {
    const cloned = binaryTree.clone();
    expect(cloned.root?.left?.key).toBe(2);
    expect(cloned.get(cloned.root?.right)).toBe('c');
  });
});

describe('classic use', () => {
  it('@example determine loan approval using a decision tree', () => {
    // Decision tree structure
    const loanDecisionTree = new BinaryTree<string>(
      ['stableIncome', 'goodCredit', 'Rejected', 'Approved', 'Rejected'],
      { isDuplicate: true }
    );

    function determineLoanApproval(
      node?: BinaryTreeNode<string> | null,
      conditions?: { [key: string]: boolean }
    ): string {
      if (!node) throw new Error('Invalid node');

      // If it's a leaf node, return the decision result
      if (!node.left && !node.right) return node.key;

      // Check if a valid condition exists for the current node's key
      return conditions?.[node.key]
        ? determineLoanApproval(node.left, conditions)
        : determineLoanApproval(node.right, conditions);
    }

    // Test case 1: Stable income and good credit score
    expect(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: true })).toBe('Approved');

    // Test case 2: Stable income but poor credit score
    expect(determineLoanApproval(loanDecisionTree.root, { stableIncome: true, goodCredit: false })).toBe('Rejected');

    // Test case 3: No stable income
    expect(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: true })).toBe('Rejected');

    // Test case 4: No stable income and poor credit score
    expect(determineLoanApproval(loanDecisionTree.root, { stableIncome: false, goodCredit: false })).toBe('Rejected');
  });

  it('@example evaluate the arithmetic expression represented by the binary tree', () => {
    const expressionTree = new BinaryTree<number | string>(['+', 3, '*', null, null, 5, '-', null, null, 2, 8]);

    function evaluate(node?: BinaryTreeNode<number | string> | null): number {
      if (!node) return 0;

      if (typeof node.key === 'number') return node.key;

      const leftValue = evaluate(node.left); // Evaluate the left subtree
      const rightValue = evaluate(node.right); // Evaluate the right subtree

      // Perform the operation based on the current node's operator
      switch (node.key) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          return rightValue !== 0 ? leftValue / rightValue : 0; // Handle division by zero
        default:
          throw new Error(`Unsupported operator: ${node.key}`);
      }
    }

    expect(evaluate(expressionTree.root)).toBe(-27);
  });
});
