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
  Heap: "heap-typed",
  AvlTree: "avl-tree-typed",
  BinaryTree: "binary-tree-typed",
  BST: "bst-typed",
  Deque: "deque-typed",
  DirectedGraph: "directed-graph-typed",
  DoublyLinkedList: ["doubly-linked-list-typed", "linked-list-typed"],
  Graph: "graph-typed",
  LinkedList: "linked-list-typed",
  MaxHeap: "max-heap-typed",
  MaxPriorityQueue: "max-priority-queue-typed",
  MinHeap: "min-heap-typed",
  MinPriorityQueue: "min-priority-queue-typed",
  PriorityQueue: "priority-queue-typed",
  SinglyLinkedList: "singly-linked-list-typed",
  Queue: "queue-typed",
  RedBlackTree: "red-black-tree-typed",
  Stack: "stack-typed",
  TreeMultimap: "tree-multimap-typed",
  Trie: "trie-typed",
  UndirectedGraph: "undirected-graph-typed",
};

const classMap: Record<string, string> = {
  Bst: "BST",
  AvlTree: "AVLTree",
  AvlTreeMultiMap: "AVLTreeMultiMap",
  AvlTreeCounter: "AVLTreeCounter"
}

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

      const transformedBody = exampleBody
        .replace(
          /expect\((.*?)\)\.(toBeUndefined|toBeNull)\(\);/g,
          (match, actual, method) => {
            const expectedValue = method === 'toBeUndefined' ? 'undefined' : 'null';
            return `console.log(${actual}); // ${expectedValue}`;
          }
        )
        .replace(
          // @ts-ignore
          /expect\((.*?)\)\.(toEqual|toBe|toStrictEqual|toHaveLength|toMatchObject)\((.*?)\);/gs, // Use `s` flag for multiline
          (match, actual, method, expected) => {
              expected = expected.replace(/\n/g, '\n //')
            return `console.log(${actual}); // ${expected}`;
          }
        )
        .trim();

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

  let updatedContent = sourceContent;

  const classNode = sourceFile.statements.find(
    stmt => ts.isClassDeclaration(stmt) && stmt.name?.text === className
  ) as ts.ClassDeclaration | undefined;

  if (classNode) {
    const classStart = classNode.getStart(sourceFile);
    const classEnd = classNode.getEnd();
    const classText = classNode.getFullText(sourceFile);

    // Extract annotation content
    const existingCommentMatch = classText.match(/\/\*\*([\s\S]*?)\*\//);
    if (!existingCommentMatch) {
      console.warn(`No existing comment found for class: ${className}`);
      return;
    }

    const existingCommentInner = existingCommentMatch[1].replace(/^\n \* /, ''); // Extract comment content (excluding `/**` and `*/`)

    // Replace @example part
    const exampleSection = examples
      .map(
        example => {
          const indentedBody = '    ' + example.body;
          return ` * @example\n * \/\/ ${example.name}\n${indentedBody
            .split('\n')
            .map(line => {
              if (line.trim() === '') return ` *`
              return ` * ${line}`})
            .join('\n')}`
        }
      )
      .join('\n') + '\n ';

    let newComment = '';
    if (existingCommentInner.includes('@example')) {
      newComment = existingCommentInner.replace(/ \* @example[\s\S]*?(?=\*\/|$)/g, exampleSection);
    } else {
      newComment = existingCommentInner + `${exampleSection.trimStart()}`;
    }


    // Replace original content
    updatedContent =
      sourceContent.slice(0, classStart - existingCommentInner.length - 3) +
      newComment +
      classText.slice(existingCommentMatch[0].length).trim() +
      sourceContent.slice(classEnd);
  }

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



    const newExamples = examples.map(
      example => {
        const indentedBody = '    ' + example.body;
        return `### ${example.name}\n\`\`\`typescript\n${indentedBody}\n\`\`\``}
    );

    if (isReplaceMD && newExamples.length > 0) {
      if (dirKey instanceof Array && dirKey.length > 0) {
        for (const readmeRoot of dirKey) {
          const readmePath = path.resolve(pkgRootDir, readmeRoot, fileName);
          replaceExamplesInReadme(readmePath, newExamples);
        }
      }
      if (typeof dirKey === 'string') {
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
