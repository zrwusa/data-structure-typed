/**
 * Post-process TypeDoc-generated markdown for VitePress compatibility.
 * Escapes bare TypeScript generic angle brackets <T> in plain text
 * to HTML entities so Vue's template compiler doesn't choke on them.
 */
import { glob } from 'fast-glob';
import { readFileSync, writeFileSync } from 'fs';

const files = await glob('docs-site/api/**/*.md');
let count = 0;

for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  let inCode = false;
  let changed = false;
  const fixed = lines.map(line => {
    if (line.trim().startsWith('```')) inCode = !inCode;
    if (inCode || line.trim().startsWith('#')) return line;

    // Split on backtick spans — only escape outside of inline code
    const parts = line.split(/(`[^`]*`)/);
    const newParts = parts.map((part, i) => {
      if (i % 2 !== 0) return part; // inside backticks — leave alone
      const escaped = part.replace(/<([A-Za-z][^>]*?)>/g, '&lt;$1&gt;');
      if (escaped !== part) changed = true;
      return escaped;
    });
    return newParts.join('');
  });

  if (changed) {
    writeFileSync(f, fixed.join('\n'));
    count++;
  }
}

console.log(`✅ Escaped generics in ${count} files`);
