import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import {
  DataSourceType,
  ReplacePathNamesCommandHandler,
  ReplacePathNamesCommandHandlerPayload,
} from './replacePathNamesCommandHandler.js';
import { resolve } from 'path';
import { GitService } from '../../services/gitService/gitService.js';
import { CollectionService } from '../../services/collectionService/collectionService.js';
import { PathNotFoundError } from '../../errors/pathNotFoundError.js';

export interface GetAllPathsFromDirectoryPayload {
  readonly directoryPath: string;
}

export interface ExtractAllRelativePathsPayload {
  readonly relativeFilePath: string;
}

export class ReplacePathNamesCommandHandlerImpl implements ReplacePathNamesCommandHandler {
  public constructor(
    private readonly fileSystemService: FileSystemService,
    private readonly gitService: GitService,
  ) {}

  public async execute(payload: ReplacePathNamesCommandHandlerPayload): Promise<void> {
    const { dataSource, replaceFrom, replaceTo, excludePaths = [] } = payload;

    const absoluteExcludePaths = excludePaths.map((excludePath) => resolve(excludePath));

    absoluteExcludePaths.map((excludePath) => {
      if (!this.fileSystemService.checkIfPathExists({ path: excludePath })) {
        throw new PathNotFoundError({ path: excludePath });
      }
    });

    let allPaths: string[] = [];

    if (dataSource.type === DataSourceType.path) {
      const directoryPath = resolve(dataSource.path);

      allPaths = await this.getAllPathsFromDirectory({ directoryPath });
    } else {
      allPaths = await this.getAllPathsFromGitStage();
    }

    const filteredPaths = allPaths.filter(
      (filePath) => absoluteExcludePaths.find((excludePath) => filePath.includes(excludePath)) === undefined,
    );

    CollectionService.sortByLengthDescending({ data: filteredPaths });

    for (const path of filteredPaths) {
      if (path.search(replaceFrom) === -1) {
        continue;
      }

      const newPath = path.replaceAll(replaceFrom, replaceTo);

      if (this.fileSystemService.checkIfPathExists({ path: newPath })) {
        await this.fileSystemService.remove({ path });
      } else {
        await this.fileSystemService.move({ fromPath: path, toPath: newPath });
      }
    }
  }

  private async getAllPathsFromDirectory(payload: GetAllPathsFromDirectoryPayload): Promise<string[]> {
    const { directoryPath } = payload;

    if (!this.fileSystemService.checkIfPathExists({ path: directoryPath })) {
      throw new PathNotFoundError({ path: directoryPath });
    }

    let allPaths: string[] = [];

    if (await this.fileSystemService.checkIfPathIsDirectory({ path: directoryPath })) {
      allPaths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath });
    }

    allPaths.push(directoryPath);

    return allPaths;
  }

  private async getAllPathsFromGitStage(): Promise<string[]> {
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

    const allPaths = [...new Set(gitStagedAbsolutePaths)];

    return allPaths;
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
