/**
 * Enhanced Performance Report Generator - DUAL OUTPUT VERSION
 *
 * Generate two types of reports:
 * 1. HTML Report (benchmark/report.html) - Side-by-side comparison layout (JS vs C++)
 * 2. Markdown Tables (docs/PERFORMANCE.md) - Markdown comparison tables with C++ Avg column
 *
 * ✨ Number abbreviation: 10000000 -> 10M, 100000 -> 100K, 1000 -> 1K
 */

import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';
const END = '\x1b[0m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

const parentDirectory = path.resolve(__dirname, '../..');
const reportDistPath = path.join(parentDirectory, 'benchmark');
const docsPath = path.join(parentDirectory, 'docs');
const reportJsonPath = path.join(reportDistPath, 'report.json');
const runnerConfigPath = path.join(__dirname, 'runner-config.json');

/**
 * Load order configuration from runner-config.json
 */
function loadOrderConfig() {
    try {
        if (fs.existsSync(runnerConfigPath)) {
            const config = JSON.parse(fs.readFileSync(runnerConfigPath, 'utf-8'));
            return config.order || [];
        }
    } catch (e) {
        console.warn(`${YELLOW}⚠ Could not load runner-config.json for ordering${END}`);
    }
    return [];
}

// Test name mapping to display names
const testNameMap = {
    'red-black-tree': 'RedBlackTree',
    'avl-tree': 'AVLTree',
    'avl-rb-range-search': 'AVLRBRangeSearch',
    'binary-tree': 'BinaryTree',
    'bst': 'BST',
    'tree-set': 'TreeSet',
    'tree-map': 'TreeMap',
    'tree-multi-set': 'TreeMultiSet',
    'tree-multi-map': 'TreeMultiMap',
    'trie': 'Trie',
    'heap': 'Heap',
    'stack': 'Stack',
    'queue': 'Queue',
    'deque': 'Deque',
    'hash-map': 'HashMap',
    'singly-linked-list': 'SinglyLinkedList',
    'doubly-linked-list': 'DoublyLinkedList',
    'directed-graph': 'DirectedGraph',
    'priority-queue': 'PriorityQueue'
};

function loadReport() {
    if (!fs.existsSync(reportJsonPath)) {
        console.error(`${RED}Report not found at ${reportJsonPath}${END}`);
        console.log(`${YELLOW}Please run benchmarks first with: pnpm test:perf${END}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(reportJsonPath, 'utf-8'));
}

/**
 * Format number abbreviation: 10000000 -> 10M, 100000 -> 100K, 1000 -> 1K
 * Handles both comma-separated (1,000,000) and plain (1000000) formats
 */
function normalizeCaseName(text) {
    if (!text || typeof text !== 'string') return text;
    // Google Benchmark sometimes appends suffixes like "/iterations:1" to the case name.
    return text.replace(/\/iterations:\d+$/, '');
}

function formatNumberAbbr(text) {
    if (!text || typeof text !== 'string') return text;

    const normalized = normalizeCaseName(text);

    // First, remove commas for processing
    const cleanText = normalized.replace(/,/g, '');

    // Replace numbers with abbreviated versions
    return cleanText.replace(/\b(\d+)\b/g, (match) => {
        const num = parseInt(match, 10);
        if (num >= 1000000) {
            const rounded = Math.round(num / 1000000 * 10) / 10;
            return rounded.toString().replace(/\.0$/, '') + 'M';
        } else if (num >= 1000) {
            const rounded = Math.round(num / 1000 * 10) / 10;
            return rounded.toString().replace(/\.0$/, '') + 'K';
        }
        return match;
    });
}

/**
 * Pattern-driven native test matching rules
 * Maps JS test names to their corresponding C++ equivalents
 */
function getNativeMappings(testCaseName, testName) {
    const mappings = [];

    // Queue: "Native JS Array" ↔ "Native std::deque"
    if (testName === 'queue' && testCaseName.startsWith('Native JS Array')) {
        const operation = testCaseName.replace(/^Native JS Array\s+/, '');
        mappings.push(`Native std::deque ${operation}`);
    }

    // Deque: "Native JS Array" ↔ "Native vector"
    if (testName === 'deque' && testCaseName.startsWith('Native JS Array')) {
        const operation = testCaseName.replace(/^Native JS Array\s+/, '');
        mappings.push(`Native vector ${operation}`);
    }

    // HashMap: "Native JS Map" ↔ "std::map"
    if (testName === 'hash-map') {
        const jsMapMatch = testCaseName.match(/^Native JS Map\s+(.+)$/);
        if (jsMapMatch) {
            mappings.push(`std::map ${jsMapMatch[1]}`);
        }

        const jsSetMatch = testCaseName.match(/^Native JS Set\s+(.+)$/);
        if (jsSetMatch) {
            mappings.push(`std::unordered_set ${jsSetMatch[1]}`);
        }
    }

    // Reverse mapping
    if (testName === 'queue' && testCaseName.startsWith('Native std::deque')) {
        const operation = testCaseName.replace(/^Native std::deque\s+/, '');
        mappings.push(`Native JS Array ${operation}`);
    }

    if (testName === 'deque' && testCaseName.startsWith('Native vector')) {
        const operation = testCaseName.replace(/^Native vector\s+/, '');
        mappings.push(`Native JS Array ${operation}`);
    }

    if (testName === 'hash-map') {
        const cppMapMatch = testCaseName.match(/^std::map\s+(.+)$/);
        if (cppMapMatch) {
            mappings.push(`Native JS Map ${cppMapMatch[1]}`);
        }

        const cppSetMatch = testCaseName.match(/^std::unordered_set\s+(.+)$/);
        if (cppSetMatch) {
            mappings.push(`Native JS Set ${cppSetMatch[1]}`);
        }
    }

    // TreeMap: JS variants ↔ C++ std::map
    if (testName === 'tree-map') {
        // Match "1M set TreeMap" -> "1M set std::map"
        const treeMapMatch = testCaseName.match(/^(.+?)\s+(set|get|build\+get|rangeSearch|navigable|build\+rangeSearch|build\+navigable)\s+(TreeMap|RBT)(\s+\(Node\))?$/);
        if (treeMapMatch) {
            const [, size, op] = treeMapMatch;
            mappings.push(`${size} ${op} std::map`);
        }
        // Reverse: "1M set std::map" -> match any TreeMap/RBT variant
        const stdMapMatch = testCaseName.match(/^(.+?)\s+(set|get|build\+get|rangeSearch|navigable)\s+std::map$/);
        if (stdMapMatch) {
            const [, size, op] = stdMapMatch;
            mappings.push(`${size} ${op} TreeMap`);
            mappings.push(`${size} ${op} TreeMap (Node)`);
            mappings.push(`${size} ${op} RBT`);
            mappings.push(`${size} ${op} RBT (Node)`);
        }
    }

    // TreeSet: JS variants ↔ C++ std::set
    if (testName === 'tree-set') {
        // Match "1M add TreeSet" -> "1M add std::set"
        const treeSetMatch = testCaseName.match(/^(.+?)\s+(add|has|build\+has|rangeSearch|navigable|build\+rangeSearch|build\+navigable)\s+(TreeSet|RBT)(\s+\(Node\))?$/);
        if (treeSetMatch) {
            const [, size, op] = treeSetMatch;
            mappings.push(`${size} ${op} std::set`);
        }
        // Reverse: "1M add std::set" -> match any TreeSet/RBT variant
        const stdSetMatch = testCaseName.match(/^(.+?)\s+(add|has|build\+has|rangeSearch|navigable)\s+std::set$/);
        if (stdSetMatch) {
            const [, size, op] = stdSetMatch;
            mappings.push(`${size} ${op} TreeSet`);
            mappings.push(`${size} ${op} TreeSet (Node)`);
            mappings.push(`${size} ${op} RBT`);
            mappings.push(`${size} ${op} RBT (Node)`);
        }
    }

    // TreeMultiMap: JS variants ↔ C++ std::multimap
    if (testName === 'tree-multi-map') {
        // JS: "1M add (TreeMultiMap, bucketed)" -> C++: "1M add std::multimap"
        const addMatch = testCaseName.match(/^(.+?)\s+add\s+\(TreeMultiMap.*\)$/);
        if (addMatch) {
            mappings.push(`${addMatch[1]} add std::multimap`);
        }
        // JS: "1M has-only (TreeMultiMap)" -> C++: "1M has std::multimap"
        const hasMatch = testCaseName.match(/^(.+?)\s+has-only\s+\(TreeMultiMap\)$/);
        if (hasMatch) {
            mappings.push(`${hasMatch[1]} has std::multimap`);
        }
        // JS: "1M get-only (TreeMultiMap)" -> C++: "1M get std::multimap"
        const getMatch = testCaseName.match(/^(.+?)\s+get-only\s+\(TreeMultiMap\)$/);
        if (getMatch) {
            mappings.push(`${getMatch[1]} get std::multimap`);
        }
        // JS: "1M count-only (TreeMultiMap)" -> C++: "1M count std::multimap"
        const countMatch = testCaseName.match(/^(.+?)\s+count-only\s+\(TreeMultiMap\)$/);
        if (countMatch) {
            mappings.push(`${countMatch[1]} count std::multimap`);
        }
        // JS: "1M build+has (TreeMultiMap)" -> C++: "1M build+has std::multimap"
        const buildHasMatch = testCaseName.match(/^(.+?)\s+build\+has\s+\(TreeMultiMap\)$/);
        if (buildHasMatch) {
            mappings.push(`${buildHasMatch[1]} build+has std::multimap`);
        }
        // JS: "1M build+get (TreeMultiMap)" -> C++: "1M build+get std::multimap"
        const buildGetMatch = testCaseName.match(/^(.+?)\s+build\+get\s+\(TreeMultiMap\)$/);
        if (buildGetMatch) {
            mappings.push(`${buildGetMatch[1]} build+get std::multimap`);
        }
        // JS: "1M bucket iteration (TreeMultiMap)" or "1M flatEntries iteration (TreeMultiMap)" -> C++: "1M iterate std::multimap"
        const iterMatch = testCaseName.match(/^(.+?)\s+(bucket|flatEntries)\s+iteration\s+\(TreeMultiMap\)$/);
        if (iterMatch) {
            mappings.push(`${iterMatch[1]} iterate std::multimap`);
        }
        // Reverse: C++ -> JS
        const cppAddMatch = testCaseName.match(/^(.+?)\s+add\s+std::multimap$/);
        if (cppAddMatch) {
            mappings.push(`${cppAddMatch[1]} add (TreeMultiMap, bucketed)`);
            mappings.push(`${cppAddMatch[1]} add (TreeMultiMap bucketed)`);
        }
        const cppHasMatch = testCaseName.match(/^(.+?)\s+has\s+std::multimap$/);
        if (cppHasMatch) {
            mappings.push(`${cppHasMatch[1]} has-only (TreeMultiMap)`);
        }
        const cppGetMatch = testCaseName.match(/^(.+?)\s+get\s+std::multimap$/);
        if (cppGetMatch) {
            mappings.push(`${cppGetMatch[1]} get-only (TreeMultiMap)`);
        }
        const cppCountMatch = testCaseName.match(/^(.+?)\s+count\s+std::multimap$/);
        if (cppCountMatch) {
            mappings.push(`${cppCountMatch[1]} count-only (TreeMultiMap)`);
        }
        const cppBuildHasMatch = testCaseName.match(/^(.+?)\s+build\+has\s+std::multimap$/);
        if (cppBuildHasMatch) {
            mappings.push(`${cppBuildHasMatch[1]} build+has (TreeMultiMap)`);
        }
        const cppBuildGetMatch = testCaseName.match(/^(.+?)\s+build\+get\s+std::multimap$/);
        if (cppBuildGetMatch) {
            mappings.push(`${cppBuildGetMatch[1]} build+get (TreeMultiMap)`);
        }
        const cppIterMatch = testCaseName.match(/^(.+?)\s+iterate\s+std::multimap$/);
        if (cppIterMatch) {
            mappings.push(`${cppIterMatch[1]} bucket iteration (TreeMultiMap)`);
            mappings.push(`${cppIterMatch[1]} flatEntries iteration (TreeMultiMap)`);
        }
    }

    // TreeMultiSet: JS variants ↔ C++ std::multiset
    if (testName === 'tree-multi-set') {
        // JS: "1M add (TreeMultiSet, expanded iteration)" -> C++: "1M add std::multiset"
        const addMatch = testCaseName.match(/^(.+?)\s+add\s+\(TreeMultiSet.*\)$/);
        if (addMatch) {
            mappings.push(`${addMatch[1]} add std::multiset`);
        }
        // JS: "1M has-only (TreeMultiSet)" -> C++: "1M has std::multiset"
        const hasMatch = testCaseName.match(/^(.+?)\s+has-only\s+\(TreeMultiSet\)$/);
        if (hasMatch) {
            mappings.push(`${hasMatch[1]} has std::multiset`);
        }
        // JS: "1M count-only (TreeMultiSet)" -> C++: "1M count std::multiset"
        const countMatch = testCaseName.match(/^(.+?)\s+count-only\s+\(TreeMultiSet\)$/);
        if (countMatch) {
            mappings.push(`${countMatch[1]} count std::multiset`);
        }
        // JS: "1M build+has (TreeMultiSet)" -> C++: "1M build+has std::multiset"
        const buildHasMatch = testCaseName.match(/^(.+?)\s+build\+has\s+\(TreeMultiSet\)$/);
        if (buildHasMatch) {
            mappings.push(`${buildHasMatch[1]} build+has std::multiset`);
        }
        // JS: "1M build+count (TreeMultiSet)" -> C++: "1M build+count std::multiset"
        const buildCountMatch = testCaseName.match(/^(.+?)\s+build\+count\s+\(TreeMultiSet\)$/);
        if (buildCountMatch) {
            mappings.push(`${buildCountMatch[1]} build+count std::multiset`);
        }
        // JS: "1M expanded iteration (TreeMultiSet)" or "1M entries view (TreeMultiSet)" -> C++: "1M iterate std::multiset"
        const iterMatch = testCaseName.match(/^(.+?)\s+(expanded iteration|entries view)\s+\(TreeMultiSet\)$/);
        if (iterMatch) {
            mappings.push(`${iterMatch[1]} iterate std::multiset`);
        }
        // Reverse: C++ -> JS
        const cppAddMatch = testCaseName.match(/^(.+?)\s+add\s+std::multiset$/);
        if (cppAddMatch) {
            mappings.push(`${cppAddMatch[1]} add (TreeMultiSet, expanded iteration)`);
            mappings.push(`${cppAddMatch[1]} add (TreeMultiSet expanded iteration)`);
        }
        const cppHasMatch = testCaseName.match(/^(.+?)\s+has\s+std::multiset$/);
        if (cppHasMatch) {
            mappings.push(`${cppHasMatch[1]} has-only (TreeMultiSet)`);
        }
        const cppCountMatch = testCaseName.match(/^(.+?)\s+count\s+std::multiset$/);
        if (cppCountMatch) {
            mappings.push(`${cppCountMatch[1]} count-only (TreeMultiSet)`);
        }
        const cppBuildHasMatch = testCaseName.match(/^(.+?)\s+build\+has\s+std::multiset$/);
        if (cppBuildHasMatch) {
            mappings.push(`${cppBuildHasMatch[1]} build+has (TreeMultiSet)`);
        }
        const cppBuildCountMatch = testCaseName.match(/^(.+?)\s+build\+count\s+std::multiset$/);
        if (cppBuildCountMatch) {
            mappings.push(`${cppBuildCountMatch[1]} build+count (TreeMultiSet)`);
        }
        const cppIterMatch = testCaseName.match(/^(.+?)\s+iterate\s+std::multiset$/);
        if (cppIterMatch) {
            mappings.push(`${cppIterMatch[1]} expanded iteration (TreeMultiSet)`);
            mappings.push(`${cppIterMatch[1]} entries view (TreeMultiSet)`);
        }
    }

    return mappings;
}

/**
 * Generate Markdown comparison tables (for PERFORMANCE.md)
 */
function generateMarkdownComparison(report) {
    const { javascript = [], native = [] } = report;

    if (javascript.length === 0) {
        console.warn(`${YELLOW}No JavaScript benchmarks found${END}`);
        return '';
    }

    const cppMap = new Map();
    for (const nativeTest of native) {
        const nativeTestName = nativeTest.testName;
        for (const benchmark of nativeTest.benchmarks) {
            const testCaseName = benchmark['Test Case'];
            const cppValue = benchmark['Latency Avg (ms)'];
            const normalizedCase = normalizeCaseName(testCaseName);

            // Direct match (raw)
            cppMap.set(`${nativeTestName}|${testCaseName}`, cppValue);
            // Also allow normalized (strip "/iterations:N" suffix)
            if (normalizedCase !== testCaseName) {
                cppMap.set(`${nativeTestName}|${normalizedCase}`, cppValue);
            }
            // Also allow abbreviated lookup (e.g. 1,000,000 -> 1M)
            cppMap.set(`${nativeTestName}|${formatNumberAbbr(testCaseName)}`, cppValue);
            if (normalizedCase !== testCaseName) {
                cppMap.set(`${nativeTestName}|${formatNumberAbbr(normalizedCase)}`, cppValue);
            }

            // Pattern-based match
            const ruleMappings = getNativeMappings(testCaseName, nativeTestName);
            for (const mapping of ruleMappings) {
                const ruleKey = `${nativeTestName}|${mapping}`;
                cppMap.set(ruleKey, cppValue);
            }
        }
    }

    const groups = new Map();
    // Track testName -> displayName for sorting
    const testNameToDisplay = new Map();
    
    for (const jsResult of javascript) {
        const testName = jsResult.testName;
        const displayName = testNameMap[testName] || testName;
        testNameToDisplay.set(testName, displayName);

        if (!groups.has(displayName)) {
            groups.set(displayName, []);
        }

        for (const benchmark of jsResult.benchmarks) {
            groups.get(displayName).push({
                testName: testName,
                benchmark: benchmark
            });
        }
    }

    // Sort groups by runner-config.json order
    const orderConfig = loadOrderConfig();
    const sortedDisplayNames = Array.from(groups.keys()).sort((a, b) => {
        // Find the testName for each displayName (reverse lookup)
        const getTestName = (displayName) => {
            for (const [testName, dn] of testNameToDisplay) {
                if (dn === displayName) return testName;
            }
            return displayName.toLowerCase().replace(/\s+/g, '-');
        };
        
        const testNameA = getTestName(a);
        const testNameB = getTestName(b);
        
        const indexA = orderConfig.indexOf(testNameA);
        const indexB = orderConfig.indexOf(testNameB);
        
        // If both are in order config, sort by config order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in config, A comes first
        if (indexA !== -1) return -1;
        // If only B is in config, B comes first
        if (indexB !== -1) return 1;
        // Neither in config, sort alphabetically
        return a.localeCompare(b);
    });

    let markdown = '';

    for (const displayName of sortedDisplayNames) {
        const items = groups.get(displayName);
        markdown += `### ${displayName}\n`;
        // Main table: this data structure only (no js-sdsl / Native / Node Mode / C++ columns).
        markdown += `| Test Case | Avg (ms) | Min (ms) | Max (ms) | Stability |\n`;
        markdown += `|-----------|----------|----------|----------|-----------|\n`;

        // Index by raw test case name for optional "side-by-side" summaries.
        const jsAvgByCase = new Map();

        // Helper: keep non-DST variants out of the main table.
        const isVariantCase = (name) => {
            if (!name) return false;
            return (
                name.includes('(js-sdsl)') ||
                name.includes('(Node Mode)') ||
                name.startsWith('Native JS ')
            );
        };

        for (const item of items) {
            const rawName = item.benchmark['Test Case'];
            const testCaseName = formatNumberAbbr(rawName);
            const jsAvg = item.benchmark['Latency Avg (ms)'];
            const jsMin = item.benchmark['Min (ms)'];
            const jsMax = item.benchmark['Max (ms)'];
            const jsStability = item.benchmark['Stability'];

            // Store both raw and formatted keys so later summary tables can use abbreviated names.
            jsAvgByCase.set(rawName, jsAvg);
            jsAvgByCase.set(formatNumberAbbr(rawName), jsAvg);

            if (!isVariantCase(rawName)) {
                markdown += `| ${testCaseName} | ${jsAvg} | ${jsMin} | ${jsMax} | ${jsStability} |\n`;
            }
        }

        // Optional side-by-side comparison table:
        // - Main table above is DST only.
        // - Side-by-side table merges DST + variants (Node Mode / js-sdsl / Native) + C++.
        const suiteName = (() => {
            // Prefer the non-ESM base suite name when possible.
            const first = items[0]?.testName ?? '';
            return first.replace(/-esm$/, '');
        })();

        const hasVariantRows = items.some(it => isVariantCase(it.benchmark?.['Test Case']));
        const hasCpp = native && native.length > 0;

        if (hasVariantRows || hasCpp) {
            const pickOpt = (k) => jsAvgByCase.get(k);
            const pick = (k) => pickOpt(k) ?? '-';
            const cppPick = (k) =>
                cppMap.get(`${suiteName}|${k}`) ??
                cppMap.get(`${suiteName}|${formatNumberAbbr(k)}`) ??
                '-';

            const baseCases = [];
            for (const it of items) {
                const raw = it.benchmark?.['Test Case'];
                if (!raw) continue;
                if (isVariantCase(raw)) continue;
                if (!baseCases.includes(raw)) baseCases.push(raw);
            }

            if (baseCases.length > 0) {
                markdown += `\n#### ${displayName} (side-by-side)\n\n`;
                markdown += `> Comparison table. The main table above is ${displayName} only.\n`;
                markdown += `> Native is \`-\` when there is no apples-to-apples equivalent in this benchmark.\n\n`;

                const hasNodeMode = items.some(it => (it.benchmark?.['Test Case'] ?? '').includes('(Node Mode)'));
                // Keep the js-sdsl column even when a suite has no js-sdsl baseline cases.
                // Missing values should render as "-" instead of hiding the entire column.
                const hasSdsl = true;
                // Keep the Native column even when a suite has no Native baseline cases.
                // Missing values should render as "-" instead of hiding the entire column.
                const hasNative = true;

                // Node Mode is only meaningful for binary-tree family; hide it elsewhere.
                const isBinaryTreeSuite = ['red-black-tree', 'avl-tree', 'bst', 'binary-tree'].includes(suiteName);
                const showNodeMode = isBinaryTreeSuite && hasNodeMode;

                const columns = [
                    { key: 'dst', label: 'DST (ms)', align: 'right' },
                    ...(showNodeMode ? [{ key: 'node', label: 'Node Mode (ms)', align: 'right' }] : []),
                    ...(hasSdsl ? [{ key: 'sdsl', label: 'js-sdsl (ms)', align: 'right' }] : []),
                    ...(hasNative ? [{ key: 'native', label: 'Native (ms)', align: 'right' }] : []),
                    ...(hasCpp ? [{ key: 'cpp', label: 'C++ (ms)', align: 'right' }] : [])
                ];

                const header = ['Test Case', ...columns.map(c => c.label)];
                const sep = ['-----------', ...columns.map(() => '---------:')];

                markdown += `| ${header.join(' | ')} |\n`;
                markdown += `| ${sep.join(' | ')} |\n`;

                for (const base of baseCases) {
                    const abbr = formatNumberAbbr(base);
                    const dst = pick(base);
                    const nodeMode = pick(`${base} (Node Mode)`);
                    const sdsl = pick(`${base} (js-sdsl)`);
                    // Native rows usually have a prefix; try common variants.
                    const nativeMs = (
                        pickOpt(`Native JS ${base}`) ??
                        pickOpt(`Native JS Array ${base}`) ??
                        pickOpt(`Native JS Map ${base}`) ??
                        pickOpt(`Native JS Set ${base}`)
                    );
                    const cpp = cppPick(base);

                    const row = [
                        abbr,
                        dst,
                        ...(showNodeMode ? [nodeMode] : []),
                        ...(hasSdsl ? [sdsl] : []),
                        ...(hasNative ? [nativeMs ?? '-'] : []),
                        ...(hasCpp ? [cpp] : [])
                    ];

                    markdown += `| ${row.join(' | ')} |\n`;
                }

                markdown += '\n';
            }
        }

        markdown += '\n';
    }

    return markdown;
}

/**
 * Update PERFORMANCE.md file with new markdown tables
 */
function updatePerformanceMarkdown(markdownContent) {
    const mdPath = path.join(docsPath, 'PERFORMANCE.md');

    if (!fs.existsSync(mdPath)) {
        console.warn(
            `${YELLOW}⚠ PERFORMANCE.md not found at ${mdPath}${END}`
        );
        console.log(
            `${YELLOW}Skipping Markdown update. Create the file with markers to enable this feature.${END}`
        );
        return;
    }

    let content = fs.readFileSync(mdPath, 'utf-8');

    const startMarker = '[//]: # (No deletion!!! Start of Replace Section)';
    const endMarker = '[//]: # (No deletion!!! End of Replace Section)';

    if (!content.includes(startMarker) || !content.includes(endMarker)) {
        console.warn(
            `${YELLOW}⚠ Replace markers not found in PERFORMANCE.md${END}`
        );
        console.log(
            `${YELLOW}Add these markers to PERFORMANCE.md to enable auto-update:${END}`
        );
        console.log(`${CYAN}${startMarker}${END}`);
        console.log(`${CYAN}${endMarker}${END}`);
        return;
    }

    const regex = new RegExp(
        `${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}`,
        'g'
    );

    const updated = content.replace(
        regex,
        `${startMarker}\n\n${markdownContent}\n${endMarker}`
    );

    fs.writeFileSync(mdPath, updated, 'utf-8');
    console.log(`${GREEN}✓ Updated ${mdPath}${END}`);
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate HTML report with side-by-side comparison layout
 */
function generateHtmlReport(report) {
    const { javascript = [], native = [] } = report;

    const testGroups = new Map();
    for (const test of javascript) {
        if (!testGroups.has(test.testName)) {
            testGroups.set(test.testName, { testName: test.testName, js: null, native: null });
        }
        testGroups.get(test.testName).js = test;
    }
    for (const test of native) {
        if (!testGroups.has(test.testName)) {
            testGroups.set(test.testName, { testName: test.testName, js: null, native: null });
        }
        testGroups.get(test.testName).native = test;
    }

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Benchmark Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 30px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      border-bottom: 3px solid #3498db;
      padding-bottom: 15px;
    }
    .timestamp {
      color: #7f8c8d;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .summary {
      background: #ecf0f1;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 30px;
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }
    .summary-stat {
      display: inline-block;
    }
    .summary-label {
      font-size: 12px;
      color: #7f8c8d;
      text-transform: uppercase;
      font-weight: 600;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      margin-top: 5px;
    }
    .test-section {
      margin-bottom: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #3498db;
    }
    .test-name {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .comparison {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .comparison-column {
      flex: 1;
    }
    .comparison-header {
      font-weight: 600;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 2px solid #3498db;
      font-size: 14px;
    }
    .lang-js {
      color: #f39c12;
    }
    .lang-cpp {
      color: #e74c3c;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    th {
      background: #34495e;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #ecf0f1;
      font-size: 13px;
    }
    tr:hover {
      background: #f5f5f5;
    }
    .metric {
      font-weight: 500;
      color: #27ae60;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Performance Benchmark Report</h1>
    <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    
    <div class="summary">
      <div class="summary-stat">
        <div class="summary-label">data-structure-typed Tests</div>
        <div class="summary-value">${javascript.length}</div>
      </div>
      <div class="summary-stat">
        <div class="summary-label">C++ Tests</div>
        <div class="summary-value">${native.length}</div>
      </div>
      <div class="summary-stat">
        <div class="summary-label">Total Tests</div>
        <div class="summary-value">${javascript.length + native.length}</div>
      </div>
    </div>
`;

    // Group by test name and generate side-by-side comparisons
    for (const [testName, group] of testGroups) {
        html += `<div class="test-section">`;
        html += `<div class="test-name">${testName}</div>`;
        html += `<div class="comparison">`;

        // JavaScript table (left side)
        if (group.js) {
            html += `<div class="comparison-column">`;
            html += `<div class="comparison-header lang-js">data-structure-typed</div>`;
            html += `<table>`;
            html += `<thead><tr><th>Test Case</th><th>Avg (ms)</th><th>Min (ms)</th><th>Max (ms)</th><th>Stability</th></tr></thead>`;
            html += `<tbody>`;
            for (const benchmark of group.js.benchmarks) {
                html += `<tr>`;
                html += `<td>${formatNumberAbbr(benchmark['Test Case'])}</td>`;
                html += `<td class="metric">${benchmark['Latency Avg (ms)']}</td>`;
                html += `<td>${benchmark['Min (ms)']}</td>`;
                html += `<td>${benchmark['Max (ms)']}</td>`;
                html += `<td>${benchmark['Stability']}</td>`;
                html += `</tr>`;
            }
            html += `</tbody></table>`;
            html += `</div>`;
        }

        // C++ table (right side)
        if (group.native) {
            html += `<div class="comparison-column">`;
            html += `<div class="comparison-header lang-cpp">C++</div>`;
            html += `<table>`;
            html += `<thead><tr><th>Test Case</th><th>Avg (ms)</th><th>Min (ms)</th><th>Max (ms)</th><th>Stability</th></tr></thead>`;
            html += `<tbody>`;
            for (const benchmark of group.native.benchmarks) {
                html += `<tr>`;
                html += `<td>${formatNumberAbbr(benchmark['Test Case'])}</td>`;
                html += `<td class="metric">${benchmark['Latency Avg (ms)']}</td>`;
                html += `<td>${benchmark['Min (ms)']}</td>`;
                html += `<td>${benchmark['Max (ms)']}</td>`;
                html += `<td>${benchmark['Stability']}</td>`;
                html += `</tr>`;
            }
            html += `</tbody></table>`;
            html += `</div>`;
        }

        html += `</div></div>`;
    }

    html += `</div></body></html>`;

    const htmlPath = path.join(reportDistPath, 'report.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`${GREEN}✓ HTML report written to: ${htmlPath}${END}`);
}

async function main() {
    console.log(`\n${BOLD}📄 Generating Reports...${END}\n`);

    const report = loadReport();

    // Generate HTML report with side-by-side comparison layout
    console.log(`${CYAN}→ Generating HTML report (comparison layout)...${END}`);
    generateHtmlReport(report);

    // Generate Markdown comparison tables
    console.log(`${CYAN}→ Generating Markdown comparison tables...${END}`);
    const markdown = generateMarkdownComparison(report);
    if (markdown) {
        updatePerformanceMarkdown(markdown);
    } else {
        console.log(`${YELLOW}ℹ No Markdown tables generated${END}`);
    }

    console.log(
        `\n${GREEN}${BOLD}✅ All reports generated successfully!${END}${END}`
    );
    console.log(`\n${CYAN}📁 Output files:${END}`);
    console.log(`  ${GREEN}✓${END} HTML Report:        benchmark/report.html`);
    console.log(`    └─ 📊 Comparison Layout: Left JS | Right C++`);
    console.log(`    └─ 🎨 Summary Stats + Test Sections`);
    console.log(`    └─ 📋 2 Tables Per Data Structure`);
    console.log(`    └─ ✨ Number Abbreviation: 10M, 100K, 1K`);
    console.log(`\n  ${GREEN}✓${END} Markdown Tables:    docs/PERFORMANCE.md`);
    console.log(`    └─ Comparison tables with C++ Avg column`);
    console.log(`    └─ Intelligent native test matching`);
    console.log(`    └─ ✨ Number Abbreviation: 10M, 100K, 1K`);
    console.log(`\n  ${GRAY}ℹ${END} Data Source:       benchmark/report.json\n`);
}

main().catch(err => {
    console.error(`${RED}❌ Error:${END}`, err.message);
    process.exit(1);
});