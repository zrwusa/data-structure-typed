import { Matrix } from '../../../../src';

describe('Matrix additional branch coverage', () => {
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
      expect(() => m.inverse()).toThrow(/division by zero/i);
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
