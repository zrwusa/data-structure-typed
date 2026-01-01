const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "dist", "esm");

function isRelativeBare(spec) {
  return (
    (spec.startsWith("./") || spec.startsWith("../")) &&
    !spec.endsWith(".js") &&
    !spec.endsWith(".mjs") &&
    !spec.endsWith(".cjs") &&
    !spec.endsWith(".json")
  );
}

function resolveTarget(fileDir, spec) {
  const base = path.resolve(fileDir, spec);

  // Case 1: "./foo.js" exists
  if (fs.existsSync(base + ".js")) {
    return spec + ".js";
  }

  // Case 2: "./foo/index.js" exists
  const indexPath = path.join(base, "index.js");
  if (fs.existsSync(indexPath)) {
    // normalize to POSIX for import strings
    return spec.replace(/\\/g, "/") + "/index.js";
  }

  // Could not resolve safely
  return null;
}

function processFile(filePath) {
  if (!filePath.endsWith(".js")) return;

  let code = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // matches: import ... from "spec"  OR export ... from "spec"
  const importExportRegex =
    /(import\s+(?:[^"']+?\s+from\s+)?|export\s+(?:\*|{[^}]*})\s+from\s+)["']([^"']+)["']/g;

  code = code.replace(importExportRegex, (full, prefix, spec) => {
    if (!isRelativeBare(spec)) return full;

    const dir = path.dirname(filePath);
    const fixed = resolveTarget(dir, spec);
    if (!fixed) return full;

    changed = true;
    return `${prefix}"${fixed}"`;
  });

  if (changed) {
    fs.writeFileSync(filePath, code, "utf8");
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile()) {
      processFile(full);
    }
  }
}

if (fs.existsSync(ROOT)) {
  walk(ROOT);
}

