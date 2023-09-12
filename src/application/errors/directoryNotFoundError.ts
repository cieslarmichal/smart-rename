import { BaseError } from '../../types/errors/baseError.js';

interface Context {
  readonly path: string;
}

export class DirectoryNotFoundError extends BaseError<Context> {
  public constructor(context: Context) {
    super('DirectoryNotFoundError', 'Directory not found.', context);
  }
}
