export interface ReplaceAllInPathNamesCommandHandlerPayload {
  readonly inputPath: string;
  readonly replaceFrom: string;
  readonly replaceTo: string;
  readonly excludePaths?: string[];
}

export interface ReplaceAllInPathNamesCommandHandlerResult {
  readonly changedPathNames: Map<string, string>;
}

export interface ReplaceAllInPathNamesCommandHandler {
  execute(payload: ReplaceAllInPathNamesCommandHandlerPayload): Promise<ReplaceAllInPathNamesCommandHandlerResult>;
}
