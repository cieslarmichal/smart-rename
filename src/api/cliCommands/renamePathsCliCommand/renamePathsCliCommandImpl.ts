import { type Argv } from 'yargs';
import { RenamePathsCliCommand, RenamePathsCliCommandOptions } from './renamePathsCliCommand.js';
import { ReplaceInPathNamesCommandHandlerImpl } from '../../../application/commandHandlers/replaceInPathNamesCommandHandler/replaceInPathNamesCommandHandlerImpl.js';
import { NoneOfOptionalOptionsProvidedError } from '../../../application/errors/noneOfOptionalOptionsProvidedError.js';
import { FileSystemServiceImpl } from '../../../application/services/fileSystemService/fileSystemServiceImpl.js';
import { GitClientFactory } from '../../../application/services/gitService/gitClient/gitClientFactory.js';
import { GitServiceImpl } from '../../../application/services/gitService/gitServiceImpl.js';
import { BaseError } from '../../../types/errors/baseError.js';
import { FindPathsFromDirectoryRecursivelyQueryHandlerImpl } from '../../../application/queryHandlers/findPathsFromDirectoryRecursivelyQueryHandler/findPathsFromDirectoryRecursivelyQueryHandlerImpl.js';
import { FindPathsFromGitStageQueryHandlerImpl } from '../../../application/queryHandlers/findPathsFromGitStageQueryHandler/findPathsFromGitStageQueryHandlerImpl.js';

export class RenamePathsCliCommandImpl implements RenamePathsCliCommand {
  public readonly command = '$0 <source>';
  public readonly description = 'Replace all occurences in paths names.';

  public build(builder: Argv<RenamePathsCliCommandOptions>): Argv<RenamePathsCliCommandOptions> {
    return builder
      .option({
        path: {
          description: 'Directory path (recursive search)',
          string: true,
          demandOption: false,
          conflicts: 'gitStage',
        },
        gitStage: {
          description: 'Whether to use git stage as a source of paths',
          boolean: true,
          demandOption: false,
          conflicts: 'path',
        },
        from: {
          description: 'Replace from',
          string: true,
          demandOption: true,
          alias: 'f',
        },
        to: {
          description: 'Replace to',
          string: true,
          demandOption: true,
          alias: 't',
        },
      })
      .example('smart-rename --path . --from user --to customer', 'Rename paths from current directory.')
      .example('smart-rename --gitStage --from user --to customer', 'Rename paths from git stage.')
      .usage('Usage: $0 [options]');
  }

  public async execute(options: RenamePathsCliCommandOptions): Promise<void> {
    if (options.path === undefined && options.gitStage === undefined) {
      throw new NoneOfOptionalOptionsProvidedError({ fieldsNames: ['path', 'gitStage'] });
    }

    const directoryPath = options.path;

    const replaceFrom = options.from;

    const replaceTo = options.from;

    const fileSystemService = new FileSystemServiceImpl();

    const gitClient = GitClientFactory.create();

    const gitService = new GitServiceImpl(gitClient);

    const replaceInPathNamesCommandHandler = new ReplaceInPathNamesCommandHandlerImpl(fileSystemService);

    const findPathsFromDirectoryRecursivelyQueryHandler = new FindPathsFromDirectoryRecursivelyQueryHandlerImpl(
      fileSystemService,
    );

    const findPathsFromGitStageQueryHandler = new FindPathsFromGitStageQueryHandlerImpl(gitService, fileSystemService);

    try {
      const paths = directoryPath
        ? await findPathsFromDirectoryRecursivelyQueryHandler.execute({ directoryPath })
        : await findPathsFromGitStageQueryHandler.execute();

      await replaceInPathNamesCommandHandler.execute({ paths, replaceFrom, replaceTo });
    } catch (error) {
      if (error instanceof BaseError) {
        console.error({ errorMessage: error.message, errorContext: error.context });
      } else {
        console.error({ error });
      }

      return;
    }
  }
}
