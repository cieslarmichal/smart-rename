import { resolve } from 'path';
import { GitService } from '../../services/gitService/gitService.js';
import { FindPathsFromGitStageQueryHandler } from './findPathsFromGitStageQueryHandler.js';
import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';

export interface ExtractAllRelativePathsPayload {
  readonly relativeFilePath: string;
}

export class FindPathsFromGitStageQueryHandlerImpl implements FindPathsFromGitStageQueryHandler {
  public constructor(
    private readonly gitService: GitService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  public async execute(): Promise<string[]> {
    const gitStagedRelativeFilePaths = await this.gitService.getStagedFiles();

    const gitStagedAbsolutePaths = gitStagedRelativeFilePaths
      .map((gitStagedRelativeFilePath) => {
        const relativePaths = this.extractAllRelativePaths({
          relativeFilePath: gitStagedRelativeFilePath,
        });

        const absolutePaths = relativePaths.map((relativePath) => resolve(relativePath));

        const existingPaths = absolutePaths.filter((path) => this.fileSystemService.checkIfPathExists({ path }));

        return existingPaths;
      })
      .flat();

    const gitStagedAbsoluteUniquePaths = [...new Set(gitStagedAbsolutePaths)];

    return gitStagedAbsoluteUniquePaths;
  }

  private extractAllRelativePaths(payload: ExtractAllRelativePathsPayload): string[] {
    const { relativeFilePath } = payload;

    const filePathParts = relativeFilePath.split('/');

    const allRelativePaths: string[] = [];

    for (let i = 0; i < filePathParts.length; i++) {
      let relativePathParts = [];

      for (let j = 0; j <= i; j++) {
        relativePathParts.push(filePathParts[j]);
      }

      const relativePath = relativePathParts.join('/');

      allRelativePaths.push(relativePath);
    }

    return allRelativePaths;
  }
}
