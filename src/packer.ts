import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import {defaultExclusions} from "./utils/defaultExclusions";
import {PackerOptions} from "./types/PackerOptions";
import {FileStats} from "./types/FileStats";
import {fileMatchesPattern} from "./utils/fileMatchesPattern";
import {generatePromptForAI} from "./utils/generatePromptForAI";

export function packFiles(options: PackerOptions): { outputPath: string; stats: FileStats; files: string[] } {
  const files = getProjectFiles(options);
  const output = `${generatePromptForAI(files, options.projectName)}${getFilesStructuredContent(files)}`
  const outputPath = getOutputPath(options.outputDir, options.projectName);

  writeOutputIfApplicable(output, outputPath, options);

  return {outputPath, files, stats: getFilesStats(files)};
}

function getProjectFiles(options: PackerOptions): string[] {
  const allExclusions = [...defaultExclusions, ...(options.excludePatterns || [])];

  return glob.sync('**/*', {
    nodir: true,
    dot: true
  }).filter(file => !fileMatchesPattern(file, allExclusions));
}

function getFilesStats(files: string[]): FileStats {
  const stats: FileStats = {totalFiles: 0, filesByExtension: {}};

  for (const file of files) {
    const ext = path.extname(file) || path.basename(file);
    stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;
    stats.totalFiles++;
  }

  return stats;
}

function getFilesStructuredContent(files: string[]): string {
  let output = '';

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    output += `--- BEGIN FILEPATH ---\n${file}\n--- BEGIN FILE CONTENTS ---\n${content}\n--- END FILE CONTENTS ---\n\n`;
  }

  return output;
}

function getOutputPath(outputDir?: string, projectName?: string): string {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const fileName = projectName ? `${projectName}_${timestamp}.txt` : `packed_${timestamp}.txt`;

  return outputDir ? path.join(outputDir, fileName) : fileName;
}

function writeOutputIfApplicable(output: string, outputPath: string, options: PackerOptions) {
  if (options.dryRun) {
    return
  }

  if (options.outputDir) {
    fs.mkdirSync(options.outputDir, {recursive: true});
  }
  fs.writeFileSync(outputPath, output);
}
