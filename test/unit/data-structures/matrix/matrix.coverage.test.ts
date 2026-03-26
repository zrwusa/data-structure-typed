import { Matrix } from '../../../../src';

describe('Matrix misc coverage', () => {

  describe('branch', () => {
  it('inverse throws when matrix is singular (pivotRow reaches rows)', () => {
      const m = new Matrix([[0]], { rows: 1, cols: 1 });
      expect(() => m.inverse()).toThrow(/singular/i);
    });

    it('inverse hits division-by-zero guard (pivotElement===0) via get() monkeypatch', () => {
      const m = new Matrix(
        [
          [1, 0],
          [0, 1]
        ],
        { rows: 2, cols: 2 }
      );

      const origGet = (Matrix as any).prototype.get;
      try {
        (Matrix as any).prototype.get = function (row: number, col: number) {
          // Make pivot search succeed (non-zero) but pivot element read as 0.
          if (row === col) return 0;
          return 1;
        };
        expect(() => m.inverse()).toThrow(/Singular matrix/i);
      } finally {
        (Matrix as any).prototype.get = origGet;
      }
    });

    it('inverse treats undefined elimination factor as 0 (factor===undefined branch)', () => {
      const m = new Matrix(
        [
          [1, 0],
          [0, 1]
        ],
        { rows: 2, cols: 2 }
      );

      const origGet = (Matrix as any).prototype.get;
      try {
        (Matrix as any).prototype.get = function (row: number, col: number) {
          // Provide real diagonal for pivoting
          if (row === col) return 1;
          // For elimination factor reads (j,i) when j!=i, return undefined
          return undefined;
        };

        // Should still return something (we only care about branch execution)
        const inv = m.inverse();
        expect(inv?.rows).toBe(2);
        expect(inv?.cols).toBe(2);
      } finally {
        (Matrix as any).prototype.get = origGet;
      }
    });

    it('_scaleRow and _addScaledRow coerce undefined multiply/add results to 0', () => {
      const m = new Matrix(
        [
          [1, 2],
          [3, 4]
        ],
        {
          rows: 2,
          cols: 2,
          multiplyFn: () => undefined as any,
          addFn: () => undefined as any
        }
      );

      // call protected helpers via any
      (m as any)._scaleRow(0, 2);
      expect(m.data[0][0]).toBe(0);
      expect(m.data[0][1]).toBe(0);

      (m as any)._addScaledRow(1, 0, 3);
      expect(m.data[1][0]).toBe(0);
      expect(m.data[1][1]).toBe(0);
    });
  });

  describe('inverse pivotElement ?? 1 branch', () => {
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
});
