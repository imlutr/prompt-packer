export interface PackerResult {
  outputPath: string;
  filesCount: number;
  filesByExtension: Map<string, string[]>
}
