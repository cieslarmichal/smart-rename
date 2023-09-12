import { CliCommand } from '../../../types/cliCommand.js';

export interface RenamePathsCliCommandOptions {
  readonly path: string | undefined;
  readonly gitStage: boolean | undefined;
  readonly from: string;
  readonly to: string;
}

export type RenamePathsCliCommand = CliCommand<RenamePathsCliCommandOptions>;
