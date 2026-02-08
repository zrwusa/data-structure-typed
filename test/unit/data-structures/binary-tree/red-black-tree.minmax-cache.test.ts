import { RedBlackTree } from '../../../../src';

/**
 * Regression tests for RedBlackTree min/max cache + boundary fast paths.
 * Focus: correctness when inserting monotonic keys and deleting boundary nodes.
 */

describe('RedBlackTree min/max cache regression', () => {
  it('should keep min/max correct across increasing inserts and boundary deletes', () => {
    const rb = new RedBlackTree<number, number>();

    for (let i = 0; i < 1000; i++) rb.set(i, i);

    // delete min repeatedly
    for (let i = 0; i < 250; i++) {
      rb.delete(i);
      const min = rb.getLeftMost(n => n, rb.root);
      expect(min?.key).toBe(i + 1);
    }

    // delete max repeatedly
    for (let i = 999; i >= 750; i--) {
      rb.delete(i);
      const max = rb.getRightMost(n => n, rb.root);
      expect(max?.key).toBe(i - 1);
    }
  });

  it('should reset min/max on clear and after deleting to empty', () => {
    const rb = new RedBlackTree<number, number>();
    rb.set(1, 1);
    rb.set(2, 2);

    rb.clear();
    expect(rb.size).toBe(0);
    expect(rb.getLeftMost(n => n, rb.root)).toBe(undefined);
    expect(rb.getRightMost(n => n, rb.root)).toBe(undefined);

    rb.set(10, 10);
    rb.delete(10);
    expect(rb.size).toBe(0);
    expect(rb.getLeftMost(n => n, rb.root)).toBe(undefined);
    expect(rb.getRightMost(n => n, rb.root)).toBe(undefined);
  });

  it('should keep min/max correct across decreasing inserts and boundary deletes', () => {
    const rb = new RedBlackTree<number, number>();

    for (let i = 1000; i >= 1; i--) rb.set(i, i);

    // delete min repeatedly
    for (let k = 1; k <= 250; k++) {
      rb.delete(k);
      const min = rb.getLeftMost(n => n, rb.root);
      expect(min?.key).toBe(k + 1);
    }

    // delete max repeatedly
    for (let k = 1000; k >= 751; k--) {
      rb.delete(k);
      const max = rb.getRightMost(n => n, rb.root);
      expect(max?.key).toBe(k - 1);
    }
  });
});
