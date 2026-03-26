#!/usr/bin/env python3
"""
Merge fragmented .coverage.test.ts files into grouped files.
Preserves all test cases, just reorganizes into fewer files.

Strategy:
- For each data structure, find all *.coverage.test.ts files
- Group related files by prefix pattern (e.g., bst.more-branches-*)
- Merge small files into a single <prefix>.coverage.test.ts
- Keep existing <prefix>.coverage.test.ts as the merge target
"""
import re
import os
import glob
from collections import defaultdict

TEST_ROOT = 'test/unit/data-structures'

# Maps for describe label
NAME_MAP = {
    'red-black-tree': 'RedBlackTree',
    'bst': 'BST',
    'avl-tree': 'AVLTree',
    'binary-tree': 'BinaryTree',
    'binary-indexed-tree': 'BinaryIndexedTree',
    'segment-tree': 'SegmentTree',
    'abstract-graph': 'AbstractGraph',
    'directed-graph': 'DirectedGraph',
    'undirected-graph': 'UndirectedGraph',
    'map-graph': 'MapGraph',
    'deque': 'Deque',
    'queue': 'Queue',
    'heap': 'Heap',
    'max-heap': 'MaxHeap',
    'max-priority-queue': 'MaxPriorityQueue',
    'priority-queue': 'PriorityQueue',
    'hash-map': 'HashMap',
    'doubly-linked-list': 'DoublyLinkedList',
    'singly-linked-list': 'SinglyLinkedList',
    'skip-linked-list': 'SkipLinkedList',
    'linked-list': 'LinkedList',
    'linear-base': 'LinearBase',
    'iterable-element-base': 'IterableElementBase',
    'matrix': 'Matrix',
    'stack': 'Stack',
    'tree': 'Tree',
    'trie': 'Trie',
    'tree-multi-map': 'TreeMultiMap',
}

# Explicit merge groups: prefix -> {group_name: [suffixes]}
# Files matching these suffixes get merged into <prefix>.<group_name>.coverage.test.ts
# Any remaining .coverage.test.ts files for the prefix go into <prefix>.coverage.test.ts
MERGE_GROUPS = {
    'red-black-tree': {
        'boundary': ['boundary-corruption-repair', 'boundary-max-update', 'boundary-null',
                      'boundary-stale-cache', 'boundary-update'],
        'cache': ['cache-delete', 'cache-edge', 'cache-stale-insert',
                  'insert-cache-nullish', 'insert-header-parent-nullish'],
        'hint': ['hint', 'hint-cache-compare-update', 'hint-cache-no-update',
                 'hint-cache-nullish', 'hint-mapmode-defined', 'hint-mapmode-undefined',
                 'hint-more'],
        'delete': ['delete-fixup', 'delete-successor'],
        'setkvnode': ['setkvnode-parent-cache', 'setkvnode-remaining', 'setkvnode-uncovered',
                      'set-inputs', 'update-branches'],
        'misc': ['factories', 'internal-walk', 'misc-inputs', 'predsucc',
                 'more-branches-2', 'more-branches-3', 'more-branches-4',
                 'remaining-branches'],
    },
    'bst': {
        'delete': ['deletebykey', 'deletewhere'],
        'floor-lower': ['floor-lower-predicate', 'floor-setmany', 'bound-by-predicate'],
        'search': ['search-fastpath', 'range-pruning', 'getnode.range-ensure'],
        'misc': ['misc-branches', 'more', 'node-family',
                 'more-branches-2', 'more-branches-3', 'more-branches-4', 'more-branches-5'],
    },
}

# Simple merges: all coverage files for a prefix merge into one <prefix>.coverage.test.ts
# These are data structures with few coverage files that don't need sub-groups
SIMPLE_MERGE_PREFIXES = [
    'binary-tree', 'avl-tree', 'binary-indexed-tree', 'segment-tree',
    'abstract-graph', 'directed-graph', 'undirected-graph', 'map-graph',
    'deque', 'queue', 'heap', 'max-heap', 'max-priority-queue', 'priority-queue',
    'hash-map', 'doubly-linked-list', 'singly-linked-list', 'skip-linked-list',
    'linked-list', 'linear-base', 'iterable-element-base',
    'matrix', 'stack', 'tree', 'trie', 'tree-multi-map',
]


def extract_test_content(filepath):
    """Extract imports, helper code, and describe body from a test file."""
    content = open(filepath).read()
    lines = content.split('\n')

    # Collect imports
    import_lines = []
    for line in lines:
        if line.startswith('import '):
            import_lines.append(line)

    # Find the first describe line
    desc_start = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("describe(") or stripped.startswith("describe ('"):
            desc_start = i
            break

    if desc_start is None:
        return None, None, None, import_lines

    # Extract helper code between imports and describe
    helper_lines = []
    for i in range(len(lines)):
        if i >= desc_start:
            break
        line = lines[i]
        if line.startswith('import ') or not line.strip():
            continue
        helper_lines.append(line)
    helpers = '\n'.join(helper_lines).strip()

    # Extract describe name and body
    remaining = '\n'.join(lines[desc_start:])
    match = re.search(r"describe\(\s*'([^']+)'\s*,\s*\(\)\s*=>\s*\{(.*)\}\s*\)\s*;?\s*$", remaining, re.DOTALL)
    if not match:
        return None, None, helpers, import_lines

    desc_name = match.group(1)
    body = match.group(2)

    return desc_name, body.strip(), helpers, import_lines


def merge_imports(all_import_lines):
    """Merge import lines, combining named imports from same module."""
    module_imports = defaultdict(set)
    other_imports = []

    for imp in all_import_lines:
        imp = imp.rstrip(';').rstrip()
        m = re.match(r"import\s*\{([^}]+)\}\s*from\s*'([^']+)'", imp)
        if m:
            names = [n.strip() for n in m.group(1).split(',') if n.strip()]
            module_imports[m.group(2)].update(names)
        elif imp not in other_imports:
            other_imports.append(imp)

    result = []
    for module in sorted(module_imports.keys()):
        names = sorted(module_imports[module])
        result.append(f"import {{ {', '.join(names)} }} from '{module}';")
    result.extend(other_imports)
    return result


def merge_files(prefix, group_name, filepaths, display_name):
    """Merge multiple test files into one."""
    describes = []
    all_helpers = []
    all_imports = []

    for filepath in filepaths:
        desc_name, body, helpers, imports = extract_test_content(filepath)
        all_imports.extend(imports)
        if body:
            describes.append((desc_name, body))
            if helpers:
                suffix = os.path.basename(filepath).replace(f'{prefix}.', '').replace('.coverage.test.ts', '')
                all_helpers.append(f"// --- from {suffix} ---\n{helpers}")

    if not describes:
        return None

    import_lines = merge_imports(all_imports)
    output = '\n'.join(import_lines) + '\n\n'

    if all_helpers:
        output += '\n'.join(all_helpers) + '\n\n'

    output += f"describe('{display_name} {group_name} coverage', () => {{\n"

    for desc_name, body in describes:
        short_name = desc_name
        # Remove common prefixes for readability
        for remove in [display_name + ' ', 'remaining ', 'additional ']:
            short_name = short_name.replace(remove, '')
        short_name = short_name.replace(' coverage', '').strip()

        output += f"\n  describe('{short_name}', () => {{\n"
        for line in body.split('\n'):
            if line.strip():
                output += f"  {line}\n"
            else:
                output += "\n"
        output += "  });\n"

    output += "});\n"
    return output


def find_coverage_files(directory, prefix):
    """Find all .coverage.test.ts files for a given prefix in a directory."""
    pattern = os.path.join(directory, f'{prefix}.*.coverage.test.ts')
    files = glob.glob(pattern)
    # Also check for exact <prefix>.coverage.test.ts
    exact = os.path.join(directory, f'{prefix}.coverage.test.ts')
    if os.path.exists(exact) and exact not in files:
        files.append(exact)
    return sorted(files)


def find_directory_for_prefix(prefix):
    """Find which subdirectory contains files for this prefix."""
    for root, dirs, files in os.walk(TEST_ROOT):
        for f in files:
            if f.startswith(f'{prefix}.') and f.endswith('.test.ts'):
                return root
    return None


def process_grouped_merge(prefix, groups, directory):
    """Process a prefix with explicit sub-groups."""
    display_name = NAME_MAP.get(prefix, prefix)
    total_merged = 0

    for group_name, suffixes in groups.items():
        filepaths = []
        for suffix in suffixes:
            fp = os.path.join(directory, f'{prefix}.{suffix}.coverage.test.ts')
            if os.path.exists(fp):
                filepaths.append(fp)

        if len(filepaths) < 2:
            # Check if the single file IS the target
            target = os.path.join(directory, f'{prefix}.{group_name}.coverage.test.ts')
            if len(filepaths) == 1 and os.path.abspath(filepaths[0]) == os.path.abspath(target):
                continue
            if len(filepaths) == 0:
                continue

        outpath = os.path.join(directory, f'{prefix}.{group_name}.coverage.test.ts')
        content = merge_files(prefix, group_name, filepaths, display_name)
        if not content:
            continue

        print(f"\n  [{group_name}] {len(filepaths)} files -> {os.path.basename(outpath)}")
        with open(outpath, 'w') as f:
            f.write(content)

        for fp in filepaths:
            if os.path.abspath(fp) != os.path.abspath(outpath):
                os.remove(fp)
                total_merged += 1

    return total_merged


def process_simple_merge(prefix, directory):
    """Merge all coverage files for a prefix into one."""
    display_name = NAME_MAP.get(prefix, prefix)
    files = find_coverage_files(directory, prefix)

    if len(files) <= 1:
        return 0

    outpath = os.path.join(directory, f'{prefix}.coverage.test.ts')
    content = merge_files(prefix, 'misc', files, display_name)
    if not content:
        return 0

    print(f"\n  [all] {len(files)} files -> {os.path.basename(outpath)}")
    with open(outpath, 'w') as f:
        f.write(content)

    merged = 0
    for fp in files:
        if os.path.abspath(fp) != os.path.abspath(outpath):
            os.remove(fp)
            merged += 1

    return merged


def main():
    total = 0

    # Process grouped merges
    for prefix, groups in MERGE_GROUPS.items():
        directory = find_directory_for_prefix(prefix)
        if not directory:
            continue
        print(f"\n{'='*50}")
        print(f"  {NAME_MAP.get(prefix, prefix)} (grouped)")
        print(f"{'='*50}")
        total += process_grouped_merge(prefix, groups, directory)

    # Simple merges disabled for now — import merging needs more work
    # for prefix in SIMPLE_MERGE_PREFIXES:
    #     directory = find_directory_for_prefix(prefix)
    #     if not directory:
    #         continue
    #     files = find_coverage_files(directory, prefix)
    #     if len(files) <= 1:
    #         continue
    #     print(f"\n{'='*50}")
    #     print(f"  {NAME_MAP.get(prefix, prefix)} (simple merge)")
    #     print(f"{'='*50}")
    #     total += process_simple_merge(prefix, directory)

    print(f"\n✅ Done. Removed {total} fragmented files.")


if __name__ == '__main__':
    main()
