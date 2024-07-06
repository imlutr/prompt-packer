# Prompt Packer

Prompt Packer is a command-line tool that simplifies the process of sharing project files with AI models. It packs your
files into a single, structured text file that AI assistants can easily parse and understand.

## 📖 Usage
1. Install Node.js if you haven't already. You can download it [here](https://nodejs.org/en/download/prebuilt-installer).
2. Install Prompt Packer globally:
    ```sh
    npm install -g prompt-packer
    ```
3. Navigate to your project directory:
    ```sh
    cd /path/to/your/project
    ```
4. Run Prompt Packer
    ```sh
    prompt-packer "My project"
    ```
5. Use the output `.txt` file as needed for your AI model

## 🛠 Options

- `[project-name]` - specify the project name (required)
- `-e, --exclude <patterns...>` - file patterns to exclude
- `-o, --output-dir <directory>` - specify the output directory
- `-d, --dry-run` - perform a dry run without creating the output file

## 📂 Default File Exclusions

Prompt Packer comes with a comprehensive list of default file exclusions to help you get started quickly. These exclusions cover common files and directories that are typically not needed for AI analysis, such as version control files, dependencies, build outputs, and more.

You can find the complete list of default exclusions in the [defaultExclusions.ts](src/utils/defaultExclusions.ts) file.

If you need to exclude additional files or directories, you can use the `-e, --exclude` option when running Prompt Packer.


## 📄 Example Output
```
PROMPT FOR AI:
This file contains 4 files from the project "My Project".
Each file is represented in the following format:

--- BEGIN FILEPATH ---
(filepath here)
--- BEGIN FILE CONTENTS ---
(file contents here)
--- END FILE CONTENTS ---

List of all files:
src/index.ts
src/utils.ts
tsconfig.json
package.json

Instructions for AI:
1. When analyzing or discussing files, refer to them by their filepath.
2. Treat the content between "BEGIN FILE CONTENTS" and "END FILE CONTENTS" as the entire content of the file.
3. Ignore the "BEGIN FILEPATH", "BEGIN FILE CONTENTS", and "END FILE CONTENTS" markers in your analysis; they are not part of the actual file contents.
4. If asked to modify a file, provide only the modified contents without any separators or markers.
5. When showing modified or new file contents, use the following format:

ˋˋˋfiletype
(modified or new file contents here)
ˋˋˋ

6. Be aware of file extensions and treat files accordingly (e.g., .js for JavaScript, .py for Python, etc.).
7. When adding new files, suggest an appropriate filepath based on the project structure.

Please parse and analyze the contents of these files as needed, following the above instructions.
END OF PROMPT


--- BEGIN FILEPATH ---
src/index.js
--- BEGIN FILE CONTENTS ---
console.log('Hello, World!');
--- END FILE CONTENTS ---

...
```

## 📜 License

This project is licensed under the MIT License.
