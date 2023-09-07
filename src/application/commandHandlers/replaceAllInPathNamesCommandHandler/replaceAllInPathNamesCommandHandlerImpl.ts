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
    const { inputPath, replaceFrom, replaceTo, excludePaths = [] } = payload;

    this.validateIfPathsExist({ inputPath, excludePaths });

    const allFilesPaths = await this.getAllFilesPaths({ path: inputPath });

    const filteredFilePaths = allFilesPaths.filter(
      (filePath) => excludePaths.find((excludePath) => filePath.includes(excludePath)) === undefined,
    );

    return { programmingLanguageNamesToFilesInfo };
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

  private async getAllFilesPaths(payload: GetAllFilesPathsPayload): Promise<string[]> {
    const { path } = payload;

    let filesPaths: string[];

    if (this.fileSystemService.checkIfPathIsDirectory({ path })) {
      filesPaths = await this.fileSystemService.getAllPathNamesFromDirectory({ directoryPath: path });
    } else {
      filesPaths = [path];
    }

    return filesPaths;
  }
}
