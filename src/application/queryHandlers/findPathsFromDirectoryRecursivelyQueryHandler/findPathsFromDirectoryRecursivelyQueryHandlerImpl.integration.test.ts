import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'fs';
import { FileSystemServiceImpl } from '../../services/fileSystemService/fileSystemServiceImpl.js';
import { DirectoryNotFoundError } from '../../errors/directoryNotFoundError.js';
import { FindPathsFromDirectoryRecursivelyQueryHandlerImpl } from './findPathsFromDirectoryRecursivelyQueryHandlerImpl.js';

describe('FindPathsFromDirectoryRecursivelyQueryHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const findPathsFromDirectoryRecursivelyQueryHandlerImpl = new FindPathsFromDirectoryRecursivelyQueryHandlerImpl(
    fileSystemService,
  );

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests2');

  const userModuleDirectory = join(testDataDirectory, 'userModule');
  const userRepositoriesDirectory = join(userModuleDirectory, 'repositories');
  const userRepositoryDirectory = join(userRepositoriesDirectory, 'userRepository');
  const userServicesDirectory = join(userModuleDirectory, 'services');
  const userServiceDirectory = join(userServicesDirectory, 'userService');
  const userHashServiceDirectory = join(userServicesDirectory, 'hashService');
  const userDomainDirectory = join(userModuleDirectory, 'domain');
  const userDirectory = join(userDomainDirectory, 'user');

  const userModuleFile = join(userModuleDirectory, 'userModule.ts');
  const userRepositoryFile = join(userRepositoryDirectory, 'userRepository.ts');
  const userRepositoryImplFile = join(userRepositoryDirectory, 'userRepositoryImpl.ts');
  const userServiceFile = join(userServiceDirectory, 'userService.ts');
  const userServiceImplFile = join(userServiceDirectory, 'userSerivceImpl.ts');
  const userHashServiceFile = join(userHashServiceDirectory, 'hashService.ts');
  const userHashServiceImplFile = join(userHashServiceDirectory, 'hashServiceImpl.ts');

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
    await mkdir(userHashServiceDirectory);
    await mkdir(userDomainDirectory);
    await mkdir(userDirectory);

    await writeFile(userModuleFile, 'test');
    await writeFile(userRepositoryFile, 'test');
    await writeFile(userRepositoryImplFile, 'test');
    await writeFile(userServiceFile, 'test');
    await writeFile(userServiceImplFile, 'test');
    await writeFile(userHashServiceFile, 'test');
    await writeFile(userHashServiceImplFile, 'test');
  });

  afterEach(async () => {
    await rm(testDataDirectory, { recursive: true });
  });

  it('finds paths', async () => {
    const actualPaths = await findPathsFromDirectoryRecursivelyQueryHandlerImpl.execute({
      directoryPath: testDataDirectory,
    });

    expect(actualPaths.length).toBe(16);
    expect(actualPaths.find((path) => path === testDataDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userModuleDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userRepositoriesDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userRepositoryDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userServicesDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userServiceDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userHashServiceDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userDomainDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userDirectory)).toBeDefined();
    expect(actualPaths.find((path) => path === userModuleFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userRepositoryFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userRepositoryImplFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userServiceFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userServiceImplFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userHashServiceFile)).toBeDefined();
    expect(actualPaths.find((path) => path === userHashServiceImplFile)).toBeDefined();
  });

  it('throws an error if provided directory path does not exist', async () => {
    const directoryPath = 'invalid';

    try {
      await findPathsFromDirectoryRecursivelyQueryHandlerImpl.execute({
        directoryPath,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(DirectoryNotFoundError);

      return;
    }

    expect.fail();
  });
});
