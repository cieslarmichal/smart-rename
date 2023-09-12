export interface FindPathsFromDirectoryRecursivelyQueryHandlerPayload {
  readonly directoryPath: string;
}

export interface FindPathsFromDirectoryRecursivelyQueryHandler {
  execute(payload: FindPathsFromDirectoryRecursivelyQueryHandlerPayload): Promise<string[]>;
}
