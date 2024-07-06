import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface PackerOptions {
  excludePatterns: string[];
  projectName?: string;
  outputDir?: string;
  dryRun?: boolean;
}

const defaultExclusions = [
  // Version control
  '.git/**',
  '.svn/**',
  '.hg/**',
  '.bzr/**',
  'CVS/**',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',

  // Dependencies
  'node_modules/**',
  'bower_components/**',
  'jspm_packages/**',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',

  // Build outputs
  'dist/**',
  'build/**',
  'out/**',
  '*.min.js',
  '*.min.css',

  // IDE and editor files
  '.idea/**',
  '.vscode/**',
  '.sublime-*',
  '*.swp',
  '*.swo',
  '*.swn',
  '*.bak',
  '*.tmp',
  '*.sublime-workspace',
  '.DS_Store',
  'Thumbs.db',

  // Logs
  'logs/**',
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',

  // Test coverage
  'coverage/**',
  '.nyc_output/**',

  // Environment and config files
  '.env',
  '.env.*',
  '*.env',
  'config.js',
  'config.json',

  // Documentation
  'docs/**',
  '*.md',
  'README*',
  'LICENSE*',
  'CHANGELOG*',

  // Images and media
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.gif',
  '*.svg',
  '*.ico',
  '*.bmp',
  '*.webp',
  '*.mp3',
  '*.mp4',
  '*.avi',
  '*.mov',

  // Fonts
  '*.woff',
  '*.woff2',
  '*.eot',
  '*.ttf',
  '*.otf',

  // Archives
  '*.zip',
  '*.rar',
  '*.7z',
  '*.gz',
  '*.tar',
  '*.tgz',

  // Misc
  '*.pdf',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib',
  '*.class',
  '*.pyc',
  '*.pyo',
  '*.o',
  '*.obj',

  // Project-specific (examples, adjust as needed)
  'terraform.tfstate',
  'terraform.tfstate.backup',
  '.terraform/**',
  '*.tfvars',

  // Mobile development
  'Pods/**',
  '*.xcodeproj/**',
  '*.xcworkspace/**',
  '*.pbxproj',
  '*.gradle',
  '*.keystore',

  // Docker
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',

  // Serverless
  '.serverless/**',
  'serverless.yml',

  // Kubernetes
  'kubectl',
  'minikube',

  // Temp files
  '*~',
  'temp/**',
  'tmp/**',
];

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
  const stats: FileStats = { totalFiles: 0, filesByExtension: {} };

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
      fs.mkdirSync(options.outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, output);
  }

  return { outputPath, stats, files };
}
