import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FileSystemServiceImpl } from '../libs/fileSystem/fileSystemServiceImpl.js';
import {
  CountLinesOfCodeCommandHandlerImpl,
  ReplaceAllInPathNamesCommandHandlerImpl,
} from './commandHandlers/replaceAllInPathNamesCommandHandler/replaceAllInPathNamesCommandHandlerImpl.js';
import { BaseError } from './errors/baseError.js';

export class Application {
  public start(): void {
    yargs(hideBin(process.argv))
      .command(
        '$0 <input>',
        'Replace all in paths names recursively.',
        () => {},
        async (argv) => {
          const inputPath = argv['input'] as string;

          const replaceFrom = argv['from'] as string;

          const replaceTo = argv['to'] as string;

          const excludePaths = argv['e'] as string[];

          const fileSystemService = new FileSystemServiceImpl();

          const commandHandler = new ReplaceAllInPathNamesCommandHandlerImpl(fileSystemService);

          let programmingLanguageNamesToFilesInfo;

          try {
            const result = await commandHandler.execute({ inputPath, excludePaths });

            programmingLanguageNamesToFilesInfo = result.programmingLanguageNamesToFilesInfo;
          } catch (error) {
            if (error instanceof BaseError) {
              console.error({ errorMessage: error.message, errorContext: error.context });
            } else {
              console.error({ error });
            }

            return;
          }

          console.log(result.toString());
        },
      )
      .positional('input', {
        describe: 'Directory/file path name to search for occurences and replace all',
        type: 'string',
        demandOption: true,
      })
      .option('from', {
        describe: 'Rename from',
        type: 'string',
        demandOption: true,
      })
      .option('to', {
        describe: 'Rename from',
        type: 'string',
        demandOption: true,
      })
      .option('e', {
        alias: 'exclude',
        describe: 'Directories/files names to be excluded from search',
        type: 'array',
        demandOption: false,
      })
      .help().argv;
  }
}
