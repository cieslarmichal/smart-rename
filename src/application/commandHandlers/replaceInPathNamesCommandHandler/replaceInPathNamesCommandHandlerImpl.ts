import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import {
  ReplaceInPathNamesCommandHandler,
  ReplaceInPathNamesCommandHandlerPayload,
} from './replaceInPathNamesCommandHandler.js';
import { CollectionService } from '../../services/collectionService/collectionService.js';

export class ReplaceInPathNamesCommandHandlerImpl implements ReplaceInPathNamesCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(payload: ReplaceInPathNamesCommandHandlerPayload): Promise<void> {
    const { paths, replaceFrom, replaceTo } = payload;

    CollectionService.sortByLengthDescending({ data: paths });

    for (const path of paths) {
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
}
