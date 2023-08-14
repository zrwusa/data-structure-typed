import {BST, BSTNode} from '../../../../src';

describe('bst-case6', () => {
    it('should perform various operations on a Binary Search Tree', () => {
        const arr = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];

        const tree = new BST();

        expect(tree).toBeInstanceOf(BST);

        tree.addMany(arr);

        expect(tree.root).toBeInstanceOf(BSTNode);
        if (tree.root) expect(tree.root.id).toBe(11);
        expect(tree.count).toBe(16);
        expect(tree.has(6)).toBe(true);

        const node6 = tree.get(6);
        expect(node6 && tree.getHeight(node6)).toBe(2);
        expect(node6 && tree.getDepth(node6)).toBe(3);
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

        expect(node15).toBeInstanceOf(BSTNode);
        if (node15 instanceof BSTNode) {
            const subTreeAdd = tree.subTreeAdd(node15, 1, 'count');
            expect(subTreeAdd).toBeDefined();
        }


        const node11 = tree.get(11);
        expect(node11).toBeInstanceOf(BSTNode);
        if (node11 instanceof BSTNode) {
            const allGreaterNodesAdd = tree.allGreaterNodesAdd(node11, 2, 'count');
            expect(allGreaterNodesAdd).toBeDefined();
        }

        const dfs = tree.DFS('in', 'node');
        expect(dfs[0].id).toBe(1);
        expect(dfs[dfs.length - 1].id).toBe(16);

        tree.balance();
        const bfs = tree.BFS('node');
        expect(tree.isBalanced()).toBe(true);
        expect(bfs[0].id).toBe(8);
        expect(bfs[bfs.length - 1].id).toBe(16);

        const removed11 = tree.remove(11, true);
        expect(removed11).toBeInstanceOf(Array);
        expect(removed11[0]).toBeDefined();
        expect(removed11[0].deleted).toBeDefined();
        if (removed11[0].deleted) expect(removed11[0].deleted.id).toBe(11);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(node15 && tree.getHeight(node15)).toBe(2);

        const removed1 = tree.remove(1, true);
        expect(removed1).toBeInstanceOf(Array);
        expect(removed1[0]).toBeDefined();
        expect(removed1[0].deleted).toBeDefined();
        if (removed1[0].deleted) expect(removed1[0].deleted.id).toBe(1);

        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(4);

        const removed4 = tree.remove(4, true);
        expect(removed4).toBeInstanceOf(Array);
        expect(removed4[0]).toBeDefined();
        expect(removed4[0].deleted).toBeDefined();
        if (removed4[0].deleted) expect(removed4[0].deleted.id).toBe(4);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(4);

        const removed10 = tree.remove(10, true);
        expect(removed10).toBeInstanceOf(Array);
        expect(removed10[0]).toBeDefined();
        expect(removed10[0].deleted).toBeDefined();
        if (removed10[0].deleted) expect(removed10[0].deleted.id).toBe(10);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(4);

        const removed15 = tree.remove(15, true);
        expect(removed15).toBeInstanceOf(Array);
        expect(removed15[0]).toBeDefined();
        expect(removed15[0].deleted).toBeDefined();
        if (removed15[0].deleted) expect(removed15[0].deleted.id).toBe(15);

        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        const removed5 = tree.remove(5, true);
        expect(removed5).toBeInstanceOf(Array);
        expect(removed5[0]).toBeDefined();
        expect(removed5[0].deleted).toBeDefined();
        if (removed5[0].deleted) expect(removed5[0].deleted.id).toBe(5);

        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        const removed13 = tree.remove(13, true);
        expect(removed13).toBeInstanceOf(Array);
        expect(removed13[0]).toBeDefined();
        expect(removed13[0].deleted).toBeDefined();
        if (removed13[0].deleted) expect(removed13[0].deleted.id).toBe(13);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        const removed3 = tree.remove(3, true);
        expect(removed3).toBeInstanceOf(Array);
        expect(removed3[0]).toBeDefined();
        expect(removed3[0].deleted).toBeDefined();
        if (removed3[0].deleted) expect(removed3[0].deleted.id).toBe(3);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(3);

        const removed8 = tree.remove(8, true);
        expect(removed8).toBeInstanceOf(Array);
        expect(removed8[0]).toBeDefined();
        expect(removed8[0].deleted).toBeDefined();
        if (removed8[0].deleted) expect(removed8[0].deleted.id).toBe(8);
        expect(tree.isAVLBalanced()).toBe(true);
        expect(tree.getHeight()).toBe(3);

        const removed6 = tree.remove(6, true);
        expect(removed6).toBeInstanceOf(Array);
        expect(removed6[0]).toBeDefined();
        expect(removed6[0].deleted).toBeDefined();
        if (removed6[0].deleted) expect(removed6[0].deleted.id).toBe(6);
        expect(tree.remove(6, true).length).toBe(0);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(3);

        const removed7 = tree.remove(7, true);
        expect(removed7).toBeInstanceOf(Array);
        expect(removed7[0]).toBeDefined();
        expect(removed7[0].deleted).toBeDefined();
        if (removed7[0].deleted) expect(removed7[0].deleted.id).toBe(7);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(3);

        const removed9 = tree.remove(9, true);
        expect(removed9).toBeInstanceOf(Array);
        expect(removed9[0]).toBeDefined();
        expect(removed9[0].deleted).toBeDefined();
        if (removed9[0].deleted) expect(removed9[0].deleted.id).toBe(9);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(3);

        const removed14 = tree.remove(14, true);
        expect(removed14).toBeInstanceOf(Array);
        expect(removed14[0]).toBeDefined();
        expect(removed14[0].deleted).toBeDefined();
        if (removed14[0].deleted) expect(removed14[0].deleted.id).toBe(14);
        expect(tree.isAVLBalanced()).toBe(false);
        expect(tree.getHeight()).toBe(2);


        expect(!tree.isAVLBalanced()).toBe(true);

        const lastBFSIds = tree.BFS();
        expect(lastBFSIds[0]).toBe(2);
        expect(lastBFSIds[1]).toBe(12);
        expect(lastBFSIds[2]).toBe(16);

        const lastBFSNodes = tree.BFS('node');
        expect(lastBFSNodes[0].id).toBe(2);
        expect(lastBFSNodes[1].id).toBe(12);
        expect(lastBFSNodes[2].id).toBe(16);
    });
});
