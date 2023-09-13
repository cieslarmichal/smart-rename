export interface CheckIfPathIsDirectoryPayload {
  readonly path: string;
}

export interface CheckIfPathIsFilePayload {
  readonly path: string;
}

export interface CheckIfPathExistsPayload {
  readonly path: string;
}

export interface GetAllPathsFromDirectoryPayload {
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

export interface FileSystemService {
  checkIfPathIsDirectory(payload: CheckIfPathIsDirectoryPayload): Promise<boolean>;
  checkIfPathIsFile(payload: CheckIfPathIsFilePayload): Promise<boolean>;
  checkIfPathExists(payload: CheckIfPathExistsPayload): boolean;
  getAllPathsFromDirectory(payload: GetAllPathsFromDirectoryPayload): Promise<string[]>;
  move(payload: MovePayload): Promise<void>;
  remove(payload: RemovePayload): Promise<void>;
  readFile(payload: ReadFilePayload): Promise<string>;
}
