import {
  CheckIfPathExistsPayload,
  CheckIfPathIsDirectoryPayload,
  CheckIfPathIsFilePayload,
  FileSystemService,
  GetAllPathsFromDirectoryPayload,
  MovePayload,
  RemovePayload,
} from './fileSystemService.js';
import { existsSync, lstatSync } from 'fs';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'path';
import { move as asyncMove } from 'fs-extra';

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

    return absolutePaths;
  }

  public async move(payload: MovePayload): Promise<void> {
    const { fromPath, toPath } = payload;

    await asyncMove(fromPath, toPath, { overwrite: false });
  }

  public async remove(payload: RemovePayload): Promise<void> {
    const { path } = payload;

    await rm(path, { recursive: true, force: true });
  }
}
