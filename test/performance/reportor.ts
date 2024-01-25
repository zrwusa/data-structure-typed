import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';
import { ConsoleColor, numberFix, render } from '../utils';
import { PerformanceTest } from './types';

const args = process.argv.slice(2);

const { GREEN, BOLD, END, YELLOW, GRAY, CYAN, BG_YELLOW } = ConsoleColor;

const getRelativePath = (file: string) => {
  return path.relative(__dirname, file);
};
const coloredLabeled = (label: string, file: string) => {
  const relativeFilePath = getRelativePath(file);
  const directory = path.dirname(relativeFilePath);
  const fileName = path.basename(relativeFilePath);
  return `${BG_YELLOW} ${label} ${END} ${GRAY}${directory}/${END}${CYAN}${fileName}${END}`;
};

const parentDirectory = path.resolve(__dirname, '../..');
const reportDistPath = path.join(parentDirectory, 'benchmark');

const testDir = path.join(__dirname, 'data-structures');
const allFiles = fastGlob.sync(path.join(testDir, '**', '*.test.ts'));
let testFiles: string[];

let isIndividual = false;
if (args.length > 0) {
  console.log(`arguments: ${args.join(' ')}`);

  testFiles = allFiles.filter(file => args.every(word => file.includes(word)));
  isIndividual = true;
  console.log(
    `${testFiles.map(file => coloredLabeled('Matched', file)).join(`
`)}`
  );
} else {
  isIndividual = false;
  testFiles = allFiles;
}

const report: { [key: string]: any } = {};

let completedCount = 0;

const performanceTests: PerformanceTest[] = [];

testFiles.forEach((file: string) => {
  const testName = path.basename(file, '.test.ts');
  const testFunction = require(file);
  const { suite } = testFunction;
  if (suite) performanceTests.push({ testName, suite, file });
});

const composeReport = () => {
  if (!fs.existsSync(reportDistPath)) fs.mkdirSync(reportDistPath, { recursive: true });

  const filePath = path.join(reportDistPath, 'report.json');
  const htmlFilePath = path.join(reportDistPath, 'report.html');
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <title>performance of data-structure-typed</title>
                          <style>
                          *{
                          box-sizing: border-box;
                          }
                                #json-to-html {
                                padding: 0 10px 20px;
                                }
                                
                                .json-to-html-label {
                                    font-size: 2rem;
                                    margin: 2rem 0 0 3px;
                                }
                               .content table {
                                  width: 100%;
                                  table-layout: fixed;
                                  border-collapse: collapse;
                                  margin-top: 10px;
                                  font-size: 16px;
                                }
                            
                                .content table th,
                                .content table td {
                                  padding: 8px 12px;
                                  text-align: left;
                                  border: 1px solid #ddd;
                                }
                            
                                .content table th {
                                  background-color: #f2f2f2;
                                  font-weight: bold;
                                }
                            
                                .content table tr:nth-child(odd) {
                                  background-color: #ffffff;
                                }
                            </style>
                        </head>
                        <body>
                        <div id="json-to-html">`;
  let htmlTables = '';
  for (const r in report) {
    if (report.hasOwnProperty(r)) {
      htmlTables += render(report[r].testName, report[r].benchmarks, {
        plainHtml: true,
        '<>': 'table',
        html: [
          {
            '<>': 'tr',
            html: [
              { '<>': 'td', html: '${name}' },
              { '<>': 'td', html: '${periodMS}' },
              { '<>': 'td', html: '${mean}' }
            ]
          }
        ]
      });
    }
  }
  htmlTables += `

`;
  html += htmlTables;
  html += `</div>
                    </body>
                  </html>`;
  if (!isIndividual)
    replaceMarkdownContent(
      '[//]: # (No deletion!!! Start of Replace Section)', // Start tag
      '[//]: # (No deletion!!! End of Replace Section)', // end identifier
      htmlTables // New content to be inserted
    );
  fs.writeFileSync(htmlFilePath, html);
  console.log(`Performance ${BOLD}${GREEN}report${END} file generated in file://${BOLD}${GREEN}${htmlFilePath}${END}`);
};

function replaceMarkdownContent(startMarker: string, endMarker: string, newText: string) {
  const filePath = path.join(parentDirectory, 'README.md'); // Path to README.md file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Unable to read ${filePath}:`, err);
      return;
    }

    // Find the start and end markers in the content
    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      console.error('Unable to find start or end marker');
      return;
    }

    // Replace the old content with the new text
    const updatedMarkdown = data.slice(0, startIndex + startMarker.length) + '\n' + newText + data.slice(endIndex);

    // Try writing the modified content back to the file
    fs.writeFile(filePath, updatedMarkdown, 'utf8', err => {
      if (err) {
        console.error(`Unable to write to ${filePath}:`, err);
      } else {
        console.log(`The content has been successfully replaced in file://${BOLD}${GREEN}${filePath}${END}`);
      }
    });
  });
}

const order = [
  'heap',
  'rb-tree',
  'queue',
  'deque',
  'hash-map',
  'trie',
  'avl-tree',
  'binary-tree-overall',
  'directed-graph',
  'doubly-linked-list',
  'singly-linked-list',
  'priority-queue',
  'stack'
];

const sortedPerformanceTests = [...performanceTests].sort((a, b) => {
  const indexA = order.indexOf(a.testName);
  const indexB = order.indexOf(b.testName);

  // If both a and b are in the order, sort them according to their indices in the order.
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }

  // If there is only 'a' in the order, then place 'b' in front.
  if (indexA !== -1) {
    return 1;
  }

  // If only b is in the order, then a should be placed before it.
  if (indexB !== -1) {
    return -1;
  }

  // If neither a nor b are in order, keep their original order
  return 0;
});

console.log(`${GREEN} Found tests${END}: ${sortedPerformanceTests.map(test => test.testName)}`);

sortedPerformanceTests.forEach(item => {
  const { suite, testName, file } = item;

  console.log(coloredLabeled('Running', file));

  if (suite) {
    let runTime = 0;
    suite
      .on('complete', function (this: Benchmark.Suite) {
        completedCount++;
        report[testName] = {};
        report[testName].benchmarks = this.map((benchmark: Benchmark) => {
          runTime += benchmark.times.elapsed;
          return {
            'test name': benchmark.name,
            'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
            'executions per sec': numberFix(benchmark.hz, 2),
            // 'executed times': numberFix(benchmark.count, 0),
            // 'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
            'sample deviation': numberFix(benchmark.stats.deviation, 2)
          };
        });

        report[testName].testName = testName;
        const isDone = completedCount === performanceTests.length;
        runTime = Number(runTime.toFixed(2));
        const isTimeWarn = runTime > 120;
        console.log(
          // `Files: ${GREEN}${testFileCount}${END} `,
          // `Suites: ${GREEN}${performanceTests.length}${END} `,
          `Suites Progress: ${isDone ? GREEN : YELLOW}${completedCount}${END}/${isDone ? GREEN : YELLOW}${
            performanceTests.length
          }${END}`,
          `Time: ${isTimeWarn ? YELLOW : GREEN}${runTime}s${END}`
        );
        if (isDone) {
          composeReport();
        }
      })
      .run({ async: false });
  }
});
