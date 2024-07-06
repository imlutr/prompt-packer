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

export function packFiles(options: PackerOptions): { outputPath: string; stats: FileStats; files: string[] } {
  const allExclusions = [...defaultExclusions, ...(options.excludePatterns || [])];
  const files = glob.sync('**/*', {
    ignore: allExclusions,
    nodir: true,
    dot: true
  });

  let output = '';
  const stats: FileStats = {totalFiles: 0, filesByExtension: {}};

  for (const file of files) {
    const ext = path.extname(file).toLowerCase() || 'no extension';
    stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;
    stats.totalFiles++;

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
