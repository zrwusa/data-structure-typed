import {TreeNode} from '../../../../src';

describe('TreeNode', () => {
  it('should create a TreeNode with the given key and value', () => {
    const node = new TreeNode<string>('1', 'Node 1');
    expect(node.key).toBe('1');
    expect(node.value).toBe('Node 1');
    expect(node.children).toEqual([]);
  });

  it('should add children to the TreeNode', () => {
    const parentNode = new TreeNode<string>('1', 'Parent Node');
    const child1 = new TreeNode<string>('2', 'Child 1');
    const child2 = new TreeNode<string>('3', 'Child 2');

    parentNode.addChildren([child1, child2]);

    expect(parentNode.children).toEqual([child1, child2]);
  });

  it('should calculate the height of the tree correctly', () => {
    const rootNode = new TreeNode<string>('1', 'Root Node');
    const child1 = new TreeNode<string>('2', 'Child 1');
    const child2 = new TreeNode<string>('3', 'Child 2');
    const grandchild1 = new TreeNode<string>('4', 'Grandchild 1');
    const grandchild2 = new TreeNode<string>('5', 'Grandchild 2');

    rootNode.addChildren([child1, child2]);
    child1.addChildren([grandchild1]);
    child2.addChildren([grandchild2]);

    expect(rootNode.getHeight()).toBe(2); // Height of the tree should be 2
  });

  it('should handle nodes without children when calculating height', () => {
    const rootNode = new TreeNode<string>('1', 'Root Node');
    expect(rootNode.getHeight()).toBe(0); // Height of a single node should be 0
  });
});
