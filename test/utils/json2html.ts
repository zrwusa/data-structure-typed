import * as _ from './is';
import { Json2htmlOptions } from '../types';

function toggleJS(options?: Json2htmlOptions): string {
  if (options?.plainHtml) {
    return '';
  } else {
    return 'onclick="json-to-html.toggleVisibility(this);return false"';
  }
}

function makeLabelDiv(options: any, level: number, keyName: string | number, datatype?: string): string {
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

function getContentClass(keyName: string | number): string {
  if (typeof keyName === 'string') {
    return 'content';
  } else {
    return '';
  }
}

function isPlainObject(val: any): boolean {
  let lastKey: string | undefined;
  let lastOwnKey: string | undefined;
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

function isLeafValue(val: any): boolean {
  return (
    _.isNumber(val) ||
    _.isString(val) ||
    _.isBoolean(val) ||
    _.isDate(val) ||
    _.isNull(val) ||
    _.isUndefined(val) ||
    isNaN(val) ||
    _.isFunction(val) ||
    !isPlainObject(val)
  );
}

function isLeafObject(obj: any): boolean {
  if (!_.isObject(obj)) {
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

function isTable(arr: any[]): boolean {
  if (!_.isArray(arr)) {
    return false;
  }
  if (arr.length === 0 || !_.isObject(arr[0])) {
    return false;
  } else {
    let nonCompliant = arr.find(row => !isLeafObject(row));
    if (nonCompliant) {
      return false;
    } else {
      const cols = Object.keys(arr[0]);
      nonCompliant = arr.find((row: object) => !_.isEqual(cols, Object.keys(row)));
      if (nonCompliant) {
        return false;
      } else {
        return true;
      }
    }
  }
}

function drawTable(arr: any[]): string {
  function drawRow(headers: string[], rowObj: any): string {
    return '<td>' + headers.map(header => rowObj[header]).join('</td><td>') + '</td>';
  }

  const cols = Object.keys(arr[0]);
  const content = arr.map(rowObj => drawRow(cols, rowObj));
  const headingHtml = '<tr><th>' + cols.join('</th><th>') + '</th></tr>';
  const contentHtml = '<tr>' + content.join('</tr><tr>') + '</tr>';
  return '<table style="display: table; width:100%; table-layout: fixed;">' + headingHtml + contentHtml + '</table>';
}

function _render(name: string, data: any, options: Json2htmlOptions, level: number, altRow: number): string {
  const contentClass = getContentClass(name);
  if (_.isArray(data)) {
    const title = makeLabelDiv(options, level, `${name}`, 'array');
    let subs: string;
    if (isTable(data)) {
      subs = drawTable(data);
    } else {
      subs =
        "<div class='altRows'>" +
        data
          .map((val: any, idx: number) => _render(idx.toString(), val, options, level + 1, idx % 2))
          .join("</div><div class='altRows'>") +
        '</div>';
    }
    return `<div class="json-to-html-collapse clearfix ${altRow}">
      ${title}
      <div class="${contentClass}">${subs}</div>
    </div>`;
  } else if (isLeafValue(data)) {
    const title = makeLabelDiv(options, level, name);
    if (_.isFunction(data)) {
      return `${title}<span class='json-to-html-value'>&nbsp;&nbsp;-function() can't _render-</span>`;
    } else if (!isPlainObject(data)) {
      if (_.isFunction(data.toString)) {
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

export function render(name: string, json: any, options: Json2htmlOptions): string {
  return `${_render(name, json, options, 0, 0)}`;
}
