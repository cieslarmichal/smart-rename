export interface ReplaceInPathNamesCommandHandlerPayload {
  readonly paths: string[];
  readonly replaceFrom: string;
  readonly replaceTo: string;
}

export interface ReplaceInPathNamesCommandHandler {
  execute(payload: ReplaceInPathNamesCommandHandlerPayload): Promise<void>;
}
