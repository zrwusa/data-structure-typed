/**
 * DISABLED — prefixing moved to CSS search display.
 * Page TOC stays clean (just `add()`), search results show `Class: TreeSet<K,R>.add()` via CSS order swap.
 */
console.log('⏭️ prefix-class-to-methods.mjs SKIPPED (display handled by CSS)');
process.exit(0);

/**
 * Original code below (kept for reference):
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

function walk(dir) {
  const results = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) results.push(...walk(full));
    else if (full.endsWith('.md')) results.push(full);
  }
  return results;
}

const files = walk('docs/api/classes');
let count = 0;

for (const f of files) {
  const className = basename(f, '.md');
  const content = readFileSync(f, 'utf8');
  
  // Replace ### methodName() with ### ClassName.methodName()
  // But skip ### ClassName (the constructor heading) and ### K, V, R (type params)
  const fixed = content.replace(/^### ([a-z_]\w*\()/gm, `### ${className}.$1`);
  
  // Also prefix property/accessor names (lowercase start, no parens)
  const fixed2 = fixed.replace(/^### ([a-z_]\w*)$/gm, (match, name) => {
    // Skip single-letter type params
    if (name.length <= 2) return match;
    return `### ${className}.${name}`;
  });

  if (fixed2 !== content) {
    writeFileSync(f, fixed2);
    count++;
  }
}

console.log(`✅ Prefixed class name to methods in ${count}/${files.length} files`);
