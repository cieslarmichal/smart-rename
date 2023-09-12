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

export interface ReplacePathNamesCommandHandlerPayload {
  readonly dataSource: DataSource;
  readonly replaceFrom: string;
  readonly replaceTo: string;
}

export interface ReplacePathNamesCommandHandler {
  execute(payload: ReplacePathNamesCommandHandlerPayload): Promise<void>;
}
