#!/usr/bin/env node
import { program } from 'commander';
import { packFiles, PackerOptions } from './packer.js';

program
  .name('prompt-packer')
  .description('Pack files into a single text file for AI prompts')
  .argument('[project-name]', 'Project name')
  .option('-e, --exclude <patterns...>', 'File patterns to exclude (regex)')
  .option('-o, --output-dir <directory>', 'Specify output directory')
  .option('-d, --dry-run', 'Perform a dry run without creating the output file')
  .action((projectName, options) => {
    if (!projectName) {
      program.outputHelp();
      return;
    }

    const packerOptions: PackerOptions = {
      excludePatterns: options.exclude || [],
      projectName,
      outputDir: options.outputDir,
      dryRun: options.dryRun,
    };

    const { outputPath, stats, files } = packFiles(packerOptions);

    if (packerOptions.dryRun) {
      console.log(`Files that would be packed (${stats.totalFiles} total):`);
    } else {
      console.log(`Files packed (${stats.totalFiles} total):`);
    }

    Object.entries(stats.filesByExtension)
      .sort(([, a], [, b]) => b - a)
      .forEach(([ext, count]) => {
        console.log(`  ${ext}: ${count}`);
      });

    if (packerOptions.dryRun) {
      console.log(`\nOutput would be written to: ${outputPath}`);
    } else {
      console.log(`\nOutput written to: ${outputPath}`);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no arguments provided
if (process.argv.length === 2) {
  program.outputHelp();
}
