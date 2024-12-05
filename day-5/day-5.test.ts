import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

import { calculateSumOfMiddlePageNumbersOfCorrectedUpdates, calculateSumOfMiddlePageNumbersOfCorrectlyOrderedUpdates } from './day-5';

describe('Day 5: Print Queue', () => {
  const updatesFilePath = path.join(__dirname, 'updates.txt');

  it('Part 1: should calculate sum of middle page numbers of correctly ordered updates', async () => {
    const expectedSumOfMiddlePageNumbersOfCorrectlyOrderedUpdates = 6051; // Verified for this dataset

    const sumOfMiddlePageNumbersOfCorrectlyOrderedUpdates = await calculateSumOfMiddlePageNumbersOfCorrectlyOrderedUpdates(updatesFilePath);

    assert.strictEqual(sumOfMiddlePageNumbersOfCorrectlyOrderedUpdates, expectedSumOfMiddlePageNumbersOfCorrectlyOrderedUpdates);
  });

  it('Part 2: should calculate sum of middle page numbers of corrected updates', async () => {
    const expectedSumOfMiddlePageNumbersOfCorrectedUpdates = 5093; // Verified for this dataset

    const sumOfMiddlePageNumbersOfCorrectedUpdates = await calculateSumOfMiddlePageNumbersOfCorrectedUpdates(updatesFilePath);

    assert.strictEqual(sumOfMiddlePageNumbersOfCorrectedUpdates, expectedSumOfMiddlePageNumbersOfCorrectedUpdates);
  });
});
