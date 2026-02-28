/**
 * Schema Generator for data-structure-typed
 *
 * Generates a machine-readable JSON schema describing all data structures,
 * methods, complexity, and AI-friendly metadata.
 *
 * Usage: npx ts-node scripts/generate-schema.ts
 */

import { Project, ClassDeclaration, MethodDeclaration, JSDocTag, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

// Schema types
interface ComplexityInfo {
  best?: string;
  average?: string;
  worst?: string;
}

interface ParameterInfo {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

interface MethodInfo {
  name: string;
  kind: 'method' | 'getter' | 'setter';
  static: boolean;
  parameters: ParameterInfo[];
  returns: {
    type: string;
    description?: string;
  };
  timeComplexity?: ComplexityInfo;
  spaceComplexity?: ComplexityInfo;
  mutatesState?: boolean;
  description?: string;
  throws?: string[];
}

interface GenericParameter {
  name: string;
  constraint: string | null;
  default?: string;
}

interface StructureInfo {
  name: string;
  category: string;
  type: 'class' | 'interface';
  extends?: string;
  implements?: string[];
  genericParameters: GenericParameter[];
  description?: string;
  mutability: 'mutable' | 'immutable';
  threadSafe: boolean;
  complexitySummary: Record<string, string>;
  methods: MethodInfo[];
  properties: {
    name: string;
    type: string;
    readonly: boolean;
    description?: string;
  }[];
  designRationale?: string;
  alternativeTo?: string[];
  useCases?: string[];
  antiPatterns?: string[];
  aiHints?: {
    semanticTags?: string[];
    compareWith?: { structure: string; difference: string }[];
  };
}

interface LibrarySchema {
  library: string;
  version: string;
  language: string;
  generatedAt: string;
  structures: StructureInfo[];
}

// Category mapping based on file path
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

// Extract JSDoc tag value
function getJSDocTagValue(declaration: ClassDeclaration | MethodDeclaration, tagName: string): string | undefined {
  const jsDocs = declaration.getJsDocs();
  for (const jsDoc of jsDocs) {
    const tags = jsDoc.getTags();
    for (const tag of tags) {
      if (tag.getTagName() === tagName) {
        const text = tag.getCommentText();
        return text?.trim();
      }
    }
  }
  return undefined;
}

// Extract description from JSDoc
function getDescription(declaration: ClassDeclaration | MethodDeclaration): string | undefined {
  const jsDocs = declaration.getJsDocs();
  if (jsDocs.length > 0) {
    return jsDocs[0].getDescription()?.trim();
  }
  return undefined;
}

// Parse complexity string into structured format
function parseComplexity(complexityStr: string | undefined): ComplexityInfo | undefined {
  if (!complexityStr) return undefined;

  // Handle formats like "O(1)", "O(log n)", "O(n) average, O(n²) worst"
  const result: ComplexityInfo = {};

  if (complexityStr.includes('average') || complexityStr.includes('worst') || complexityStr.includes('best')) {
    const bestMatch = complexityStr.match(/O\([^)]+\)\s*best/i);
    const avgMatch = complexityStr.match(/O\([^)]+\)\s*average/i);
    const worstMatch = complexityStr.match(/O\([^)]+\)\s*worst/i);

    if (bestMatch) result.best = bestMatch[0].replace(/\s*best/i, '');
    if (avgMatch) result.average = avgMatch[0].replace(/\s*average/i, '');
    if (worstMatch) result.worst = worstMatch[0].replace(/\s*worst/i, '');
  } else {
    // Single complexity applies to all cases
    const match = complexityStr.match(/O\([^)]+\)/);
    if (match) {
      result.best = match[0];
      result.average = match[0];
      result.worst = match[0];
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

// Simplify type string (remove import paths, keep just the type name)
function simplifyType(typeStr: string): string {
  // Remove import(...) wrappers
  let simplified = typeStr.replace(/import\([^)]+\)\./g, '');
  // Simplify common patterns
  simplified = simplified.replace(/\s+/g, ' ').trim();
  return simplified;
}

// Extract method information
function extractMethodInfo(method: MethodDeclaration): MethodInfo {
  const name = method.getName();
  const isStatic = method.isStatic();

  // Parameters
  const parameters: ParameterInfo[] = method.getParameters().map(param => ({
    name: param.getName(),
    type: simplifyType(param.getType().getText()),
    optional: param.isOptional(),
    description: undefined // Could extract from @param JSDoc
  }));

  // Return type
  const returnType = simplifyType(method.getReturnType().getText());

  // Extract complexity from JSDoc
  const timeComplexity = parseComplexity(getJSDocTagValue(method, 'timeComplexity'));
  const spaceComplexity = parseComplexity(getJSDocTagValue(method, 'spaceComplexity'));

  // Description
  const description = getDescription(method);

  return {
    name,
    kind: 'method',
    static: isStatic,
    parameters,
    returns: {
      type: returnType,
      description: undefined
    },
    timeComplexity,
    spaceComplexity,
    mutatesState: undefined, // Could infer from method name or JSDoc
    description,
    throws: []
  };
}

// Extract class information
function extractClassInfo(classDecl: ClassDeclaration, filePath: string): StructureInfo {
  const name = classDecl.getName() || 'Unknown';
  const category = getCategory(filePath);

  // Generic parameters
  const genericParameters: GenericParameter[] = classDecl.getTypeParameters().map(tp => ({
    name: tp.getName(),
    constraint: tp.getConstraint()?.getText() || null,
    default: tp.getDefault()?.getText()
  }));

  // Extends
  const extendsClause = classDecl.getExtends();
  const extendsName = extendsClause?.getText();

  // Implements
  const implementsNames = classDecl.getImplements().map(i => i.getText());

  // Description
  const description = getDescription(classDecl);

  // Methods (public only)
  const methods: MethodInfo[] = classDecl
    .getMethods()
    .filter(m => !m.getName().startsWith('_') && m.getScope() !== 'private' && m.getScope() !== 'protected')
    .map(extractMethodInfo);

  // Properties (public only)
  const properties = classDecl
    .getProperties()
    .filter(p => !p.getName().startsWith('_') && p.getScope() !== 'private' && p.getScope() !== 'protected')
    .map(p => ({
      name: p.getName(),
      type: simplifyType(p.getType().getText()),
      readonly: p.isReadonly(),
      description: undefined
    }));

  // Build complexity summary from methods
  const complexitySummary: Record<string, string> = {};
  for (const method of methods) {
    if (method.timeComplexity?.average) {
      complexitySummary[method.name] = method.timeComplexity.average;
    }
  }

  return {
    name,
    category,
    type: 'class',
    extends: extendsName,
    implements: implementsNames.length > 0 ? implementsNames : undefined,
    genericParameters,
    description,
    mutability: 'mutable', // Default, could be inferred
    threadSafe: false,
    complexitySummary,
    methods,
    properties
  };
}

// Main function
async function generateSchema(): Promise<void> {
  console.log('🔍 Scanning TypeScript source files...');

  const project = new Project({
    tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json')
  });

  // Get all source files in data-structures directory
  const sourceFiles = project.getSourceFiles('src/data-structures/**/*.ts');

  console.log(`📁 Found ${sourceFiles.length} source files`);

  const structures: StructureInfo[] = [];

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();

    // Skip index files and base files
    if (filePath.endsWith('index.ts')) continue;

    const classes = sourceFile.getClasses();

    for (const classDecl of classes) {
      // Skip internal/private classes
      const className = classDecl.getName();
      if (!className || className.startsWith('_')) continue;

      // Skip abstract base classes for now (or include them with a flag)
      // if (classDecl.isAbstract()) continue;

      console.log(`  📦 Processing: ${className}`);

      const structureInfo = extractClassInfo(classDecl, filePath);
      structures.push(structureInfo);
    }
  }

  // Read package.json for version
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

  const schema: LibrarySchema = {
    library: 'data-structure-typed',
    version: packageJson.version,
    language: 'TypeScript',
    generatedAt: new Date().toISOString(),
    structures
  };

  // Write schema
  const outputPath = path.join(__dirname, '..', 'docs', 'schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

  console.log(`\n✅ Schema generated: ${outputPath}`);
  console.log(`   📊 ${structures.length} data structures documented`);

  // Summary
  const methodCount = structures.reduce((acc, s) => acc + s.methods.length, 0);
  console.log(`   🔧 ${methodCount} methods documented`);
}

generateSchema().catch(console.error);
