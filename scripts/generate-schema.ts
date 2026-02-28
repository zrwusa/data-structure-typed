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
}

interface ComplexityIndex {
  [complexity: string]: {
    methods: string[];
    classes: string[];
  };
}

interface QAPair {
  instruction: string;
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

  // Layer 3: Complexity Index
  complexityIndex: ComplexityIndex;

  // Layer 4: Training Data
  trainingData: {
    qa: QAPair[];
    totalPairs: number;
  };

  // Metadata
  stats: {
    totalAtoms: number;
    totalClasses: number;
    totalMethods: number;
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

  // Factual QA from methods
  for (const atom of atoms) {
    if (atom.type !== 'method') continue;

    // How-to questions
    if (atom.behavior?.mutates) {
      pairs.push({
        instruction: `How do I ${atom.id.split('.')[1].replace(/([A-Z])/g, ' $1').toLowerCase().trim()} in ${atom.parent}?`,
        output: `Use ${atom.id}(). ${atom.semanticSummary}`,
        type: 'howto'
      });
    }

    // Complexity questions
    if (atom.complexity?.time?.average) {
      pairs.push({
        instruction: `What is the time complexity of ${atom.id}()?`,
        output: `${atom.id}() runs in ${atom.complexity.time.average} time complexity.`,
        type: 'factual'
      });
    }
  }

  // Class-level QA
  for (const cls of classes) {
    // What is X?
    pairs.push({
      instruction: `What is ${cls.name} in data-structure-typed?`,
      output: cls.semanticSummary,
      type: 'factual'
    });

    // When to use X?
    if (cls.tags.length > 0) {
      pairs.push({
        instruction: `When should I use ${cls.name}?`,
        output: `Use ${cls.name} when you need ${cls.tags.slice(0, 3).join(', ')} operations. ${cls.semanticSummary}`,
        type: 'reasoning'
      });
    }
  }

  // Comparison QA
  const comparisons: [string, string, string][] = [
    ['Stack', 'Queue', 'Stack is LIFO (last-in-first-out) while Queue is FIFO (first-in-first-out).'],
    ['Deque', 'Queue', 'Deque allows insertion and deletion at both ends, while Queue only at front/back.'],
    ['TreeMap', 'HashMap', 'TreeMap maintains sorted key order with O(log n) ops, HashMap is unordered with O(1) average.'],
    ['DoublyLinkedList', 'SinglyLinkedList', 'DoublyLinkedList has prev pointers allowing bidirectional traversal, SinglyLinkedList only has next pointers.'],
    ['RedBlackTree', 'AVLTree', 'Both are self-balancing. AVL is more strictly balanced (faster lookups), Red-Black has faster insertions.']
  ];

  for (const [a, b, diff] of comparisons) {
    if (classes.some(c => c.name === a) && classes.some(c => c.name === b)) {
      pairs.push({
        instruction: `What is the difference between ${a} and ${b}?`,
        output: diff,
        type: 'comparison'
      });
    }
  }

  return pairs;
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
      }

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
        complexitySummary
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
    complexityIndex,
    trainingData: {
      qa,
      totalPairs: qa.length
    },
    stats: {
      totalAtoms: atoms.length,
      totalClasses: classes.length,
      totalMethods: atoms.filter(a => a.type === 'method').length,
      categoryCounts
    }
  };

  // Write main schema
  const outputPath = path.join(__dirname, '..', 'docs', 'schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

  // Write embeddings-only file (smaller, for vector DB)
  const embeddingsPath = path.join(__dirname, '..', 'docs', 'embeddings.jsonl');
  const embeddingsLines = atoms.map(a => JSON.stringify({ id: a.id, text: a.embeddingText, tags: a.tags }));
  fs.writeFileSync(embeddingsPath, embeddingsLines.join('\n'));

  // Write training data separately
  const trainingPath = path.join(__dirname, '..', 'docs', 'training-qa.jsonl');
  const trainingLines = qa.map(q => JSON.stringify(q));
  fs.writeFileSync(trainingPath, trainingLines.join('\n'));

  console.log(`\n✅ Schema generated successfully!`);
  console.log(`   📄 ${outputPath} (full schema)`);
  console.log(`   📄 ${embeddingsPath} (embedding texts)`);
  console.log(`   📄 ${trainingPath} (training QA pairs)`);
  console.log(`\n📊 Stats:`);
  console.log(`   🧬 ${atoms.length} knowledge atoms`);
  console.log(`   📦 ${classes.length} classes`);
  console.log(`   🔧 ${atoms.filter(a => a.type === 'method').length} methods`);
  console.log(`   ❓ ${qa.length} QA pairs`);
  console.log(`   🏷️ Complexity buckets: ${Object.keys(complexityIndex).join(', ')}`);
}

generateSchema().catch(console.error);
