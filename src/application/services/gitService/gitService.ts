export interface GitService {
  getStagedPaths(): Promise<string[]>;
}
