import { BaseError } from './baseError.js';

interface Context {
  readonly path: string;
}

export class GitRepositoryNotFoundError extends BaseError<Context> {
  public constructor(context: Context) {
    super('GitRepositoryNotFoundError', 'Git repository not found.', context);
  }
}
