import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';
import { toPascalCase } from './test/utils';

const isReplaceMD = false;
const START_MARKER = '[//]: # (No deletion!!! Start of Example Replace Section)';
const END_MARKER = '[//]: # (No deletion!!! End of Example Replace Section)';

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
          /expect\((.*?)\)\.(toEqual|toBe|toStrictEqual|toHaveLength|toMatchObject)\((.*?)\);/g,
          (match, actual, method, expected) => {
            return `console.log(${actual}); // ${expected.trim()}`;
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

    const existingCommentInner = existingCommentMatch[1]; // Extract comment content (excluding `/**` and `*/`)

    // Replace @example part
    const exampleSection = examples
      .map(
        example =>
          `@example \n * \/\/ ${example.name} \n${example.body
            .split('\n')
            .map(line => ` * ${line}`)
            .join('\n')}\n * \n`
      )
      .join('\n');

    let newComment = '';
    if (existingCommentInner.includes('@example')) {
      newComment = existingCommentInner.replace(/@example[\s\S]*?(?=\*\/|$)/g, exampleSection);
    } else {
      newComment = existingCommentInner + `\n * ${exampleSection}`;
    }


    // Replace original content
    updatedContent =
      sourceContent.slice(0, classStart - existingCommentInner.length - 1) +
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
function updateExamples(testDir: string, readmePath: string, sourceBaseDir: string): void {
  const testFiles = getAllTestFiles(testDir);

  let allExamples: string[] = [];
  for (const file of testFiles) {
    const examples = extractExamplesFromFile(file);

    if (examples.length === 0) {
      console.log(`No @example found in test file: ${file}`);
      continue;
    }

    const relativePath = path.relative(testDir, file);
    const sourceFilePath = path.resolve(sourceBaseDir, relativePath.replace('.test.ts', '.ts'));
    const className = path.basename(sourceFilePath, '.ts');

    addExamplesToSourceFile(sourceFilePath, toPascalCase(className), examples);

    allExamples = allExamples.concat(
      examples.map(example => `### ${example.name}\n\`\`\`typescript\n${example.body}\n\`\`\``)
    );
  }

  if (isReplaceMD && allExamples.length > 0) {
    replaceExamplesInReadme(readmePath, allExamples);
  }
}

/**
 * Replace content between markers in README.md.
 */
function replaceExamplesInReadme(readmePath: string, newExamples: string[]): void {
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  const startIdx = readmeContent.indexOf(START_MARKER);
  const endIdx = readmeContent.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${readmePath}`);
  }

  const before = readmeContent.slice(0, startIdx + START_MARKER.length);
  const after = readmeContent.slice(endIdx);

  const updatedContent = `${before}\n\n${newExamples.join('\n\n')}\n\n${after}`;
  fs.writeFileSync(readmePath, updatedContent, 'utf-8');

  console.log(`README.md updated with new examples.`);
}

// Run the script
const testDir = path.resolve(__dirname, 'test/unit');
const readmePath = path.resolve(__dirname, 'README.md');
const sourceBaseDir = path.resolve(__dirname, 'src');

updateExamples(testDir, readmePath, sourceBaseDir);
