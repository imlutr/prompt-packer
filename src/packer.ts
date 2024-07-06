import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import {defaultExclusions} from "./utils/defaultExports.js";

export interface PackerOptions {
  excludePatterns: string[];
  projectName?: string;
  outputDir?: string;
  dryRun?: boolean;
}

interface FileStats {
  totalFiles: number;
  filesByExtension: { [key: string]: number };
}

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
The files are delimited by XML-like tags in the format: <file path="filepath">file contents</file>

File extensions are used to categorize the files. Here's a summary of the file types:
`;

  for (const file of files) {
    const ext = path.extname(file) || path.basename(file);
    stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;
    stats.totalFiles++;
  }

  // Add file type summary to the prompt
  Object.entries(stats.filesByExtension).sort(([, a], [, b]) => b - a).forEach(([ext, count]) => {
    output += `${ext}: ${count} file(s)\n`;
  });

  output += `
List of all files:
${files.join('\n')}

Please parse and analyze the contents of these files as needed.
END OF PROMPT

`;

  // Now add the file contents
  for (const file of files) {
    if (!options.dryRun) {
      const content = fs.readFileSync(file, 'utf-8');
      output += `<file path="${file}">\n${content}\n</file>\n\n`;
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
