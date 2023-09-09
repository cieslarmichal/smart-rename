export interface GitService {
  getStagedFiles(): Promise<string[]>;
}
