export type PathSource = {
  type: 'path';
  path: string;
};

export type GitSource = {
  type: 'git';
};

export type DataSource = PathSource | GitSource;

export interface ReplaceAllInPathNamesCommandHandlerPayload {
  readonly dataSource: DataSource;
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
