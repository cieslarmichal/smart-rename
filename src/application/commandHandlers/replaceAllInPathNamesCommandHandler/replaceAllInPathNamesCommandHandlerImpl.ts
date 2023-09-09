import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import {
  DataSourceType,
  ReplaceAllInPathNamesCommandHandler,
  ReplaceAllInPathNamesCommandHandlerPayload,
} from './replaceAllInPathNamesCommandHandler.js';
import { resolve } from 'path';
import { GitService } from '../../services/gitService/gitService.js';

export interface ValidateIfPathsExistPayload {
  readonly inputPaths: string[];
  readonly excludePaths: string[];
}

export interface ExtractAllRelativePathsPayload {
  readonly relativeFilePath: string;
}

export class ReplaceAllInPathNamesCommandHandlerImpl implements ReplaceAllInPathNamesCommandHandler {
  public constructor(
    private readonly fileSystemService: FileSystemService,
    private readonly gitService: GitService,
  ) {}

  public async execute(payload: ReplaceAllInPathNamesCommandHandlerPayload): Promise<void> {
    const { dataSource, replaceFrom, replaceTo, excludePaths = [] } = payload;

    const absoluteExcludePaths = excludePaths.map((excludePath) => resolve(excludePath));

    let allPaths: string[] = [];

    if (dataSource.type === DataSourceType.path) {
      this.validateIfPathsExist({ inputPaths: [dataSource.path], excludePaths });

      const absolutePath = resolve(dataSource.path);

      if (await this.fileSystemService.checkIfPathIsDirectory({ path: absolutePath })) {
        allPaths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath: absolutePath });
      }

      allPaths.push(absolutePath);
    } else {
      const gitStagedRelativeFilePaths = await this.gitService.getStagedFiles();

      console.log(gitStagedRelativeFilePaths);

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

      allPaths = [...new Set(gitStagedAbsolutePaths)];

      console.log(allPaths);
    }

    const filteredPaths = allPaths.filter(
      (filePath) => absoluteExcludePaths.find((excludePath) => filePath.includes(excludePath)) === undefined,
    );

    filteredPaths.sort((path1, path2) => {
      if (path1.length < path2.length) {
        return 1;
      } else if (path1.length === path2.length) {
        return 0;
      } else {
        return -1;
      }
    });

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

  private validateIfPathsExist(payload: ValidateIfPathsExistPayload): void {
    const { inputPaths, excludePaths } = payload;

    inputPaths.map((inputPath) => {
      if (!this.fileSystemService.checkIfPathExists({ path: inputPath })) {
        throw new InputPathNotExistsError({ path: inputPath });
      }
    });

    excludePaths.map((excludePath) => {
      if (!this.fileSystemService.checkIfPathExists({ path: excludePath })) {
        throw new ExcludePathNotExistsError({ path: excludePath });
      }
    });
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
