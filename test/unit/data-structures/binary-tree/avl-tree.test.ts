import {AVLTree, AVLTreeNode, CP, IterationType} from '../../../../src';

describe('AVL Tree Test', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>();

    for (const i of arr) tree.add(i, i);

    tree.add(null);
    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot?.key).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && tree.subTreeTraverse(node => (subTreeSum += node.key), node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), CP.lt, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(15);

    const dfs = tree.dfs(node => node, 'in');
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
});

describe('AVL Tree Test recursively', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>({iterationType: IterationType.RECURSIVE});

    for (const i of arr) tree.add(i, i);

    const node6 = tree.getNode(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.getNode(10);
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot?.key).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && tree.subTreeTraverse(node => (subTreeSum += node.key), node15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), CP.lt, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(15);

    const dfs = tree.dfs(node => node, 'in');
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
  const avl = new AVLTree<{id: number; text: string}>();
  beforeEach(() => {
    avl.clear();
  });

  it('add', () => {
    avl.add(1);
    const node2 = new AVLTreeNode(2);
    avl.add(node2);
    const node3 = new AVLTreeNode(3, {id: 3, text: 'text3'});
    avl.add(node3);
    avl.add(node3, {id: 3, text: 'text33'});

    const bfsRes = avl.bfs(node => node.key);
    expect(bfsRes[0]).toBe(2);
  });
});

describe('AVLTree', () => {
  it('should balance the tree using _balanceLR when nodes are added', () => {
    const avlTree = new AVLTree();
    avlTree.add(10, 'A');
    avlTree.add(5, 'B');
    avlTree.add(15, 'C');
    avlTree.add(3, 'D');
    avlTree.add(7, 'E');

    // Adding nodes to trigger _balanceLR
    avlTree.add(12, 'F');

    // You can add more specific assertions to check the tree's balance and structure.
  });

  it('should balance the tree using _balanceLR when nodes are deleted', () => {
    const avlTree = new AVLTree();
    avlTree.add(10, 'A');
    avlTree.add(5, 'B');
    avlTree.add(15, 'C');
    avlTree.add(3, 'D');
    avlTree.add(7, 'E');
    avlTree.add(12, 'F');

    // Deleting nodes to trigger _balanceLR
    avlTree.delete(3);

    // You can add more specific assertions to check the tree's balance and structure.
  });

  describe('BinaryTree APIs test', () => {
    const avl = new AVLTree<{id: number; text: string}>();
    beforeEach(() => {
      avl.clear();
    });

    it('add', () => {
      avl.add(1);
      const node2 = new AVLTreeNode(2);
      avl.add(node2);
      const node3 = new AVLTreeNode(3, {id: 3, text: 'text3'});
      avl.add(node3);
      avl.add(node3, {id: 3, text: 'text33'});

      const bfsRes = avl.bfs(node => node);
      expect(bfsRes[0]?.key).toBe(2);
    });
  });

});
