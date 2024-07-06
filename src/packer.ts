import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import {defaultExclusions} from "./utils/defaultExclusions";
import {PackerOptions} from "./types/PackerOptions";
import {FileStats} from "./types/FileStats";

function matchesExclusion(file: string, exclusions: string[]): boolean {
  const normalizedFile = file.replace(/\\/g, '/');
  return exclusions.some(pattern => {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(`(^|/)${regexPattern}$`).test(normalizedFile);
  });
}

export function packFiles(options: PackerOptions): { outputPath: string; stats: FileStats; files: string[] } {
  const allExclusions = [...defaultExclusions, ...(options.excludePatterns || [])];
  const files = glob.sync('**/*', {
    nodir: true,
    dot: true
  }).filter(file => !matchesExclusion(file, allExclusions));

  let output = '';
  const stats: FileStats = {totalFiles: 0, filesByExtension: {}};

  // Generate the AI prompt
  output += `PROMPT FOR AI:
This file contains ${files.length} files from the project "${options.projectName || 'unnamed'}".
Each file is represented in the following format:

--- BEGIN FILEPATH ---
(filepath here)
--- BEGIN FILE CONTENTS ---
(file contents here)
--- END FILE CONTENTS ---

List of all files:
${files.join('\n')}

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
END OF PROMPT


`;

  for (const file of files) {
    const ext = path.extname(file) || path.basename(file);
    stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;
    stats.totalFiles++;
  }

  // Now add the file contents
  for (const file of files) {
    if (!options.dryRun) {
      const content = fs.readFileSync(file, 'utf-8');
      output += `--- BEGIN FILEPATH ---\n${file}\n--- BEGIN FILE CONTENTS ---\n${content}\n--- END FILE CONTENTS ---\n\n`;
    }
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const fileName = options.projectName
    ? `${options.projectName}_${timestamp}.txt`
    : `packed_${timestamp}.txt`;

  const outputPath = options.outputDir ? path.join(options.outputDir, fileName) : fileName;

  if (!options.dryRun) {
    if (options.outputDir) {
      fs.mkdirSync(options.outputDir, {recursive: true});
    }
    fs.writeFileSync(outputPath, output);
  }

  return {outputPath, stats, files};
}
