import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { RenamePathsCliCommandImpl } from './cliCommands/renamePathsCliCommand/renamePathsCliCommandImpl.js';

export class Application {
  public static async start(): Promise<void> {
    const cliCommand = new RenamePathsCliCommandImpl();

    yargs(hideBin(process.argv))
      .command([
        {
          command: cliCommand.command,
          describe: cliCommand.description,
          builder: (builder: any): Argv => {
            return cliCommand.build(builder);
          },
          handler: async (argv: any): Promise<void> => {
            await cliCommand.execute(argv);
          },
        },
      ])
      .help().argv;
  }
}
