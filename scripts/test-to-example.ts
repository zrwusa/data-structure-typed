// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
import * as ts from 'typescript';

const filePath = path.resolve(__dirname, './config.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const config = JSON.parse(fileContent);

function toPascalCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const isReplaceMD = true;
const START_MARKER = '[//]: # (No deletion!!! Start of Example Replace Section)';
const END_MARKER = '[//]: # (No deletion!!! End of Example Replace Section)';
const pkgRootDir = config.individualsDir;

const dirMap: Record<string, string | string[]> = {
  Heap: 'heap-typed',
  AvlTree: 'avl-tree-typed',
  BinaryTree: 'binary-tree-typed',
  BST: 'bst-typed',
  Deque: 'deque-typed',
  DirectedGraph: 'directed-graph-typed',
  DoublyLinkedList: ['doubly-linked-list-typed', 'linked-list-typed'],
  Graph: 'graph-typed',
  LinkedList: 'linked-list-typed',
  MaxHeap: 'max-heap-typed',
  MaxPriorityQueue: 'max-priority-queue-typed',
  MinHeap: 'min-heap-typed',
  MinPriorityQueue: 'min-priority-queue-typed',
  PriorityQueue: 'priority-queue-typed',
  SinglyLinkedList: 'singly-linked-list-typed',
  Queue: 'queue-typed',
  RedBlackTree: 'red-black-tree-typed',
  Stack: 'stack-typed',
  TreeMultimap: 'tree-multimap-typed',
  Trie: 'trie-typed',
  UndirectedGraph: 'undirected-graph-typed'
};

const classMap: Record<string, string> = {
  Bst: 'BST',
  AvlTree: 'AVLTree',
  AvlTreeMultiMap: 'AVLTreeMultiMap',
  AvlTreeCounter: 'AVLTreeCounter'
};

/**
 * Class name → source file path (relative to src/data-structures/).
 * Used for [Class.method] tagged examples where file name ≠ class name.
 */
const classToSourceFile: Record<string, string> = {

  SegmentTree: 'binary-tree/segment-tree.ts',
  BinaryIndexedTree: 'binary-tree/binary-indexed-tree.ts',
  RedBlackTree: 'binary-tree/red-black-tree.ts',
  AVLTree: 'binary-tree/avl-tree.ts',
  BST: 'binary-tree/bst.ts',
  BinaryTree: 'binary-tree/binary-tree.ts',
  TreeMap: 'binary-tree/tree-map.ts',
  TreeSet: 'binary-tree/tree-set.ts',
  TreeMultiMap: 'binary-tree/tree-multi-map.ts',
  TreeMultiSet: 'binary-tree/tree-multi-set.ts',
  SkipList: 'linked-list/skip-linked-list.ts',
  SinglyLinkedList: 'linked-list/singly-linked-list.ts',
  DoublyLinkedList: 'linked-list/doubly-linked-list.ts',
  HashMap: 'hash/hash-map.ts',
  LinkedHashMap: 'hash/hash-map.ts',
  Heap: 'heap/heap.ts',
  MinHeap: 'heap/min-heap.ts',
  MaxHeap: 'heap/max-heap.ts',
  MinPriorityQueue: 'priority-queue/min-priority-queue.ts',
  MaxPriorityQueue: 'priority-queue/max-priority-queue.ts',
  PriorityQueue: 'priority-queue/priority-queue.ts',
  Queue: 'queue/queue.ts',
  Deque: 'queue/deque.ts',
  Stack: 'stack/stack.ts',
  DirectedGraph: 'graph/directed-graph.ts',
  UndirectedGraph: 'graph/undirected-graph.ts',
  MapGraph: 'graph/map-graph.ts',
  Trie: 'trie/trie.ts',
  Matrix: 'matrix/matrix.ts'
};

/**
 * Inheritance chains: base class → direct subclasses.
 * When a [Base.method] @example is injected, it propagates to all
 * subclasses that override (or inherit) that method.
 */
const inheritanceMap: Record<string, string[]> = {
  BinaryTree: ['BST'],
  BST: ['AVLTree', 'RedBlackTree'],
  RedBlackTree: ['TreeMap', 'TreeSet', 'TreeMultiMap', 'TreeMultiSet'],
  Heap: ['MinHeap', 'MaxHeap', 'PriorityQueue'],
  PriorityQueue: ['MinPriorityQueue', 'MaxPriorityQueue'],
  // DirectedGraph / UndirectedGraph don't have deep subclass chains we need
};

/** Get all descendants of a class (recursive). */
function getDescendants(className: string): string[] {
  const direct = inheritanceMap[className] || [];
  const all: string[] = [...direct];
  for (const child of direct) {
    all.push(...getDescendants(child));
  }
  return all;
}

/**
 * Class name → preferred variable name for examples.
 */
const classToVarName: Record<string, string> = {
  BinaryTree: 'tree',
  BST: 'bst',
  AVLTree: 'avl',
  RedBlackTree: 'rbt',
  TreeMap: 'tm',
  TreeSet: 'ts',
  TreeMultiMap: 'tmm',
  TreeMultiSet: 'tms',
  Heap: 'heap',
  MinHeap: 'minHeap',
  MaxHeap: 'maxHeap',
  PriorityQueue: 'pq',
  MinPriorityQueue: 'minPQ',
  MaxPriorityQueue: 'maxPQ',
};

/**
 * Rewrite example code: replace source class name with target class name.
 * e.g., `new BST<number>(...)` → `new RedBlackTree<number>(...)`
 *        `const bst = ...`    → `const rbt = ...`
 */
function rewriteExampleForClass(body: string, sourceClass: string, targetClass: string): string {
  const sourceVar = classToVarName[sourceClass] || sourceClass.charAt(0).toLowerCase() + sourceClass.slice(1);
  const targetVar = classToVarName[targetClass] || targetClass.charAt(0).toLowerCase() + targetClass.slice(1);

  let result = body;
  // Replace constructor: new BST → new RedBlackTree
  result = result.replace(new RegExp(`\\bnew ${sourceClass}\\b`, 'g'), `new ${targetClass}`);
  // Replace variable declarations: const bst → const rbt
  result = result.replace(new RegExp(`\\b(const|let|var)\\s+${sourceVar}\\b`, 'g'), `$1 ${targetVar}`);
  // Replace variable usage: bst. → rbt.  (only whole-word before dot/bracket/comma/paren/semicolon/space)
  result = result.replace(new RegExp(`\\b${sourceVar}([.\\[,);\\s])`, 'g'), `${targetVar}$1`);
  // Replace variable at end of line
  result = result.replace(new RegExp(`\\b${sourceVar}$`, 'gm'), targetVar);

  return result;
}

const fileName = 'README.md';

// ─── File helpers ─────────────────────────────────────────────

function getAllTestFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter(file => !file.isDirectory() && file.name.endsWith('.ts'))
    .map(file => path.join(dir, file.name));
  const directories = entries.filter(entry => entry.isDirectory());
  for (const directory of directories) {
    files.push(...getAllTestFiles(path.join(dir, directory.name)));
  }
  return files;
}

// ─── Parenthesis balancing ────────────────────────────────────

function findBalancedParenClose(str: string, startIdx: number): number {
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    else if (char === ')') {
      depth--;
      if (depth === 0) return i;
    } else if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\') i++;
        i++;
      }
    }
  }
  return -1;
}

// ─── expect → comment conversion (AST) ───────────────────────

function transformExpectStatementsWithAST(codeBlock: string): string {
  const sourceFile = ts.createSourceFile('temp.ts', codeBlock, ts.ScriptTarget.Latest, true);
  const replacements: Array<{ start: number; end: number; replacement: string }> = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && node.expression && ts.isPropertyAccessExpression(node.expression)) {
      const propAccess = node.expression;
      const methodName = propAccess.name.text;

      if (propAccess.expression && ts.isCallExpression(propAccess.expression)) {
        const expectCall = propAccess.expression;

        if (
          expectCall.expression &&
          ts.isIdentifier(expectCall.expression) &&
          expectCall.expression.text === 'expect'
        ) {
          const actual = expectCall.arguments[0]?.getFullText(sourceFile)?.trim() || '';
          const expected = node.arguments[0]?.getFullText(sourceFile)?.trim() || '';

          const hasNot =
            propAccess.expression.parent &&
            ts.isPropertyAccessExpression(propAccess.expression.parent) &&
            propAccess.expression.parent.name.text === 'not';

          const notStr = hasNot ? 'not ' : '';
          const comment = convertMatcherToComment(methodName, expected);
          const replacement = `console.log(${actual}); // ${notStr}${comment}`;

          replacements.push({
            start: expectCall.getStart(sourceFile),
            end: node.getEnd(),
            replacement
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  replacements.sort((a, b) => b.start - a.start);
  let result = codeBlock;
  for (const replacement of replacements) {
    result = result.slice(0, replacement.start) + replacement.replacement + result.slice(replacement.end);
  }
  return result;
}

function convertMatcherToComment(method: string, expected: string): string {
  const matchers: Record<string, (exp: string) => string> = {
    toBeUndefined: () => 'undefined',
    toBeNull: () => 'null',
    toBeTruthy: () => 'truthy',
    toBeFalsy: () => 'falsy',
    toBeDefined: () => 'defined',
    toBeGreaterThan: (exp: string) => `> ${exp}`,
    toBeGreaterThanOrEqual: (exp: string) => `>= ${exp}`,
    toBeLessThan: (exp: string) => `< ${exp}`,
    toBeLessThanOrEqual: (exp: string) => `<= ${exp}`,
    toBe: (exp: string) => exp,
    toEqual: (exp: string) => exp,
    toStrictEqual: (exp: string) => exp,
    toContain: (exp: string) => `contains ${exp}`,
    toContainEqual: (exp: string) => `contains ${exp}`,
    toHaveLength: (exp: string) => `length: ${exp}`,
    toHaveProperty: (exp: string) => `has property ${exp}`,
    toMatch: (exp: string) => `matches ${exp}`,
    toThrow: (exp: string) => (exp ? `throws ${exp}` : 'throws')
  };

  const matcherFn = matchers[method];
  if (!matcherFn) return method;

  if (['toBeUndefined', 'toBeNull', 'toBeTruthy', 'toBeFalsy', 'toBeDefined'].includes(method)) {
    return matcherFn('');
  }

  const cleanExpected = expected.replace(/\n/g, '\n //');
  return matcherFn(cleanExpected);
}

// ─── Extract examples from test files ─────────────────────────

interface ExampleEntry {
  name: string;
  body: string;
  /** If tagged [Class.method], set className + methodName */
  className?: string;
  methodName?: string;
}

const TAG_RE = /^\[([A-Za-z]+)(?:\.([A-Za-z]+))?\]\s+(.+)$/;

function extractExamplesFromFile(filePath: string): ExampleEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const examples: ExampleEntry[] = [];

  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      node.arguments.length >= 2 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text.startsWith('@example') &&
      ts.isArrowFunction(node.arguments[1])
    ) {
      const rawName = node.arguments[0].text.replace('@example ', '').trim();
      const bodyNode = node.arguments[1].body;
      let exampleBody: string;

      if (ts.isBlock(bodyNode)) {
        exampleBody = bodyNode.statements
          .map(stmt => stmt.getFullText(sourceFile))
          .join('')
          .trim();
      } else {
        exampleBody = bodyNode.getFullText(sourceFile).trim();
      }

      const transformedBody = transformExpectStatementsWithAST(exampleBody).trim();

      // Parse [Class.method] or [Class] tag
      const tagMatch = rawName.match(TAG_RE);
      if (tagMatch) {
        const [, className, methodName, description] = tagMatch;
        examples.push({
          name: description,
          body: transformedBody,
          className,
          methodName: methodName || undefined
        });
      } else {
        // No tag — class-level (legacy behavior)
        examples.push({ name: rawName, body: transformedBody });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return examples;
}

// ─── Inject into class-level JSDoc ────────────────────────────

function addExamplesToSourceFile(
  sourceFilePath: string,
  className: string,
  examples: ExampleEntry[]
): void {
  if (!fs.existsSync(sourceFilePath)) {
    console.warn(`Source file not found: ${sourceFilePath}`);
    return;
  }

  const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const sf = ts.createSourceFile(sourceFilePath, sourceContent, ts.ScriptTarget.Latest, true);
  const classNode = sf.statements.find(
    stmt => ts.isClassDeclaration(stmt) && stmt.name?.text === className
  ) as ts.ClassDeclaration | undefined;

  if (!classNode) return;

  const fullStart = classNode.getFullStart();
  const classStart = classNode.getStart(sf);
  const leadingRegion = sourceContent.slice(fullStart, classStart);
  const commentStartInLeading = leadingRegion.lastIndexOf('/**');

  if (commentStartInLeading === -1) {
    console.warn(`No existing comment found for class: ${className}`);
    return;
  }

  const commentStart = fullStart + commentStartInLeading;
  const commentEnd = sourceContent.indexOf('*/', commentStart);
  if (commentEnd === -1 || commentEnd > classStart) {
    console.warn(`Malformed comment for class: ${className}`);
    return;
  }

  const commentEndInclusive = commentEnd + 2;
  const existingCommentBlock = sourceContent.slice(commentStart, commentEndInclusive);
  const existingCommentMatch = existingCommentBlock.match(/\/\*\*([\s\S]*?)\*\//);
  if (!existingCommentMatch) {
    console.warn(`No existing comment found for class: ${className}`);
    return;
  }

  const existingCommentInner = existingCommentMatch[1];

  const exampleSection =
    examples
      .map(example => {
        const indentedBody = ' ' + example.body;
        return ` * @example\n * // ${example.name}\n${indentedBody
          .split('\n')
          .map(line => (line.trim() === '' ? ` *` : ` * ${line}`))
          .join('\n')}`;
      })
      .join('\n') + '\n';

  let newInner: string;
  if (existingCommentInner.includes('@example')) {
    newInner = existingCommentInner.replace(/ \* @example[\s\S]*?(?=\*\/|$)/g, exampleSection);
  } else {
    newInner = existingCommentInner.replace(/\s*$/, '\n') + exampleSection;
  }

  const newCommentBlock = `/**${newInner.replace(/^\n?/, '\n').replace(/\s*$/, '\n')} */`;
  const updatedContent =
    sourceContent.slice(0, commentStart) + newCommentBlock + sourceContent.slice(commentEndInclusive);

  // Clean up whitespace-only lines
  const cleanedContent = updatedContent
    .replace(/^[ \t]+$/gm, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/\n\n(\s*\* @example)/g, '\n$1');
  fs.writeFileSync(sourceFilePath, cleanedContent, 'utf-8');
  console.log(`  ✅ [class] ${className} ← ${examples.length} example(s)`);
}

// ─── Inject into method-level JSDoc ───────────────────────────

function addExampleToMethod(
  sourceFilePath: string,
  className: string,
  methodName: string,
  example: ExampleEntry
): boolean {
  if (!fs.existsSync(sourceFilePath)) {
    console.warn(`Source file not found: ${sourceFilePath}`);
    return false;
  }

  let sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const sf = ts.createSourceFile(sourceFilePath, sourceContent, ts.ScriptTarget.Latest, true);

  // Find the class
  const classNode = sf.statements.find(
    stmt => ts.isClassDeclaration(stmt) && stmt.name?.text === className
  ) as ts.ClassDeclaration | undefined;

  if (!classNode) {
    console.warn(`  ⚠️  Class "${className}" not found in ${sourceFilePath}`);
    return false;
  }

  // Find the method member
  const member = classNode.members.find(m => {
    if (ts.isMethodDeclaration(m) || ts.isGetAccessorDeclaration(m) || ts.isSetAccessorDeclaration(m)) {
      return m.name && ts.isIdentifier(m.name) && m.name.text === methodName;
    }
    return false;
  });

  if (!member) {
    // Method not found in this class — likely inherited from base (not overridden).
    return false;
  }

  const memberStart = member.getStart(sf);
  const memberFullStart = member.getFullStart();

  // Look for existing JSDoc in leading trivia
  const leadingRegion = sourceContent.slice(memberFullStart, memberStart);
  const jsdocEndInLeading = leadingRegion.lastIndexOf('*/');

  const indentedBody = ' ' + example.body;
  const exampleBlock = ` * @example\n * // ${example.name}\n${indentedBody
    .split('\n')
    .map(line => (line.trim() === '' ? ` *` : ` * ${line}`))
    .join('\n')}\n`;

  if (jsdocEndInLeading !== -1) {
    // Existing JSDoc found
    const jsdocStart = leadingRegion.lastIndexOf('/**', jsdocEndInLeading);
    const absJsdocStart = memberFullStart + jsdocStart;
    const absJsdocEnd = memberFullStart + jsdocEndInLeading + 2;
    const existingJsdoc = sourceContent.slice(absJsdocStart, absJsdocEnd);

    if (existingJsdoc.includes('@example')) {
      // Replace existing @example block(s) with new one
      const updatedJsdoc = existingJsdoc.replace(/ \* @example[\s\S]*?(?= \* @[a-z]|\s*\*\/)/g, '');
      const updatedEnd = updatedJsdoc.lastIndexOf('*/');
      const newJsdoc = updatedJsdoc.slice(0, updatedEnd) + exampleBlock + updatedJsdoc.slice(updatedEnd);
      sourceContent = sourceContent.slice(0, absJsdocStart) + newJsdoc + sourceContent.slice(absJsdocEnd);
    } else {
      // Insert before closing */
      const insertPos = memberFullStart + jsdocEndInLeading;
      sourceContent = sourceContent.slice(0, insertPos) + exampleBlock + sourceContent.slice(insertPos);
    }
  } else {
    // No JSDoc — create one
    const indent = '  '; // 2-space class member indent
    const newJsdoc = `${indent}/**\n${indent} * ${example.name}\n${indent}${exampleBlock}${indent} */\n${indent}`;
    sourceContent = sourceContent.slice(0, memberStart) + newJsdoc + sourceContent.slice(memberStart);
  }

  // Clean up whitespace-only lines (prevent accumulation from repeated runs)
  sourceContent = sourceContent.replace(/^[ \t]+$/gm, '');
  // Collapse 3+ consecutive blank lines into 2
  sourceContent = sourceContent.replace(/\n{4,}/g, '\n\n\n');
  // Remove blank lines before * @example inside JSDoc
  sourceContent = sourceContent.replace(/\n\n(\s*\* @example)/g, '\n$1');
  fs.writeFileSync(sourceFilePath, sourceContent);
  console.log(`  ✅ [method] ${className}.${methodName} ← "${example.name}"`);
  return true;
}

// ─── README.md update ─────────────────────────────────────────

function replaceExamplesInReadme(readmePath: string, newExamples: string[]): void {
  let readmeContent: string;
  try {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  } catch (error) {
    console.warn(`Failed to read ${fileName} at ${readmePath}: ${error}`);
    return;
  }

  const startIdx = readmeContent.indexOf(START_MARKER);
  const endIdx = readmeContent.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${readmePath}`);
  }

  const before = readmeContent.slice(0, startIdx + START_MARKER.length);
  const after = readmeContent.slice(endIdx);
  const updatedContent = `${before}\n\n${newExamples.join('\n\n')}\n\n${after}`;

  fs.writeFileSync(readmePath, updatedContent, 'utf-8');
  console.log(`  📄 ${readmePath} updated`);
}

// ─── Main orchestrator ────────────────────────────────────────

function updateExamples(testDir: string, sourceBaseDir: string): void {
  const testFiles = getAllTestFiles(testDir);
  let totalMethod = 0;
  let totalClass = 0;

  for (const file of testFiles) {
    const examples = extractExamplesFromFile(file);
    if (examples.length === 0) continue;

    // Split into tagged (method/class-level) and untagged (legacy class-level)
    const taggedMethod = examples.filter(e => e.className && e.methodName);
    const taggedClass = examples.filter(e => e.className && !e.methodName);
    const untagged = examples.filter(e => !e.className);

    // --- Method-level: [Class.method] tagged ---
    for (const ex of taggedMethod) {
      const relFile = classToSourceFile[ex.className!];
      if (!relFile) {
        console.warn(`  ⚠️  Unknown class "${ex.className}" in tag`);
        continue;
      }
      const srcPath = path.resolve(sourceBaseDir, 'data-structures', relFile);
      addExampleToMethod(srcPath, ex.className!, ex.methodName!, ex);
      totalMethod++;

      // Propagate to subclasses that override or inherit this method
      const descendants = getDescendants(ex.className!);
      for (const desc of descendants) {
        const descFile = classToSourceFile[desc];
        if (!descFile) continue;
        const descPath = path.resolve(sourceBaseDir, 'data-structures', descFile);
        // Rewrite example code with target class name
        const rewrittenBody = rewriteExampleForClass(ex.body, ex.className!, desc);
        const rewrittenEx: ExampleEntry = {
          ...ex,
          body: rewrittenBody
        };
        addExampleToMethod(descPath, desc, ex.methodName!, rewrittenEx);
        totalMethod++;
      }
    }

    // --- Class-level: [Class] tagged ---
    for (const ex of taggedClass) {
      const relFile = classToSourceFile[ex.className!];
      if (!relFile) {
        console.warn(`  ⚠️  Unknown class "${ex.className}" in tag`);
        continue;
      }
      const srcPath = path.resolve(sourceBaseDir, 'data-structures', relFile);
      addExamplesToSourceFile(srcPath, ex.className!, [ex]);
      totalClass++;
    }

    // --- Untagged: legacy file-name → class mapping ---
    if (untagged.length > 0) {
      const relativePath = path.relative(testDir, file);
      const sourceFilePath = path.resolve(sourceBaseDir, relativePath.replace('.test.ts', '.ts'));

      let className = toPascalCase(path.basename(sourceFilePath, '.ts'));
      if (className === 'Bst') className = 'BST';
      if (className === 'AvlTree') className = 'AVLTree';
      className = classMap[className] || className;

      addExamplesToSourceFile(sourceFilePath, className, untagged);
      totalClass++;

      // README update for individual packages
      const dirKey = dirMap[className];
      if (dirKey && isReplaceMD) {
        const newExamples = untagged.map(example => {
          const indentedBody = ' ' + example.body;
          return `### ${example.name}\n\`\`\`typescript\n${indentedBody}\n\`\`\``;
        });

        if (newExamples.length > 0) {
          if (dirKey instanceof Array) {
            for (const readmeRoot of dirKey) {
              const readmePath = path.resolve(pkgRootDir, readmeRoot, fileName);
              replaceExamplesInReadme(readmePath, newExamples);
            }
          } else {
            const readmePath = path.resolve(pkgRootDir, dirKey, fileName);
            replaceExamplesInReadme(readmePath, newExamples);
          }
        }
      }
    }
  }

  console.log(`\n✅ Done: ${totalMethod} method-level, ${totalClass} class-level injections`);
}

// Run
const testDir = path.resolve(__dirname, '../test/unit');
const sourceBaseDir = path.resolve(__dirname, '../src');
updateExamples(testDir, sourceBaseDir);
