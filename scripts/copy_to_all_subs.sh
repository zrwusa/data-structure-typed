#!/bin/bash

# Enable extended globbing
shopt -s extglob

# target directory
individuals_dir_default=$(jq -r .individualsDir ./scripts/config.json)

# Source directory
source_dir_default=$(jq -r .sourceDir ./scripts/config.json)

# List of directories
directories=(
  "avl-tree-typed"

)

# Loop through each directory
for dir in "${directories[@]}"; do
  # Delete all files except index.ts
  find "$individuals_dir_default"/"$dir"/src -type f ! -name 'index.ts' -delete

  # Copy the files to the target directory, excluding index.ts
  cp -R "$source_dir_default"/src/!(index.ts) "$individuals_dir_default"/"$dir"/src
done

echo "All packages copied."
