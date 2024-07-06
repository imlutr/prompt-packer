#!/usr/bin/env node
import { program } from 'commander';
import { packFiles } from './packer';
import { PackerOptions } from './types/PackerOptions';
import { PackerResult } from './types/PackerResult';

program
  .name('prompt-packer')
  .description('Pack files into a single text file for AI prompts')
  .argument('[project-name]', 'Project name')
  .option('-e, --exclude <patterns...>', 'File patterns to exclude')
  .option(
    '-i, --include <patterns...>',
    'File patterns to include, overriding the default exclusions'
  )
  .option('-o, --output-dir <directory>', 'Output directory')
  .action((projectName, options) => {
    if (!projectName) {
      program.outputHelp();
      return;
    }

    const packerOptions: PackerOptions = {
      projectName,
      outputDir: options.outputDir,
      excludePatterns: options.exclude || [],
      includePatterns: options.include || [],
    };

    const result = packFiles(packerOptions);
    logMessage(result);
  });

// Parse arguments
program.parse(process.argv);

function logMessage(result: PackerResult): void {
  console.log(`Files packed (${result.filesCount} total):`);

  const sortedFilesByExtension = Array.from(
    result.filesByExtension.entries()
  ).sort((a, b) => b[1].length - a[1].length);
  for (const [ext, files] of sortedFilesByExtension) {
    console.log(`  ${ext} (${files.length}):`);
    for (const file of files) {
      console.log(`    ${file}`);
    }
  }

  console.log(
    `\nOutput written to: ${result.outputPath} (${result.outputLinesCount} lines)`
  );
}
