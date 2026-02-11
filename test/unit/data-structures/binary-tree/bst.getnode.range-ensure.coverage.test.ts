import { BST } from '../../../../src';
import { Range } from '../../../../src/common';

describe('BST getNode() extra coverage', () => {
  it('treats runtime Range input by forwarding to getNodes and returning first result', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15, 3, 7, 12, 18]) t.set(k, k);

    const range = new Range(6, 13, true, true);
    const n = t.getNode(range as any);
    expect(n?.key).toBe(7);
  });

  it('returns undefined when ensureNode(startNode) fails (startNode is null)', () => {
    const t = new BST<number, number>([], { isMapMode: false });
    for (const k of [10, 5, 15]) t.set(k, k);

    // bypass type and pass null startNode
    const out = t.getNode(10 as any, null as any);
    expect(out).toBeUndefined();
  });
});
