import { GitService } from '../../services/gitService/gitService.js';
import { FindPathsFromGitStageQueryHandler } from './findPathsFromGitStageQueryHandler.js';
import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import { GitRepositoryNotFoundError } from '../../errors/gitRepositoryNotFoundError.js';
import { join } from 'node:path';

export interface ExtractAllNestedPathsPayload {
  readonly path: string;
}

export class FindPathsFromGitStageQueryHandlerImpl implements FindPathsFromGitStageQueryHandler {
  public constructor(
    private readonly gitService: GitService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  public async execute(): Promise<string[]> {
    if (!(await this.gitService.checkIfCurrentPathIsGitRepository())) {
      throw new GitRepositoryNotFoundError({ currentWorkingDirectory: __dirname });
    }

    const gitRepositoryRootDirectory = await this.gitService.getRepositoryRoot();

    const gitStagedRelativeFilePaths = await this.gitService.getStagedFiles();

    const gitStagedPaths = gitStagedRelativeFilePaths
      .map((gitStagedRelativeFilePath) => {
        const nestedPaths = this.extractAllNestedPaths({ path: gitStagedRelativeFilePath });

        const existingPaths = nestedPaths.filter((path) => this.fileSystemService.checkIfPathExists({ path }));

        const existingAbsolutePaths = existingPaths.map((relativePath) =>
          join(gitRepositoryRootDirectory, relativePath),
        );

        return existingAbsolutePaths;
      })
      .flat();

    const gitStagedUniquePaths = [...new Set(gitStagedPaths)];

    return gitStagedUniquePaths;
  }

  private extractAllNestedPaths(payload: ExtractAllNestedPathsPayload): string[] {
    const { path } = payload;

    const filePathElements = path.split('/');

    const allNestedPaths: string[] = [];

    for (let i = 0; i < filePathElements.length; i++) {
      let nestedPathElements = [];

      for (let j = 0; j <= i; j++) {
        nestedPathElements.push(filePathElements[j]);
      }

      const nestedPath = nestedPathElements.join('/');

      if (!nestedPath.length) {
        continue;
      }

      allNestedPaths.push(nestedPath);
    }

    return allNestedPaths;
  }
}
