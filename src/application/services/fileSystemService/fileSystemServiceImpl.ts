import {
  CheckIfPathExistsPayload,
  CheckIfPathIsDirectoryPayload,
  FileSystemService,
  GetAllPathsFromDirectoryPayload,
  MovePayload,
  ReadFilePayload,
  RemovePayload,
} from './fileSystemService.js';
import { existsSync } from 'fs';
import { readdir, rm, lstat, readFile as readFileAsync } from 'node:fs/promises';
import { join } from 'path';
import { move as asyncMove } from 'fs-extra';

export class FileSystemServiceImpl implements FileSystemService {
  public async checkIfPathIsDirectory(payload: CheckIfPathIsDirectoryPayload): Promise<boolean> {
    const { path } = payload;

    const stats = await lstat(path);

    return stats.isDirectory();
  }

  public async checkIfPathIsFile(payload: CheckIfPathIsDirectoryPayload): Promise<boolean> {
    const { path } = payload;

    const stats = await lstat(path);

    return stats.isFile();
  }

  public checkIfPathExists(payload: CheckIfPathExistsPayload): boolean {
    const { path } = payload;

    return existsSync(path);
  }

  public async getAllPathsFromDirectory(payload: GetAllPathsFromDirectoryPayload): Promise<string[]> {
    const { directoryPath } = payload;

    const allPaths: string[] = [];

    await this.getAllPathsFromDirectoryHelper(directoryPath, allPaths);

    return allPaths;
  }

  private async getAllPathsFromDirectoryHelper(directoryPath: string, allPaths: string[]): Promise<void> {
    const relativePaths = await readdir(directoryPath);

    await Promise.all(
      relativePaths.map(async (relativePath) => {
        const absolutePath = join(directoryPath, relativePath);

        allPaths.push(absolutePath);

        if (await this.checkIfPathIsDirectory({ path: absolutePath })) {
          await this.getAllPathsFromDirectoryHelper(absolutePath, allPaths);
        } else {
          return;
        }
      }),
    );
  }

  public async move(payload: MovePayload): Promise<void> {
    const { fromPath, toPath } = payload;

    await asyncMove(fromPath, toPath, { overwrite: false });
  }

  public async remove(payload: RemovePayload): Promise<void> {
    const { path } = payload;

    await rm(path, { recursive: true, force: true });
  }

  public async readFile(payload: ReadFilePayload): Promise<string> {
    const { filePath } = payload;

    const content = await readFileAsync(filePath, 'utf-8');

    return content.toString();
  }
}
