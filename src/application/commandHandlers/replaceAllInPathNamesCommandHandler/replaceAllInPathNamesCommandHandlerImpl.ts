import { FileSystemService } from '../../../libs/fileSystem/fileSystemService.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import {
  DataSourceType,
  ReplaceAllInPathNamesCommandHandler,
  ReplaceAllInPathNamesCommandHandlerPayload,
  ReplaceAllInPathNamesCommandHandlerResult,
} from './replaceAllInPathNamesCommandHandler.js';

export interface ValidateIfPathsExistPayload {
  readonly inputPaths: string[];
  readonly excludePaths: string[];
}

export class ReplaceAllInPathNamesCommandHandlerImpl implements ReplaceAllInPathNamesCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(
    payload: ReplaceAllInPathNamesCommandHandlerPayload,
  ): Promise<ReplaceAllInPathNamesCommandHandlerResult> {
    const { dataSource, replaceFrom, replaceTo, excludePaths = [] } = payload;

    let allPaths: string[];

    if (dataSource.type === DataSourceType.path) {
      this.validateIfPathsExist({ inputPaths: [dataSource.path], excludePaths });

      if (await this.fileSystemService.checkIfPathIsDirectory({ path: dataSource.path })) {
        allPaths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath: dataSource.path });
      } else {
        allPaths = [dataSource.path];
      }
    } else {
      // TODO: git staged files
      allPaths = [];
    }

    const filteredPaths = allPaths.filter(
      (filePath) => excludePaths.find((excludePath) => filePath.includes(excludePath)) === undefined,
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

    const changedPathNames: [string, string][] = [];

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

      changedPathNames.push([path, newPath]);
    }

    return { changedPathNames };
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
