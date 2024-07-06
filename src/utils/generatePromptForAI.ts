export function generatePromptForAI(
  fileNames: string[],
  projectName: string
): string {
  return `--- BEGIN PROMPT FOR AI ---
This file contains ${fileNames.length} files from the project "${projectName}". Each file is represented in the following format:

--- BEGIN FILEPATH ---
(filepath here)
--- BEGIN FILE CONTENTS ---
(file contents here)
--- END FILE CONTENTS ---

List of all files:
${fileNames.join('\n')}

Instructions for AI:
1. When analyzing or discussing files, refer to them by their filepath.
2. Treat the content between "BEGIN FILE CONTENTS" and "END FILE CONTENTS" as the entire content of the file.
3. Ignore the "BEGIN FILEPATH", "BEGIN FILE CONTENTS", and "END FILE CONTENTS" markers in your analysis; they are not part of the actual file contents.
4. If asked to modify a file, provide only the modified contents without any separators or markers.
5. When showing modified or new file contents, use the following format:

\`\`\`filetype
(modified or new file contents here)
\`\`\`

6. Be aware of file extensions and treat files accordingly (e.g., .js for JavaScript, .py for Python, etc.).
7. When adding new files, suggest an appropriate filepath based on the project structure.

Please parse and analyze the contents of these files as needed, following the above instructions.
--- END PROMPT FOR AI ---


`;
}
