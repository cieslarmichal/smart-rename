import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { join } from 'path';
import { ReplaceInPathNamesCommandHandlerImpl } from './replaceInPathNamesCommandHandlerImpl.js';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'fs';
import { FileSystemServiceImpl } from '../../services/fileSystemService/fileSystemServiceImpl.js';

describe('ReplaceInPathNamesCommandHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const replaceInPathNamesCommandHandler = new ReplaceInPathNamesCommandHandlerImpl(fileSystemService);

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests1');

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

  const filesExist = (paths: string[]): boolean => {
    return paths.every((path) => existsSync(path));
  };

  const filesNotExist = (paths: string[]): boolean => {
    return !paths.some((path) => existsSync(path));
  };

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

  it('replaces occurences in path names', async () => {
    await replaceInPathNamesCommandHandler.execute({
      paths: [
        userRepositoryImplFile,
        userRepositoryFile,
        userServiceImplFile,
        userHashServiceImplFile,
        userServiceFile,
        userHashServiceFile,
        userRepositoryDirectory,
        userHashServiceDirectory,
        userServiceDirectory,
        userModuleFile,
        userRepositoriesDirectory,
        userDirectory,
        userServicesDirectory,
        userDomainDirectory,
        userModuleDirectory,
        testDataDirectory,
      ],
      replaceFrom: 'user',
      replaceTo: 'customer',
    });

    expect(
      filesNotExist([
        userRepositoryImplFile,
        userRepositoryFile,
        userServiceImplFile,
        userHashServiceImplFile,
        userServiceFile,
        userHashServiceFile,
        userRepositoryDirectory,
        userHashServiceDirectory,
        userServiceDirectory,
        userModuleFile,
        userRepositoriesDirectory,
        userDirectory,
        userServicesDirectory,
        userDomainDirectory,
        userModuleDirectory,
      ]),
    ).toBe(true);

    expect(
      filesExist([
        customerRepositoryImplFile,
        customerRepositoryFile,
        customerServiceImplFile,
        customerHashServiceImplFile,
        customerServiceFile,
        customerHashServiceFile,
        customerRepositoryDirectory,
        customerHashServiceDirectory,
        customerServiceDirectory,
        customerModuleFile,
        customerRepositoriesDirectory,
        customerDirectory,
        customerServicesDirectory,
        customerDomainDirectory,
        customerModuleDirectory,
      ]),
    ).toBe(true);
  });
});
