import { BaseError } from '../../types/errors/baseError.js';

interface Context {
  readonly fieldsNames: string[];
}

export class NoneOfOptionalOptionsProvidedError extends BaseError<Context> {
  public constructor(context: Context) {
    super('NoneOfOptionalOptionsProvidedError', 'None of optional options provided.', context);
  }
}
