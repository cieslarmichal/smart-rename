import { FileSystemService } from '../../../libs/fileSystem/fileSystemService.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import {
  DataSourceType,
  ReplaceAllInPathNamesCommandHandler,
  ReplaceAllInPathNamesCommandHandlerPayload,
} from './replaceAllInPathNamesCommandHandler.js';
import { resolve } from 'path';

export interface ValidateIfPathsExistPayload {
  readonly inputPaths: string[];
  readonly excludePaths: string[];
}

export class ReplaceAllInPathNamesCommandHandlerImpl implements ReplaceAllInPathNamesCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(payload: ReplaceAllInPathNamesCommandHandlerPayload): Promise<void> {
    const { dataSource, replaceFrom, replaceTo, excludePaths = [] } = payload;

    const absoluteExcludePaths = excludePaths.map((excludePath) => resolve(excludePath));

    let allPaths: string[];

    if (dataSource.type === DataSourceType.path) {
      this.validateIfPathsExist({ inputPaths: [dataSource.path], excludePaths });

      const absolutePath = resolve(dataSource.path);

      if (await this.fileSystemService.checkIfPathIsDirectory({ path: absolutePath })) {
        allPaths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath: absolutePath });
        allPaths.push(absolutePath);
      } else {
        allPaths = [absolutePath];
      }
    } else {
      // TODO: git staged files
      allPaths = [];
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
}
