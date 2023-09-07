import {
  CheckIfPathExistsPayload,
  CheckIfPathIsDirectoryPayload,
  CheckIfPathIsFilePayload,
  FileSystemService,
  GetAllPathsFromDirectoryPayload,
  RenamePathPayload,
} from './fileSystemService.js';
import { existsSync, lstatSync } from 'fs';
import { readdir, rename } from 'node:fs/promises';
import { join } from 'path';

export class FileSystemServiceImpl implements FileSystemService {
  public checkIfPathIsDirectory(payload: CheckIfPathIsDirectoryPayload): boolean {
    const { path } = payload;

    return lstatSync(path).isDirectory();
  }

  public checkIfPathIsFile(payload: CheckIfPathIsFilePayload): boolean {
    const { path } = payload;

    return lstatSync(path).isFile();
  }

  public checkIfPathExists(payload: CheckIfPathExistsPayload): boolean {
    const { path } = payload;

    return existsSync(path);
  }

  public async getAllPathsFromDirectory(payload: GetAllPathsFromDirectoryPayload): Promise<string[]> {
    const { directoryPath } = payload;

    const relativePaths = await readdir(directoryPath, { recursive: true });

    const absolutePaths = relativePaths.map((relativePath) => join(directoryPath, relativePath));

    const absoluteFilePaths = absolutePaths.filter((absolutePath) => this.checkIfPathIsFile({ path: absolutePath }));

    return absoluteFilePaths;
  }

  public async renamePath(payload: RenamePathPayload): Promise<void> {
    const { fromPath, toPath } = payload;

    await rename(fromPath, toPath);
  }
}
