export interface GitService {
  getStagedFiles(): Promise<string[]>;
  checkIfCurrentPathIsGitRepository(): Promise<boolean>;
  getRepositoryRoot(): Promise<string>;
}
