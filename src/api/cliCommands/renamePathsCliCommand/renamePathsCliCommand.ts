import { CliCommand } from '../cliCommand.js';

export interface RenamePathsCliCommandOptions {
  readonly path: string | undefined;
  readonly gitStage: boolean | undefined;
  readonly from: string;
  readonly to: string;
  readonly includeFilesContents: boolean | undefined;
  readonly exclude: string[] | undefined;
}

export type RenamePathsCliCommand = CliCommand<RenamePathsCliCommandOptions>;
