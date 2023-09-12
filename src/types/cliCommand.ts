import { type ArgumentsCamelCase, type Argv } from 'yargs';

export interface CliCommand<Options> {
  readonly command: string;
  readonly description: string;
  readonly build: (builder: Argv<Options>) => Argv<Options>;
  readonly execute: (argv: ArgumentsCamelCase<Options>) => Promise<void>;
}
