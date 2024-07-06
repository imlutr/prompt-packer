export interface FileStats {
  files: string[];
  fileCountsByExtension: { [key: string]: number };
}
