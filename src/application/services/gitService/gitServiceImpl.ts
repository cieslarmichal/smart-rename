import { GitClient } from './gitClient/gitClient.js';
import { GitService } from './gitService.js';

export class GitServiceImpl implements GitService {
  public constructor(private readonly gitClient: GitClient) {}

  public async getStagedFiles(): Promise<string[]> {
    const { staged } = await this.gitClient.status();

    return staged;
  }
}
