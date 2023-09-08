import { GitClient } from './gitClient.js';
import { SimpleGitOptions, simpleGit } from 'simple-git';

export class GitClientFactory {
  public static create(): GitClient {
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
    };

    return simpleGit(options);
  }
}
