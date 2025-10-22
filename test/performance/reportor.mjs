import * as path from 'path';
import * as fs from 'fs';
import fastGlob from 'fast-glob';
import { fileURLToPath } from 'url';

const isNumber = value => {
  return typeof value === 'number';
};
const isString = value => {
  return typeof value === 'string';
};
const isBoolean = value => {
  return typeof value === 'boolean';
};
const isDate = value => {
  return value instanceof Date;
};
const isNull = value => {
  return value === null;
};
const isUndefined = value => {
  return typeof value === 'undefined';
};
const isFunction = value => {
  return typeof value === 'function';
};
const isObject = value => {
  return typeof value === 'object';
};
const isArray = value => {
  return Array.isArray(value);
};
const isEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== 'object' || typeof objB !== 'object' || objA === null || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }
    if (!isEqual(objA[key], objB[key])) {
      return false;
    }
  }
  return true;
};

function toggleJS(options) {
  if (options === null || options === void 0 ? void 0 : options.plainHtml) {
    return '';
  } else {
    return 'onclick="json-to-html.toggleVisibility(this);return false"';
  }
}

function makeLabelDiv(options, level, keyName, datatype) {
  if (typeof keyName === 'number') {
    return `<div class='index'><span class='json-to-html-label'>${keyName}&nbsp;</span></div>`;
  } else if (typeof keyName === 'string') {
    if (datatype === 'array') {
      return `<div class='collapsible level${level}' ${toggleJS(options)}><span class='json-to-html-label'>${keyName}</span></div>`;
    } else if (datatype === 'object') {
      return `<div class='attribute collapsible level${level}' ${toggleJS(options)}><span class='json-to-html-label'>${keyName}:</span></div>`;
    } else {
      return `<div class='leaf level${level}'><span class='json-to-html-label'>${keyName}:</span></div>`;
    }
  } else {
    return '';
  }
}

function getContentClass(keyName) {
  if (typeof keyName === 'string') {
    return 'content';
  } else {
    return '';
  }
}

function isPlainObject(val) {
  let lastKey;
  let lastOwnKey;
  for (const key in val) {
    if (val.hasOwnProperty(key)) {
      lastOwnKey = key;
    }
  }
  for (const key in val) {
    lastKey = key;
  }
  return lastOwnKey === lastKey;
}

function isLeafValue(val) {
  return (
    isNumber(val) ||
    isString(val) ||
    isBoolean(val) ||
    isDate(val) ||
    isNull(val) ||
    isUndefined(val) ||
    isNaN(val) ||
    isFunction(val) ||
    !isPlainObject(val)
  );
}

function isLeafObject(obj) {
  if (!isObject(obj)) {
    return false;
  }
  for (const key in obj) {
    const val = obj[key];
    if (!isLeafValue(val)) {
      return false;
    }
  }
  return true;
}

function isTable(arr) {
  if (!isArray(arr)) {
    return false;
  }
  if (arr.length === 0 || !isObject(arr[0])) {
    return false;
  } else {
    let nonCompliant = arr.find(row => !isLeafObject(row));
    if (nonCompliant) {
      return false;
    } else {
      const cols = Object.keys(arr[0]);
      nonCompliant = arr.find(row => !isEqual(cols, Object.keys(row)));
      return !nonCompliant;
    }
  }
}

function drawTable(arr) {
  function drawRow(headers, rowObj) {
    return '<td>' + headers.map(header => rowObj[header]).join('</td><td>') + '</td>';
  }

  const cols = Object.keys(arr[0]);
  const content = arr.map(rowObj => drawRow(cols, rowObj));
  const headingHtml = '<tr><th>' + cols.join('</th><th>') + '</th></tr>';
  const contentHtml = '<tr>' + content.join('</tr><tr>') + '</tr>';
  return '<table style="display: table; width:100%; table-layout: fixed;">' + headingHtml + contentHtml + '</table>';
}

function _render(name, data, options, level, altRow) {
  const contentClass = getContentClass(name);
  if (isArray(data)) {
    const title = makeLabelDiv(options, level, `${name}`, 'array');
    let subs;
    if (isTable(data)) {
      subs = drawTable(data);
    } else {
      subs =
        "<div class='altRows'>" +
        data
          .map((val, idx) => _render(idx.toString(), val, options, level + 1, idx % 2))
          .join("</div><div class='altRows'>") +
        '</div>';
    }
    return `<div class="json-to-html-collapse clearfix ${altRow}">
      ${title}
      <div class="${contentClass}">${subs}</div>
    </div>`;
  } else if (isLeafValue(data)) {
    const title = makeLabelDiv(options, level, name);
    if (isFunction(data)) {
      return `${title}<span class='json-to-html-value'>&nbsp;&nbsp;-function() can't _render-</span>`;
    } else if (!isPlainObject(data)) {
      if (isFunction(data.toString)) {
        return `${title}<span class='json-to-html-value'>&nbsp;&nbsp;${data.toString()}</span>`;
      } else {
        return `${title}<span class='json-to-html-value'>&nbsp;&nbsp;-instance object, can't render-</span>`;
      }
    } else {
      return `${title}<span class='json-to-html-value'>&nbsp;&nbsp;${data}</span>`;
    }
  } else {
    const title = makeLabelDiv(options, level, name, 'object');
    let count = 0;
    const subs =
      '<div>' +
      Object.entries(data)
        .map(([key, val]) => _render(key, val, options, level + 1, count++ % 2))
        .join('</div><div>') +
      '</div>';
    const inner = `<div class="json-to-html-expand clearfix ${altRow}">
      ${title}
      <div class="${contentClass}">${subs}</div>
    </div>`;
    return `${level === 0 ? "<div id='json-to-html'>" : ''}
      ${inner}
      ${level === 0 ? '</div>' : ''}`;
  }
}

export function render(name, json, options) {
  return `${_render(name, json, options, 0, 0)}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function numberFix(num, decimalPlaces) {
  if (num > 10000 || num < 0.001) {
    const [mantissa, exponent] = num.toExponential().split('e');
    const formattedMantissa = Number(mantissa).toFixed(decimalPlaces);
    return `${formattedMantissa}e${exponent}`;
  } else {
    return num.toFixed(decimalPlaces);
  }
}

const ConsoleColor = {
  END: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',
  INVERSE: '\x1b[7m',
  STRIKETHROUGH: '\x1b[9m',
  NO_BOLD: '\x1b[22m',
  NO_ITALIC: '\x1b[23m',
  NO_UNDERLINE: '\x1b[24m',
  NO_INVERSE: '\x1b[27m',
  NO_STRIKETHROUGH: '\x1b[29m',
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  GRAY: '\x1b[90m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m'
};
const args = process.argv.slice(2);
const { GREEN, BOLD, END, YELLOW, GRAY, CYAN, BG_YELLOW } = ConsoleColor;
const isOnlyOrdered = true;
const runOrder = [
  'heap',
  'avl-tree',
  'red-black-tree',
  'doubly-linked-list',
  'directed-graph',
  'queue',
  'deque',
  'hash-map',
  'trie',
  'stack'
  // 'singly-linked-list',
  // 'priority-queue',
  // 'binary-tree-overall'
];
const getRelativePath = file => {
  return path.relative(__dirname, file);
};
const coloredLabeled = (label, file) => {
  const relativeFilePath = getRelativePath(file);
  const directory = path.dirname(relativeFilePath);
  const fileName = path.basename(relativeFilePath);
  return `${BG_YELLOW} ${label} ${END} ${GRAY}${directory}/${END}${CYAN}${fileName}${END}`;
};
const parentDirectory = path.resolve(__dirname, '../..');
const reportDistPath = path.join(parentDirectory, 'benchmark');
const testDir = path.join(__dirname, 'data-structures');
let allFiles = fastGlob.sync(path.join(testDir, '**', '*.test.mjs'));

let testFiles;
let isIndividual = false;
if (args.length > 0) {
  console.log(`arguments: ${args.join(' ')}`);
  testFiles = allFiles.filter(file => args.every(word => file.includes(word)));
  isIndividual = true;
  console.log(
    `${testFiles.map(file => coloredLabeled('Found', file)).join(`
`)}`
  );
} else {
  isIndividual = false;
  testFiles = allFiles;
}
const report = {};
let completedCount = 0;
const performanceTests = [];
for (const file of testFiles) {
  const testName = path.basename(file, '.test.mjs');
  const testFunction = await import(file);
  const { suite } = testFunction;
  if (suite)
    performanceTests.push({
      testName,
      suite,
      file
    });
}

const composeReport = () => {
  if (!fs.existsSync(reportDistPath))
    fs.mkdirSync(reportDistPath, {
      recursive: true
    });
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
              {
                '<>': 'td',
                html: '${name}'
              },
              {
                '<>': 'td',
                html: '${periodMS}'
              },
              {
                '<>': 'td',
                html: '${mean}'
              }
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

function replaceMarkdownContent(startMarker, endMarker, newText) {
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

const sortedPerformanceTests = (
  isOnlyOrdered ? [...performanceTests].filter(test => runOrder.includes(test.testName)) : [...performanceTests]
).sort((a, b) => {
  const indexA = runOrder.indexOf(a.testName);
  const indexB = runOrder.indexOf(b.testName);
  // If both a and b are in the runOrder, sort them according to their indices in the runOrder.
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  // If there is only 'a' in the runOrder, then place 'b' in front.
  if (indexA !== -1) {
    return 1;
  }
  // If only b is in the runOrder, then a should be placed before it.
  if (indexB !== -1) {
    return -1;
  }
  // If neither a nor b are in runOrder, keep their original runOrder
  return 0;
});
console.log(
  `${GREEN} Matched Suites (${performanceTests.length})${END}: ${performanceTests.map(test => test.testName)}`
);
console.log(
  `${GREEN} Running Suites (${sortedPerformanceTests.length})${END}: ${sortedPerformanceTests.map(test => test.testName)}`
);
sortedPerformanceTests.forEach(item => {
  const { suite, testName, file } = item;
  console.log(coloredLabeled('Running', file));
  if (suite) {
    let runTime = 0;
    suite
      .on('complete', function () {
        completedCount++;
        report[testName] = {};
        report[testName].benchmarks = this.map(benchmark => {
          runTime += benchmark.times.elapsed;
          return {
            'test name': benchmark.name,
            'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
            // 'executions per sec': numberFix(benchmark.hz, 2),
            // 'executed times': numberFix(benchmark.count, 0),
            'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
            'sample deviation': numberFix(benchmark.stats.deviation, 2)
          };
        });
        report[testName].testName = testName;
        const isDone = completedCount === sortedPerformanceTests.length;
        runTime = Number(runTime.toFixed(2));
        const isTimeWarn = runTime > 120;
        console.log(
          // `Files: ${GREEN}${testFileCount}${END} `,
          // `Suites: ${GREEN}${performanceTests.length}${END} `,
          `Suites Progress: ${isDone ? GREEN : YELLOW}${completedCount}${END}/${isDone ? GREEN : YELLOW}${sortedPerformanceTests.length}${END}`,
          `Time Costs: ${isTimeWarn ? YELLOW : GREEN}${runTime}s${END}`
        );
        if (isDone) {
          composeReport();
        }
      })
      .run({ async: false });
  }
});
