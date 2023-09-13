export interface ReplaceInFilesContentsCommandHandlerPayload {
  readonly paths: string[];
  readonly replaceFrom: string;
  readonly replaceTo: string;
}

export interface ReplaceInFilesContentsCommandHandler {
  execute(payload: ReplaceInFilesContentsCommandHandlerPayload): Promise<void>;
}
