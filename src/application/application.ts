import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ReplaceAllInPathNamesCommandHandlerImpl } from './commandHandlers/replaceAllInPathNamesCommandHandler/replaceAllInPathNamesCommandHandlerImpl.js';
import { BaseError } from './errors/baseError.js';
import {
  DataSource,
  DataSourceType,
} from './commandHandlers/replaceAllInPathNamesCommandHandler/replaceAllInPathNamesCommandHandler.js';
import { FileSystemServiceImpl } from './services/fileSystemService/fileSystemServiceImpl.js';

export class Application {
  public start(): void {
    yargs(hideBin(process.argv))
      .command(
        '$0 <source>',
        'Replace all occurences in paths names.',
        () => {},
        async (argv) => {
          const source = argv['source'] as string;

          const replaceFrom = argv['from'] as string;

          const replaceTo = argv['to'] as string;

          const excludePaths = argv['e'] as string[];

          const fileSystemService = new FileSystemServiceImpl();

          const commandHandler = new ReplaceAllInPathNamesCommandHandlerImpl(fileSystemService);

          try {
            let dataSource: DataSource;

            if (source === 'git') {
              dataSource = { type: DataSourceType.git };
            } else {
              dataSource = { type: DataSourceType.path, path: source };
            }

            await commandHandler.execute({ dataSource, replaceFrom, replaceTo, excludePaths });
          } catch (error) {
            if (error instanceof BaseError) {
              console.error({ errorMessage: error.message, errorContext: error.context });
            } else {
              console.error({ error });
            }

            return;
          }
        },
      )
      .positional('source', {
        describe: `Directory path or 'git' (staged files) to replace all occurrences`,
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
