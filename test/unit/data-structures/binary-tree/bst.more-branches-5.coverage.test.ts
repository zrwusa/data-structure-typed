import { BST } from '../../../../src';

describe('BST additional reachable branch coverage (batch 5)', () => {
  it('search(): forces shouldVisitRight key-pruning branch + covers && chain short-circuit variants', () => {
    const t = new BST<number, number>();
    t.setMany([
      [10, 10],
      [20, 20]
    ]);

    const originalIsPredicate = (t as any)._isPredicate.bind(t);

    const run = (keyNodeOrEntry: any) => {
      let calls = 0;
      (t as any)._isPredicate = (p: any) => {
        // 1st call (isPred computation) => true, to bypass the fast-path.
        // After that, behave like the real implementation so _ensurePredicate works
        // and shouldVisitRight sees "not predicate".
        calls++;
        if (calls === 1) return true;
        return originalIsPredicate(p);
      };

      try {
        t.search(keyNodeOrEntry);
      } finally {
        (t as any)._isPredicate = originalIsPredicate;
      }
    };

    // 1) benchmarkKey === null => hits first short-circuit (benchmarkKey !== null)
    run([null, 0]);

    // 2) benchmarkKey === undefined => passes first check, fails second
    run([undefined, 0]);

    // 3) compare(...) < 0 is false => passes both nullish checks
    run([5, 0]);
  });
});
