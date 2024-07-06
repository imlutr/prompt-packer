import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import {defaultExclusions} from "./utils/defaultExclusions";
import {PackerOptions} from "./types/PackerOptions";
import {generatePromptForAI} from "./utils/generatePromptForAI";
import {PackerResult} from "./types/PackerResult";
import ignore from "ignore";

export function packFiles(options: PackerOptions): PackerResult {
  const files = getProjectFiles(options);
  const output = `${generatePromptForAI(files, options.projectName)}${getFilesStructuredContent(files)}`
  const outputLinesCount = output.split('\n').length;
  const outputPath = getOutputPath(options.outputDir, options.projectName);

  writeOutput(output, outputPath, options);

  return {
    outputPath,
    outputLinesCount,
    filesCount: files.length,
    filesByExtension: getFilesByExtension(files)
  };
}

function getProjectFiles(options: PackerOptions): string[] {
  const files = glob.sync('**/*', {
    nodir: true,
    dot: true
  });

  const projectFiles: string[] = [];

  // Exclude files, if they match an exclusion pattern
  const allExclusions = [...defaultExclusions, ...(options.excludePatterns || [])];
  const igExclude = ignore().add(allExclusions)
  projectFiles.push(...igExclude.filter(files));

  // Add back files that match inclusion patterns (for overriding default exclusions)
  const igInclude = ignore().add(options.includePatterns);
  for (const file of files) {
    if (igInclude.ignores(file)) {
      projectFiles.push(file);
    }
  }

  return projectFiles;
}

function getFilesByExtension(files: string[]): Map<string, string[]> {
  const filesByExtension = new Map();

  for (const file of files) {
    const extension = path.extname(file) || path.basename(file);

    if (!filesByExtension.has(extension)) {
      filesByExtension.set(extension, []);
    }
    filesByExtension.get(extension).push(file);
  }

  return filesByExtension;
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

function writeOutput(output: string, outputPath: string, options: PackerOptions) {
  if (options.outputDir) {
    fs.mkdirSync(options.outputDir, {recursive: true});
  }
  fs.writeFileSync(outputPath, output);
}
