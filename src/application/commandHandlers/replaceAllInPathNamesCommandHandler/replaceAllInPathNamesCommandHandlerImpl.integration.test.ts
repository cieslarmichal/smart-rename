import { describe, it, expect } from 'vitest';
import { FileSystemServiceImpl } from '../../../libs/fileSystem/fileSystemServiceImpl.js';
import { CountLinesOfCodeCommandHandlerImpl } from './replaceAllInPathNamesCommandHandlerImpl.js';
import { ExcludePathNotExistsError } from '../../errors/excludePathNotExistsError.js';
import { InputPathNotExistsError } from '../../errors/inputPathNotExistsError.js';
import { join } from 'path';
import { ProgrammingLanguageServiceImpl } from '../../services/programmingLanguageServiceImpl.js';
import { ProgrammingLanguageName } from '../../programmingLanguageName.js';

describe('CountLinesOfCodeCommandHandlerImpl', () => {
  const fileSystemService = new FileSystemServiceImpl();

  const programmingLanguageService = new ProgrammingLanguageServiceImpl();

  const countLinesOfCodeCommandHandler = new CountLinesOfCodeCommandHandlerImpl(
    fileSystemService,
    programmingLanguageService,
  );

  const testDataDirectory = join(__dirname, '..', '..', '..', '..', 'tests', 'data');

  it('returns lines of code by programming languages without excluded paths', async () => {
    const { programmingLanguageNamesToFilesInfo } = await countLinesOfCodeCommandHandler.execute({
      inputPath: testDataDirectory,
      excludePaths: [],
    });

    expect(programmingLanguageNamesToFilesInfo.size).toEqual(6);
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.cpp)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 8,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.csharp)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 10,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.go)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 6,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.javascript)).toEqual({
      numberOfFiles: 2,
      numberOfLines: 32,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.python)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 4,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.java)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 16,
    });
  });

  it('returns lines of code by programming languages with excluded paths', async () => {
    const excludePath1 = join(testDataDirectory, 'cpp');

    const excludePath2 = join(testDataDirectory, 'csharp');

    const excludePath3 = join(testDataDirectory, 'nested', 'javascript', 'example1.js');

    const excludePaths: string[] = [excludePath1, excludePath2, excludePath3];

    const { programmingLanguageNamesToFilesInfo } = await countLinesOfCodeCommandHandler.execute({
      inputPath: testDataDirectory,
      excludePaths,
    });

    expect(programmingLanguageNamesToFilesInfo.size).toEqual(4);
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.go)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 6,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.javascript)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 12,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.python)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 4,
    });
    expect(programmingLanguageNamesToFilesInfo.get(ProgrammingLanguageName.java)).toEqual({
      numberOfFiles: 1,
      numberOfLines: 16,
    });
  });

  it('throws if provided input path does not exist', async () => {
    const inputPath = 'invalid';

    try {
      await countLinesOfCodeCommandHandler.execute({ inputPath, excludePaths: [] });
    } catch (error) {
      expect(error).toBeInstanceOf(InputPathNotExistsError);

      return;
    }

    expect.fail();
  });

  it('throws if provided exclude path does not exist', async () => {
    const excludePaths: string[] = ['invalid'];

    try {
      await countLinesOfCodeCommandHandler.execute({ inputPath: testDataDirectory, excludePaths });
    } catch (error) {
      expect(error).toBeInstanceOf(ExcludePathNotExistsError);

      return;
    }

    expect.fail();
  });
});
