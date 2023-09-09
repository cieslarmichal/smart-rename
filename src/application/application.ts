import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ReplacePathNamesCommandHandlerImpl } from './commandHandlers/replacePathNamesCommandHandler/replacePathNamesCommandHandlerImpl.js';
import { BaseError } from './errors/baseError.js';
import {
  DataSource,
  DataSourceType,
} from './commandHandlers/replacePathNamesCommandHandler/replacePathNamesCommandHandler.js';
import { FileSystemServiceImpl } from './services/fileSystemService/fileSystemServiceImpl.js';
import { GitClientFactory } from './services/gitService/gitClient/gitClientFactory.js';
import { GitServiceImpl } from './services/gitService/gitServiceImpl.js';

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

          const gitClient = GitClientFactory.create();

          const gitService = new GitServiceImpl(gitClient);

          const commandHandler = new ReplacePathNamesCommandHandlerImpl(fileSystemService, gitService);

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
      .option('f', {
        alias: 'from',
        describe: 'Rename from',
        type: 'string',
        demandOption: true,
      })
      .option('t', {
        alias: 'to',
        describe: 'Rename to',
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
