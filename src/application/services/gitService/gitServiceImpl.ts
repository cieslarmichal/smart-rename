import { GitClient } from './gitClient/gitClient.js';
import { GitService } from './gitService.js';

export class GitServiceImpl implements GitService {
  public constructor(private readonly gitClient: GitClient) {}

  public async getStagedFiles(): Promise<string[]> {
    const { staged, renamed } = await this.gitClient.status();

    const renamedPaths = renamed.map((renamedPath) => renamedPath.to);

    return [...staged, ...renamedPaths];
  }

  public async checkIfCurrentPathIsGitRepository(): Promise<boolean> {
    const currentPathIsGitRepository = await this.gitClient.checkIsRepo();

    return currentPathIsGitRepository;
  }

  public async getRepositoryRoot(): Promise<string> {
    const repositoryRoot = await this.gitClient.revparse(['--show-toplevel']);

    return repositoryRoot;
  }
}
