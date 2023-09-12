import { type Argv } from 'yargs';
import { RenamePathsCliCommand, RenamePathsCliCommandOptions } from './renamePathsCliCommand.js';
import { NoneOfOptionalOptionsProvidedError } from '../../errors/noneOfOptionalOptionsProvidedError.js';

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
          description: 'Rename from',
          string: true,
          demandOption: true,
          alias: 'f',
        },
        to: {
          description: 'Rename to',
          string: true,
          demandOption: true,
          alias: 't',
        },
      }).
      .example('smart-rename --path . --from user --to customer', 'Rename paths from current directory.')
      .example('smart-rename --gitStage --from user --to customer', 'Rename paths from git stage.')
      .usage('Usage: $0 [options]');
  }

  public async execute(options: RenamePathsCliCommandOptions): Promise<void> {
    if (options.path === undefined && options.gitStage === undefined) {
      throw new NoneOfOptionalOptionsProvidedError({fieldsNames: ['path', 'gitStage']});
    }

    const includePathsFromGitStage = options.gitStage ?? false;

    const projectKey = options.path;

    const renameFrom = options.from;

    const renameTo = options.from;

  }
}
