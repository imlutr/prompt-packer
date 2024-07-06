export const defaultExclusions: string[] = [
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

  // Temp files
  '*~',
  'temp/**',
  'tmp/**',

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
  'LICENSE*',

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

  // Mobile development
  'Pods/**',
  '*.xcodeproj/**',
  '*.xcworkspace/**',
  '*.pbxproj',
  '*.gradle',
  '*.keystore',

  // Terraform
  'terraform.tfstate',
  'terraform.tfstate.backup',
  '.terraform/**',
  '*.tfvars',

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
];
