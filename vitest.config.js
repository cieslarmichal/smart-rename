import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['**/*.test.ts'],
    globals: false,
    environment: 'node',
    outputTruncateLength: 120,
    outputDiffLines: 30,
  },
});
