import { FileSystemService } from '../../../libs/fileSystem/fileSystemService.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import {
  ReplaceAllInPathNamesCommandHandler,
  ReplaceAllInPathNamesCommandHandlerPayload,
  ReplaceAllInPathNamesCommandHandlerResult,
} from './replaceAllInPathNamesCommandHandler.js';

export interface ValidateIfPathsExistPayload {
  readonly inputPath: string;
  readonly excludePaths: string[];
}

export interface GetAllFilesPathsPayload {
  readonly path: string;
}

export class ReplaceAllInPathNamesCommandHandlerImpl implements ReplaceAllInPathNamesCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(
    payload: ReplaceAllInPathNamesCommandHandlerPayload,
  ): Promise<ReplaceAllInPathNamesCommandHandlerResult> {
    const { dataSource, replaceFrom, replaceTo, excludePaths = [] } = payload;

    this.validateIfPathsExist({ inputPath, excludePaths });

    const allPaths = await this.getAllPaths({ path: inputPath });

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

    const changedPathNames = new Map<string, string>();

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

      changedPathNames.set(path, newPath);
    }

    return { changedPathNames };
  }

  private validateIfPathsExist(payload: ValidateIfPathsExistPayload): void {
    const { inputPath, excludePaths } = payload;

    if (!this.fileSystemService.checkIfPathExists({ path: inputPath })) {
      throw new InputPathNotExistsError({ path: inputPath });
    }

    excludePaths.map((excludePath) => {
      if (!this.fileSystemService.checkIfPathExists({ path: excludePath })) {
        throw new ExcludePathNotExistsError({ path: excludePath });
      }
    });
  }

  private async getAllPaths(payload: GetAllFilesPathsPayload): Promise<string[]> {
    const { path } = payload;

    let paths: string[];

    if (this.fileSystemService.checkIfPathIsDirectory({ path })) {
      paths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath: path });
    } else {
      paths = [path];
    }

    return paths;
  }
}
