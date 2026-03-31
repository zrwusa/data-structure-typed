#!/bin/bash

# Publish Docusaurus docs site to data-structure-typed-docs repo

source_dir=$(jq -r .sourceDir ./scripts/config.json)
docs_dir=$(jq -r .docsDir ./scripts/config.json)
version=$(jq -r .version "$source_dir/package.json")

echo "📦 Building Docusaurus docs for v$version..."

# Build Docusaurus
cd "$source_dir/docs-site-docusaurus"
rm -rf docs/api
npx typedoc --options typedoc.json
node sort-protected.mjs
pnpm build

# Deploy to docs repo
cd "$docs_dir"
shopt -s extglob
rm -rf !(.git|.gitignore)

cp -r "$source_dir/docs-site-docusaurus/build/"* "$docs_dir"

git add .
git commit -m "[pkg] $version published"
git push

cd "$source_dir"
echo "✅ Docs published for v$version"
