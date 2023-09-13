import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { join } from 'path';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'fs';
import { FileSystemServiceImpl } from '../../services/fileSystemService/fileSystemServiceImpl.js';
import { ReplaceInFilesContentsCommandHandlerImpl } from './replaceInFilesContentsCommandHandlerImpl.js';

describe('ReplaceInFilesContentsCommandHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const replaceInFilesContentsCommandHandlerImpl = new ReplaceInFilesContentsCommandHandlerImpl(fileSystemService);

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests4');

  const userModuleDirectory = join(testDataDirectory, 'userModule');
  const userRepositoriesDirectory = join(userModuleDirectory, 'repositories');
  const userRepositoryDirectory = join(userRepositoriesDirectory, 'userRepository');
  const userServicesDirectory = join(userModuleDirectory, 'services');
  const userServiceDirectory = join(userServicesDirectory, 'userService');

  const userModuleFile = join(userModuleDirectory, 'userModule.ts');
  const userRepositoryFile = join(userRepositoryDirectory, 'userRepository.ts');
  const userServiceFile = join(userServiceDirectory, 'userService.ts');

  beforeEach(async () => {
    if (existsSync(testDataDirectory)) {
      await rm(testDataDirectory, { recursive: true });
    }

    await mkdir(testDataDirectory);
    await mkdir(userModuleDirectory);
    await mkdir(userRepositoriesDirectory);
    await mkdir(userRepositoryDirectory);
    await mkdir(userServicesDirectory);
    await mkdir(userServiceDirectory);

    await writeFile(userModuleFile, 'userModule');
    await writeFile(userRepositoryFile, 'user user user repo');
    await writeFile(userServiceFile, 'test');
  });

  afterEach(async () => {
    await rm(testDataDirectory, { recursive: true });
  });

  it('replaces occurences in path names', async () => {
    await replaceInFilesContentsCommandHandlerImpl.execute({
      paths: [
        userRepositoryFile,
        userServiceFile,
        userRepositoryDirectory,
        userServiceDirectory,
        userModuleFile,
        userRepositoriesDirectory,
        userServicesDirectory,
        userModuleDirectory,
        testDataDirectory,
      ],
      replaceFrom: 'user',
      replaceTo: 'customer',
    });

    const fileContent1 = await readFile(userModuleFile, 'utf-8');
    const fileContent2 = await readFile(userRepositoryFile, 'utf-8');
    const fileContent3 = await readFile(userServiceFile, 'utf-8');

    expect(fileContent1).toEqual('customerModule');
    expect(fileContent2).toEqual('customer customer customer repo');
    expect(fileContent3).toEqual('test');
  });
});
