import {AVLTree} from '../../../../src';

describe('AVL Tree Test', () => {
    it('should perform various operations on a AVL Tree', () => {

        const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
        const tree = new AVLTree();

        for (const i of arr) tree.add(i, i);

        const node6 = tree.get(6);

        expect(node6 && tree.getHeight(node6)).toBe(3);
        expect(node6 && tree.getDepth(node6)).toBe(1);

        const getNodeById = tree.get(10, 'id');
        expect(getNodeById?.id).toBe(10);

        const getNodesByCount = tree.getNodes(1, 'count');
        expect(getNodesByCount.length).toBe(16);

        const getMinNodeByRoot = tree.getLeftMost();
        expect(getMinNodeByRoot?.id).toBe(1);

        const node15 = tree.get(15);
        const getMinNodeBySpecificNode = node15 && tree.getLeftMost(node15);
        expect(getMinNodeBySpecificNode?.id).toBe(12);

        const subTreeSum = node15 && tree.subTreeSum(node15);
        expect(subTreeSum).toBe(70);

        const lesserSum = tree.lesserSum(10);
        expect(lesserSum).toBe(45);

        if (node15) {
            const subTreeAdd = tree.subTreeAdd(node15, 1, 'count');
            expect(subTreeAdd).toBe(true);
        }
        // node15 has type problem. After the uniform design, the generics of containers (DirectedGraph, BST) are based on the type of value. However, this design has a drawback: when I attempt to inherit from the Vertex or BSTNode classes, the types of the results obtained by all methods are those of the parent class.
        expect(node15?.val).toBe(15);

        const node11 = tree.get(11);
        if (node11) {
            const allGreaterNodesAdd = tree.allGreaterNodesAdd(node11, 2, 'count');
            expect(allGreaterNodesAdd).toBe(true);
        }

        const dfs = tree.DFS('in', 'node');
        expect(dfs[0].id).toBe(1);
        expect(dfs[dfs.length - 1].id).toBe(16);

        tree.balance();
        const bfs = tree.BFS('node');
        expect(tree.isBalanced()).toBe(true);
        expect(bfs[0].id).toBe(8);
        expect(bfs[bfs.length - 1].id).toBe(16);

        expect(tree.remove(11, true)[0].deleted?.id).toBe(11);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(node15 && tree.getHeight(node15)).toBe(2);

        expect(tree.remove(1, true)[0].deleted?.id).toBe(1);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(4);

        expect(tree.remove(4, true)[0].deleted?.id).toBe(4);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(4);

        expect(tree.remove(10, true)[0].deleted?.id).toBe(10);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(15, true)[0].deleted?.id).toBe(15);
        expect(tree.isAVLBalanced()).toBe(true);

        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(5, true)[0].deleted?.id).toBe(5);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(13, true)[0].deleted?.id).toBe(13);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(3, true)[0].deleted?.id).toBe(3);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(8, true)[0].deleted?.id).toBe(8);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        expect(tree.remove(6, true)[0].deleted?.id).toBe(6);
        expect(tree.remove(6, true).length).toBe(0);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(2);

        expect(tree.remove(7, true)[0].deleted?.id).toBe(7);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(2);

        expect(tree.remove(9, true)[0].deleted?.id).toBe(9);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(2);
        expect(tree.remove(14, true)[0].deleted?.id).toBe(14);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(1);

        expect(tree.isAVLBalanced()).toBe(true);
        const lastBFSIds = tree.BFS();
        expect(lastBFSIds[0]).toBe(12);
        expect(lastBFSIds[1]).toBe(2);
        expect(lastBFSIds[2]).toBe(16);

        const lastBFSNodes = tree.BFS('node');
        expect(lastBFSNodes[0].id).toBe(12);
        expect(lastBFSNodes[1].id).toBe(2);
        expect(lastBFSNodes[2].id).toBe(16);
    });
});
