import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { FileSystemServiceImpl } from '../../../libs/fileSystem/fileSystemServiceImpl.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import { join } from 'path';
import { ReplaceAllInPathNamesCommandHandlerImpl } from './replaceAllInPathNamesCommandHandlerImpl.js';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'fs';

describe('ReplaceAllInPathNamesCommandHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const replaceAllInPathNamesCommandHandler = new ReplaceAllInPathNamesCommandHandlerImpl(fileSystemService);

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests');

  beforeAll(async () => {
    if (existsSync(testDataDirectory)) {
      await rm(testDataDirectory, { recursive: true });
    }

    await mkdir(testDataDirectory);

    const userModuleDirectory = join(testDataDirectory, 'userModule');
    const userRepositoriesDirectory = join(userModuleDirectory, 'repositories');
    const userRepositoryDirectory = join(userRepositoriesDirectory, 'userRepository');
    const userServicesDirectory = join(userModuleDirectory, 'services');
    const userServiceDirectory = join(userServicesDirectory, 'userService');
    const userDomainDirectory = join(userModuleDirectory, 'domain');
    const userDirectory = join(userDomainDirectory, 'user');

    await mkdir(userModuleDirectory);
    await mkdir(userRepositoriesDirectory);
    await mkdir(userRepositoryDirectory);
    await mkdir(userServicesDirectory);
    await mkdir(userServiceDirectory);
    await mkdir(userDomainDirectory);
    await mkdir(userDirectory);

    await writeFile(join(userModuleDirectory, 'userModule.ts'), 'test');
    await writeFile(join(userRepositoryDirectory, 'userRepository.ts'), 'test');
    await writeFile(join(userRepositoryDirectory, 'userRepositoryImpl.ts'), 'test');
    await writeFile(join(userServiceDirectory, 'userService.ts'), 'test');
    await writeFile(join(userServiceDirectory, 'userSerivceImpl.ts'), 'test');
    await writeFile(join(userDirectory, 'user.ts'), 'test');
  });

  afterEach(async () => {
    // await rm(testDataDirectory, { recursive: true });
  });

  it('renames paths without excluded paths', async () => {
    const { changedPathNames } = await replaceAllInPathNamesCommandHandler.execute({
      inputPath: testDataDirectory,
      replaceFrom: 'user',
      replaceTo: 'customer',
      excludePaths: [],
    });

    console.log({ changedPathNames });

    expect(changedPathNames.size).toEqual(10);
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.cpp)).toEqual({
    //   numberOfFiles: 1,
    //   numberOfLines: 8,
    // });
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.csharp)).toEqual({
    //   numberOfFiles: 1,
    //   numberOfLines: 10,
    // });
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.go)).toEqual({
    //   numberOfFiles: 1,
    //   numberOfLines: 6,
    // });
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.javascript)).toEqual({
    //   numberOfFiles: 2,
    //   numberOfLines: 32,
    // });
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.python)).toEqual({
    //   numberOfFiles: 1,
    //   numberOfLines: 4,
    // });
    // expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.java)).toEqual({
    //   numberOfFiles: 1,
    //   numberOfLines: 16,
    // });
  });

  // it('renames paths with excluded paths', async () => {
  //   const excludePath1 = join(testDataDirectory, 'cpp');

  //   const excludePath2 = join(testDataDirectory, 'csharp');

  //   const excludePath3 = join(testDataDirectory, 'nested', 'javascript', 'example1.js');

  //   const excludePaths: string[] = [excludePath1, excludePath2, excludePath3];

  //   const { programmingLanguageNamesToFilesInfo } = await replaceAllInPathNamesCommandHandler.execute({
  //     inputPath: testDataDirectory,
  //     excludePaths,
  //   });

  //   expect(programmingLanguageNamesToFilesInfo.size).toEqual(4);
  //   expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.go)).toEqual({
  //     numberOfFiles: 1,
  //     numberOfLines: 6,
  //   });
  //   expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.javascript)).toEqual({
  //     numberOfFiles: 1,
  //     numberOfLines: 12,
  //   });
  //   expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.python)).toEqual({
  //     numberOfFiles: 1,
  //     numberOfLines: 4,
  //   });
  //   expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.java)).toEqual({
  //     numberOfFiles: 1,
  //     numberOfLines: 16,
  //   });
  // });

  it('throws if provided input path does not exist', async () => {
    const inputPath = 'invalid';

    try {
      await replaceAllInPathNamesCommandHandler.execute({
        inputPath,
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
        inputPath: testDataDirectory,
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
