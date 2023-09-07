import { BaseError } from './baseError.js';

interface Context {
  readonly path: string;
}

export class ExcludePathNotExistsError extends BaseError<Context> {
  public constructor(context: Context) {
    super('ExcludePathNotExistsError', 'Exclude path does not exist.', context);
  }
}
