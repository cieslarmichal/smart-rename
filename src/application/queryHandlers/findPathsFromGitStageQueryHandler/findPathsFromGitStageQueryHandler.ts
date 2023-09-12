export interface FindPathsFromGitStageQueryHandler {
  execute(): Promise<string[]>;
}
