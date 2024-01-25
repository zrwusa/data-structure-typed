import { AVLTree } from 'data-structure-typed';

describe('AVL Tree Test from data-structure-typed', () => {
  it('should perform various operations on a AVL Tree from data-structure-typed', () => {
    const keys = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree<number>();

    for (const i of keys) tree.add([i, i]);

    const node6 = tree.get(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getValueById = tree.get(10);
    expect(getValueById).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot?.key).toBe(1);

    const node15 = tree.getNode(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    let subTreeSum = 0;
    node15 && tree.dfs(node => (subTreeSum += node.key), 'PRE', 15);
    expect(subTreeSum).toBe(70);

    let lesserSum = 0;
    tree.lesserOrGreaterTraverse(node => (lesserSum += node.key), -1, 10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.value).toBe(15);

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
