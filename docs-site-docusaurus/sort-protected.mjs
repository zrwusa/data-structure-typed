/**
 * Post-process TypeDoc markdown: move protected members to end of file.
 * Operates on H3 sections (### methodName) — checks for `protected` keyword.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if (full.endsWith('.md')) results.push(full);
  }
  return results;
}

function processFile(content) {
  const lines = content.split('\n');

  // Split into sections by H3 (### name)
  // Keep everything before first H3 as header
  const sections = [];
  let current = [];
  let inH3 = false;

  for (const line of lines) {
    if (line.startsWith('### ') && inH3) {
      sections.push(current);
      current = [line];
    } else if (line.startsWith('### ')) {
      // First H3 — push header
      sections.push(current);
      current = [line];
      inH3 = true;
    } else {
      current.push(line);
    }
  }
  sections.push(current);

  if (sections.length <= 2) return { content, changed: false }; // no H3 sections

  const header = sections[0]; // everything before first H3
  const h3Sections = sections.slice(1);

  // Classify: protected vs public
  const publicSections = [];
  const protectedSections = [];

  for (const section of h3Sections) {
    const text = section.slice(0, 10).join('\n'); // check first 10 lines
    if (text.includes('`protected`') || text.includes('protected ')) {
      protectedSections.push(section);
    } else {
      publicSections.push(section);
    }
  }

  if (protectedSections.length === 0) return { content, changed: false };

  // Add a divider before protected section
  const protectedHeader = ['', '---', '', '## Protected Members', ''];

  const result = [
    ...header,
    ...publicSections.flat(),
    ...protectedHeader,
    ...protectedSections.flat(),
  ].join('\n');

  return { content: result, changed: true };
}

const files = walk('docs/api/classes');
let count = 0;

for (const f of files) {
  const original = readFileSync(f, 'utf8');
  const { content, changed } = processFile(original);
  if (changed) {
    writeFileSync(f, content);
    count++;
  }
}

console.log(`✅ Sorted protected members to bottom in ${count}/${files.length} files`);
