# Prompt Packer

Prompt Packer is a command-line tool that packs multiple files into a single text file suitable for AI prompts. It
generates a structured prompt that includes file contents, file type summary, and a list of all files.

## Installation

To install Prompt Packer, make sure you have Node.js installed, then run:

```sh
npm install -g prompt-packer
```

## Usage

To pack files into an AI prompt, navigate to your project directory and run:

```sh
prompt-packer <project-name> [options]
```

Replace <project-name> with the name of your project.

## Options

`-e, --exclude <patterns...>`: File patterns to exclude (regex)
`-o, --output-dir <directory>`: Specify output directory
`-d, --dry-run`: Perform a dry run without creating the output file

## Example

Pack files from the current directory into an AI prompt:

```sh
prompt-packer my-project
```

Pack files excluding certain patterns:

```sh
prompt-packer my-project -e "*.txt"
```

Perform a dry run without creating the output file:

```sh
prompt-packer my-project --dry-run
```

## Output
The generated AI prompt will be saved as a text file in the specified output directory (or the current directory if not specified). The file name will be in the format <project-name>_<timestamp>.txt.

The prompt includes:
- Project name and total number of files
- File type summary
- List of all files
- File contents delimited by XML-like tags

## License
This project is licensed under the MIT License.
