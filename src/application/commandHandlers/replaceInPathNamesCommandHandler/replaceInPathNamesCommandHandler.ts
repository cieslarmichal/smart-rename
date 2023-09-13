export interface ReplaceInPathNamesCommandHandlerPayload {
  readonly paths: string[];
  readonly replaceFrom: string;
  readonly replaceTo: string;
}

export interface ReplaceInPathNamesCommandHandlerResult {
  readonly changedPaths: Map<string, string>;
}

export interface ReplaceInPathNamesCommandHandler {
  execute(payload: ReplaceInPathNamesCommandHandlerPayload): Promise<ReplaceInPathNamesCommandHandlerResult>;
}
