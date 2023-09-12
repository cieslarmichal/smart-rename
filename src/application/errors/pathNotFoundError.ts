import { BaseError } from './baseError.js';

interface Context {
  readonly path: string;
}

export class PathNotFoundError extends BaseError<Context> {
  public constructor(context: Context) {
    super('PathNotFoundError', 'Path does not exist.', context);
  }
}
