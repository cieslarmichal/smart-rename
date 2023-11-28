import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import {
  ReplaceInPathNamesCommandHandler,
  ReplaceInPathNamesCommandHandlerPayload,
  ReplaceInPathNamesCommandHandlerResult,
} from './replaceInPathNamesCommandHandler.js';
import { CollectionService } from '../../services/collectionService/collectionService.js';
import { join } from 'path';

export class ReplaceInPathNamesCommandHandlerImpl implements ReplaceInPathNamesCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(
    payload: ReplaceInPathNamesCommandHandlerPayload,
  ): Promise<ReplaceInPathNamesCommandHandlerResult> {
    const { rootDirectory, paths, replaceFrom, replaceTo } = payload;

    CollectionService.sortByLengthDescending({ data: paths });

    const changedPaths = new Map<string, string>();

    for (const path of paths) {
      if (path.search(replaceFrom) === -1) {
        continue;
      }

      const relativePath = path.replace(rootDirectory, '');

      const renamedRelativePath = relativePath.replaceAll(replaceFrom, replaceTo);

      const renamedAbsolutePath = join(rootDirectory, renamedRelativePath);

      if (this.fileSystemService.checkIfPathExists({ path: renamedAbsolutePath })) {
        const pathIsDirectory = await this.fileSystemService.checkIfPathIsDirectory({ path });

        if (pathIsDirectory) {
          const pathsFromDirectory = await this.fileSystemService.getPathsFromDirectory({ directoryPath: path });

          await Promise.all(
            pathsFromDirectory.map(async (pathFromDirectory) => {
              const pathSuffix = pathFromDirectory.replace(path, '');

              await this.fileSystemService.move({
                fromPath: join(path, pathFromDirectory),
                toPath: join(renamedAbsolutePath, pathSuffix),
              });
            }),
          );
        }

        await this.fileSystemService.remove({ path });
      } else {
        await this.fileSystemService.move({ fromPath: path, toPath: renamedAbsolutePath });
      }

      changedPaths.set(path, renamedAbsolutePath);
    }

    return { changedPaths };
  }
}
