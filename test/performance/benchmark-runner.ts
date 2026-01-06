import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';
import { fork } from 'child_process';
import { ConsoleColor, numberFix } from '../utils';

/**
 * Optimized benchmark runner
 * Features:
 * - Optional per-suite isolation via child_process (--isolate)
 * - GC + cooldown between suites (--gc, --cooldown-ms=50)
 * - Shuffle or custom order (--shuffle, --order=heap,avl-tree,...)
 * - Arg tokens still filter test files like before
 * - Maintains JSON/HTML report + README injection
 *
 * Example:
 *  ts-node benchmark-runner.optimized.ts --isolate --gc --cooldown-ms=80 heap set get
 */

// ---- CLI parsing (lightweight) ----
type Flags = {
  isolate: boolean;
  gc: boolean;
  cooldownMs: number;
  shuffle: boolean;
  order?: string[];
  orderFile?: string;
  include?: string[];
  exclude?: string[];
  label?: string;
};

function parseArgs(argv: string[]) {
  const flags: Flags = {
    isolate: false,
    gc: false,
    cooldownMs: 50,
    shuffle: false,
    order: undefined,
    orderFile: undefined,
    include: undefined,
    exclude: undefined,
    label: undefined
  };
  const filters: string[] = [];
  argv.forEach(raw => {
    if (!raw.startsWith('--')) {
      filters.push(raw);
      return;
    }
    const [k, v] = raw.replace(/^--/, '').split('=');
    switch (k) {
      case 'isolate':
        flags.isolate = true;
        break;
      case 'gc':
        flags.gc = true;
        break;
      case 'shuffle':
        flags.shuffle = true;
        break;
      case 'cooldown-ms':
        flags.cooldownMs = v ? Number(v) : flags.cooldownMs;
        break;
      case 'order':
        flags.order = (v ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        break;
      case 'order-file':
        flags.orderFile = v || '';
        break;
      case 'include':
        flags.include = (v ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        break;
      case 'exclude':
        flags.exclude = (v ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        break;
      case 'label':
        flags.label = v || '';
        break;
      default:
        break;
    }
  });
  return { flags, filters };
}

const argv = process.argv.slice(2);
const { flags, filters } = parseArgs(argv);

const { GREEN, BOLD, END, YELLOW, GRAY, CYAN, BG_YELLOW } = ConsoleColor;

// ---- Optional runOrder config support (order/include/exclude/label) ----
type RunConfig = { order?: string[]; include?: string[]; exclude?: string[]; label?: string };

function loadRunConfigFromFile(filePath?: string): RunConfig | null {
  const p1 = filePath ? path.resolve(process.cwd(), filePath) : path.resolve(__dirname, 'runner-config.json');
  const p2 = filePath ? undefined : path.resolve(__dirname, 'run-order.json');
  const candidates = [p1, p2].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (Array.isArray(data)) {
          console.log(`${YELLOW}Using run config from file:${END} ${p}`);
          return { order: data as string[] };
        } else if (data && typeof data === 'object') {
          const cfg: RunConfig = {};
          if (Array.isArray((data as any).order))
            cfg.order = (data as any).order.filter((x: any) => typeof x === 'string');
          if (Array.isArray((data as any).include))
            cfg.include = (data as any).include.filter((x: any) => typeof x === 'string');
          if (Array.isArray((data as any).exclude))
            cfg.exclude = (data as any).exclude.filter((x: any) => typeof x === 'string');
          if (typeof (data as any).label === 'string') cfg.label = (data as any).label;
          console.log(`${YELLOW}Using run config from file:${END} ${p}`);
          return cfg;
        }
      }
    } catch (e) {
      console.warn(`Failed to load run config from ${p}:`, e);
    }
  }
  return null;
}

function loadRunOrderFromFile(filePath?: string): string[] | null {
  const p1 = filePath ? path.resolve(process.cwd(), filePath) : path.resolve(__dirname, 'runner-config.json');
  const p2 = filePath ? undefined : path.resolve(__dirname, 'run-order.json');
  const candidates = [p1, p2].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (Array.isArray(arr) && arr.every((x: any) => typeof x === 'string')) {
          console.log(`${YELLOW}Using runOrder from file:${END} ${p}`);
          return arr;
        }
      }
    } catch (e) {
      console.warn(`Failed to load order from ${p}:`, e);
    }
  }
  return null;
}

const defaultRunOrder = [
  'heap',
  'avl-tree',
  'red-black-tree',
  'doubly-linked-list',
  'linked-hash-map',
  'hash-map',
  'map-graph',
  'graph',
  'directed-graph',
  'undirected-graph',
  'queue',
  'deque',
  'priority-queue',
  'singly-linked-list',
  'binary-tree-overall',
  'bst',
  'trie',
  'stack'
];

const cfg = loadRunConfigFromFile(flags.orderFile);
const fileOrder = cfg?.order || loadRunOrderFromFile(flags.orderFile);
const runOrder = flags.order && flags.order.length ? flags.order : fileOrder || defaultRunOrder;

const getRelativePath = (file: string) => path.relative(__dirname, file);

// ---- Selection helpers (include/exclude) ----
function fileRel(file: string) {
  return path.relative(testDir, file).replace(/\\/g, '/');
}

function makeMatcher(rule: string): (s: string) => boolean {
  // If there is no wildcard, the substring matches and is compatible with your original behavior
  if (!/[?*]/.test(rule)) {
    return (s: string) => s.includes(rule);
  }

  // Use POSIX delimiters uniformly
  const norm = rule.replace(/\\/g, '/');

  // Escape regular special characters first, but keep * and ?
  const esc = norm.replace(/[.+^${}()|[\]\\]/g, '\\$&');

  // To process ** (across multi-level directories), use sentinel placeholders first to avoid conflicts with the subsequent replacement of *
  const GLOBSTAR = '<<GLOBSTAR>>';
  const withSentinel = esc.replace(/\*\*/g, GLOBSTAR);

  // * => Multiple characters that do not cross directories, ? => Single characters that do not cross directories
  const seg = withSentinel.replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]');

  // Restore ** => any character (can cross directories)
  const regexSource = '^' + seg.split(GLOBSTAR).join('.*') + '$';
  const re = new RegExp(regexSource);

  return (s: string) => re.test(s.replace(/\\/g, '/'));
}

function applyIncludeExclude(files: string[], include?: string[], exclude?: string[]) {
  let res = [...files];
  if (include && include.length) {
    const matchers = include.map(makeMatcher);
    res = res.filter(f => matchers.some(m => m(fileRel(f))));
  }
  if (exclude && exclude.length) {
    const matchers = exclude.map(makeMatcher);
    res = res.filter(f => !matchers.some(m => m(fileRel(f))));
  }
  return res;
}

const coloredLabeled = (label: string, file: string) => {
  const relativeFilePath = getRelativePath(file);
  const directory = path.dirname(relativeFilePath);
  const fileName = path.basename(relativeFilePath);
  return `${BG_YELLOW} ${label} ${END} ${GRAY}${directory}/${END}${CYAN}${fileName}${END}`;
};

const parentDirectory = path.resolve(__dirname, '../..');
const reportDistPath = path.join(parentDirectory, 'benchmark');

const testDir = path.join(__dirname, 'data-structures');
const allFiles = fastGlob.sync([path.join(testDir, '**', '*.test.ts'), path.join(testDir, '**', '*.test.mjs')]);
let testFiles: string[] = [];

// Filters: same semantics as your original runner (non -- args are match substrings)
if (filters.length > 0) {
  console.log(`arguments: ${filters.join(' ')}`);
  testFiles = allFiles.filter(file => filters.every(word => file.includes(word)));
} else {
  testFiles = [...allFiles];
}

// Apply include/exclude from config and CLI
const includeRules = [...(cfg?.include || []), ...(flags.include || [])];
const excludeRules = [...(cfg?.exclude || []), ...(flags.exclude || [])];
if (includeRules.length || excludeRules.length) {
  testFiles = applyIncludeExclude(testFiles, includeRules, excludeRules);
}

// sort by runOrder, optionally shuffle
function sortByOrder(files: string[]): string[] {
  type Item = { file: string; name: string; idx: number };
  const items: Item[] = files.map(file => {
    const name = path.basename(file, '.test.ts');
    const idx = runOrder.indexOf(name);
    return { file, name, idx: idx === -1 ? Number.MAX_SAFE_INTEGER : idx };
  });
  items.sort((a, b) => a.idx - b.idx || a.name.localeCompare(b.name));
  return items.map(i => i.file);
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const discoveredTotal = allFiles.length;

testFiles = sortByOrder(testFiles);
if (flags.shuffle) shuffle(testFiles);

const plannedCount = testFiles.length;
const isIndividual = filters.length > 0;

// ---------------- report utils (kept from original) ----------------
const report: { [key: string]: any } = {};
let completedCount = 0;

function ensureDist() {
  if (!fs.existsSync(reportDistPath)) fs.mkdirSync(reportDistPath, { recursive: true });
}

function writeReportHTMLAndJSON(htmlTables: string) {
  ensureDist();
  const filePath = path.join(reportDistPath, 'report.json');
  const htmlFilePath = path.join(reportDistPath, 'report.html');
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  const html = `<!DOCTYPE html>
  <html lang="en"><head><meta charset="UTF-8"/><title>Benchmark Report</title>
  <style>
    body { margin:0; padding:0; font-family: ui-sans-serif, system-ui, -apple-system; }
    .json-to-html-title { font-size: 3rem; font-weight: bold; }
    .content { padding: 2rem; }
    .content table { width:100%; table-layout:fixed; border-collapse:collapse; margin-top:10px; font-size:16px; }
    .content table th, .content table td { padding: 8px 12px; text-align:left; border:1px solid #ddd; }
    .content table th { background:#f2f2f2; font-weight:bold; }
    .content table tr:nth-child(odd) { background:#fff; }
  </style></head><body><div class="content">
  <div class="json-to-html-title">Benchmark Report</div>
  ${htmlTables}
  </div></body></html>`;

  if (!isIndividual) {
    replaceMarkdownContent(
      '[//]: # (No deletion!!! Start of Replace Section)',
      '[//]: # (No deletion!!! End of Replace Section)',
      htmlTables
    );
  }
  fs.writeFileSync(htmlFilePath, html);
  console.log(`Performance ${BOLD}${GREEN}report${END} file generated in file://${BOLD}${GREEN}${htmlFilePath}${END}`);
}

function replaceMarkdownContent(startMarker: string, endMarker: string, newText: string) {
  const filePath = path.join(parentDirectory, '/docs/PERFORMANCE.md');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Unable to read ${filePath}:`, err);
      return;
    }
    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      console.warn('Markers not found or invalid range; skip README injection.');
      return;
    }
    const updatedMarkdown = data.slice(0, startIndex + startMarker.length) + '\n' + newText + data.slice(endIndex);
    fs.writeFile(filePath, updatedMarkdown, 'utf8', err2 => {
      if (err2) console.error(`Unable to write to ${filePath}:`, err2);
      else console.log(`The content has been successfully replaced in file://${BOLD}${GREEN}${filePath}${END}`);
    });
  });
}

function toHtmlTables() {
  let htmlTables = '';
  for (const key of Object.keys(report)) {
    const block = report[key];
    const rows = block.benchmarks as Array<Record<string, any>>;
    if (!rows || !rows.length) continue;
    const headers = Object.keys(rows[0]);
    const table = [
      '<table>',
      '<thead>',
      '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>',
      '</thead>',
      '<tbody>',
      ...rows.map(r => '<tr>' + headers.map(h => `<td>${r[h]}</td>`).join('') + '</tr>'),
      '</tbody>',
      '</table>'
    ].join('');
    htmlTables += `<h2>${key}</h2>` + table;
  }
  return htmlTables;
}

// ---------------- in-process mode (improved hygiene) ----------------

async function runInProcess(files: string[]) {
  const durations: number[] = [];
  let index = 0;
  for (const file of files) {
    index++;
    const base = path.basename(file);
    const testName = base.replace(/\.test\.[^.]+$/, '');
    console.log(`${BOLD}${GREEN}[${index}/${plannedCount}]${END} ${coloredLabeled('Run', file)}`);

    const mod = require(file);
    const suite: Benchmark.Suite | undefined = mod?.suite ?? mod?.default?.suite;
    if (!suite) {
      report[testName] = { benchmarks: [] };
      completedCount++;
      console.log(
        `Progress: ${BOLD}${GREEN}${completedCount}${END}/${BOLD}${GREEN}${plannedCount}${END} Last ${testName}: ${YELLOW}SKIP${END}`
      );
      continue;
    }

    try {
      suite.forEach((b: any) => {
        if (typeof b.fn === 'function') b.fn.call(b);
      });
    } catch {}

    if (flags.gc && global.gc) global.gc();
    await new Promise(r => setTimeout(r, flags.cooldownMs));

    const t0 = Date.now();
    await new Promise<void>(resolve => {
      suite
        .on('complete', function (this: Benchmark.Suite) {
          const rows = this.map((benchmark: any) => ({
            'test name': benchmark.name,
            'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
            'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
            'sample deviation': numberFix(benchmark.stats.deviation, 2)
          }));
          report[testName] = { benchmarks: rows };
          resolve();
        })
        .run({ async: false });
    });

    const dt = (Date.now() - t0) / 1000;
    durations.push(dt);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const remaining = plannedCount - ++completedCount;
    const etaSec = Math.max(0, Math.round(remaining * avg));
    const mins = Math.floor(etaSec / 60)
      .toString()
      .padStart(2, '0');
    const secs = (etaSec % 60).toString().padStart(2, '0');
    console.log(
      `Progress: ${BOLD}${GREEN}${completedCount}${END}/${BOLD}${GREEN}${plannedCount}${END} Last ${testName}: ${GREEN}OK${END} in ${numberFix(dt, 2)}s | ETA ~ ${mins}:${secs}`
    );
  }
}

// ---------------- isolated-per-suite mode
type ChildMessage = {
  testName: string;
  benchmarks: Array<Record<string, any>>;
  runTime: number;
  file: string;
};

async function runIsolated(files: string[]) {
  const durations: number[] = [];
  let index = 0;

  for (const file of files) {
    index++;
    const testName = path.basename(file).replace(/\.test\.[^.]+$/, '');
    console.log(`${BOLD}${GREEN}[${index}/${plannedCount}]${END} ${coloredLabeled('Fork', file)}`);

    await new Promise<void>((resolve, reject) => {
      const childEntry = path.resolve(__dirname, './single-suite-runner.ts'); // ensure .ts

      // Always run with Node + ts-node/register in child.
      const execArgv = ['-r', 'ts-node/register/transpile-only'];

      // If user wants GC, put it into NODE_OPTIONS (so Node consumes it, not ts-node).
      const env = {
        ...process.env,
        NODE_OPTIONS: ((process.env.NODE_OPTIONS || '') + (flags.gc ? ' --expose-gc' : '')).trim()
      };

      const t0 = Date.now();
      const cp = fork(childEntry, [file], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        execArgv,
        execPath: process.execPath,
        env
      });

      let got = false;
      cp.on('message', (m: ChildMessage) => {
        got = true;
        report[m.testName] = { benchmarks: m.benchmarks };
      });
      cp.on('exit', code => {
        completedCount++;
        const dt = (Date.now() - t0) / 1000;
        durations.push(dt);

        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        const remaining = files.length - completedCount;
        const etaSec = Math.max(0, Math.round(remaining * avg));
        const mins = Math.floor(etaSec / 60)
          .toString()
          .padStart(2, '0');
        const secs = (etaSec % 60).toString().padStart(2, '0');
        const label =
          code === 0 && got ? `${GREEN}OK${END}` : code === 0 && !got ? `${YELLOW}SKIP${END}` : `${YELLOW}ERR${END}`;

        console.log(
          `Progress: ${BOLD}${GREEN}${completedCount}${END}/${BOLD}${GREEN}${plannedCount}${END}`,
          `Last ${testName}: ${label} in ${numberFix(dt, 2)}s | ETA ~ ${mins}:${secs}`
        );

        if (code !== 0) reject(new Error(`Child failed: ${code}`));
        else resolve();
      });
    });

    await new Promise(r => setTimeout(r, flags.cooldownMs));
  }
}

// ---------------- entry ----------------
(async function main() {
  if (!testFiles.length) {
    console.log(`${YELLOW}No test files matched.${END}`);
    process.exit(0);
  }
  console.log(
    `${BOLD}${GREEN}Running ${plannedCount} planned suite(s)${END} out of ${discoveredTotal} discovered ${flags.isolate ? '(isolated)' : '(in-process)'} ${flags.shuffle ? '[shuffled]' : ''} ${flags.label ? '[' + flags.label + ']' : ''}`
  );

  if (flags.isolate) await runIsolated(testFiles);
  else await runInProcess(testFiles);

  // Render report (same as original)
  const htmlTables = toHtmlTables();
  writeReportHTMLAndJSON(htmlTables);

  // Summary
  const counts = { ok: 0, skip: 0, err: 0 };
  for (const key of Object.keys(report)) {
    const arr = report[key]?.benchmarks || [];
    if (!Array.isArray(arr)) continue;
    if (arr.length === 0) counts.skip++;
    else counts.ok++;
  }
  // We don't track 'err' explicitly here because child errors stop the run; when needed, you can extend message payload.
  console.log(
    `${BOLD}${GREEN}Summary:${END} planned=${plannedCount}, discovered=${discoveredTotal}, ok=${counts.ok}, skipped=${counts.skip}`
  );
})();
