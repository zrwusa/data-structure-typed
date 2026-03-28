/**
 * Fix TypeScript generics <T> in TypeDoc markdown for MDX compatibility.
 * Converts bare < > in non-fenced-code, non-backtick content to HTML entities.
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

function fixFile(content) {
  // Split into fenced code blocks vs non-code sections
  // Use a state machine that properly tracks ``` fences
  const result = [];
  const lines = content.split('\n');
  let inFence = false;
  let fenceChar = '';
  let changed = false;

  for (const line of lines) {
    const trimmed = line.trim();
    // Detect fence start/end
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!inFence) {
        inFence = true;
        fenceChar = fenceMatch[1][0];
      } else if (trimmed.startsWith(fenceChar.repeat(3))) {
        inFence = false;
      }
      result.push(line);
      continue;
    }

    if (inFence) {
      result.push(line);
      continue;
    }

    // Outside code blocks: escape generics outside of inline backticks
    const parts = line.split(/(`[^`]*`)/);
    const newParts = parts.map((part, i) => {
      if (i % 2 !== 0) return part; // inside backtick
      // Escape < ... > that look like TypeScript generics
      return part.replace(/<([A-Za-z][^>]*)>/g, (m, inner) => {
        changed = true;
        return `&lt;${inner}&gt;`;
      });
    });
    result.push(newParts.join(''));
  }

  return { content: result.join('\n'), changed };
}

const files = walk('docs/api');
let count = 0;

for (const f of files) {
  const original = readFileSync(f, 'utf8');
  const { content, changed } = fixFile(original);
  if (changed) {
    writeFileSync(f, content);
    count++;
  }
}

console.log(`✅ Fixed generics in ${count}/${files.length} files`);
