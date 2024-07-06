import {FileStats} from "./FileStats";

export interface PackerResult {
  outputPath: string;
  stats: FileStats;
  files: string[];
}
