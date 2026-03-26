import { TreeNode } from '../../../../src';

describe('TreeNode remaining branch coverage', () => {
  it('constructor assigns children when provided (covers if(children) branch)', () => {
    const child = new TreeNode('c');
    const root = new TreeNode('r', undefined, [child]);
    expect(root.children).toEqual([child]);
  });
});
