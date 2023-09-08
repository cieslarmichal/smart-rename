export enum DataSourceType {
  path = 'path',
  git = 'git',
}

export type PathSource = {
  type: DataSourceType.path;
  path: string;
};

export type GitSource = {
  type: DataSourceType.git;
};

export type DataSource = PathSource | GitSource;

export interface ReplaceAllInPathNamesCommandHandlerPayload {
  readonly dataSource: DataSource;
  readonly replaceFrom: string;
  readonly replaceTo: string;
  readonly excludePaths?: string[];
}

export interface ReplaceAllInPathNamesCommandHandlerResult {
  readonly changedPathNames: [string, string][];
}

export interface ReplaceAllInPathNamesCommandHandler {
  execute(payload: ReplaceAllInPathNamesCommandHandlerPayload): Promise<ReplaceAllInPathNamesCommandHandlerResult>;
}
