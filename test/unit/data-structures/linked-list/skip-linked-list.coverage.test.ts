import { SkipList } from '../../../../src';

describe('SkipList additional branch coverage', () => {
  it('constructor applies options branches (maxLevel/probability) and first() returns undefined when empty', () => {
    const s = new SkipList<number, number>([], { maxLevel: 8, probability: 0.25 });
    expect(s.maxLevel).toBe(8);
    expect(s.probability).toBe(0.25);

    // covers `firstNode ? ... : undefined` false arm
    expect(s.first).toBeUndefined();
  });

  it('delete() covers the break branch when deleted node has smaller level than list level', () => {
    const s = new SkipList<number, string>();

    // Force deterministic node levels: first node makes list level high, second is low-level.
    const origRandomLevel = (s as any)._randomLevel;
    const levels = [4, 1];
    (s as any)._randomLevel = () => levels.shift() ?? 1;
    try {
      s.add(1, 'hi'); // level 4, end -> raises list level
      s.add(2, 'lo'); // level 1, end, list level stays 4

      expect(s.level).toBeGreaterThan(1);
      expect(s.delete(2)).toBe(true);
      expect(s.get(2)).toBeUndefined();
    } finally {
      (s as any)._randomLevel = origRandomLevel;
    }
  });
});
