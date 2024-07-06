import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import {defaultExclusions} from "./utils/defaultExclusions";
import {PackerOptions} from "./types/PackerOptions";
import {FileStats} from "./types/FileStats";
import {fileMatchesPattern} from "./utils/fileMatchesPattern";
import {generatePromptForAI} from "./utils/generatePromptForAI";

function getProjectFiles(options: PackerOptions): string[] {
  const allExclusions = [...defaultExclusions, ...(options.excludePatterns || [])];

  return glob.sync('**/*', {
    nodir: true,
    dot: true
  }).filter(file => !fileMatchesPattern(file, allExclusions));
}

export function packFiles(options: PackerOptions): { outputPath: string; stats: FileStats; files: string[] } {
  const files = getProjectFiles(options);

  let output = '';
  const stats: FileStats = {totalFiles: 0, filesByExtension: {}};

  // Generate the AI prompt
  output += generatePromptForAI(files, options.projectName)

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
