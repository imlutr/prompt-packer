export interface PackerResult {
  outputPath: string;
  outputLinesCount: number;
  filesCount: number;
  filesByExtension: Map<string, string[]>;
}
