import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

import { calculateSumOfEnabledMultiplications, calculateSumOfMultiplications } from './day-3';

describe('Day 3: Mull It Over', () => {
  const corruptedMemoryFilePath = path.join(__dirname, 'corrupted-memory.txt');

  it('Part 1: should calculate sum of multiplications', async () => {
    const expectedSumOfMultiplications = 179571322; // Verified for this dataset

    const sumOfMultiplications = await calculateSumOfMultiplications(corruptedMemoryFilePath);

    assert.strictEqual(sumOfMultiplications, expectedSumOfMultiplications);
  });

  it('Part 2: should calculate sum of enabled multiplications', async () => {
    const expectedSumOfEnabledMultiplications = 103811193; // Verified for this dataset

    const sumOfEnabledMultiplications = await calculateSumOfEnabledMultiplications(corruptedMemoryFilePath);

    assert.strictEqual(sumOfEnabledMultiplications, expectedSumOfEnabledMultiplications);
  });
});
