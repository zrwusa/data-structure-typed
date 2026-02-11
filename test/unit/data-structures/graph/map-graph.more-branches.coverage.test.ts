import { MapGraph } from '../../../../src';

describe('MapGraph remaining branch coverage', () => {
  it('_createInstance falls back to this.originCoord/this.bottomRight when options omit them (?? rhs)', () => {
    const g = new MapGraph<number, number>([10, 20], [30, 40]);

    // No-arg call hits (options || {}) rhs.
    const inst = (g as any)._createInstance();
    expect(inst).toBeInstanceOf(MapGraph);

    // Empty options hits originCoord/bottomRight ?? rhs.
    const instEmpty = (g as any)._createInstance({});
    expect(instEmpty).toBeInstanceOf(MapGraph);

    // Verify fallbacks were used.
    expect((inst as any).originCoord).toEqual([10, 20]);
    expect((inst as any).bottomRight).toEqual([30, 40]);

    const inst2 = (g as any)._createInstance({ bottomRight: undefined });
    expect((inst2 as any).bottomRight).toEqual([30, 40]);
  });
});
