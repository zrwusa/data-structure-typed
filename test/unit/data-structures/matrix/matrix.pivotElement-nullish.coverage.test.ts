import { Matrix } from '../../../../src';

describe('Matrix inverse pivotElement ?? 1 remaining branch coverage', () => {
  it('inverse() uses pivotElement fallback 1 when get(i,i) is nullish', () => {
    const origGet = Matrix.prototype.get;
    try {
      Matrix.prototype.get = function (row: number, col: number): any {
        if (row === 0 && col === 0) return undefined;
        return origGet.call(this, row, col);
      };

      const m = new Matrix([
        [1, 0],
        [0, 1]
      ]);

      const inv = m.inverse();

      // Restore before asserting so inv.get is not affected.
      Matrix.prototype.get = origGet;

      expect(inv?.get(0, 0)).toBe(1);
      expect(inv?.get(1, 1)).toBe(1);
    } finally {
      Matrix.prototype.get = origGet;
    }
  });
});
