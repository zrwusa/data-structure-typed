import type {BinaryTreeNodeId, BinaryTreeNodePropertyName, BSTComparator, BSTDeletedResult} from '../types';
import {BinaryTree, BinaryTreeNode, FamilyPosition, LoopType,} from './binary-tree';

export enum CP {lt = -1, eq = 0, gt = 1}

export class BSTNode<T> extends BinaryTreeNode<T> {
    override clone(): BSTNode<T> {
        return new BSTNode<T>(this.id, this.val, this.count);
    }
}

export class BST<T> extends BinaryTree<T> {
    constructor(options?: {
        comparator?: BSTComparator,
        loopType?: LoopType
    }) {
        super(options);
        if (options !== undefined) {
            const {comparator} = options;
            if (comparator !== undefined) {
                this._comparator = comparator;
            }
        }
    }

    override createNode(id: BinaryTreeNodeId, val: T | null, count?: number): BSTNode<T> | null {
        return val !== null ? new BSTNode<T>(id, val, count) : null;
    }

    override put(id: BinaryTreeNodeId, val: T | null, count: number = 1): BSTNode<T> | null {
        let inserted: BSTNode<T> | null = null;
        const newNode = this.createNode(id, val, count);
        if (this.root === null) {
            this.root = newNode;
            this.size++;
            this.count += newNode?.count ?? 1;
            inserted = (this.root);
        } else {
            let cur = this.root;
            let traversing = true;
            while (traversing) {
                if (cur !== null && newNode !== null) {
                    if (this._compare(cur.id, id) === CP.eq) {
                        if (newNode) {
                            cur.count += newNode.count;
                            this.count += newNode.count;
                            cur.val = newNode.val;
                        }
                        //Duplicates are not accepted.
                        traversing = false;
                        inserted = cur;
                    } else if (this._compare(cur.id, id) === CP.gt) {
                        // Traverse left of the node
                        if (cur.left === undefined) {
                            if (newNode) {
                                newNode.parent = cur;
                                newNode.familyPosition = FamilyPosition.left;
                            }
                            //Add to the left of the current node
                            cur.left = newNode;
                            this.size++;
                            this.count += newNode.count;
                            traversing = false;
                            inserted = cur.left;
                        } else {
                            //Traverse the left of the current node
                            if (cur.left) cur = cur.left;
                        }
                    } else if (this._compare(cur.id, id) === CP.lt) {
                        // Traverse right of the node
                        if (cur.right === undefined) {
                            if (newNode) {
                                newNode.parent = cur;
                                newNode.familyPosition = FamilyPosition.right;
                            }
                            //Add to the right of the current node
                            cur.right = newNode;
                            this.size++;
                            this.count += newNode.count;
                            traversing = false;
                            inserted = (cur.right);
                        } else {
                            //Traverse the left of the current node
                            if (cur.right) cur = cur.right;
                        }
                    }
                } else {
                    traversing = false;
                }
            }
        }
        return inserted;
    }

    override get(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName): BSTNode<T> | null {
        propertyName = propertyName ?? 'id';
        return this.getNodes(nodeProperty, propertyName, true)[0] ?? null;
    }

    lastKey() {
        if (this._compare(0, 1) === CP.lt) return this.getRightMost()?.id ?? 0;
        else if (this._compare(0, 1) === CP.gt) return this.getLeftMost()?.id ?? 0;
        else return this.getRightMost()?.id ?? 0;
    }

    override remove(id: BinaryTreeNodeId, ignoreCount?: boolean): BSTDeletedResult<T>[] {
        const bstDeletedResult: BSTDeletedResult<T>[] = [];

        if (!this.root) return bstDeletedResult;

        const curr: BSTNode<T> | null = this.get(id);
        if (!curr) return bstDeletedResult;

        const parent: BSTNode<T> | null = curr?.parent ? curr.parent : null;
        let needBalanced: BSTNode<T> | null = null, orgCurrent = curr;

        if (curr.count > 1 && !ignoreCount) {
            curr.count--;
            this.count--;
        } else {
            if (!curr.left) {
                if (!parent) {
                    if (curr.right !== undefined) this.root = curr.right;
                } else {
                    switch (curr.familyPosition) {
                        case FamilyPosition.left:
                            parent.left = curr.right;
                            break;
                        case FamilyPosition.right:
                            parent.right = curr.right;
                            break;
                    }
                    needBalanced = parent;
                }
            } else {
                const leftSubTreeMax = curr.left ? this.getRightMost(curr.left) : null;
                if (leftSubTreeMax) {
                    const parentOfLeftSubTreeMax = leftSubTreeMax.parent;
                    orgCurrent = curr.swapLocation(leftSubTreeMax);
                    if (parentOfLeftSubTreeMax) {
                        if (parentOfLeftSubTreeMax.right === leftSubTreeMax) parentOfLeftSubTreeMax.right = leftSubTreeMax.left;
                        else parentOfLeftSubTreeMax.left = leftSubTreeMax.left;
                        needBalanced = parentOfLeftSubTreeMax;
                    }
                }
            }
            this.size--;
            this.count -= curr.count;
        }

        bstDeletedResult.push({deleted: orgCurrent, needBalanced});
        return bstDeletedResult;
    }

    override getNodes(nodeProperty: BinaryTreeNodeId | T, propertyName ?: BinaryTreeNodePropertyName, onlyOne ?: boolean): BSTNode<T>[] {
        propertyName = propertyName ?? 'id';
        if (!this.root) return [];
        const result: BSTNode<T>[] = [];

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>) => {
                if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return;

                if (!cur.left && !cur.right) return;
                if (propertyName === 'id') {
                    if (this._compare(cur.id, nodeProperty as number) === CP.gt) cur.left && _traverse(cur.left);
                    if (this._compare(cur.id, nodeProperty as number) === CP.lt) cur.right && _traverse(cur.right);
                } else {
                    cur.left && _traverse(cur.left);
                    cur.right && _traverse(cur.right);
                }
            }

            _traverse(this.root);
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    if (this._pushByPropertyNameStopOrNot(cur, result, nodeProperty, propertyName, onlyOne)) return result;
                    if (propertyName === 'id') {
                        if (this._compare(cur.id, nodeProperty as number) === CP.gt) cur.left && queue.push(cur.left);
                        if (this._compare(cur.id, nodeProperty as number) === CP.lt) cur.right && queue.push(cur.right);
                    } else {
                        cur.left && queue.push(cur.left);
                        cur.right && queue.push(cur.right);
                    }
                }
            }
        }

        return result;
    }

    // --- start additional functions
    lesserSum(id: BinaryTreeNodeId, propertyName ?: BinaryTreeNodePropertyName): number {
        propertyName = propertyName ?? 'id';
        if (!this.root) return 0;

        const getSumByPropertyName = (cur: BSTNode<T>) => {
            let needSum: number;
            switch (propertyName) {
                case 'id':
                    needSum = cur.id;
                    break;
                case 'count':
                    needSum = cur.count;
                    break;
                default:
                    needSum = cur.id;
                    break;
            }
            return needSum;
        }

        let sum = 0;

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>): void => {
                const compared = this._compare(cur.id, id);
                if (compared === CP.eq) {
                    if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
                    return;
                } else if (compared === CP.lt) {
                    if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
                    sum += getSumByPropertyName(cur);
                    if (cur.right) _traverse(cur.right);
                    else return;
                } else {
                    if (cur.left) _traverse(cur.left);
                    else return;
                }
            };

            _traverse(this.root);
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const compared = this._compare(cur.id, id);
                    if (compared === CP.eq) {
                        if (cur.right) sum += this.subTreeSum(cur.right, propertyName);
                        return sum;
                    } else if (compared === CP.lt) { // todo maybe a bug
                        if (cur.left) sum += this.subTreeSum(cur.left, propertyName);
                        sum += getSumByPropertyName(cur);
                        if (cur.right) queue.push(cur.right);
                        else return sum;
                    } else {
                        if (cur.left) queue.push(cur.left);
                        else return sum;
                    }
                }
            }
        }

        return sum;
    }

    allGreaterNodesAdd(node: BSTNode<T>, delta: number, propertyName ?: BinaryTreeNodePropertyName): boolean {
        propertyName = propertyName ?? 'id';
        if (!this.root) return false;

        const _sumByPropertyName = (cur: BSTNode<T>) => {
            switch (propertyName) {
                case 'id':
                    cur.id += delta;
                    break;
                case 'count':
                    cur.count += delta;
                    break;
                default:
                    cur.id += delta;
                    break;
            }
        }

        if (this._loopType === LoopType.recursive) {
            const _traverse = (cur: BSTNode<T>) => {
                const compared = this._compare(cur.id, node.id);
                _sumByPropertyName(cur);

                if (!cur.left && !cur.right) return;
                if (cur.left && compared === CP.gt) _traverse(cur.left);
                else if (cur.right && compared === CP.gt) _traverse(cur.right);
            };

            _traverse(this.root);
            return true;
        } else {
            const queue: BSTNode<T>[] = [this.root];
            while (queue.length > 0) {
                const cur = queue.shift();
                if (cur) {
                    const compared = this._compare(cur.id, node.id);
                    _sumByPropertyName(cur);

                    if (cur.left && compared === CP.gt) queue.push(cur.left);
                    else if (cur.right && compared === CP.gt) queue.push(cur.right);
                }
            }
            return true;
        }
    }

    balance(): boolean {
        const sorted = this.DFS('in', 'node'), n = sorted.length;
        this.clear();

        if (sorted.length < 1) return false;
        if (this._loopType === LoopType.recursive) {
            const buildBalanceBST = (l: number, r: number) => {
                if (l > r) return;
                const m = l + Math.floor((r - l) / 2);
                const midNode = sorted[m];
                this.put(midNode.id, midNode.val, midNode.count);
                buildBalanceBST(l, m - 1);
                buildBalanceBST(m + 1, r);
            };

            buildBalanceBST(0, n - 1);
            return true;
        } else {
            const stack: [[number, number]] = [[0, n - 1]];
            while (stack.length > 0) {
                const popped = stack.pop();
                if (popped) {
                    const [l, r] = popped;
                    if (l <= r) {
                        const m = l + Math.floor((r - l) / 2);
                        const midNode = sorted[m];
                        this.put(midNode.id, midNode.val, midNode.count);
                        stack.push([m + 1, r]);
                        stack.push([l, m - 1]);
                    }
                }
            }
            return true;
        }
    }

    isAVLBalanced(): boolean {
        if (!this.root) return true;

        let balanced = true;

        if (this._loopType === LoopType.recursive) {
            const _height = (cur: BSTNode<T> | null | undefined): number => {
                if (!cur) return 0;
                const leftHeight = _height(cur.left), rightHeight = _height(cur.right);
                if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
                return Math.max(leftHeight, rightHeight) + 1;
            };
            _height(this.root);
        } else {
            const stack: BSTNode<T>[] = [];
            let node: BSTNode<T> | null | undefined = this.root, last: BSTNode<T> | null = null;
            const depths: Map<BSTNode<T>, number> = new Map();

            while (stack.length > 0 || node) {
                if (node) {
                    stack.push(node);
                    node = node.left;
                } else {
                    node = stack[stack.length - 1]
                    if (!node.right || last === node.right) {
                        node = stack.pop();
                        if (node) {
                            const left = node.left ? depths.get(node.left) ?? -1 : -1;
                            const right = node.right ? depths.get(node.right) ?? -1 : -1;
                            if (Math.abs(left - right) > 1) return false;
                            depths.set(node, 1 + Math.max(left, right));
                            last = node;
                            node = null;
                        }
                    } else node = node.right
                }
            }
        }

        return balanced;
    }

    protected _comparator: BSTComparator = (a, b) => a - b;

    protected _compare(a: BinaryTreeNodeId, b: BinaryTreeNodeId): CP {
        const compared = this._comparator(a, b);
        if (compared > 0) return CP.gt;
        else if (compared < 0) return CP.lt;
        else return CP.eq;
    }

    // --- end additional functions
}