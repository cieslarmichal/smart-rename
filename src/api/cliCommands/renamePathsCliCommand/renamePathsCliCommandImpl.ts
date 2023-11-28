import { type Argv } from 'yargs';
import { RenamePathsCliCommand, RenamePathsCliCommandOptions } from './renamePathsCliCommand.js';
import { ReplaceInPathNamesCommandHandlerImpl } from '../../../application/commandHandlers/replaceInPathNamesCommandHandler/replaceInPathNamesCommandHandlerImpl.js';
import { FileSystemServiceImpl } from '../../../application/services/fileSystemService/fileSystemServiceImpl.js';
import { GitClientFactory } from '../../../application/services/gitService/gitClient/gitClientFactory.js';
import { GitServiceImpl } from '../../../application/services/gitService/gitServiceImpl.js';
import { FindPathsFromDirectoryRecursivelyQueryHandlerImpl } from '../../../application/queryHandlers/findPathsFromDirectoryRecursivelyQueryHandler/findPathsFromDirectoryRecursivelyQueryHandlerImpl.js';
import { FindPathsFromGitStageQueryHandlerImpl } from '../../../application/queryHandlers/findPathsFromGitStageQueryHandler/findPathsFromGitStageQueryHandlerImpl.js';
import { BaseError } from '../../../application/errors/baseError.js';
import { ReplaceInFilesContentsCommandHandlerImpl } from '../../../application/commandHandlers/replaceInFilesContentsCommandHandler/replaceInFilesContentsCommandHandlerImpl.js';
import { resolve } from 'path';

export class RenamePathsCliCommandImpl implements RenamePathsCliCommand {
  public readonly command = '$0';
  public readonly description = 'Replace all occurences in paths names.';

  public build(builder: Argv<RenamePathsCliCommandOptions>): Argv<RenamePathsCliCommandOptions> {
    return builder
      .option({
        path: {
          description: 'Directory path (search includes directory path and all recursive paths inside)',
          string: true,
          demandOption: false,
          alias: 'p',
          conflicts: 'gitStage',
        },
        gitStage: {
          description: 'Whether to use paths from git stage',
          boolean: true,
          demandOption: false,
          alias: 'g',
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
        includeFilesContents: {
          description: 'Whether to also replace all occurences in files contents',
          boolean: true,
          demandOption: false,
          alias: 'i',
        },
        exclude: {
          describe: 'Paths to be excluded from renaming',
          type: 'array',
          string: true,
          demandOption: false,
          alias: 'e',
        },
      })
      .usage('Usage: smart-rename [options]');
  }

  public async execute(options: RenamePathsCliCommandOptions): Promise<void> {
    if (options.path === undefined && options.gitStage === undefined) {
      console.error({
        errorMessage: 'At least one of the optional options need to be provided.',
        errorContext: { optionalOptions: ['path', 'gitStage'] },
      });

      return;
    }

    const directoryPath = options.path;

    const replaceFrom = options.from;

    const replaceTo = options.to;

    const includeFilesContents = options.includeFilesContents;

    const excludedPaths = options.exclude;

    const fileSystemService = new FileSystemServiceImpl();

    const gitClient = GitClientFactory.create();

    const gitService = new GitServiceImpl(gitClient);

    const replaceInPathNamesCommandHandler = new ReplaceInPathNamesCommandHandlerImpl(fileSystemService);

    const replaceInFilesContentsCommandHandler = new ReplaceInFilesContentsCommandHandlerImpl(fileSystemService);

    const findPathsFromDirectoryRecursivelyQueryHandler = new FindPathsFromDirectoryRecursivelyQueryHandlerImpl(
      fileSystemService,
    );

    const findPathsFromGitStageQueryHandler = new FindPathsFromGitStageQueryHandlerImpl(gitService, fileSystemService);

    try {
      let paths = directoryPath
        ? await findPathsFromDirectoryRecursivelyQueryHandler.execute({ directoryPath })
        : await findPathsFromGitStageQueryHandler.execute();

      if (excludedPaths?.length) {
        const absoluteExcludePaths = excludedPaths.map((excludedPath) => resolve(excludedPath));

        paths = paths.filter(
          (path) => absoluteExcludePaths.find((excludedPath) => path.includes(excludedPath)) === undefined,
        );
      }

      let rootDirectory = directoryPath ? directoryPath : await gitService.getRepositoryRoot();

      const { changedPaths } = await replaceInPathNamesCommandHandler.execute({
        paths,
        replaceFrom,
        replaceTo,
        rootDirectory,
      });

      if (includeFilesContents) {
        const updatedPaths = paths.map((path) => changedPaths.get(path) || path);

        await replaceInFilesContentsCommandHandler.execute({ paths: updatedPaths, replaceFrom, replaceTo });
      }
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
