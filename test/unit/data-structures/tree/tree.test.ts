import { TreeNode } from '../../../../src';

describe('TreeNode', () => {
  it('should create a tree node with key and value', () => {
    const node = new TreeNode<string>('root', 'RootValue');
    expect(node.key).toBe('root');
    expect(node.value).toBe('RootValue');
    expect(node.children).toEqual(undefined);
  });

  it('should allow setting and getting key and value', () => {
    const node = new TreeNode<string>('node1', 'Value1');
    node.key = 'newKey';
    node.value = 'newValue';
    expect(node.key).toBe('newKey');
    expect(node.value).toBe('newValue');
  });

  it('should add a single child node', () => {
    const parent = new TreeNode<string>('parent');
    const child = new TreeNode<string>('child', 'ChildValue');

    parent.addChildren(child);

    expect(parent.children).toHaveLength(1);
    expect(parent.children?.[0].key).toBe('child');
    expect(parent.children?.[0].value).toBe('ChildValue');
  });

  it('should add multiple children nodes', () => {
    const parent = new TreeNode<string>('parent');
    const child1 = new TreeNode<string>('child1');
    const child2 = new TreeNode<string>('child2');

    parent.addChildren([child1, child2]);

    expect(parent.children).toHaveLength(2);
    expect(parent.children?.[0].key).toBe('child1');
    expect(parent.children?.[1].key).toBe('child2');
    parent.children = [];

    expect(parent.children[0]).toBe(undefined);
    expect(parent.children[1]).toBe(undefined);
  });

  it('should calculate the correct height of the tree', () => {
    const root = new TreeNode<string>('root');
    const child1 = new TreeNode<string>('child1');
    const child2 = new TreeNode<string>('child2');
    const grandChild = new TreeNode<string>('grandChild');

    root.addChildren(child1);
    root.addChildren(child2);
    child1.addChildren(grandChild);

    expect(root.getHeight()).toBe(2); // root -> child1 -> grandChild (height = 2)
  });
});
