export interface CheckIfPathIsDirectoryPayload {
  readonly path: string;
}

export interface CheckIfPathIsFilePayload {
  readonly path: string;
}

export interface CheckIfPathExistsPayload {
  readonly path: string;
}

export interface GetPathsFromDirectoryPayload {
  readonly directoryPath: string;
}

export interface GetPathsFromDirectoryRecursivePayload {
  readonly directoryPath: string;
}

export interface MovePayload {
  readonly fromPath: string;
  readonly toPath: string;
}

export interface RemovePayload {
  readonly path: string;
}

export interface ReadFilePayload {
  readonly filePath: string;
}

export interface WriteFilePayload {
  readonly filePath: string;
  readonly data: string;
}

export interface FileSystemService {
  checkIfPathIsDirectory(payload: CheckIfPathIsDirectoryPayload): Promise<boolean>;
  checkIfPathIsFile(payload: CheckIfPathIsFilePayload): Promise<boolean>;
  checkIfPathExists(payload: CheckIfPathExistsPayload): boolean;
  getPathsFromDirectory(payload: GetPathsFromDirectoryPayload): Promise<string[]>;
  getPathsFromDirectoryRecursive(payload: GetPathsFromDirectoryRecursivePayload): Promise<string[]>;
  move(payload: MovePayload): Promise<void>;
  remove(payload: RemovePayload): Promise<void>;
  readFile(payload: ReadFilePayload): Promise<string>;
  writeFile(payload: WriteFilePayload): Promise<void>;
}
