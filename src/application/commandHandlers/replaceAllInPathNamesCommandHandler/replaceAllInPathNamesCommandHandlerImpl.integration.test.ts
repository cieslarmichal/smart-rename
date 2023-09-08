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

  it('renames paths without excluded paths', async () => {
    const { changedPathNames } = await replaceAllInPathNamesCommandHandler.execute({
      dataSource: { type: DataSourceType.path, path: testDataDirectory },
      replaceFrom: 'user',
      replaceTo: 'customer',
      excludePaths: [userServicesDirectory],
    });

    expect(changedPathNames.length).toEqual(8);
    expect(changedPathNames[0]).toEqual([userRepositoryImplFile, customerRepositoryImplFile]);
    expect(changedPathNames[1]).toEqual([userRepositoryFile, customerRepositoryFile]);
    expect(changedPathNames[2]).toEqual([userRepositoryDirectory, customerRepositoryDirectory]);
    expect(changedPathNames[3]).toEqual([userModuleFile, customerModuleFile]);
    expect(changedPathNames[4]).toEqual([userRepositoriesDirectory, customerRepositoriesDirectory]);
    expect(changedPathNames[5]).toEqual([userDirectory, customerDirectory]);
    expect(changedPathNames[6]).toEqual([userDomainDirectory, customerDomainDirectory]);
    expect(changedPathNames[7]).toEqual([userModuleDirectory, customerModuleDirectory]);
  });

  it('renames paths with excluded paths', async () => {
    const { changedPathNames } = await replaceAllInPathNamesCommandHandler.execute({
      dataSource: { type: DataSourceType.path, path: testDataDirectory },
      replaceFrom: 'user',
      replaceTo: 'customer',
      excludePaths: [],
    });

    expect(changedPathNames.length).toEqual(15);
    expect(changedPathNames[0]).toEqual([userRepositoryImplFile, customerRepositoryImplFile]);
    expect(changedPathNames[1]).toEqual([userRepositoryFile, customerRepositoryFile]);
    expect(changedPathNames[2]).toEqual([userServiceImplFile, customerServiceImplFile]);
    expect(changedPathNames[3]).toEqual([userHashServiceImplFile, customerHashServiceImplFile]);
    expect(changedPathNames[4]).toEqual([userServiceFile, customerServiceFile]);
    expect(changedPathNames[5]).toEqual([userHashServiceFile, customerHashServiceFile]);
    expect(changedPathNames[6]).toEqual([userRepositoryDirectory, customerRepositoryDirectory]);
    expect(changedPathNames[7]).toEqual([userHashServiceDirectory, customerHashServiceDirectory]);
    expect(changedPathNames[8]).toEqual([userServiceDirectory, customerServiceDirectory]);
    expect(changedPathNames[9]).toEqual([userModuleFile, customerModuleFile]);
    expect(changedPathNames[10]).toEqual([userRepositoriesDirectory, customerRepositoriesDirectory]);
    expect(changedPathNames[11]).toEqual([userDirectory, customerDirectory]);
    expect(changedPathNames[12]).toEqual([userServicesDirectory, customerServicesDirectory]);
    expect(changedPathNames[13]).toEqual([userDomainDirectory, customerDomainDirectory]);
    expect(changedPathNames[14]).toEqual([userModuleDirectory, customerModuleDirectory]);
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
