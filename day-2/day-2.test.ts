import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

import { determineNumberOfSafeReports, determineNumberOfSafeReportsWithProblemDampener } from './day-2';

describe('Day 2: Red-Nosed Reports', () => {
  const reportsFilePath = path.join(__dirname, 'reports.txt');

  it('Part 1: should determine number of safe reports', async () => {
    const expectedNumberOfSafeReports = 660; // Verified for this dataset

    const numberOfSafeReports = await determineNumberOfSafeReports(reportsFilePath);

    assert.strictEqual(numberOfSafeReports, expectedNumberOfSafeReports);
  });

  it('Part 2: should determine number of safe reports with problem dampener', async () => {
    const expectedNumberOfSafeReportsWithProblemDampener = 689; // Verified for this dataset

    const numberOfSafeReports = await determineNumberOfSafeReportsWithProblemDampener(reportsFilePath);

    assert.strictEqual(numberOfSafeReports, expectedNumberOfSafeReportsWithProblemDampener);
  });
});
