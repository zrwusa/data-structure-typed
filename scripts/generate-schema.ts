/**
 * AI-First Schema Generator for data-structure-typed
 *
 * Generates:
 * 1. Knowledge atoms (method-level semantic units)
 * 2. Embedding-optimized text
 * 3. RAG-friendly chunks
 * 4. Training data (QA, reasoning, comparison)
 * 5. Complexity index
 *
 * Usage: npx ts-node scripts/generate-schema.ts
 */

import { Project, ClassDeclaration, MethodDeclaration } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// ============ Types ============

interface ComplexityInfo {
  best?: string;
  average?: string;
  worst?: string;
}

interface Behavior {
  mutates: boolean;
  pure: boolean;
  sideEffects: string[];
}

interface KnowledgeAtom {
  id: string;
  type: 'class' | 'method' | 'property';
  fqName: string;
  parent?: string;
  semanticSummary: string;
  technicalSummary: string;
  embeddingText: string;
  complexity?: {
    time?: ComplexityInfo;
    space?: ComplexityInfo;
  };
  behavior?: Behavior;
  parameters?: { name: string; type: string; description?: string }[];
  returns?: { type: string; description?: string };
  tags: string[];
  related: string[];
}

interface ClassChunk {
  id: string;
  name: string;
  category: string;
  semanticSummary: string;
  technicalSummary: string;
  embeddingText: string;
  extends?: string;
  genericParameters: string[];
  tags: string[];
  methodCount: number;
  complexitySummary: Record<string, string>;
  relations: KnowledgeTriple[];
}

interface KnowledgeTriple {
  subject: string;
  predicate: string;
  object: string;
}

interface RetrievalChunk {
  chunkId: string;
  sourceId: string;
  section: 'overview' | 'operation' | 'complexity' | 'example' | 'usage';
  title: string;
  content: string;
  embeddingText: string;
  metadata: {
    category: string;
    tags: string[];
    complexity?: string;
  };
}

interface ComplexityIndex {
  [complexity: string]: {
    methods: string[];
    classes: string[];
  };
}

interface QAPair {
  instruction: string;
  context?: string;
  output: string;
  type: 'factual' | 'reasoning' | 'comparison' | 'howto';
}

interface AISchema {
  library: string;
  version: string;
  language: string;
  generatedAt: string;

  // Layer 1: Knowledge Atoms (method-level)
  atoms: KnowledgeAtom[];

  // Layer 2: Class Chunks (class-level)
  classes: ClassChunk[];

  // Layer 3: Retrieval Chunks (section-level, for RAG)
  retrievalChunks: RetrievalChunk[];

  // Layer 4: Knowledge Graph (triples)
  knowledgeGraph: {
    triples: KnowledgeTriple[];
    totalTriples: number;
  };

  // Layer 5: Complexity Index
  complexityIndex: ComplexityIndex;

  // Layer 6: Training Data
  trainingData: {
    qa: QAPair[];
    totalPairs: number;
  };

  // Metadata
  stats: {
    totalAtoms: number;
    totalClasses: number;
    totalMethods: number;
    totalChunks: number;
    totalTriples: number;
    categoryCounts: Record<string, number>;
  };
}

// ============ Helpers ============

function getCategory(filePath: string): string {
  if (filePath.includes('binary-tree')) return 'tree';
  if (filePath.includes('linked-list')) return 'linear';
  if (filePath.includes('queue')) return 'linear';
  if (filePath.includes('stack')) return 'linear';
  if (filePath.includes('heap')) return 'heap';
  if (filePath.includes('priority-queue')) return 'heap';
  if (filePath.includes('hash')) return 'hash';
  if (filePath.includes('graph')) return 'graph';
  if (filePath.includes('trie')) return 'trie';
  if (filePath.includes('matrix')) return 'matrix';
  return 'other';
}

function getCategoryTags(category: string): string[] {
  const tagMap: Record<string, string[]> = {
    tree: ['tree', 'hierarchical', 'recursive', 'sorted', 'logarithmic-access'],
    linear: ['linear', 'sequential', 'ordered'],
    heap: ['heap', 'priority', 'complete-tree', 'logarithmic-insert'],
    hash: ['hash', 'key-value', 'constant-time-lookup', 'unordered'],
    graph: ['graph', 'vertices', 'edges', 'network', 'relationships'],
    trie: ['trie', 'prefix-tree', 'string-search', 'autocomplete'],
    matrix: ['matrix', '2d-array', 'grid', 'mathematical']
  };
  return tagMap[category] || [];
}

function inferTags(className: string, description: string, category: string): string[] {
  const tags: string[] = [...getCategoryTags(category)];

  // Infer from class name
  const nameLower = className.toLowerCase();
  if (nameLower.includes('doubly')) tags.push('doubly-linked', 'bidirectional');
  if (nameLower.includes('singly')) tags.push('singly-linked', 'forward-only');
  if (nameLower.includes('red') && nameLower.includes('black')) tags.push('self-balancing', 'red-black');
  if (nameLower.includes('avl')) tags.push('self-balancing', 'avl', 'height-balanced');
  if (nameLower.includes('bst') || nameLower.includes('binary')) tags.push('binary');
  if (nameLower.includes('deque')) tags.push('double-ended', 'array-backed', 'circular-buffer');
  if (nameLower.includes('stack')) tags.push('lifo', 'last-in-first-out');
  if (nameLower.includes('queue')) tags.push('fifo', 'first-in-first-out');
  if (nameLower.includes('priority')) tags.push('priority-based', 'heap-backed');
  if (nameLower.includes('map')) tags.push('key-value', 'associative');
  if (nameLower.includes('set')) tags.push('unique-elements', 'membership');
  if (nameLower.includes('multi')) tags.push('duplicates-allowed');
  if (nameLower.includes('linked')) tags.push('node-based', 'pointer-based');
  if (nameLower.includes('skip')) tags.push('probabilistic', 'skip-list');

  // Infer from description
  const descLower = description.toLowerCase();
  if (descLower.includes('mutable')) tags.push('mutable');
  if (descLower.includes('immutable')) tags.push('immutable');
  if (descLower.includes('sorted') || descLower.includes('order')) tags.push('sorted');
  if (descLower.includes('o(1)') || descLower.includes('constant')) tags.push('constant-time-ops');
  if (descLower.includes('o(log')) tags.push('logarithmic-ops');

  return [...new Set(tags)]; // Dedupe
}

function inferMethodTags(methodName: string, className: string): string[] {
  const tags: string[] = [];
  const nameLower = methodName.toLowerCase();

  if (nameLower.includes('push') || nameLower.includes('add') || nameLower.includes('insert') || nameLower.includes('set'))
    tags.push('insertion', 'mutating');
  if (nameLower.includes('pop') || nameLower.includes('delete') || nameLower.includes('remove'))
    tags.push('deletion', 'mutating');
  if (nameLower.includes('get') || nameLower.includes('peek') || nameLower.includes('at') || nameLower.includes('search') || nameLower.includes('find'))
    tags.push('lookup', 'read-only');
  if (nameLower.includes('clear')) tags.push('bulk-delete', 'mutating');
  if (nameLower.includes('clone') || nameLower.includes('copy')) tags.push('copying', 'read-only');
  if (nameLower.includes('map') || nameLower.includes('filter') || nameLower.includes('reduce'))
    tags.push('functional', 'transformation');
  if (nameLower.includes('iterator') || nameLower.includes('foreach') || nameLower.includes('values'))
    tags.push('iteration');
  if (nameLower.includes('sort')) tags.push('sorting');
  if (nameLower.includes('reverse')) tags.push('reordering', 'mutating');
  if (nameLower.includes('isempty') || nameLower.includes('has') || nameLower.includes('contains'))
    tags.push('predicate', 'read-only');
  if (nameLower.includes('size') || nameLower.includes('length') || nameLower.includes('count'))
    tags.push('size-query', 'read-only');

  return tags;
}

function inferBehavior(methodName: string, description: string): Behavior {
  const nameLower = methodName.toLowerCase();
  const descLower = description.toLowerCase();

  const mutates =
    nameLower.includes('push') ||
    nameLower.includes('pop') ||
    nameLower.includes('add') ||
    nameLower.includes('delete') ||
    nameLower.includes('remove') ||
    nameLower.includes('set') ||
    nameLower.includes('clear') ||
    nameLower.includes('insert') ||
    nameLower.includes('shift') ||
    nameLower.includes('unshift') ||
    descLower.includes('modifies') ||
    descLower.includes('removes') ||
    descLower.includes('adds');

  const pure =
    !mutates &&
    (nameLower.includes('get') ||
      nameLower.includes('peek') ||
      nameLower.includes('has') ||
      nameLower.includes('find') ||
      nameLower.includes('search') ||
      nameLower.includes('isempty') ||
      nameLower.includes('clone'));

  const sideEffects: string[] = [];
  if (mutates) sideEffects.push('modifies internal state');

  return { mutates, pure, sideEffects };
}

function simplifyType(typeStr: string): string {
  let simplified = typeStr.replace(/import\([^)]+\)\./g, '');
  simplified = simplified.replace(/\s+/g, ' ').trim();
  return simplified;
}

function getJSDocTagValue(declaration: ClassDeclaration | MethodDeclaration, tagName: string): string | undefined {
  const jsDocs = declaration.getJsDocs();
  for (const jsDoc of jsDocs) {
    const tags = jsDoc.getTags();
    for (const tag of tags) {
      if (tag.getTagName() === tagName) {
        return tag.getCommentText()?.trim();
      }
    }
  }
  return undefined;
}

function getDescription(declaration: ClassDeclaration | MethodDeclaration): string {
  const jsDocs = declaration.getJsDocs();
  if (jsDocs.length > 0) {
    return jsDocs[0].getDescription()?.trim() || '';
  }
  return '';
}

function getComplexityFromRemarks(declaration: ClassDeclaration | MethodDeclaration): {
  time?: ComplexityInfo;
  space?: ComplexityInfo;
} {
  const remarks = getJSDocTagValue(declaration, 'remarks');
  if (!remarks) return {};

  const result: { time?: ComplexityInfo; space?: ComplexityInfo } = {};

  const timeMatch = remarks.match(/Time\s+(O\([^)]+\))/i);
  if (timeMatch) {
    result.time = { best: timeMatch[1], average: timeMatch[1], worst: timeMatch[1] };
  }

  const spaceMatch = remarks.match(/Space\s+(O\([^)]+\))/i);
  if (spaceMatch) {
    result.space = { best: spaceMatch[1], average: spaceMatch[1], worst: spaceMatch[1] };
  }

  return result;
}

function generateSemanticSummary(className: string, methodName: string | null, description: string, complexity?: { time?: ComplexityInfo }): string {
  if (methodName) {
    const timeStr = complexity?.time?.average || '';
    return `${className}.${methodName}() ${description}${timeStr ? ` Runs in ${timeStr} time.` : ''}`;
  }
  return description;
}

function generateEmbeddingText(
  className: string,
  methodName: string | null,
  description: string,
  params: { name: string; type: string }[],
  returnType: string | null,
  complexity?: { time?: ComplexityInfo; space?: ComplexityInfo },
  tags: string[] = []
): string {
  const parts: string[] = [];

  if (methodName) {
    const paramStr = params.map(p => `${p.name}: ${p.type}`).join(', ');
    parts.push(`${className}.${methodName}(${paramStr})`);
    if (returnType) parts.push(`returns ${returnType}`);
  } else {
    parts.push(className);
  }

  parts.push(description);

  if (complexity?.time?.average) {
    parts.push(`Time complexity: ${complexity.time.average}`);
  }
  if (complexity?.space?.average) {
    parts.push(`Space complexity: ${complexity.space.average}`);
  }

  if (tags.length > 0) {
    parts.push(`Tags: ${tags.slice(0, 5).join(', ')}`);
  }

  return parts.join('. ').replace(/\.\./g, '.');
}

function findRelatedMethods(methodName: string, className: string, allAtoms: KnowledgeAtom[]): string[] {
  const related: string[] = [];
  const nameLower = methodName.toLowerCase();

  // Find similar operations in other classes
  const relatedPatterns: Record<string, string[]> = {
    push: ['unshift', 'add', 'insert', 'enqueue'],
    pop: ['shift', 'delete', 'remove', 'dequeue'],
    shift: ['pop', 'unshift'],
    unshift: ['push', 'shift'],
    get: ['set', 'has', 'peek'],
    set: ['get', 'delete'],
    add: ['delete', 'has'],
    delete: ['add', 'clear'],
    peek: ['pop', 'get'],
    clear: ['delete', 'isEmpty']
  };

  const patterns = relatedPatterns[nameLower] || [];

  // Find methods with similar names in same class
  for (const pattern of patterns) {
    const sameClassMethod = `${className}.${pattern}`;
    if (allAtoms.some(a => a.id === sameClassMethod)) {
      related.push(sameClassMethod);
    }
  }

  // Find same method in related classes
  const relatedClasses: Record<string, string[]> = {
    Stack: ['Queue', 'Deque'],
    Queue: ['Stack', 'Deque'],
    Deque: ['Stack', 'Queue'],
    DoublyLinkedList: ['SinglyLinkedList'],
    SinglyLinkedList: ['DoublyLinkedList'],
    TreeMap: ['TreeSet', 'HashMap'],
    TreeSet: ['TreeMap', 'TreeMultiSet'],
    RedBlackTree: ['AVLTree', 'BST'],
    AVLTree: ['RedBlackTree', 'BST']
  };

  const relatedClassList = relatedClasses[className] || [];
  for (const relClass of relatedClassList) {
    const relMethod = `${relClass}.${methodName}`;
    if (allAtoms.some(a => a.id === relMethod)) {
      related.push(relMethod);
    }
  }

  return [...new Set(related)].slice(0, 5);
}

// ============ Generators ============

function generateQAPairs(atoms: KnowledgeAtom[], classes: ClassChunk[]): QAPair[] {
  const pairs: QAPair[] = [];

  // ============ Method-level QA ============
  for (const atom of atoms) {
    if (atom.type !== 'method') continue;

    const methodName = atom.id.split('.')[1];
    const className = atom.parent || '';

    // 1. Complexity questions (multiple phrasings)
    if (atom.complexity?.time?.average) {
      const complexity = atom.complexity.time.average;
      
      pairs.push({
        instruction: `What is the time complexity of ${atom.id}()?`,
        output: `${atom.id}() runs in ${complexity} time complexity.`,
        type: 'factual'
      });

      pairs.push({
        instruction: `How fast is ${methodName} in ${className}?`,
        output: `${className}.${methodName}() operates in ${complexity} time.`,
        type: 'factual'
      });

      // Is it efficient?
      if (complexity === 'O(1)') {
        pairs.push({
          instruction: `Is ${atom.id}() efficient?`,
          output: `Yes, ${atom.id}() is very efficient with constant time ${complexity} complexity.`,
          type: 'factual'
        });
      }
    }

    // 2. How-to questions (multiple phrasings)
    if (atom.behavior?.mutates && atom.parameters && atom.parameters.length > 0) {
      pairs.push({
        instruction: `How do I ${methodName.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} in ${className}?`,
        output: `Use ${atom.id}(). ${atom.semanticSummary}`,
        type: 'howto'
      });

      pairs.push({
        instruction: `How to call ${methodName} on a ${className}?`,
        output: `Call ${className}.${methodName}(${atom.parameters.map(p => p.name).join(', ')}). ${atom.technicalSummary}`,
        type: 'howto'
      });
    }

    // 3. What does X do?
    if (atom.technicalSummary) {
      pairs.push({
        instruction: `What does ${atom.id}() do?`,
        output: atom.technicalSummary,
        type: 'factual'
      });
    }

    // 4. Code example questions
    if (['push', 'pop', 'add', 'delete', 'get', 'set'].includes(methodName.toLowerCase())) {
      const paramExample = atom.parameters?.map(p => {
        if (p.type.includes('number')) return '42';
        if (p.type.includes('string')) return '"value"';
        return 'element';
      }).join(', ') || '';

      pairs.push({
        instruction: `Show me an example of using ${atom.id}()`,
        output: `const ds = new ${className}();\nds.${methodName}(${paramExample}); // ${atom.technicalSummary}`,
        type: 'howto'
      });
    }
  }

  // ============ Class-level QA ============
  for (const cls of classes) {
    // 1. What is X? (multiple phrasings)
    pairs.push({
      instruction: `What is ${cls.name} in data-structure-typed?`,
      output: cls.semanticSummary,
      type: 'factual'
    });

    pairs.push({
      instruction: `Explain ${cls.name} data structure`,
      output: `${cls.name} is a ${cls.category} data structure. ${cls.semanticSummary}`,
      type: 'factual'
    });

    // 2. When to use X? (multiple phrasings)
    if (cls.tags.length > 0) {
      pairs.push({
        instruction: `When should I use ${cls.name}?`,
        output: `Use ${cls.name} when you need ${cls.tags.slice(0, 3).join(', ')} operations. ${cls.semanticSummary}`,
        type: 'reasoning'
      });

      pairs.push({
        instruction: `What are the use cases for ${cls.name}?`,
        output: `${cls.name} is ideal for: ${cls.tags.slice(0, 5).join(', ')}. ${cls.semanticSummary}`,
        type: 'reasoning'
      });
    }

    // 3. Complexity summary
    if (Object.keys(cls.complexitySummary).length > 0) {
      const mainOps = Object.entries(cls.complexitySummary).slice(0, 5);
      pairs.push({
        instruction: `What are the time complexities for ${cls.name} operations?`,
        output: mainOps.map(([op, c]) => `${op}: ${c}`).join(', '),
        type: 'factual'
      });
    }

    // 4. Basic usage example
    pairs.push({
      instruction: `How to create a ${cls.name}?`,
      output: `const ds = new ${cls.name}(); // Creates an empty ${cls.name}`,
      type: 'howto'
    });

    // 5. What operations does X support?
    if (Object.keys(cls.complexitySummary).length > 0) {
      pairs.push({
        instruction: `What operations does ${cls.name} support?`,
        output: `${cls.name} supports: ${Object.keys(cls.complexitySummary).slice(0, 8).join(', ')}`,
        type: 'factual'
      });
    }
  }

  // ============ Scenario-based QA ============
  const scenarios: { question: string; answer: string; structures: string[] }[] = [
    {
      question: "I need to implement an undo/redo system. Which data structure should I use?",
      answer: "Use Stack. Stack's LIFO (Last-In-First-Out) nature is perfect for undo/redo - push actions onto the stack, pop to undo.",
      structures: ['Stack']
    },
    {
      question: "How to efficiently find the top K largest elements?",
      answer: "Use MinHeap or MinPriorityQueue with size K. Insert elements and remove minimum when size exceeds K. Final heap contains top K.",
      structures: ['MinHeap', 'MinPriorityQueue', 'Heap']
    },
    {
      question: "I need fast lookup by key and sorted iteration. What should I use?",
      answer: "Use TreeMap. It provides O(log n) lookup by key AND maintains sorted order for iteration.",
      structures: ['TreeMap']
    },
    {
      question: "Which structure for a task scheduler with priorities?",
      answer: "Use PriorityQueue or MaxPriorityQueue. Tasks with higher priority are dequeued first in O(log n) time.",
      structures: ['PriorityQueue', 'MaxPriorityQueue']
    },
    {
      question: "I need fast insertions at both the front and back. What's best?",
      answer: "Use Deque. It provides O(1) push/pop at both ends, unlike Array which is O(n) for shift/unshift.",
      structures: ['Deque']
    },
    {
      question: "How to implement autocomplete efficiently?",
      answer: "Use Trie. It enables O(m) prefix search where m is the prefix length, perfect for autocomplete suggestions.",
      structures: ['Trie']
    },
    {
      question: "I need a sorted set with no duplicates. What should I use?",
      answer: "Use TreeSet. It maintains unique elements in sorted order with O(log n) add/has/delete operations.",
      structures: ['TreeSet']
    },
    {
      question: "Which structure to detect cycles in a graph?",
      answer: "Use DirectedGraph with DFS. The tarjan() method finds strongly connected components and can detect cycles.",
      structures: ['DirectedGraph']
    },
    {
      question: "I need O(1) average lookup but don't care about order. What to use?",
      answer: "Use HashMap. It provides O(1) average time for get/set/delete operations.",
      structures: ['HashMap']
    },
    {
      question: "How to maintain a leaderboard that updates frequently?",
      answer: "Use TreeMap or RedBlackTree. Both maintain sorted order with O(log n) updates, avoiding costly re-sorting.",
      structures: ['TreeMap', 'RedBlackTree']
    },
    {
      question: "I need to store key-value pairs where keys can have multiple values. What to use?",
      answer: "Use TreeMultiMap. It allows multiple values per key while maintaining sorted key order.",
      structures: ['TreeMultiMap']
    },
    {
      question: "Which is faster for random insertions: LinkedList or Array?",
      answer: "DoublyLinkedList is faster for insertions at known positions (O(1) with node reference), while Array requires O(n) shifting.",
      structures: ['DoublyLinkedList']
    }
  ];

  for (const scenario of scenarios) {
    if (scenario.structures.some(s => classes.some(c => c.name === s))) {
      pairs.push({
        instruction: scenario.question,
        output: scenario.answer,
        type: 'reasoning'
      });
    }
  }

  // ============ Comparison QA (expanded) ============
  const comparisons: { a: string; b: string; diff: string; questions: string[] }[] = [
    {
      a: 'Stack', b: 'Queue',
      diff: 'Stack is LIFO (last-in-first-out) - last element added is first removed. Queue is FIFO (first-in-first-out) - first element added is first removed.',
      questions: ['What is the difference between Stack and Queue?', 'Stack vs Queue?', 'When to use Stack instead of Queue?']
    },
    {
      a: 'Deque', b: 'Queue',
      diff: 'Deque (double-ended queue) allows O(1) insertion and deletion at both ends. Queue only allows push at back and shift from front.',
      questions: ['What is the difference between Deque and Queue?', 'Deque vs Queue?']
    },
    {
      a: 'TreeMap', b: 'HashMap',
      diff: 'TreeMap maintains sorted key order with O(log n) operations. HashMap is unordered with O(1) average operations. Use TreeMap when you need sorted iteration, HashMap for fastest lookups.',
      questions: ['What is the difference between TreeMap and HashMap?', 'TreeMap vs HashMap?', 'Should I use TreeMap or HashMap?']
    },
    {
      a: 'DoublyLinkedList', b: 'SinglyLinkedList',
      diff: 'DoublyLinkedList has prev and next pointers, allowing bidirectional traversal and O(1) deletion with node reference. SinglyLinkedList only has next pointers, using less memory but requiring O(n) for backward operations.',
      questions: ['What is the difference between DoublyLinkedList and SinglyLinkedList?', 'DoublyLinkedList vs SinglyLinkedList?']
    },
    {
      a: 'RedBlackTree', b: 'AVLTree',
      diff: 'Both are self-balancing BSTs. AVL trees are more strictly balanced (max height difference of 1), providing faster lookups. Red-Black trees have relaxed balancing, providing faster insertions/deletions with slightly slower lookups.',
      questions: ['What is the difference between RedBlackTree and AVLTree?', 'RedBlackTree vs AVLTree?']
    },
    {
      a: 'TreeSet', b: 'TreeMap',
      diff: 'TreeSet stores unique values in sorted order. TreeMap stores key-value pairs with keys in sorted order. TreeSet is essentially a TreeMap where value equals key.',
      questions: ['What is the difference between TreeSet and TreeMap?']
    },
    {
      a: 'Heap', b: 'PriorityQueue',
      diff: 'PriorityQueue is built on top of Heap. Heap is the underlying data structure, PriorityQueue provides a higher-level API for priority-based operations.',
      questions: ['What is the difference between Heap and PriorityQueue?']
    },
    {
      a: 'MinHeap', b: 'MaxHeap',
      diff: 'MinHeap keeps the smallest element at the root (peek returns minimum). MaxHeap keeps the largest element at the root (peek returns maximum).',
      questions: ['What is the difference between MinHeap and MaxHeap?', 'MinHeap vs MaxHeap?']
    },
    {
      a: 'DirectedGraph', b: 'UndirectedGraph',
      diff: 'DirectedGraph has edges with direction (A→B does not imply B→A). UndirectedGraph has bidirectional edges (A-B means both can reach each other).',
      questions: ['What is the difference between DirectedGraph and UndirectedGraph?']
    },
    {
      a: 'Array', b: 'Deque',
      diff: 'Native Array has O(n) shift/unshift operations due to element reindexing. Deque provides O(1) operations at both ends using circular buffer.',
      questions: ['Why use Deque instead of Array?', 'Deque vs Array performance?']
    }
  ];

  for (const comp of comparisons) {
    const hasA = classes.some(c => c.name === comp.a);
    const hasB = classes.some(c => c.name === comp.b);
    if (hasA || hasB) {
      for (const question of comp.questions) {
        pairs.push({
          instruction: question,
          output: comp.diff,
          type: 'comparison'
        });
      }
    }
  }

  // ============ Error/Misconception QA ============
  const misconceptions: { question: string; answer: string }[] = [
    {
      question: "Is Array.shift() efficient in JavaScript?",
      answer: "No, Array.shift() is O(n) because all elements must be reindexed. Use Deque for O(1) shift operations."
    },
    {
      question: "Can I use HashMap when I need sorted keys?",
      answer: "No, HashMap does not maintain order. Use TreeMap for sorted keys or LinkedHashMap for insertion order."
    },
    {
      question: "Is BST always O(log n)?",
      answer: "No, an unbalanced BST can degrade to O(n). Use AVLTree or RedBlackTree for guaranteed O(log n) operations."
    },
    {
      question: "Should I always use HashMap for fastest lookups?",
      answer: "HashMap has O(1) average but O(n) worst case. If you need guaranteed performance, TreeMap offers consistent O(log n)."
    }
  ];

  for (const m of misconceptions) {
    pairs.push({
      instruction: m.question,
      output: m.answer,
      type: 'reasoning'
    });
  }

  // ============ Boundary Condition QA ============
  const boundaryConditions: { structure: string; method: string; condition: string; result: string }[] = [
    { structure: 'Stack', method: 'pop', condition: 'empty', result: 'Returns undefined when stack is empty.' },
    { structure: 'Stack', method: 'peek', condition: 'empty', result: 'Returns undefined when stack is empty.' },
    { structure: 'Queue', method: 'shift', condition: 'empty', result: 'Returns undefined when queue is empty.' },
    { structure: 'Deque', method: 'pop', condition: 'empty', result: 'Returns undefined when deque is empty.' },
    { structure: 'Deque', method: 'shift', condition: 'empty', result: 'Returns undefined when deque is empty.' },
    { structure: 'HashMap', method: 'get', condition: 'key not found', result: 'Returns undefined if the key does not exist.' },
    { structure: 'TreeMap', method: 'get', condition: 'key not found', result: 'Returns undefined if the key does not exist.' },
    { structure: 'DoublyLinkedList', method: 'pop', condition: 'empty', result: 'Returns undefined when list is empty.' },
    { structure: 'DoublyLinkedList', method: 'shift', condition: 'empty', result: 'Returns undefined when list is empty.' },
    { structure: 'Heap', method: 'pop', condition: 'empty', result: 'Returns undefined when heap is empty.' },
    { structure: 'Heap', method: 'peek', condition: 'empty', result: 'Returns undefined when heap is empty.' },
    { structure: 'PriorityQueue', method: 'poll', condition: 'empty', result: 'Returns undefined when queue is empty.' },
    { structure: 'BST', method: 'get', condition: 'key not found', result: 'Returns undefined if the key does not exist in the tree.' },
    { structure: 'RedBlackTree', method: 'get', condition: 'key not found', result: 'Returns undefined if the key does not exist.' },
    { structure: 'Trie', method: 'get', condition: 'word not found', result: 'Returns false if the word is not in the trie.' }
  ];

  for (const bc of boundaryConditions) {
    if (classes.some(c => c.name === bc.structure)) {
      pairs.push({
        instruction: `What happens when calling ${bc.structure}.${bc.method}() on ${bc.condition === 'empty' ? 'an empty ' + bc.structure : bc.condition}?`,
        output: bc.result,
        type: 'factual'
      });

      pairs.push({
        instruction: `What does ${bc.structure}.${bc.method}() return when ${bc.condition}?`,
        output: bc.result,
        type: 'factual'
      });
    }
  }

  // ============ Return Value QA ============
  const returnValues: { structure: string; method: string; returns: string; description: string }[] = [
    { structure: 'Stack', method: 'push', returns: 'boolean', description: 'Returns true when element is successfully pushed.' },
    { structure: 'Stack', method: 'pop', returns: 'E | undefined', description: 'Returns the popped element, or undefined if empty.' },
    { structure: 'HashMap', method: 'set', returns: 'boolean', description: 'Returns true when the key-value pair is set.' },
    { structure: 'HashMap', method: 'delete', returns: 'boolean', description: 'Returns true if key existed and was deleted, false otherwise.' },
    { structure: 'TreeMap', method: 'set', returns: 'boolean', description: 'Returns true when the key-value pair is added or updated.' },
    { structure: 'TreeSet', method: 'add', returns: 'boolean', description: 'Returns true if element was added, false if already exists.' },
    { structure: 'Deque', method: 'push', returns: 'boolean', description: 'Returns true when element is added to back.' },
    { structure: 'DoublyLinkedList', method: 'delete', returns: 'boolean', description: 'Returns true if element was found and deleted.' },
    { structure: 'Trie', method: 'add', returns: 'boolean', description: 'Returns true when word is added to the trie.' },
    { structure: 'Trie', method: 'has', returns: 'boolean', description: 'Returns true if the exact word exists in the trie.' },
    { structure: 'DirectedGraph', method: 'addVertex', returns: 'boolean', description: 'Returns true if vertex was added successfully.' },
    { structure: 'DirectedGraph', method: 'addEdge', returns: 'boolean', description: 'Returns true if edge was added successfully.' }
  ];

  for (const rv of returnValues) {
    if (classes.some(c => c.name === rv.structure)) {
      pairs.push({
        instruction: `What does ${rv.structure}.${rv.method}() return?`,
        output: `${rv.structure}.${rv.method}() returns ${rv.returns}. ${rv.description}`,
        type: 'factual'
      });

      pairs.push({
        instruction: `What is the return type of ${rv.structure}.${rv.method}()?`,
        output: `${rv.returns}. ${rv.description}`,
        type: 'factual'
      });
    }
  }

  // ============ Best Practices QA ============
  const bestPractices: { question: string; answer: string }[] = [
    {
      question: "What's the best way to iterate over a TreeMap?",
      answer: "Use for...of loop: `for (const [key, value] of treeMap) { }`. TreeMap iterates in sorted key order."
    },
    {
      question: "How to efficiently check if an element exists before adding?",
      answer: "Use the has() method first, or just call add()/set() which returns false if already exists."
    },
    {
      question: "What's the best way to get the size of a data structure?",
      answer: "Use the .size property (O(1)) rather than converting to array and checking length."
    },
    {
      question: "How to safely pop from a Stack that might be empty?",
      answer: "Check isEmpty() first, or handle the undefined return: `const item = stack.pop(); if (item !== undefined) { ... }`"
    },
    {
      question: "What's the best way to clear all elements?",
      answer: "Use clear() method which is O(1) for most structures. Avoid popping in a loop."
    },
    {
      question: "How to iterate a DoublyLinkedList in reverse?",
      answer: "Use getBackward() method which returns an iterator from tail to head."
    },
    {
      question: "How to find elements in a sorted structure?",
      answer: "Use rangeSearch(min, max) for TreeMap/TreeSet to find all elements in a range in O(log n + k)."
    },
    {
      question: "What's the best way to merge two heaps?",
      answer: "For FibonacciHeap use merge() in O(1). For regular Heap, add all elements which is O(n log n)."
    },
    {
      question: "How to get the minimum/maximum from a tree?",
      answer: "Use first()/last() methods which return min/max in O(log n) time."
    },
    {
      question: "How to clone a data structure?",
      answer: "Use clone() method which creates a deep copy. Available on most structures."
    }
  ];

  for (const bp of bestPractices) {
    pairs.push({
      instruction: bp.question,
      output: bp.answer,
      type: 'howto'
    });
  }

  // ============ Alternative Structure QA ============
  const alternatives: { need: string; avoid: string; use: string; reason: string }[] = [
    {
      need: 'fast shift/unshift operations',
      avoid: 'Array',
      use: 'Deque',
      reason: 'Array.shift() is O(n) due to reindexing. Deque provides O(1) for both ends.'
    },
    {
      need: 'sorted key-value storage',
      avoid: 'Object or Map',
      use: 'TreeMap',
      reason: 'Native Object/Map do not maintain sorted order. TreeMap keeps keys sorted.'
    },
    {
      need: 'priority-based processing',
      avoid: 'sorted Array',
      use: 'PriorityQueue or Heap',
      reason: 'Maintaining sorted array is O(n) per insert. Heap is O(log n).'
    },
    {
      need: 'unique sorted elements',
      avoid: 'Array with sort and dedupe',
      use: 'TreeSet',
      reason: 'TreeSet maintains sorted unique elements with O(log n) operations automatically.'
    },
    {
      need: 'fast prefix search',
      avoid: 'Array.filter with startsWith',
      use: 'Trie',
      reason: 'Array search is O(n*m). Trie prefix search is O(m + k) where k is result count.'
    },
    {
      need: 'graph traversal algorithms',
      avoid: 'nested objects or adjacency matrix',
      use: 'DirectedGraph or UndirectedGraph',
      reason: 'Graph classes provide built-in BFS, DFS, Dijkstra, and cycle detection.'
    },
    {
      need: 'LIFO with fast operations',
      avoid: 'Array.push/pop at index 0',
      use: 'Stack',
      reason: 'Stack provides clear semantics and consistent O(1) operations.'
    },
    {
      need: 'guaranteed O(log n) tree operations',
      avoid: 'plain BST',
      use: 'AVLTree or RedBlackTree',
      reason: 'Plain BST can degrade to O(n). Self-balancing trees guarantee O(log n).'
    }
  ];

  for (const alt of alternatives) {
    pairs.push({
      instruction: `What should I use instead of ${alt.avoid} for ${alt.need}?`,
      output: `Use ${alt.use}. ${alt.reason}`,
      type: 'reasoning'
    });

    pairs.push({
      instruction: `Why is ${alt.use} better than ${alt.avoid} for ${alt.need}?`,
      output: alt.reason,
      type: 'reasoning'
    });
  }

  // ============ Type/Parameter QA ============
  const typeQuestions: { structure: string; method: string; paramInfo: string }[] = [
    { structure: 'TreeMap', method: 'set', paramInfo: 'Takes (key: K, value: V) where K must be comparable (has < > operators or custom comparator).' },
    { structure: 'HashMap', method: 'set', paramInfo: 'Takes (key: K, value: V) where K can be any type that works with Map.' },
    { structure: 'Heap', method: 'add', paramInfo: 'Takes element: E. Elements must be comparable or provide a custom comparator in constructor.' },
    { structure: 'Trie', method: 'add', paramInfo: 'Takes word: string. Only string keys are supported.' },
    { structure: 'DirectedGraph', method: 'addEdge', paramInfo: 'Takes (src: VertexKey, dest: VertexKey, weight?: number). Creates directed edge from src to dest.' },
    { structure: 'PriorityQueue', method: 'add', paramInfo: 'Takes element: E. Priority determined by comparator (default: min-heap by value).' }
  ];

  for (const tq of typeQuestions) {
    if (classes.some(c => c.name === tq.structure)) {
      pairs.push({
        instruction: `What parameters does ${tq.structure}.${tq.method}() accept?`,
        output: tq.paramInfo,
        type: 'factual'
      });

      pairs.push({
        instruction: `What type of arguments does ${tq.structure}.${tq.method}() take?`,
        output: tq.paramInfo,
        type: 'factual'
      });
    }
  }

  // ============ Multi-structure QA ============
  // Group classes by category
  const byCategory: Record<string, string[]> = {};
  for (const cls of classes) {
    if (!byCategory[cls.category]) byCategory[cls.category] = [];
    byCategory[cls.category].push(cls.name);
  }

  for (const [category, names] of Object.entries(byCategory)) {
    if (names.length > 1 && category !== 'other') {
      pairs.push({
        instruction: `What ${category} data structures are available?`,
        output: `Available ${category} structures: ${names.join(', ')}`,
        type: 'factual'
      });
    }
  }

  // ============ Complexity-based QA ============
  // Find all O(1) operations
  const o1Methods = atoms.filter(a => a.type === 'method' && a.complexity?.time?.average === 'O(1)');
  if (o1Methods.length > 0) {
    const grouped: Record<string, string[]> = {};
    for (const m of o1Methods) {
      const method = m.id.split('.')[1];
      if (!grouped[method]) grouped[method] = [];
      grouped[method].push(m.parent || '');
    }

    pairs.push({
      instruction: "Which data structures have O(1) push?",
      output: `Structures with O(1) push: ${grouped['push']?.join(', ') || 'Stack, Deque, DoublyLinkedList'}`,
      type: 'factual'
    });

    pairs.push({
      instruction: "Which data structures have O(1) pop?",
      output: `Structures with O(1) pop: ${grouped['pop']?.join(', ') || 'Stack, Deque, DoublyLinkedList'}`,
      type: 'factual'
    });
  }

  return pairs;
}

// Generate knowledge triples for a class
function generateClassTriples(className: string, category: string, extendsClass?: string, tags: string[] = [], methods: string[] = []): KnowledgeTriple[] {
  const triples: KnowledgeTriple[] = [];

  // isA relation
  triples.push({ subject: className, predicate: 'isA', object: category });

  // extends relation
  if (extendsClass) {
    const parentName = extendsClass.split('<')[0].trim();
    triples.push({ subject: className, predicate: 'extends', object: parentName });
  }

  // hasProperty relations from tags
  for (const tag of tags.slice(0, 5)) {
    triples.push({ subject: className, predicate: 'hasProperty', object: tag });
  }

  // hasOperation relations
  for (const method of methods.slice(0, 10)) {
    triples.push({ subject: className, predicate: 'hasOperation', object: method });
  }

  return triples;
}

// Generate knowledge triples for a method
function generateMethodTriples(methodId: string, className: string, complexity?: { time?: ComplexityInfo }, behavior?: Behavior): KnowledgeTriple[] {
  const triples: KnowledgeTriple[] = [];
  const methodName = methodId.split('.')[1];

  // belongsTo relation
  triples.push({ subject: methodId, predicate: 'belongsTo', object: className });

  // timeComplexity relation
  if (complexity?.time?.average) {
    triples.push({ subject: methodId, predicate: 'hasTimeComplexity', object: complexity.time.average });
  }

  // behavior relations
  if (behavior?.mutates) {
    triples.push({ subject: methodId, predicate: 'mutatesState', object: 'true' });
  }
  if (behavior?.pure) {
    triples.push({ subject: methodId, predicate: 'isPure', object: 'true' });
  }

  return triples;
}

// Generate retrieval chunks for a class
function generateRetrievalChunks(
  className: string,
  category: string,
  description: string,
  tags: string[],
  methods: { name: string; desc: string; complexity?: string }[],
  complexitySummary: Record<string, string>
): RetrievalChunk[] {
  const chunks: RetrievalChunk[] = [];

  // Overview chunk
  chunks.push({
    chunkId: `${className.toLowerCase()}-overview`,
    sourceId: className,
    section: 'overview',
    title: `${className} Overview`,
    content: description || `${className} is a ${category} data structure.`,
    embeddingText: `${className} overview: ${description} Category: ${category}. Tags: ${tags.join(', ')}`,
    metadata: { category, tags }
  });

  // Complexity summary chunk
  if (Object.keys(complexitySummary).length > 0) {
    const complexityContent = Object.entries(complexitySummary)
      .map(([method, complexity]) => `${method}: ${complexity}`)
      .join(', ');
    chunks.push({
      chunkId: `${className.toLowerCase()}-complexity`,
      sourceId: className,
      section: 'complexity',
      title: `${className} Time Complexity`,
      content: complexityContent,
      embeddingText: `${className} time complexity: ${complexityContent}`,
      metadata: { category, tags }
    });
  }

  // Operation chunks (group by operation type)
  const insertionMethods = methods.filter(m => 
    ['push', 'add', 'set', 'insert', 'unshift'].some(op => m.name.toLowerCase().includes(op))
  );
  if (insertionMethods.length > 0) {
    const content = insertionMethods.map(m => `${m.name}: ${m.desc}${m.complexity ? ` (${m.complexity})` : ''}`).join('. ');
    chunks.push({
      chunkId: `${className.toLowerCase()}-insertion-ops`,
      sourceId: className,
      section: 'operation',
      title: `${className} Insertion Operations`,
      content,
      embeddingText: `${className} insertion operations: ${content}`,
      metadata: { category, tags, complexity: insertionMethods[0]?.complexity }
    });
  }

  const deletionMethods = methods.filter(m => 
    ['pop', 'delete', 'remove', 'shift', 'clear'].some(op => m.name.toLowerCase().includes(op))
  );
  if (deletionMethods.length > 0) {
    const content = deletionMethods.map(m => `${m.name}: ${m.desc}${m.complexity ? ` (${m.complexity})` : ''}`).join('. ');
    chunks.push({
      chunkId: `${className.toLowerCase()}-deletion-ops`,
      sourceId: className,
      section: 'operation',
      title: `${className} Deletion Operations`,
      content,
      embeddingText: `${className} deletion operations: ${content}`,
      metadata: { category, tags, complexity: deletionMethods[0]?.complexity }
    });
  }

  const lookupMethods = methods.filter(m => 
    ['get', 'peek', 'find', 'search', 'has', 'at'].some(op => m.name.toLowerCase().includes(op))
  );
  if (lookupMethods.length > 0) {
    const content = lookupMethods.map(m => `${m.name}: ${m.desc}${m.complexity ? ` (${m.complexity})` : ''}`).join('. ');
    chunks.push({
      chunkId: `${className.toLowerCase()}-lookup-ops`,
      sourceId: className,
      section: 'operation',
      title: `${className} Lookup Operations`,
      content,
      embeddingText: `${className} lookup operations: ${content}`,
      metadata: { category, tags, complexity: lookupMethods[0]?.complexity }
    });
  }

  return chunks;
}

function buildComplexityIndex(atoms: KnowledgeAtom[]): ComplexityIndex {
  const index: ComplexityIndex = {};

  for (const atom of atoms) {
    if (atom.type !== 'method' || !atom.complexity?.time?.average) continue;

    const complexity = atom.complexity.time.average;
    if (!index[complexity]) {
      index[complexity] = { methods: [], classes: [] };
    }

    index[complexity].methods.push(atom.id);

    if (atom.parent && !index[complexity].classes.includes(atom.parent)) {
      index[complexity].classes.push(atom.parent);
    }
  }

  return index;
}

// ============ Main ============

async function generateSchema(): Promise<void> {
  console.log('🔍 Scanning TypeScript source files...');

  const project = new Project({
    tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json')
  });

  const sourceFiles = project.getSourceFiles('src/data-structures/**/*.ts');
  console.log(`📁 Found ${sourceFiles.length} source files`);

  const atoms: KnowledgeAtom[] = [];
  const classes: ClassChunk[] = [];
  const retrievalChunks: RetrievalChunk[] = [];
  const allTriples: KnowledgeTriple[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    if (filePath.endsWith('index.ts')) continue;

    const category = getCategory(filePath);

    for (const classDecl of sourceFile.getClasses()) {
      const className = classDecl.getName();
      if (!className || className.startsWith('_')) continue;

      console.log(`  📦 Processing: ${className}`);

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      const classDesc = getDescription(classDecl);
      const classTags = inferTags(className, classDesc, category);
      const genericParams = classDecl.getTypeParameters().map(tp => tp.getName());
      const extendsClause = classDecl.getExtends()?.getText();

      // Class-level atom
      const classAtom: KnowledgeAtom = {
        id: className,
        type: 'class',
        fqName: className,
        semanticSummary: classDesc || `${className} data structure`,
        technicalSummary: classDesc || '',
        embeddingText: generateEmbeddingText(className, null, classDesc, [], null, undefined, classTags),
        tags: classTags,
        related: []
      };
      atoms.push(classAtom);

      const complexitySummary: Record<string, string> = {};

      // Method atoms
      const methods = classDecl.getMethods().filter(
        m => !m.getName().startsWith('_') && m.getScope() !== 'private' && m.getScope() !== 'protected'
      );

      for (const method of methods) {
        const methodName = method.getName();
        const methodDesc = getDescription(method);
        const complexity = getComplexityFromRemarks(method);

        const params = method.getParameters().map(p => ({
          name: p.getName(),
          type: simplifyType(p.getType().getText())
        }));
        const returnType = simplifyType(method.getReturnType().getText());
        const methodTags = [...classTags, ...inferMethodTags(methodName, className)];
        const behavior = inferBehavior(methodName, methodDesc);

        if (complexity.time?.average) {
          complexitySummary[methodName] = complexity.time.average;
        }

        const methodAtom: KnowledgeAtom = {
          id: `${className}.${methodName}`,
          type: 'method',
          fqName: `${className}.${methodName}`,
          parent: className,
          semanticSummary: generateSemanticSummary(className, methodName, methodDesc, complexity),
          technicalSummary: methodDesc,
          embeddingText: generateEmbeddingText(className, methodName, methodDesc, params, returnType, complexity, methodTags),
          complexity: Object.keys(complexity).length > 0 ? complexity : undefined,
          behavior,
          parameters: params,
          returns: { type: returnType },
          tags: methodTags,
          related: [] // Filled later
        };

        atoms.push(methodAtom);

        // Generate method triples
        const methodTriples = generateMethodTriples(
          `${className}.${methodName}`,
          className,
          Object.keys(complexity).length > 0 ? complexity : undefined,
          behavior
        );
        allTriples.push(...methodTriples);
      }

      // Generate knowledge triples for class
      const methodNames = methods.map(m => m.getName());
      const classTriples = generateClassTriples(className, category, extendsClause, classTags, methodNames);
      allTriples.push(...classTriples);

      // Generate retrieval chunks
      const methodInfoForChunks = methods.map(m => ({
        name: m.getName(),
        desc: getDescription(m),
        complexity: getComplexityFromRemarks(m).time?.average
      }));
      const classRetrievalChunks = generateRetrievalChunks(
        className, category, classDesc, classTags, methodInfoForChunks, complexitySummary
      );
      retrievalChunks.push(...classRetrievalChunks);

      // Class chunk
      const classChunk: ClassChunk = {
        id: className,
        name: className,
        category,
        semanticSummary: classDesc || `${className} is a ${category} data structure`,
        technicalSummary: classDesc,
        embeddingText: generateEmbeddingText(className, null, classDesc, [], null, undefined, classTags),
        extends: extendsClause,
        genericParameters: genericParams,
        tags: classTags,
        methodCount: methods.length,
        complexitySummary,
        relations: classTriples
      };
      classes.push(classChunk);
    }
  }

  // Fill related methods
  console.log('🔗 Building cross-references...');
  for (const atom of atoms) {
    if (atom.type === 'method' && atom.parent) {
      atom.related = findRelatedMethods(atom.id.split('.')[1], atom.parent, atoms);
    }
  }

  // Build complexity index
  console.log('📊 Building complexity index...');
  const complexityIndex = buildComplexityIndex(atoms);

  // Generate training data
  console.log('🧠 Generating training data...');
  const qa = generateQAPairs(atoms, classes);

  // Read package version
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

  const schema: AISchema = {
    library: 'data-structure-typed',
    version: packageJson.version,
    language: 'TypeScript',
    generatedAt: new Date().toISOString(),
    atoms,
    classes,
    retrievalChunks,
    knowledgeGraph: {
      triples: allTriples,
      totalTriples: allTriples.length
    },
    complexityIndex,
    trainingData: {
      qa,
      totalPairs: qa.length
    },
    stats: {
      totalAtoms: atoms.length,
      totalClasses: classes.length,
      totalMethods: atoms.filter(a => a.type === 'method').length,
      totalChunks: retrievalChunks.length,
      totalTriples: allTriples.length,
      categoryCounts
    }
  };

  // Ensure output directory exists
  const aiDocsDir = path.join(__dirname, '..', 'docs', 'ai');
  if (!fs.existsSync(aiDocsDir)) {
    fs.mkdirSync(aiDocsDir, { recursive: true });
  }

  // Write main schema
  const outputPath = path.join(aiDocsDir, 'schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

  // Write embeddings-only file (smaller, for vector DB)
  const embeddingsPath = path.join(aiDocsDir, 'embeddings.jsonl');
  const embeddingsLines = atoms.map(a => JSON.stringify({ id: a.id, text: a.embeddingText, tags: a.tags }));
  fs.writeFileSync(embeddingsPath, embeddingsLines.join('\n'));

  // Write training data separately
  const trainingPath = path.join(aiDocsDir, 'training-qa.jsonl');
  const trainingLines = qa.map(q => JSON.stringify(q));
  fs.writeFileSync(trainingPath, trainingLines.join('\n'));

  // Write retrieval chunks (for RAG vector DB)
  const chunksPath = path.join(aiDocsDir, 'retrieval-chunks.jsonl');
  const chunkLines = retrievalChunks.map(c => JSON.stringify(c));
  fs.writeFileSync(chunksPath, chunkLines.join('\n'));

  // Write knowledge triples (for knowledge graph)
  const triplesPath = path.join(aiDocsDir, 'knowledge-triples.jsonl');
  const tripleLines = allTriples.map(t => JSON.stringify(t));
  fs.writeFileSync(triplesPath, tripleLines.join('\n'));

  console.log(`\n✅ Schema generated successfully!`);
  console.log(`   📄 ${outputPath} (full schema)`);
  console.log(`   📄 ${embeddingsPath} (embedding texts)`);
  console.log(`   📄 ${chunksPath} (RAG retrieval chunks)`);
  console.log(`   📄 ${triplesPath} (knowledge graph triples)`);
  console.log(`   📄 ${trainingPath} (training QA pairs)`);
  console.log(`\n📊 Stats:`);
  console.log(`   🧬 ${atoms.length} knowledge atoms`);
  console.log(`   📦 ${classes.length} classes`);
  console.log(`   🔧 ${atoms.filter(a => a.type === 'method').length} methods`);
  console.log(`   📑 ${retrievalChunks.length} retrieval chunks`);
  console.log(`   🔗 ${allTriples.length} knowledge triples`);
  console.log(`   ❓ ${qa.length} QA pairs`);
  console.log(`   🏷️ Complexity buckets: ${Object.keys(complexityIndex).join(', ')}`);
}

generateSchema().catch(console.error);
