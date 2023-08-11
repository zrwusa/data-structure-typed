#!/bin/bash

# iterate the directory to rename and clear content of files
rename_and_clear_files() {
  local directory="$1"
  local extension="$2"
  local new_prefix="$3"

  for file in "$directory"/*; do
    if [ -d "$file" ]; then
      rename_and_clear_files "$file" "$extension" "$new_prefix"
    elif [ -f "$file" ] && [[ "$file" == *"$extension" ]]; then
      filename=$(basename "$file" "$extension")
      new_name="$directory/${filename}${new_prefix}${extension}"
      mv "$file" "$new_name"
      echo "Renamed $file to $new_name"
      > "$new_name"  # clear content of file
    fi
  done
}

# check if directory, extension and prefix were provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <directory> <extension> <new_prefix>"
  exit 1
fi

# evoke the recursive function to rename and clear files
rename_and_clear_files "$1" "$2" "$3"
