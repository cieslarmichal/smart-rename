import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { FileSystemServiceImpl } from '../../../libs/fileSystem/fileSystemServiceImpl.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import { join } from 'path';
import { ReplaceAllInPathNamesCommandHandlerImpl } from './replaceAllInPathNamesCommandHandlerImpl.js';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'fs';
import { DataSourceType } from './replaceAllInPathNamesCommandHandler.js';

describe('ReplaceAllInPathNamesCommandHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const replaceAllInPathNamesCommandHandler = new ReplaceAllInPathNamesCommandHandlerImpl(fileSystemService);

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests');

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

  const customerModuleDirectory = join(testDataDirectory, 'customerModule');
  const customerRepositoriesDirectory = join(customerModuleDirectory, 'repositories');
  const customerRepositoryDirectory = join(customerRepositoriesDirectory, 'customerRepository');
  const customerServicesDirectory = join(customerModuleDirectory, 'services');
  const customerServiceDirectory = join(customerServicesDirectory, 'customerService');
  const customerHashServiceDirectory = join(customerServicesDirectory, 'hashService');
  const customerDomainDirectory = join(customerModuleDirectory, 'domain');
  const customerDirectory = join(customerDomainDirectory, 'customer');

  const customerModuleFile = join(customerModuleDirectory, 'customerModule.ts');
  const customerRepositoryFile = join(customerRepositoryDirectory, 'customerRepository.ts');
  const customerRepositoryImplFile = join(customerRepositoryDirectory, 'customerRepositoryImpl.ts');
  const customerServiceFile = join(customerServiceDirectory, 'customerService.ts');
  const customerServiceImplFile = join(customerServiceDirectory, 'customerSerivceImpl.ts');
  const customerHashServiceFile = join(customerHashServiceDirectory, 'hashService.ts');
  const customerHashServiceImplFile = join(customerHashServiceDirectory, 'hashServiceImpl.ts');

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

  const findPathsInChangedPaths = (changedPathNames: [string, string][], path1: string, path2: string): boolean => {
    return changedPathNames.findIndex((pair) => pair[0] === path1 && pair[1] === path2) !== -1;
  };

  it('renames paths without excluded paths', async () => {
    const { changedPathNames } = await replaceAllInPathNamesCommandHandler.execute({
      dataSource: { type: DataSourceType.path, path: testDataDirectory },
      replaceFrom: 'user',
      replaceTo: 'customer',
      excludePaths: [],
    });

    expect(changedPathNames.length).toEqual(15);

    expect(findPathsInChangedPaths(changedPathNames, userRepositoryImplFile, customerRepositoryImplFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoryFile, customerRepositoryFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userServiceImplFile, customerServiceImplFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userHashServiceImplFile, customerHashServiceImplFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userServiceFile, customerServiceFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userHashServiceFile, customerHashServiceFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoryDirectory, customerRepositoryDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userHashServiceDirectory, customerHashServiceDirectory)).toBe(
      true,
    );
    expect(findPathsInChangedPaths(changedPathNames, userServiceDirectory, customerServiceDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userModuleFile, customerModuleFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoriesDirectory, customerRepositoriesDirectory)).toBe(
      true,
    );
    expect(findPathsInChangedPaths(changedPathNames, userDirectory, customerDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userServicesDirectory, customerServicesDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userDomainDirectory, customerDomainDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userModuleDirectory, customerModuleDirectory)).toBe(true);
  });

  it('renames paths with excluded paths', async () => {
    const { changedPathNames } = await replaceAllInPathNamesCommandHandler.execute({
      dataSource: { type: DataSourceType.path, path: testDataDirectory },
      replaceFrom: 'user',
      replaceTo: 'customer',
      excludePaths: [userServicesDirectory],
    });

    expect(changedPathNames.length).toEqual(8);

    expect(findPathsInChangedPaths(changedPathNames, userRepositoryImplFile, customerRepositoryImplFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoryFile, customerRepositoryFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoryDirectory, customerRepositoryDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userModuleFile, customerModuleFile)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userRepositoriesDirectory, customerRepositoriesDirectory)).toBe(
      true,
    );
    expect(findPathsInChangedPaths(changedPathNames, userDirectory, customerDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userDomainDirectory, customerDomainDirectory)).toBe(true);
    expect(findPathsInChangedPaths(changedPathNames, userModuleDirectory, customerModuleDirectory)).toBe(true);
  });

  it('throws if provided input path does not exist', async () => {
    const inputPath = 'invalid';

    try {
      await replaceAllInPathNamesCommandHandler.execute({
        dataSource: { type: DataSourceType.path, path: inputPath },
        excludePaths: [],
        replaceFrom: 'user',
        replaceTo: 'customer',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InputPathNotExistsError);

      return;
    }

    expect.fail();
  });

  it('throws if provided exclude path does not exist', async () => {
    const excludePaths: string[] = ['invalid'];

    try {
      await replaceAllInPathNamesCommandHandler.execute({
        dataSource: { type: DataSourceType.path, path: testDataDirectory },
        excludePaths,
        replaceFrom: 'user',
        replaceTo: 'customer',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ExcludePathNotExistsError);

      return;
    }

    expect.fail();
  });
});
