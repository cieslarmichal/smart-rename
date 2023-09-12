import { BaseError } from '../../types/errors/baseError.js';

interface Context {
  readonly currentWorkingDirectory: string;
}

export class GitRepositoryNotFoundError extends BaseError<Context> {
  public constructor(context: Context) {
    super('GitRepositoryNotFoundError', 'Git repository not found.', context);
  }
}
