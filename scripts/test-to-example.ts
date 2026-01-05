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
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumeric characters with spaces
    .split(' ') // Separate strings by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // The first letter is capitalized, the rest are lowercase
    .join(''); // Combine into a string
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

const fileName = 'README.md';

/**
 * Recursively retrieve all `.ts` files in a directory.
 */
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

/**
 *Calculate the end position of the parenthesis balance
 * Used to extract the actual parameter in expect() precisely
 */
function findBalancedParenClose(str: string, startIdx: number): number {
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    else if (char === ')') {
      depth--;
      if (depth === 0) return i;
    } else if (char === '"' || char === "'" || char === '`') {
      // Skip strings
      const quote = char;
      i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\') i++; // Skip escape characters
        i++;
      }
    }
  }
  return -1;
}

/**
 * Accurately convert expect statements from the AST perspective
 * Avoid parentheses nesting issues for regular expressions
 */
function transformExpectStatementsWithAST(codeBlock: string): string {
  const sourceFile = ts.createSourceFile('temp.ts', codeBlock, ts.ScriptTarget.Latest, true);

  const replacements: Array<{ start: number; end: number; replacement: string }> = [];

  function visit(node: ts.Node) {
    // Look for expect(...). method(...).
    if (ts.isCallExpression(node) && node.expression && ts.isPropertyAccessExpression(node.expression)) {
      const propAccess = node.expression;
      const methodName = propAccess.name.text;

      // Check if it's an expect() call
      if (propAccess.expression && ts.isCallExpression(propAccess.expression)) {
        const expectCall = propAccess.expression;

        if (
          expectCall.expression &&
          ts.isIdentifier(expectCall.expression) &&
          expectCall.expression.text === 'expect'
        ) {
          const actual = expectCall.arguments[0]?.getFullText(sourceFile)?.trim() || '';
          const expected = node.arguments[0]?.getFullText(sourceFile)?.trim() || '';
          const notModifier = propAccess.name.parent ? '' : '';

          // Check for .not modifiers
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

  // Replace from back to front to avoid offset changes
  replacements.sort((a, b) => b.start - a.start);
  let result = codeBlock;
  for (const replacement of replacements) {
    result = result.slice(0, replacement.start) + replacement.replacement + result.slice(replacement.end);
  }

  return result;
}

/**
 * Convert Jest matcher to annotation
 */
function convertMatcherToComment(method: string, expected: string): string {
  const matchers: Record<string, (exp: string) => string> = {
    // Boolean/type check
    toBeUndefined: () => 'undefined',
    toBeNull: () => 'null',
    toBeTruthy: () => 'truthy',
    toBeFalsy: () => 'falsy',
    toBeDefined: () => 'defined',

    // Numerical comparison
    toBeGreaterThan: (exp: string) => `> ${exp}`,
    toBeGreaterThanOrEqual: (exp: string) => `>= ${exp}`,
    toBeLessThan: (exp: string) => `< ${exp}`,
    toBeLessThanOrEqual: (exp: string) => `<= ${exp}`,

    // Equivalent check
    toBe: (exp: string) => exp,
    toEqual: (exp: string) => exp,
    toStrictEqual: (exp: string) => exp,

    // Container inspection
    toContain: (exp: string) => `contains ${exp}`,
    toContainEqual: (exp: string) => `contains ${exp}`,
    toHaveLength: (exp: string) => `length: ${exp}`,
    toHaveProperty: (exp: string) => `has property ${exp}`,

    // string/regular
    toMatch: (exp: string) => `matches ${exp}`,

    // Anomaly check
    toThrow: (exp: string) => (exp ? `throws ${exp}` : 'throws')
  };

  const matcherFn = matchers[method];
  if (!matcherFn) return method; // Unknown matcher

  // For matchers that don't require parameters
  if (['toBeUndefined', 'toBeNull', 'toBeTruthy', 'toBeFalsy', 'toBeDefined'].includes(method)) {
    return matcherFn('');
  }

  // Cleanup of expected parameters for multiple rows
  const cleanExpected = expected.replace(/\n/g, '\n //');
  return matcherFn(cleanExpected);
}

/**
 * Extract test cases with `@example` from TypeScript files using AST.
 */
function extractExamplesFromFile(filePath: string): { name: string; body: string }[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
  const examples: { name: string; body: string }[] = [];

  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) && // Ensure it's a function call
      node.arguments.length >= 2 && // At least two arguments
      ts.isStringLiteral(node.arguments[0]) && // First argument is a string
      node.arguments[0].text.startsWith('@example') && // Matches @example
      ts.isArrowFunction(node.arguments[1]) // Second argument is an arrow function
    ) {
      const exampleName = node.arguments[0].text.replace('@example ', '').trim();
      const bodyNode = node.arguments[1].body;
      let exampleBody: string;

      if (ts.isBlock(bodyNode)) {
        // If it's a block, remove outer {}
        exampleBody = bodyNode.statements
          .map(stmt => stmt.getFullText(sourceFile))
          .join('')
          .trim();
      } else {
        // If it's a single expression, use it directly
        exampleBody = bodyNode.getFullText(sourceFile).trim();
      }

      // Use AST to convert expect statements
      const transformedBody = transformExpectStatementsWithAST(exampleBody).trim();
      examples.push({ name: exampleName, body: transformedBody });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return examples;
}

/**
 * Add examples to the corresponding class in the source file.
 */
function addExamplesToSourceFile(
  sourceFilePath: string,
  className: string,
  examples: { name: string; body: string }[]
): void {
  if (!fs.existsSync(sourceFilePath)) {
    console.warn(`Source file not found: ${sourceFilePath}`);
    return;
  }

  const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const sourceFile = ts.createSourceFile(sourceFilePath, sourceContent, ts.ScriptTarget.Latest, true);
  const classNode = sourceFile.statements.find(stmt => ts.isClassDeclaration(stmt) && stmt.name?.text === className) as
    | ts.ClassDeclaration
    | undefined;

  if (!classNode) return;

  // getFullStart() includes leading comments/trivia
  const fullStart = classNode.getFullStart();
  const classStart = classNode.getStart(sourceFile); // usually points at `export class ...`

  // Search only in the leading trivia region for the nearest JSDoc block
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

  const existingCommentInner = existingCommentMatch[1]; // keep inner as-is, including leading newline

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
    // Replace from the first " * @example" to the end of the block (before */)
    newInner = existingCommentInner.replace(/ \* @example[\s\S]*?(?=\*\/|$)/g, exampleSection);
  } else {
    newInner = existingCommentInner.replace(/\s*$/, '\n') + exampleSection;
  }

  // Rebuild full comment block
  const newCommentBlock = `/**${newInner.replace(/^\n?/, '\n').replace(/\s*$/, '\n')} */`;
  const updatedContent =
    sourceContent.slice(0, commentStart) + newCommentBlock + sourceContent.slice(commentEndInclusive);

  fs.writeFileSync(sourceFilePath, updatedContent, 'utf-8');
  console.log(`Updated examples in ${sourceFilePath}`);
}

/**
 * Process all test files and update README.md and source files.
 */
function updateExamples(testDir: string, sourceBaseDir: string): void {
  const testFiles = getAllTestFiles(testDir);
  for (const file of testFiles) {
    const examples = extractExamplesFromFile(file);
    if (examples.length === 0) {
      console.log(`No @example found in test file: ${file}`);
      continue;
    }

    const relativePath = path.relative(testDir, file);
    const sourceFilePath = path.resolve(sourceBaseDir, relativePath.replace('.test.ts', '.ts'));

    let className = toPascalCase(path.basename(sourceFilePath, '.ts'));
    if (className === 'Bst') className = 'BST';
    if (className === 'AvlTree') className = 'AVLTree';
    className = classMap[className] || className;

    addExamplesToSourceFile(sourceFilePath, className, examples);

    const dirKey = dirMap[className];

    if (!dirKey) {
      console.warn(`No directory mapping found for class: ${className}`);
      continue;
    }

    const newExamples = examples.map(example => {
      const indentedBody = ' ' + example.body;
      return `### ${example.name}\n\`\`\`typescript\n${indentedBody}\n\`\`\``;
    });

    if (isReplaceMD && newExamples.length > 0) {
      if (dirKey instanceof Array && dirKey.length > 0) {
        for (const readmeRoot of dirKey) {
          const readmePath = path.resolve(pkgRootDir, readmeRoot, fileName);
          replaceExamplesInReadme(readmePath, newExamples);
        }
      } else if (typeof dirKey === 'string') {
        const readmePath = path.resolve(pkgRootDir, dirKey, fileName);
        replaceExamplesInReadme(readmePath, newExamples);
      }
    }
  }
}

/**
 * Replace content between markers in README.md.
 */
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
  console.log(`${fileName} updated with new examples.`);
}

// Run the script
const testDir = path.resolve(__dirname, '../test/unit');
const sourceBaseDir = path.resolve(__dirname, '../src');
updateExamples(testDir, sourceBaseDir);
