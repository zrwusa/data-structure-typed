/**
 * Enhanced Benchmark Runner - JavaScript + C++ Support (FIXED)
 * Combines JavaScript and C++ benchmark execution into a unified pipeline
 * ✨ Fixed: Dynamic C++ executable discovery based on test files
 * ✨ Fixed: Config rules now work properly for C++ files
 * ✨ Fixed: Glob pattern matching with proper ** support
 * ✨ NEW: Detailed progress tracking and file-level logging
 * ✨ NEW: Number formatting in test case names (1000000 -> 1M)
 */

import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import fastGlob from 'fast-glob';
import { fileURLToPath } from 'url';
import {
    compileCppBenchmarks,
    runCppBenchmark,
    discoverCppBenchmarks
} from './cmake-benchmark-runner.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes
const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';
const END = '\x1b[0m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const GRAY = '\x1b[90m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';

// Progress tracking
let currentFile = '';
let currentIndex = 0;
let totalFiles = 0;

function getProgressBar(current, total, width = 30) {
    const percentage = (current / total) * 100;
    const filledWidth = Math.round((width * current) / total);
    const emptyWidth = width - filledWidth;
    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);
    return `${filled}${empty} ${percentage.toFixed(0)}%`;
}

function printProgressHeader(type, current, total) {
    const progressBar = getProgressBar(current, total, 25);
    const status = `[${current}/${total}]`;
    console.log(
        `\n${MAGENTA}${progressBar}${END} ${status} ${BOLD}${type}${END}`
    );
}

function printFileLoading(fileName, index, total, type) {
    const progressBar = getProgressBar(index, total, 20);
    console.log(
        `  ${progressBar} ${CYAN}↳${END} ${GRAY}[${index}/${total}]${END} ${type}: ${BOLD}${fileName}${END}`
    );
}

function printFileComplete(fileName, index, total, benchmarkCount, runTime) {
    console.log(
        `  ${GREEN}✓${END} ${GRAY}[${index}/${total}]${END} ${fileName} - ${benchmarkCount} benchmarks (${runTime.toFixed(2)}s)`
    );
}

function printFileError(fileName, index, total, error) {
    console.log(
        `  ${RED}✗${END} ${GRAY}[${index}/${total}]${END} ${fileName} - ${YELLOW}${error}${END}`
    );
}

function parseArgs(argv) {
    const flags = {
        isolate: false,
        gc: false,
        cooldownMs: 50,
        shuffle: false,
        order: undefined,
        orderFile: undefined,
        include: undefined,
        exclude: undefined,
        label: undefined,
        cppOnly: false,
        jsOnly: false
    };

    const filters = [];

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
            case 'cpp-only':
                flags.cppOnly = true;
                break;
            case 'js-only':
                flags.jsOnly = true;
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

function loadRunConfigFromFile(filePath) {
    const p1 = filePath
        ? path.resolve(process.cwd(), filePath)
        : path.resolve(__dirname, 'runner-config.json');
    const p2 = filePath ? undefined : path.resolve(__dirname, 'run-order.json');

    const candidates = [p1, p2].filter(Boolean);

    for (const p of candidates) {
        try {
            if (fs.existsSync(p)) {
                const data = JSON.parse(fs.readFileSync(p, 'utf8'));

                if (Array.isArray(data)) {
                    console.log(`${YELLOW}ℹ Using run config from file:${END} ${p}`);
                    return { order: data };
                } else if (data && typeof data === 'object') {
                    const cfg = {};

                    if (Array.isArray(data.order))
                        cfg.order = data.order.filter(x => typeof x === 'string');
                    if (Array.isArray(data.include))
                        cfg.include = data.include.filter(x => typeof x === 'string');
                    if (Array.isArray(data.exclude))
                        cfg.exclude = data.exclude.filter(x => typeof x === 'string');
                    if (typeof data.label === 'string') cfg.label = data.label;

                    console.log(`${YELLOW}ℹ Using run config from file:${END} ${p}`);
                    return cfg;
                }
            }
        } catch (e) {
            console.warn(`Failed to load run config from ${p}:`, e.message);
        }
    }

    return null;
}

const cfg = loadRunConfigFromFile(flags.orderFile);

const parentDirectory = path.resolve(__dirname, '../..');
const reportDistPath = path.join(parentDirectory, 'benchmark');
const testDir = path.join(__dirname, 'data-structures');

// Helper function to match glob patterns (supports **/ correctly)
function matchesGlobPattern(filePath, pattern) {
    // Convert glob pattern to regex.
    // IMPORTANT: treat "**/" as an optional directory prefix, so patterns like
    // "binary-tree/**/*.test.cpp" match both:
    // - binary-tree/red-black-tree.test.cpp
    // - binary-tree/foo/bar/baz.test.cpp
    const globToRegex = (glob) => {
        // Escape special regex chars (but keep glob tokens * and ? intact for later).
        let re = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&');

        // Protect literal "?" glob tokens so we don't corrupt regex syntax we inject later (e.g. "(?:").
        re = re.replace(/\?/g, '___QM___');

        // "**/" -> optional nested directories
        re = re.replace(/\*\*\//g, '(?:.*\\/)?');
        // remaining "**" -> anything
        re = re.replace(/\*\*/g, '.*');
        // "*" -> anything but '/'
        re = re.replace(/\*/g, '[^/]*');
        // Restore glob '?' -> single char
        re = re.replace(/___QM___/g, '.');

        return new RegExp(`^${re}$`);
    };

    const fileName = path.basename(filePath);
    const relPath = path.relative(testDir, filePath).replace(/\\/g, '/');
    const regex = globToRegex(pattern);

    return regex.test(fileName) || regex.test(relPath);
}

// Helper function to match files against CLI filters
function matchesFilters(file, filterList) {
    if (!filterList || filterList.length === 0) return true;

    const fileName = path.basename(file);
    return filterList.some(
        word => fileName.includes(word) || file.includes(word)
    );
}

// Apply config rules (include, exclude, order) to file list
function applyConfigRules(files, config) {
    if (!config) return files;

    let filtered = [...files];

    // Apply include patterns
    if (config.include && config.include.length > 0) {
        filtered = filtered.filter(file =>
            config.include.some(pattern => matchesGlobPattern(file, pattern))
        );
    }

    // Apply exclude patterns
    if (config.exclude && config.exclude.length > 0) {
        filtered = filtered.filter(
            file =>
                !config.exclude.some(pattern => matchesGlobPattern(file, pattern))
        );
    }

    // Apply order
    if (config.order && config.order.length > 0) {
        filtered.sort((a, b) => {
            const nameA = path
                .basename(a, path.extname(a))
                .replace(/\.test$/, '');
            const nameB = path
                .basename(b, path.extname(b))
                .replace(/\.test$/, '');

            const indexA = config.order.findIndex(name => nameA.includes(name));
            const indexB = config.order.findIndex(name => nameB.includes(name));

            if (indexA === -1) return 1; // unmapped goes to end
            if (indexB === -1) return -1;

            return indexA - indexB;
        });
    }

    return filtered;
}

// Helper to apply config rules to C++ files (with .test.cpp translation)
function applyCppConfigRules(files, config) {
    if (!config) return files;

    let filtered = [...files];

    // Apply include patterns - translate .test patterns to .test.cpp
    if (config.include && config.include.length > 0) {
        filtered = filtered.filter(file => {
            return config.include.some(pattern => {
                // Try matching as-is first (glob pattern like "binary-tree/**/*.test.cpp")
                if (matchesGlobPattern(file, pattern)) return true;

                // If pattern ends with .mjs/.ts, try replacing it with .cpp variants
                if (
                    pattern.endsWith('.test.mjs') ||
                    pattern.endsWith('.test.ts')
                ) {
                    const cppPattern = pattern.replace(/\.test\.(mjs|ts)$/, '.test.cpp');
                    if (matchesGlobPattern(file, cppPattern)) return true;
                }

                return false;
            });
        });
    }

    // Apply exclude patterns - translate .test patterns to .test.cpp
    if (config.exclude && config.exclude.length > 0) {
        filtered = filtered.filter(file => {
            return !config.exclude.some(pattern => {
                // Try matching as-is first
                if (matchesGlobPattern(file, pattern)) return true;

                // If pattern ends with .mjs/.ts, try replacing it with .cpp variants
                if (
                    pattern.endsWith('.test.mjs') ||
                    pattern.endsWith('.test.ts')
                ) {
                    const cppPattern = pattern.replace(/\.test\.(mjs|ts)$/, '.test.cpp');
                    if (matchesGlobPattern(file, cppPattern)) return true;
                }

                return false;
            });
        });
    }

    // Apply order
    if (config.order && config.order.length > 0) {
        filtered.sort((a, b) => {
            const nameA = path.basename(a, '.test.cpp');
            const nameB = path.basename(b, '.test.cpp');

            const indexA = config.order.findIndex(name => nameA.includes(name));
            const indexB = config.order.findIndex(name => nameB.includes(name));

            if (indexA === -1) return 1; // unmapped goes to end
            if (indexB === -1) return -1;

            return indexA - indexB;
        });
    }

    return filtered;
}

// JS Test Discovery
const allJsFiles = !flags.cppOnly
    ? fastGlob.sync([
        path.join(testDir, '**', '*.test.ts'),
        path.join(testDir, '**', '*.test.mjs')
    ])
    : [];

let jsTestFiles = [];

if (filters.length > 0 && !flags.cppOnly) {
    jsTestFiles = allJsFiles.filter(file => matchesFilters(file, filters));
} else if (!flags.cppOnly) {
    jsTestFiles = [...allJsFiles];
}

// Apply config rules to JS tests
jsTestFiles = applyConfigRules(jsTestFiles, cfg);

// C++ Test Discovery - with same filter logic as JS
let allCppFiles = !flags.jsOnly
    ? fastGlob.sync([path.join(testDir, '**', '*.test.cpp')])
    : [];

let cppTestFiles = [];

if (filters.length > 0 && !flags.jsOnly) {
    cppTestFiles = allCppFiles.filter(file => matchesFilters(file, filters));
} else if (!flags.jsOnly) {
    cppTestFiles = [...allCppFiles];
}

// Apply config rules to C++ tests (with proper pattern translation)
cppTestFiles = applyCppConfigRules(cppTestFiles, cfg);

console.log(`\n${BOLD}📊 Benchmark Discovery${END}`);
console.log(`  ${CYAN}JavaScript tests${END}: ${jsTestFiles.length} files`);
console.log(`  ${CYAN}C++ tests${END}: ${cppTestFiles.length} files`);
console.log(`  ${CYAN}Total${END}: ${jsTestFiles.length + cppTestFiles.length} files\n`);

// Helper to format large numbers to readable units (1000000 -> 1M, 100000 -> 100K, etc.)
function formatNumberInString(str) {
    if (!str || typeof str !== 'string') return str;

    // Replace large numbers with human-readable format
    return str.replace(/\b(\d+)\b/g, (match) => {
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

// Helper
function numberFix(num, digits = 2) {
    return Number(num.toFixed(digits));
}

async function generateUnifiedReport(jsResults, cppResults) {
    if (!fs.existsSync(reportDistPath)) {
        fs.mkdirSync(reportDistPath, { recursive: true });
    }

    // Format test case names in results (convert 1000000 -> 1M)
    const formattedJsResults = jsResults.map(result => ({
        ...result,
        benchmarks: result.benchmarks.map(bench => ({
            ...bench,
            'Test Case': formatNumberInString(bench['Test Case'])
        }))
    }));

    const formattedCppResults = cppResults.map(result => ({
        ...result,
        benchmarks: result.benchmarks.map(bench => ({
            ...bench,
            'Test Case': formatNumberInString(bench['Test Case'])
        }))
    }));

    const report = {
        timestamp: new Date().toISOString(),
        javascript: formattedJsResults,
        native: formattedCppResults,
        summary: {
            jsTestCount: jsResults.length,
            cppTestCount: cppResults.length,
            totalTests: jsResults.length + cppResults.length
        }
    };

    const filePath = path.join(reportDistPath, 'report.json');
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    console.log(`\n${GREEN}✓ Report written to: ${filePath}${END}`);

    return report;
}

async function main() {
    const jsResults = [];
    const cppResults = [];

    // Run JavaScript benchmarks
    if (!flags.cppOnly && jsTestFiles.length > 0) {
        console.log(`\n${BOLD}🔵 Running JavaScript Benchmarks${END}`);
        printProgressHeader('JavaScript', 0, jsTestFiles.length);

        for (let i = 0; i < jsTestFiles.length; i++) {
            const file = jsTestFiles[i];
            const testName = path
                .basename(file, path.extname(file))
                .replace(/\.test$/, '');

            printFileLoading(testName, i + 1, jsTestFiles.length, 'Loading');

            try {
                const testModule = await import(file);

                // Support both single suite and multiple suites (suite, suite1, suite2, etc.)
                const suites = [];

                if (testModule.suite) {
                    suites.push({ name: testName, suite: testModule.suite });
                }

                // Collect all suite1, suite2, suite3, etc.
                let suiteIndex = 1;
                while (testModule[`suite${suiteIndex}`]) {
                    suites.push({
                        name: `${testName}-${suiteIndex}`,
                        suite: testModule[`suite${suiteIndex}`]
                    });
                    suiteIndex++;
                }

                // Support an alternate path: a test module can export precomputed results
                // (useful for macro-style hrtime benchmarks that should not be wrapped by Benchmark.js).
                if (testModule.results || testModule.getResults) {
                    const t0 = Date.now();
                    
                    // Heartbeat to prevent timeout during long-running macro benchmarks
                    const heartbeatInterval = setInterval(() => {
                        process.stdout.write('.');
                    }, 5000);
                    
                    const raw = testModule.getResults
                        ? await testModule.getResults()
                        : await Promise.resolve(testModule.results);
                    
                    clearInterval(heartbeatInterval);

                    const benchmarks = Array.isArray(raw) ? raw : [];
                    const runTime = Number(((Date.now() - t0) / 1000).toFixed(2));

                    jsResults.push({
                        testName: testName,
                        benchmarks,
                        runTime,
                        file
                    });

                    printFileComplete(testName, i + 1, jsTestFiles.length, benchmarks.length, runTime);
                    continue;
                }

                // Process each suite
                for (const { name: suiteName, suite } of suites) {
                    const benchmarks = [];
                    let runTime = 0;

                    // Add a default per-cycle progress log to avoid long "no output" phases.
                    // Only attach if the suite doesn't already have a cycle listener.
                    try {
                        const hasCycle = typeof suite.listeners === 'function' && suite.listeners('cycle')?.length > 0;
                        if (!hasCycle) {
                            suite.on('cycle', function (event) {
                                // Example: "✓ red-black-tree :: 1,000,000 get"
                                const b = event?.target;
                                const name = b?.name ?? '';
                                if (name) console.log(`  ✓ ${suiteName} :: ${name}`);
                            });
                        }
                    } catch {
                        // ignore
                    }

                    // Heartbeat to prevent timeout during long-running benchmarks
                    const heartbeatInterval = setInterval(() => {
                        process.stdout.write('.');
                    }, 5000);

                    await new Promise((resolve) => {
                        suite
                            .on('complete', function () {
                                clearInterval(heartbeatInterval);
                                process.stdout.write('\n');
                                benchmarks.push(
                                    ...this.map(benchmark => {
                                        runTime += benchmark.times.elapsed;
                                        const scaleOps = benchmark.options?._totalOps;

                                        // By default, Benchmark.js mean/sample are "per operation".
                                        // For some macro-style cases (e.g. "1,000,000 get") we benchmark 1 lookup per
                                        // operation but want to report total time for N lookups to keep reports consistent.
                                        const scale = typeof scaleOps === 'number' && Number.isFinite(scaleOps) && scaleOps > 0
                                            ? scaleOps
                                            : 1;

                                        const meanMs = benchmark.stats.mean * 1000 * scale;
                                        const minMs = Math.min(...benchmark.stats.sample) * 1000 * scale;
                                        const maxMs = Math.max(...benchmark.stats.sample) * 1000 * scale;

                                        // Keep extra precision for very fast ops (sub-millisecond totals),
                                        // otherwise everything rounds to 0.00ms.
                                        const msDigits = meanMs < 10 ? 4 : 2;

                                        return {
                                            'Test Case': benchmark.name,
                                            'Latency Avg (ms)': numberFix(meanMs, msDigits),
                                            'Min (ms)': numberFix(minMs, msDigits),
                                            'Max (ms)': numberFix(maxMs, msDigits),
                                            'Stability': `±${numberFix(benchmark.stats.rme, 2)}%`
                                        };
                                    })
                                );
                                runTime = Number(runTime.toFixed(2));
                                resolve();
                            })
                            .run({ async: false });
                    });

                    jsResults.push({
                        testName: suiteName,
                        benchmarks,
                        runTime,
                        file
                    });

                    printFileComplete(suiteName, i + 1, jsTestFiles.length, benchmarks.length, runTime);
                }
            } catch (err) {
                printFileError(testName, i + 1, jsTestFiles.length, err.message);
            }
        }

        console.log(`${GREEN}✓ JavaScript benchmarks complete${END}`);
    }

    // Run C++ benchmarks
    if (!flags.jsOnly && cppTestFiles.length > 0) {
        console.log(`\n${BOLD}🔴 Running C++ Benchmarks${END}`);
        printProgressHeader('C++', 0, cppTestFiles.length);

        const compiled = await compileCppBenchmarks();

        if (compiled) {
            // FIXED: Pass cppTestFiles to discover executables matching those tests
            const executables = discoverCppBenchmarks(cppTestFiles);

            for (let i = 0; i < executables.length; i++) {
                const exe = executables[i];
                printFileLoading(exe.name, i + 1, executables.length, 'Running');

                const result = runCppBenchmark(exe.path);

                if (result.success && result.benchmarks.length > 0) {
                    cppResults.push({
                        testName: exe.name,
                        benchmarks: result.benchmarks,
                        isNative: true
                    });

                    printFileComplete(exe.name, i + 1, executables.length, result.benchmarks.length, 0);
                } else {
                    printFileError(exe.name, i + 1, executables.length, 'No benchmarks parsed');
                }
            }
        }

        console.log(`${GREEN}✓ C++ benchmarks complete${END}`);
    }

    // Generate unified report (with formatted numbers)
    await generateUnifiedReport(jsResults, cppResults);

    console.log(
        `\n${GREEN}${BOLD}✅ Benchmark run complete!${END}${END}`
    );
    console.log(
        `\n${CYAN}Summary${END}:`
    );
    console.log(`  ${GREEN}JavaScript:${END} ${jsResults.length} test suites`);
    console.log(`  ${GREEN}C++:${END} ${cppResults.length} test suites`);
    console.log(`  ${GREEN}Total:${END} ${jsResults.length + cppResults.length} test suites\n`);
}

main().catch(err => {
    console.error(`${RED}❌ Error:${END}`, err);
    process.exit(1);
});