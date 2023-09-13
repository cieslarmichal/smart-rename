import { FileSystemService } from '../../services/fileSystemService/fileSystemService.js';
import {
  ReplaceInFilesContentsCommandHandler,
  ReplaceInFilesContentsCommandHandlerPayload,
} from './replaceInFilesContentsCommandHandler.js';

export class ReplaceInFilesContentsCommandHandlerImpl implements ReplaceInFilesContentsCommandHandler {
  public constructor(private readonly fileSystemService: FileSystemService) {}

  public async execute(payload: ReplaceInFilesContentsCommandHandlerPayload): Promise<void> {
    const { paths, replaceFrom, replaceTo } = payload;

    const filesPaths = paths.filter(async (path) => {
      const isFile = await this.fileSystemService.checkIfPathIsFile({ path });

      return isFile;
    });

    await Promise.all(
      filesPaths.map(async (filePath) => {
        const fileContent = await this.fileSystemService.readFile({ filePath });

        if (fileContent.search(replaceFrom) === -1) {
          return;
        }

        const updatedFileContent = fileContent.replaceAll(replaceFrom, replaceTo);

        await this.fileSystemService.writeFile({ filePath, data: updatedFileContent });
      }),
    );
  }
}
