import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import { DirectoryNotFoundError } from '../../errors/directoryNotFoundError.js';
import {
  FindPathsFromDirectoryRecursivelyQueryHandler,
  FindPathsFromDirectoryRecursivelyQueryHandlerPayload,
} from './findPathsFromDirectoryRecursivelyQueryHandler.js';
import { resolve } from 'path';

export class FindPathsFromDirectoryRecursivelyQueryHandlerImpl
  implements FindPathsFromDirectoryRecursivelyQueryHandler
{
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(payload: FindPathsFromDirectoryRecursivelyQueryHandlerPayload): Promise<string[]> {
    const { directoryPath } = payload;

    const absoluteDirectoryPath = resolve(directoryPath);

    if (!this.fileSystemService.checkIfPathIsDirectory({ path: absoluteDirectoryPath })) {
      throw new DirectoryNotFoundError({ path: absoluteDirectoryPath });
    }

    const allPaths = await this.fileSystemService.getAllPathsFromDirectory({ directoryPath: absoluteDirectoryPath });

    allPaths.push(absoluteDirectoryPath);

    return allPaths;
  }
}
