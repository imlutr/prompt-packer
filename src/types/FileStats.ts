export interface FileStats {
  totalFiles: number;
  filesByExtension: { [key: string]: number };
}
