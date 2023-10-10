import {AVLTree} from '../../../../src';

describe('AVL Tree Test', () => {
  it('should perform various operations on a AVL Tree', () => {
    const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
    const tree = new AVLTree();

    for (const i of arr) tree.add(i, i);

    const node6 = tree.get(6);

    expect(node6 && tree.getHeight(node6)).toBe(3);
    expect(node6 && tree.getDepth(node6)).toBe(1);

    const getNodeById = tree.get(10, 'key');
    expect(getNodeById?.key).toBe(10);

    const getMinNodeByRoot = tree.getLeftMost();
    expect(getMinNodeByRoot?.key).toBe(1);

    const node15 = tree.get(15);
    const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node15);
    expect(getMinNodeBySpecificNode?.key).toBe(12);

    const subTreeSum = node15 && tree.subTreeSum(node15);
    expect(subTreeSum).toBe(70);

    const lesserSum = tree.lesserSum(10);
    expect(lesserSum).toBe(45);

    // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
    expect(node15?.val).toBe(15);

    const dfs = tree.dfs('in', 'node');
    expect(dfs[0].key).toBe(1);
    expect(dfs[dfs.length - 1].key).toBe(16);

    tree.perfectlyBalance();
    const bfs = tree.bfs('node');
    expect(tree.isPerfectlyBalanced()).toBe(true);
    expect(bfs[0].key).toBe(8);
    expect(bfs[bfs.length - 1].key).toBe(16);

    expect(tree.remove(11)[0].deleted?.key).toBe(11);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(node15 && tree.getHeight(node15)).toBe(2);

    expect(tree.remove(1)[0].deleted?.key).toBe(1);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.remove(4)[0].deleted?.key).toBe(4);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(4);

    expect(tree.remove(10)[0].deleted?.key).toBe(10);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(15)[0].deleted?.key).toBe(15);
    expect(tree.isAVLBalanced()).toBe(true);

    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(5)[0].deleted?.key).toBe(5);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(13)[0].deleted?.key).toBe(13);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(3)[0].deleted?.key).toBe(3);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(8)[0].deleted?.key).toBe(8);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(3);

    expect(tree.remove(6)[0].deleted?.key).toBe(6);
    expect(tree.remove(6).length).toBe(0);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.remove(7)[0].deleted?.key).toBe(7);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);

    expect(tree.remove(9)[0].deleted?.key).toBe(9);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(2);
    expect(tree.remove(14)[0].deleted?.key).toBe(14);
    expect(tree.isAVLBalanced()).toBe(true);
    expect(tree.getHeight()).toBe(1);

    expect(tree.isAVLBalanced()).toBe(true);
    const lastBFSIds = tree.bfs();
    expect(lastBFSIds[0]).toBe(12);
    expect(lastBFSIds[1]).toBe(2);
    expect(lastBFSIds[2]).toBe(16);

    const lastBFSNodes = tree.bfs('node');
    expect(lastBFSNodes[0].key).toBe(12);
    expect(lastBFSNodes[1].key).toBe(2);
    expect(lastBFSNodes[2].key).toBe(16);
  });
});
