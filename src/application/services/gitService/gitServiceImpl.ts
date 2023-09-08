import { GitClient } from './gitClient/gitClient.js';
import { GitService } from './gitService.js';
import { resolve } from 'path';

export class GitServiceImpl implements GitService {
  public constructor(private readonly gitClient: GitClient) {}

  public async getStagedPaths(): Promise<string[]> {
    const { staged } = await this.gitClient.status();

    const stagedAbsolutePaths = staged.map((path) => resolve(path));

    return stagedAbsolutePaths;
  }
}
