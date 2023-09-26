import { Trie, TrieNode } from '../../../../src';

describe('TrieNode', () => {
  it('should create a TrieNode with the given value', () => {
    const node = new TrieNode('a');
    expect(node.val).toBe('a');
    expect(node.isEnd).toBe(false);
    expect(node.children.size).toBe(0);
  });

  it('should add a child to TrieNode', () => {
    const parentNode = new TrieNode('a');
    const childNode = new TrieNode('b');
    parentNode.children.set('b', childNode);

    expect(parentNode.children.size).toBe(1);
    expect(parentNode.children.get('b')).toBe(childNode);
  });

  it('should set isEnd property correctly', () => {
    const node = new TrieNode('a');
    node.isEnd = true;
    expect(node.isEnd).toBe(true);
  });
});

describe('Trie', () => {
  it('should create an empty Trie', () => {
    const trie = new Trie();
    expect(trie.root.val).toBe('');
    expect(trie.root.children.size).toBe(0);
  });

  it('should add words to Trie', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.has('apple')).toBe(true);
    expect(trie.has('app')).toBe(true);
    expect(trie.has('banana')).toBe(false);
  });

  it('should check if a string is an absolute prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.isAbsPrefix('appl')).toBe(true);
    expect(trie.isAbsPrefix('apples')).toBe(false);
  });

  it('should check if a string is a prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.isPrefix('app')).toBe(true);
    expect(trie.isPrefix('banana')).toBe(false);
  });

  it('should check if a string is a common prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.isCommonPrefix('ap')).toBe(true);
    expect(trie.isCommonPrefix('app')).toBe(true);
    expect(trie.isCommonPrefix('b')).toBe(false);
  });

  it('should get the longest common prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.getLongestCommonPrefix()).toBe('app');
  });

  it('should get all words with a given prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    trie.add('application');
    const words = trie.getAll('app');
    expect(words).toEqual(['apple', 'application','app']);
  });

  it('should remove words from Trie', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.has('apple')).toBe(true);
    trie.remove('apple');
    expect(trie.has('apple')).toBe(false);
    expect(trie.has('app')).toBe(true);
    trie.remove('app');
    expect(trie.has('app')).toBe(false);
  });
});
