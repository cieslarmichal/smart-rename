import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'fs';
import { FileSystemServiceImpl } from '../../services/fileSystemService/fileSystemServiceImpl.js';
import { GitClientFactory } from '../../services/gitService/gitClient/gitClientFactory.js';
import { GitServiceImpl } from '../../services/gitService/gitServiceImpl.js';
import { FindPathsFromGitStageQueryHandlerImpl } from './findPathsFromGitStageQueryHandlerImpl.js';

describe('FindPathsFromGitStageQueryHandlerImpl', () => {
  const gitClient = GitClientFactory.create();

  const gitService = new GitServiceImpl(gitClient);

  const fileSystemService = new FileSystemServiceImpl();

  const findPathsFromGitStageQueryHandlerImpl = new FindPathsFromGitStageQueryHandlerImpl(
    gitService,
    fileSystemService,
  );

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests3');

  const userModuleDirectory = join(testDataDirectory, 'userModule');
  const userModuleFile = join(userModuleDirectory, 'userModule.ts');

  beforeEach(async () => {
    if (existsSync(testDataDirectory)) {
      await rm(testDataDirectory, { recursive: true });
    }

    await mkdir(testDataDirectory);
    await mkdir(userModuleDirectory);
    await writeFile(userModuleFile, 'test');

    await gitClient.add(userModuleFile);
  });

  afterEach(async () => {
    await rm(testDataDirectory, { recursive: true });
  });

  it('finds paths from git stage', async () => {
    const actualPaths = await findPathsFromGitStageQueryHandlerImpl.execute();

    expect(actualPaths.length).toBe(3);
    expect(actualPaths.find((path) => path === testDataDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userModuleDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userModuleFile)).toBeDefined();
  });
});
