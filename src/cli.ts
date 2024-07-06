#!/usr/bin/env node --experimental-modules
import {program} from 'commander';
import {PackerOptions, packFiles} from './packer.js';

program
  .name('prompt-packer')
  .description('Pack files into a single text file for AI prompts')
  .argument('[project-name]', 'Optional project name')
  .option('-e, --exclude <patterns...>', 'File patterns to exclude (regex)')
  .option('-o, --output-dir <directory>', 'Specify output directory')
  .option('-d, --dry-run', 'Perform a dry run without creating the output file')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-c, --config <file>', 'Specify a config file')
  .action((projectName, options) => {
    const packerOptions: PackerOptions = {
      excludePatterns: options.exclude || [],
      projectName,
      outputDir: options.outputDir,
      dryRun: options.dryRun,
      verbose: options.verbose,
    };

    const {outputPath, stats, files} = packFiles(packerOptions);

    if (packerOptions.dryRun) {
      console.log(`Files that would be packed (${stats.totalFiles} total):`);
      files.forEach(file => console.log(`  ${file}`));
      console.log(`\nOutput would be written to: ${outputPath}`);
    } else {
      console.log(`${stats.totalFiles} files packed into: ${outputPath}`);
    }

    if (packerOptions.verbose) {
      console.log('\nFile types:');
      Object.entries(stats.filesByExtension)
        .sort(([, a], [, b]) => b - a)
        .forEach(([ext, count]) => {
          console.log(`  ${ext}: ${count}`);
        });
    }
  });

program.parse(process.argv);
