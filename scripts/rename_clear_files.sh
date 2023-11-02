#!/bin/bash

# Prompt the user for directory, extension, search string, and replace string
read -p "Enter the directory path (e.g., ./test): " directory
read -p "Enter the file extension (e.g., .txt): " extension
read -p "Enter the search string: " search_string
read -p "Enter the replace string: " replace_string

# iterate the directory to rename and clear content of files
rename_and_clear_files() {
  local directory="$1"
  local extension="$2"
  local search_string="$3"
  local replace_string="$4"

  for file in "$directory"/*; do
    if [ -d "$file" ]; then
      rename_and_clear_files "$file" "$extension" "$search_string" "$replace_string"
    elif [ -f "$file" ] && [[ "$file" == *"$extension" ]]; then
      filename=$(basename "$file" "$extension")
      new_name="${directory}/${filename//$search_string/$replace_string}${extension}"
      mv "$file" "$new_name"
      echo "Renamed $file to $new_name"
      > "$new_name"  # clear content of file
    fi
  done
}

# check if all required values are provided
if [ -z "$directory" ] || [ -z "$extension" ] || [ -z "$search_string" ] || [ -z "$replace_string" ]; then
  echo "Usage: $0"
  echo "Please provide the required information."
  exit 1
fi

# evoke the recursive function to rename and clear files
rename_and_clear_files "$directory" "$extension" "$search_string" "$replace_string"
