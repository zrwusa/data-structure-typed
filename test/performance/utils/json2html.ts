import * as _ from "underscore";

function toggleJS(options?: { plainHtml?: boolean }): string {
  if (options?.plainHtml) {
    return "";
  } else {
    return "onclick=\"j2h.toggleVisibility(this);return false\"";
  }
}

function makeLabelDiv(
  options: any,
  level: number,
  keyname: string | number,
  datatype?: string
): string {
  if (typeof keyname === "number") {
    return `<div class='index'><span class='j2h-label'>${keyname}&nbsp;</span></div>`;
  } else if (typeof keyname === "string") {
    if (datatype === "array") {
      return `<div class='collapsible level${level}' ${toggleJS(
        options
      )}><span class='j2h-label'>${keyname}</span></div>`;
    } else if (datatype === "object") {
      return `<div class='attribute collapsible level${level}' ${toggleJS(
        options
      )}><span class='j2h-label'>${keyname}:</span></div>`;
    } else {
      return `<div class='leaf level${level}'><span class='j2h-label'>${keyname}:</span></div>`;
    }
  } else {
    return "";
  }
}

function getContentClass(keyname: string | number): string {
  if (typeof keyname === "string") {
    return "content";
  } else {
    return "";
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
    _.isNaN(val) ||
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
    let nonCompliant = _.detect(arr, (row) => !isLeafObject(row));
    if (nonCompliant) {
      return false;
    } else {
      const cols = _.keys(arr[0]);
      nonCompliant = _.detect(arr, (row: object) => !_.isEqual(cols, _.keys(row)));
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
    return (
      "<td>" +
      headers.map((header) => rowObj[header]).join("</td><td>") +
      "</td>"
    );
  }
  const cols = _.keys(arr[0]);
  const content = arr.map((rowObj) => drawRow(cols, rowObj));
  const headingHtml = "<tr><th>" + cols.join("</th><th>") + "</th></tr>";
  const contentHtml = "<tr>" + content.join("</tr><tr>") + "</tr>";
  return "<table>" + headingHtml + contentHtml + "</table>";
}

function _render(
  name: string,
  data: any,
  options: any,
  level: number,
  altrow: number
): string {
  const contentClass = getContentClass(name);
  if (_.isArray(data)) {
    const title = makeLabelDiv(options, level, `${name} (${data.length})`, "array");
    let subs: string;
    if (isTable(data)) {
      subs = drawTable(data);
    } else {
      subs = "<div class='altRows'>" + data
        .map((val: any, idx: number) => _render(idx.toString(), val, options, level + 1, idx % 2))
        .join("</div><div class='altRows'>") + "</div>";
    }
    return `<div class="j2h-collapse clearfix ${altrow}">
      ${title}
      <div class="${contentClass}">${subs}</div>
    </div>`;
  } else if (isLeafValue(data)) {
    const title = makeLabelDiv(options, level, name);
    if (_.isFunction(data)) {
      return `${title}<span class='j2h-value'>&nbsp;&nbsp;-function() can't _render-</span>`;
    } else if (!isPlainObject(data)) {
      if (_.isFunction(data.toString)) {
        return `${title}<span class='j2h-value'>&nbsp;&nbsp;${data.toString()}</span>`;
      } else {
        return `${title}<span class='j2h-value'>&nbsp;&nbsp;-instance object, can't render-</span>`;
      }
    } else {
      return `${title}<span class='j2h-value'>&nbsp;&nbsp;${data}</span>`;
    }
  } else {
    const title = makeLabelDiv(options, level, name, "object");
    let count = 0;
    const subs = "<div>" + Object.entries(data)
      .map(([key, val]) => _render(key, val, options, level + 1, count++ % 2))
      .join("</div><div>") + "</div>";
    const inner = `<div class="j2h-expand clearfix ${altrow}">
      ${title}
      <div class="${contentClass}">${subs}</div>
    </div>`;
    return `${level === 0 ? '<div id=\'j2h\'>' : ''}
      ${inner}
      ${level === 0 ? '</div>' : ''}`;
  }
}

export function render(json: any, options: any): string {
  // return `${head}${_render('', json, options, 0, 0)}`;
  return `${_render('', json, options, 0, 0)}`;
}

const head = `<style>
#j2h table {
  border-collapse: collapse;
}
#j2h th {
  color: #888;
}
#j2h table,th, td {
  border: 1px solid #DDD;
  padding: 10px 5px;
}
#j2h th, td {
  text-align: center;
}
#j2h .content {
  padding-left: 30px;
  font-family: Arial;
}

#j2h .index {
  font-size: 100%;
  color: #999;
  float: left;
}
#j2h  .clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
#j2h  .j2h-label {
  font-family: Helvetica Neue;
  color: #333;
}
#j2h  .j2h-value {
  font-family: Arial;
  color: #777;
}
#j2h .collapsible > .j2h-label:hover {
  text-decoration: underline;
}
#j2h .collapsible > .j2h-label {
  color: #15C;
}
#j2h  .j2h-collapse > div.content {
  display: none;
}
#j2h  .j2h-collapse > .j2h-label {
  font-weight: bold;
}

#j2h .j2h-expand  > div > .j2h-label, #j2h .j2h-collapse  > div > .j2h-label {
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 25px;
  margin: 5px 0px 5px 15px;
  display: inline-block;
}

#j2h .j2h-expand  > div > .j2h-label {
    width: 30px;
  height: 30px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><polygon points="50,10 10,90 90,90" fill="blue" /></svg>');
  background-size: cover;
  background-position: center;
}

#j2h .j2h-collapse > div > .j2h-label {
      width: 30px;
  height: 30px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><polygon points="50,10 10,90 90,90" fill="blue" /></svg>');
  background-size: cover;
  background-position: center;
}

#j2h .j2h-collapse > span.collapsible:before {
  border-radius: 2px;
  border-color: #A44;
  border-style: solid;
  border-width: 1px;
  color: #A44;
  content: '+';
  display: inline-block;
  line-height: 7px;
  margin: 0 2px;
  overflow: hidden;
  padding: 1px;
  font-size: 11px;
}

#j2h .j2h-expand > span.collapsible:before {
  border: none;
  color: #A44;
  content: '-';
  display: inline-block;
  line-height: 7px;
  margin: 4px;
  overflow: hidden;
  padding: 1px;
  font-size: 11px;
}

#j2h.level0 {
  font-size: 25px;
}
#j2h  .level1 {
  font-size: 22px;
}

#j2h .leaf {
  color: #666;
  display: inline;
}

#j2h .altRows:nth-child(odd)    { background-color:#ddd; }
#j2h .altRows:nth-child(even)    { background-color:#fff; }

#j2h tr:nth-child(odd)    { background-color:#eee; }
#j2h tr:nth-child(even)    { background-color:#fff; }
</style>
<script type="text/javascript">
  j2h = {
    toggleVisibility: function(el, name) {
      j2h.toggleClass(el.parentElement,'j2h-collapse j2h-expand');
    },
    classRe: function(name) {
      return new RegExp('(?:^|\\s)'+name+'(?!\\S)');
    },
    addClass: function(el, name) {
      el.className += " "+name;
    },
    removeClass: function(el, name) {
      var re = j2h.classRe(name);
      el.className  = el.className.replace(j2h.classRe(name) , '' )
    },
    hasClass: function(el, name) {
      var re = j2h.classRe(name);
      return j2h.classRe(name).exec(el.className);
    },
    toggleClass: function(el, name) {
      var names = name.split(/\s+/);
      for (n in names) {
        if (j2h.hasClass(el, names[n])) {
          j2h.removeClass(el, names[n]);
        } else {
          j2h.addClass(el, names[n]);
        }
      }
    }
  };
</script>`;
