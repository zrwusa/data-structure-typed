#!/bin/bash


# Read the version variable from config.json
source_dir_default=$(jq -r .sourceDir ./scripts/config.json)

docs_dir_default=$(jq -r .docsDir ./scripts/config.json)

# Function to prompt for a directory path with a default value
prompt_for_directory() {
  local message="$1"
  local default_path="$2"
  read -p "$message [$default_path]: " user_path
  echo "${user_path:-$default_path}"
}

# Prompt for the source directory path
#source_dir=$(prompt_for_directory "Enter the source directory" "$source_dir_default")
source_dir="$source_dir_default"

# Prompt for the docs directory path
#docs_dir=$(prompt_for_directory "Enter the docs directory" "$docs_dir_default")
docs_dir="$docs_dir_default"

# Check if jq is installed and install it if needed
if ! command -v jq &> /dev/null; then
  echo "jq is not installed. Installing..."

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    sudo apt-get update
    sudo apt-get install jq
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v brew &> /dev/null; then
      echo "Homebrew is not installed. Please install Homebrew first."
      exit 1
    fi
    brew install jq
  else
    echo "Unsupported operating system. Please install jq manually."
    exit 1
  fi

  echo "jq has been installed."
else
  echo "jq is already installed."
fi

# Change to the source directory
cd "$source_dir"

# Read the version variable from package.json
version=$(jq -r .version package.json)

# Execute the clear.sh script in the other directory
cd "$docs_dir"
shopt -s extglob
rm -r !(.gitignore|favicon.ico|.idea)

# Copy all files from source directory to destination directory
cp -r "$source_dir/docs/"* "$docs_dir"

# Change to the destination directory
cd "$docs_dir"

# Commit the changes to the Git repository
git add .
git commit -m "[pkg] $version published"

# Push the changes to the remote repository
git push

# Change back to the original directory
cd "$source_dir"
