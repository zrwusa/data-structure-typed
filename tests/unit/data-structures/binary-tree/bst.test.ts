import {BST, BSTNode} from '../../../../src';

describe('BST operations test', () => {
    it('should perform various operations on a Binary Search Tree with numeric values', () => {
        const tree = new BST();
        expect(tree).toBeInstanceOf(BST);

        const values = [11, 3, 15, 1, 8, 13, 16, 2, 6, 9, 12, 14, 4, 7, 10, 5];
        tree.addMany(values);
        expect(tree.root).toBeInstanceOf(BSTNode);

        if (tree.root) expect(tree.root.id).toBe(11);

        expect(tree.count).toBe(16);

        expect(tree.has(6)).toBe(true);

        const node6 = tree.get(6);
        expect(node6 && tree.getHeight(node6)).toBe(2);
        expect(node6 && tree.getDepth(node6)).toBe(3);

        const nodeId10 = tree.get(10, 'id');
        expect(nodeId10?.id).toBe(10);

        const nodeVal9 = tree.get(9, 'val');
        expect(nodeVal9?.id).toBe(9);

        const nodesByCount1 = tree.getNodes(1, 'count');
        expect(nodesByCount1.length).toBe(16);

        const leftMost = tree.getLeftMost();
        expect(leftMost?.id).toBe(1);

        const node15 = tree.get(15);
        const minNodeBySpecificNode = node15 && tree.getLeftMost(node15);
        expect(minNodeBySpecificNode?.id).toBe(12);

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
            const allGreaterNodesAdded = tree.allGreaterNodesAdd(node11, 2, 'count');
            expect(allGreaterNodesAdded).toBeDefined();
        }

        const dfsInorderNodes = tree.DFS('in', 'node');
        expect(dfsInorderNodes[0].id).toBe(1);
        expect(dfsInorderNodes[dfsInorderNodes.length - 1].id).toBe(16);

        tree.balance();
        expect(tree.isBalanced()).toBe(true);

        const bfsNodesAfterBalanced = tree.BFS('node');
        expect(bfsNodesAfterBalanced[0].id).toBe(8);
        expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].id).toBe(16);

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


        expect(tree.isAVLBalanced()).toBe(false);

        const bfsIDs = tree.BFS();
        expect(bfsIDs[0]).toBe(2);
        expect(bfsIDs[1]).toBe(12);
        expect(bfsIDs[2]).toBe(16);

        const bfsNodes = tree.BFS('node');
        expect(bfsNodes[0].id).toBe(2);
        expect(bfsNodes[1].id).toBe(12);
        expect(bfsNodes[2].id).toBe(16);
    });

    it('should perform various operations on a Binary Search Tree with object values', () => {
        const objBST = new BST<BSTNode<{ id: number, keyA: number }>>({autoIncrementId: false});
        expect(objBST).toBeInstanceOf(BST);

        const values = [{id: 11, keyA: 11}, {id: 3, keyA: 3}, {id: 15, keyA: 15}, {id: 1, keyA: 1}, {
            id: 8,
            keyA: 8
        }, {id: 13, keyA: 13}, {id: 16, keyA: 16}, {id: 2, keyA: 2}, {id: 6, keyA: 6}, {id: 9, keyA: 9}, {
            id: 12,
            keyA: 12
        }, {id: 14, keyA: 14}, {id: 4, keyA: 4}, {id: 7, keyA: 7}, {id: 10, keyA: 10}, {id: 5, keyA: 5}];

        objBST.addMany(values);

        expect(objBST.root).toBeInstanceOf(BSTNode);

        if (objBST.root) expect(objBST.root.id).toBe(11);

        expect(objBST.count).toBe(16);

        expect(objBST.has(6)).toBe(true);

        const node6 = objBST.get(6);
        expect(node6 && objBST.getHeight(node6)).toBe(2);
        expect(node6 && objBST.getDepth(node6)).toBe(3);

        const nodeId10 = objBST.get(10, 'id');
        expect(nodeId10?.id).toBe(10);

        const nodeVal9 = objBST.get(9, 'id');
        expect(nodeVal9?.id).toBe(9);

        const nodesByCount1 = objBST.getNodes(1, 'count');
        expect(nodesByCount1.length).toBe(16);

        const leftMost = objBST.getLeftMost();
        expect(leftMost?.id).toBe(1);

        const node15 = objBST.get(15);
        expect(node15?.val).toEqual({id: 15, keyA: 15});
        const minNodeBySpecificNode = node15 && objBST.getLeftMost(node15);
        expect(minNodeBySpecificNode?.id).toBe(12);

        const subTreeSum = node15 && objBST.subTreeSum(node15);
        expect(subTreeSum).toBe(70);

        const lesserSum = objBST.lesserSum(10);
        expect(lesserSum).toBe(45);

        expect(node15).toBeInstanceOf(BSTNode);
        if (node15 instanceof BSTNode) {
            const subTreeAdd = objBST.subTreeAdd(node15, 1, 'count');
            expect(subTreeAdd).toBeDefined();
        }

        const node11 = objBST.get(11);
        expect(node11).toBeInstanceOf(BSTNode);
        if (node11 instanceof BSTNode) {
            const allGreaterNodesAdded = objBST.allGreaterNodesAdd(node11, 2, 'count');
            expect(allGreaterNodesAdded).toBeDefined();
        }

        const dfsInorderNodes = objBST.DFS('in', 'node');
        expect(dfsInorderNodes[0].id).toBe(1);
        expect(dfsInorderNodes[dfsInorderNodes.length - 1].id).toBe(16);

        objBST.balance();
        expect(objBST.isBalanced()).toBe(true);

        const bfsNodesAfterBalanced = objBST.BFS('node');
        expect(bfsNodesAfterBalanced[0].id).toBe(8);
        expect(bfsNodesAfterBalanced[bfsNodesAfterBalanced.length - 1].id).toBe(16);

        const removed11 = objBST.remove(11, true);
        expect(removed11).toBeInstanceOf(Array);
        expect(removed11[0]).toBeDefined();
        expect(removed11[0].deleted).toBeDefined();

        if (removed11[0].deleted) expect(removed11[0].deleted.id).toBe(11);

        expect(objBST.isAVLBalanced()).toBe(true);

        expect(node15 && objBST.getHeight(node15)).toBe(2);

        const removed1 = objBST.remove(1, true);
        expect(removed1).toBeInstanceOf(Array);
        expect(removed1[0]).toBeDefined();
        expect(removed1[0].deleted).toBeDefined();
        if (removed1[0].deleted) expect(removed1[0].deleted.id).toBe(1);

        expect(objBST.isAVLBalanced()).toBe(true);

        expect(objBST.getHeight()).toBe(4);

        const removed4 = objBST.remove(4, true);
        expect(removed4).toBeInstanceOf(Array);
        expect(removed4[0]).toBeDefined();
        expect(removed4[0].deleted).toBeDefined();
        if (removed4[0].deleted) expect(removed4[0].deleted.id).toBe(4);
        expect(objBST.isAVLBalanced()).toBe(true);
        expect(objBST.getHeight()).toBe(4);

        const removed10 = objBST.remove(10, true);
        expect(removed10).toBeInstanceOf(Array);
        expect(removed10[0]).toBeDefined();
        expect(removed10[0].deleted).toBeDefined();
        if (removed10[0].deleted) expect(removed10[0].deleted.id).toBe(10);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(4);

        const removed15 = objBST.remove(15, true);
        expect(removed15).toBeInstanceOf(Array);
        expect(removed15[0]).toBeDefined();
        expect(removed15[0].deleted).toBeDefined();
        if (removed15[0].deleted) expect(removed15[0].deleted.id).toBe(15);

        expect(objBST.isAVLBalanced()).toBe(true);
        expect(objBST.getHeight()).toBe(3);

        const removed5 = objBST.remove(5, true);
        expect(removed5).toBeInstanceOf(Array);
        expect(removed5[0]).toBeDefined();
        expect(removed5[0].deleted).toBeDefined();
        if (removed5[0].deleted) expect(removed5[0].deleted.id).toBe(5);

        expect(objBST.isAVLBalanced()).toBe(true);
        expect(objBST.getHeight()).toBe(3);

        const removed13 = objBST.remove(13, true);
        expect(removed13).toBeInstanceOf(Array);
        expect(removed13[0]).toBeDefined();
        expect(removed13[0].deleted).toBeDefined();
        if (removed13[0].deleted) expect(removed13[0].deleted.id).toBe(13);
        expect(objBST.isAVLBalanced()).toBe(true);
        expect(objBST.getHeight()).toBe(3);

        const removed3 = objBST.remove(3, true);
        expect(removed3).toBeInstanceOf(Array);
        expect(removed3[0]).toBeDefined();
        expect(removed3[0].deleted).toBeDefined();
        if (removed3[0].deleted) expect(removed3[0].deleted.id).toBe(3);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(3);

        const removed8 = objBST.remove(8, true);
        expect(removed8).toBeInstanceOf(Array);
        expect(removed8[0]).toBeDefined();
        expect(removed8[0].deleted).toBeDefined();
        if (removed8[0].deleted) expect(removed8[0].deleted.id).toBe(8);
        expect(objBST.isAVLBalanced()).toBe(true);
        expect(objBST.getHeight()).toBe(3);

        const removed6 = objBST.remove(6, true);
        expect(removed6).toBeInstanceOf(Array);
        expect(removed6[0]).toBeDefined();
        expect(removed6[0].deleted).toBeDefined();
        if (removed6[0].deleted) expect(removed6[0].deleted.id).toBe(6);
        expect(objBST.remove(6, true).length).toBe(0);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(3);

        const removed7 = objBST.remove(7, true);
        expect(removed7).toBeInstanceOf(Array);
        expect(removed7[0]).toBeDefined();
        expect(removed7[0].deleted).toBeDefined();
        if (removed7[0].deleted) expect(removed7[0].deleted.id).toBe(7);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(3);

        const removed9 = objBST.remove(9, true);
        expect(removed9).toBeInstanceOf(Array);
        expect(removed9[0]).toBeDefined();
        expect(removed9[0].deleted).toBeDefined();
        if (removed9[0].deleted) expect(removed9[0].deleted.id).toBe(9);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(3);

        const removed14 = objBST.remove(14, true);
        expect(removed14).toBeInstanceOf(Array);
        expect(removed14[0]).toBeDefined();
        expect(removed14[0].deleted).toBeDefined();
        if (removed14[0].deleted) expect(removed14[0].deleted.id).toBe(14);
        expect(objBST.isAVLBalanced()).toBe(false);
        expect(objBST.getHeight()).toBe(2);


        expect(objBST.isAVLBalanced()).toBe(false);

        const bfsIDs = objBST.BFS();
        expect(bfsIDs[0]).toBe(2);
        expect(bfsIDs[1]).toBe(12);
        expect(bfsIDs[2]).toBe(16);

        const bfsNodes = objBST.BFS('node');
        expect(bfsNodes[0].id).toBe(2);
        expect(bfsNodes[1].id).toBe(12);
        expect(bfsNodes[2].id).toBe(16);
    });
});
